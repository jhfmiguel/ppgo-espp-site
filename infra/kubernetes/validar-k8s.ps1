$ErrorActionPreference = "Stop"

$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Resolve-Path (Join-Path $raiz "..\..")
$manifesto = Join-Path $raiz "espp.yaml"
$ingress = Join-Path $raiz "ingress.yaml"
$scaling = Join-Path $raiz "scaling.yaml"
$security = Join-Path $raiz "security.yaml"
$segredoExemplo = Join-Path $raiz "secret.example.yaml"
$nextConfig = Join-Path $repo "app\next.config.ts"
$securityConfig = Join-Path $repo "api\src\main\java\br\gov\go\ppgo\espp\config\SecurityConfig.java"
$securityFilter = Join-Path $repo "api\src\main\java\br\gov\go\ppgo\espp\security\SecurityFilter.java"
$sspValidator = Join-Path $repo "api\src\main\java\br\gov\go\ppgo\espp\security\SspTokenValidator.java"

function Invoke-KubectlChecked {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)
    & kubectl @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "kubectl falhou com exit code ${LASTEXITCODE}: kubectl $($Arguments -join ' ')"
    }
}

Write-Host "[1/10] Verificando kubectl..."
Invoke-KubectlChecked @("version", "--client")

Write-Host "[2/10] Renderizando manifests com Kustomize (offline)..."
$renderizado = & kubectl kustomize $raiz 2>&1
if ($LASTEXITCODE -ne 0) { throw "Falha ao renderizar Kustomize: $($renderizado -join [Environment]::NewLine)" }
if ([string]::IsNullOrWhiteSpace(($renderizado -join "`n"))) { throw "Kustomize nao gerou manifestos." }
$yaml = $renderizado -join "`n"

Write-Host "[3/10] Conferindo recursos Kubernetes esperados..."
foreach ($recurso in @("kind: Namespace", "kind: ConfigMap", "kind: PersistentVolumeClaim", "kind: Deployment", "kind: Service", "kind: ServiceAccount", "kind: Ingress", "kind: HorizontalPodAutoscaler", "kind: PodDisruptionBudget")) {
    if ($yaml -notmatch [regex]::Escape($recurso)) { throw "Recurso obrigatorio ausente: $recurso" }
}

Write-Host "[4/10] Validando health checks, readiness e restart..."
$conteudo = Get-Content $manifesto -Raw
foreach ($check in @("startupProbe:", "readinessProbe:", "livenessProbe:", "/actuator/health/liveness", "/actuator/health/readiness", "/api/health", "restartPolicy: Always", "terminationGracePeriodSeconds: 30", "type: RollingUpdate", "maxUnavailable: 0", "maxSurge: 1")) {
    if ($conteudo -notmatch [regex]::Escape($check)) { throw "Configuracao de disponibilidade ausente: $check" }
}

Write-Host "[5/10] Validando escalabilidade e disponibilidade..."
$scalingConteudo = Get-Content $scaling -Raw
if ($scalingConteudo -notmatch 'apiVersion:\s*autoscaling/v2') { throw "HPA deve usar autoscaling/v2." }
if ($scalingConteudo -notmatch 'name:\s*espp-app') { throw "HPA/PDB do frontend ausente." }
if ($scalingConteudo -notmatch 'name:\s*espp-api') { throw "HPA/PDB da API ausente." }
if ($scalingConteudo -notmatch 'minReplicas:\s*2') { throw "Frontend deve manter no minimo 2 replicas." }
if ($scalingConteudo -notmatch 'maxReplicas:\s*6') { throw "Frontend deve permitir ate 6 replicas." }
if ($scalingConteudo -notmatch 'maxReplicas:\s*4') { throw "API deve permitir ate 4 replicas." }

Write-Host "[6/10] Validando hardening Kubernetes e modo SSP..."
$securityConteudo = Get-Content $security -Raw
if (($securityConteudo | Select-String -Pattern "automountServiceAccountToken: false" -AllMatches).Matches.Count -lt 2) { throw "ServiceAccounts devem desabilitar automount de token." }
if ($conteudo -notmatch 'ESPP_AUTH_MODE:\s*"ssp"') { throw "Ambiente Kubernetes deve operar com ESPP_AUTH_MODE=ssp." }
if (($conteudo | Select-String -Pattern "runAsNonRoot: true" -AllMatches).Matches.Count -lt 4) { throw "Hardening runAsNonRoot incompleto." }
if (($conteudo | Select-String -Pattern "allowPrivilegeEscalation: false" -AllMatches).Matches.Count -lt 2) { throw "Privilege escalation deve estar desabilitado." }
if (($conteudo | Select-String -Pattern 'drop: \["ALL"\]' -AllMatches).Matches.Count -lt 2) { throw "Capabilities Linux devem ser removidas." }
$nextSeguranca = Get-Content $nextConfig -Raw
foreach ($header in @("Content-Security-Policy", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy")) {
    if ($nextSeguranca -notmatch [regex]::Escape($header)) { throw "Security header ausente no Next.js: $header" }
}

Write-Host "[7/10] Validando seguranca Spring e contrato SSP fail-closed..."
$securityConfigConteudo = Get-Content $securityConfig -Raw
$securityFilterConteudo = Get-Content $securityFilter -Raw
$validatorConteudo = Get-Content $sspValidator -Raw
if ($securityConfigConteudo -notmatch 'SessionCreationPolicy\.STATELESS') { throw "API deve manter sessao stateless." }
if ($securityConfigConteudo -notmatch 'authorize\.anyRequest\(\)\.denyAll\(\)') { throw "SecurityConfig deve negar rotas nao declaradas." }
if ($securityFilterConteudo -notmatch 'path\.startsWith\("/actuator/health/"\)') { throw "SecurityFilter deve ignorar a arvore de health para probes." }
if ($validatorConteudo -notmatch 'return Optional\.empty\(\);') { throw "SspTokenValidator deve permanecer fail-closed." }

Write-Host "[8/10] Validando comunicacao Next.js -> Spring Boot e Ingress..."
if ($conteudo -notmatch 'ESPP_API_URL:\s*"http://espp-api:8081"') { throw "ESPP_API_URL deve apontar para http://espp-api:8081." }
$ingressConteudo = Get-Content $ingress -Raw
if ($ingressConteudo -notmatch 'apiVersion:\s*networking.k8s.io/v1') { throw "Ingress deve usar networking.k8s.io/v1." }
if ($ingressConteudo -notmatch 'secretName:\s*espp-tls') { throw "TLS Secret espp-tls nao configurado." }

Write-Host "[9/10] Validando template de Secret e separacao de credenciais..."
$secret = Get-Content $segredoExemplo -Raw
foreach ($chave in @("ESPP_DB_URL", "ESPP_DB_USERNAME", "ESPP_DB_PASSWORD", "ESPP_CONFIG_ENCRYPTION_KEY", "ESPP_MAIL_HOST", "ESPP_MAIL_USERNAME", "ESPP_MAIL_PASSWORD", "ESPP_MAIL_TO")) {
    if ($secret -notmatch [regex]::Escape($chave)) { throw "Chave obrigatoria ausente no Secret: $chave" }
}
if ($conteudo -notmatch "REGISTRY/ppgo-espp-api:TAG") { throw "Placeholder da imagem da API nao encontrado." }
if ($conteudo -notmatch "REGISTRY/ppgo-espp-app:TAG") { throw "Placeholder da imagem do frontend nao encontrado." }
if ($conteudo -match "ESPP_DB_PASSWORD") { throw "Credencial de banco nao deve ficar no manifesto principal." }

Write-Host "[10/10] Validacao offline concluida com sucesso."
