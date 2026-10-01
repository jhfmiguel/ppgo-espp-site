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
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    & kubectl @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "kubectl falhou com exit code ${LASTEXITCODE}: kubectl $($Arguments -join ' ')"
    }
}

Write-Host "[1/10] Verificando kubectl..."
Invoke-KubectlChecked @("version", "--client")

Write-Host "[2/10] Renderizando manifests com Kustomize (offline)..."
$renderizado = & kubectl kustomize $raiz 2>&1
if ($LASTEXITCODE -ne 0) {
    throw "Falha ao renderizar Kustomize: $($renderizado -join [Environment]::NewLine)"
}
if ([string]::IsNullOrWhiteSpace(($renderizado -join "`n"))) {
    throw "Kustomize nao gerou manifestos."
}
Write-Host "Kustomize renderizado com sucesso"

Write-Host "[3/10] Conferindo recursos Kubernetes esperados..."
$yaml = $renderizado -join "`n"
$recursosObrigatorios = @(
    "kind: Namespace",
    "kind: ConfigMap",
    "kind: PersistentVolumeClaim",
    "kind: Deployment",
    "kind: Service",
    "kind: ServiceAccount",
    "kind: Ingress",
    "kind: HorizontalPodAutoscaler",
    "kind: PodDisruptionBudget"
)
foreach ($recurso in $recursosObrigatorios) {
    if ($yaml -notmatch [regex]::Escape($recurso)) { throw "Recurso obrigatorio ausente no manifesto renderizado: $recurso" }
}
if (($yaml | Select-String -Pattern "kind: Deployment" -AllMatches).Matches.Count -lt 2) { throw "Esperados dois Deployments: API e frontend." }
if (($yaml | Select-String -Pattern "kind: Service" -AllMatches).Matches.Count -lt 2) { throw "Esperados dois Services: API e frontend." }
if (($yaml | Select-String -Pattern "kind: ServiceAccount" -AllMatches).Matches.Count -lt 2) { throw "Esperadas duas ServiceAccounts dedicadas." }
if (($yaml | Select-String -Pattern "kind: HorizontalPodAutoscaler" -AllMatches).Matches.Count -lt 2) { throw "Esperados dois HPAs: API e frontend." }
if (($yaml | Select-String -Pattern "kind: PodDisruptionBudget" -AllMatches).Matches.Count -lt 2) { throw "Esperados dois PodDisruptionBudgets: API e frontend." }
Write-Host "Recursos principais OK"

Write-Host "[4/10] Validando health checks, readiness e restart..."
$conteudo = Get-Content $manifesto -Raw
$checksManifesto = @(
    "startupProbe:",
    "readinessProbe:",
    "livenessProbe:",
    "/actuator/health/liveness",
    "/actuator/health/readiness",
    "/api/health",
    "restartPolicy: Always",
    "terminationGracePeriodSeconds: 30",
    "type: RollingUpdate",
    "maxUnavailable: 0",
    "maxSurge: 1"
)
foreach ($check in $checksManifesto) {
    if ($conteudo -notmatch [regex]::Escape($check)) { throw "Configuracao de disponibilidade ausente: $check" }
}
Write-Host "Health checks, readiness, restart e rolling update OK"

Write-Host "[5/10] Validando escalabilidade e disponibilidade..."
$scalingConteudo = Get-Content $scaling -Raw
if ($scalingConteudo -notmatch 'apiVersion:\s*autoscaling/v2') { throw "HPA deve usar autoscaling/v2." }
if ($scalingConteudo -notmatch 'name:\s*espp-app') { throw "HPA/PDB do frontend ausente." }
if ($scalingConteudo -notmatch 'name:\s*espp-api') { throw "HPA/PDB da API ausente." }
if ($scalingConteudo -notmatch 'minReplicas:\s*2') { throw "Frontend deve manter no minimo 2 replicas no HPA." }
if ($scalingConteudo -notmatch 'maxReplicas:\s*6') { throw "Frontend deve permitir escala horizontal ate 6 replicas." }
if ($scalingConteudo -notmatch 'maxReplicas:\s*4') { throw "API deve permitir escala horizontal ate 4 replicas." }
if (($scalingConteudo | Select-String -Pattern "averageUtilization: 70" -AllMatches).Matches.Count -lt 2) { throw "Metas de CPU dos HPAs ausentes." }
if (($scalingConteudo | Select-String -Pattern "averageUtilization: 75" -AllMatches).Matches.Count -lt 2) { throw "Metas de memoria dos HPAs ausentes." }
if (($scalingConteudo | Select-String -Pattern "kind: PodDisruptionBudget" -AllMatches).Matches.Count -lt 2) { throw "PDBs da API e frontend ausentes." }
Write-Host "HPA, limites de escala e PodDisruptionBudgets OK"

Write-Host "[6/10] Validando hardening Kubernetes e modo SSP..."
$securityConteudo = Get-Content $security -Raw
if (($securityConteudo | Select-String -Pattern "automountServiceAccountToken: false" -AllMatches).Matches.Count -lt 2) { throw "ServiceAccounts devem desabilitar automount de token." }
if ($conteudo -notmatch 'ESPP_AUTH_MODE:\s*"ssp"') { throw "Ambiente Kubernetes deve operar com ESPP_AUTH_MODE=ssp." }
if (($conteudo | Select-String -Pattern "automountServiceAccountToken: false" -AllMatches).Matches.Count -lt 2) { throw "Pods devem desabilitar automount de token." }
if (($conteudo | Select-String -Pattern "runAsNonRoot: true" -AllMatches).Matches.Count -lt 4) { throw "Hardening runAsNonRoot incompleto." }
if (($conteudo | Select-String -Pattern "allowPrivilegeEscalation: false" -AllMatches).Matches.Count -lt 2) { throw "Privilege escalation deve estar desabilitado." }
if (($conteudo | Select-String -Pattern 'drop: \["ALL"\]' -AllMatches).Matches.Count -lt 2) { throw "Capabilities Linux devem ser removidas." }
if (($conteudo | Select-String -Pattern "type: RuntimeDefault" -AllMatches).Matches.Count -lt 2) { throw "Seccomp RuntimeDefault deve estar habilitado." }
if ($conteudo -notmatch 'serviceAccountName:\s*espp-api') { throw "API deve usar ServiceAccount espp-api." }
if ($conteudo -notmatch 'serviceAccountName:\s*espp-app') { throw "Frontend deve usar ServiceAccount espp-app." }
$nextSeguranca = Get-Content $nextConfig -Raw
foreach ($header in @("Content-Security-Policy", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy")) {
    if ($nextSeguranca -notmatch [regex]::Escape($header)) { throw "Security header ausente no Next.js: $header" }
}
Write-Host "Hardening Kubernetes e security headers OK"

Write-Host "[7/10] Validando seguranca Spring e contrato SSP fail-closed..."
$securityConfigConteudo = Get-Content $securityConfig -Raw
$securityFilterConteudo = Get-Content $securityFilter -Raw
$validatorConteudo = Get-Content $sspValidator -Raw
if ($securityConfigConteudo -notmatch 'SessionCreationPolicy\.STATELESS') { throw "API deve manter sessao stateless." }
if ($securityConfigConteudo -notmatch '"/actuator/health/\*\*"') { throw "Subrotas de health devem estar liberadas para probes Kubernetes." }
if ($securityConfigConteudo -notmatch 'authorize\.anyRequest\(\)\.denyAll\(\)') { throw "SecurityConfig deve negar rotas nao declaradas." }
if ($securityFilterConteudo -notmatch 'path\.startsWith\("/actuator/health/"\)') { throw "SecurityFilter deve ignorar somente a arvore de health para probes." }
if ($validatorConteudo -notmatch 'return Optional\.empty\(\);') { throw "SspTokenValidator deve permanecer fail-closed enquanto o contrato SSP nao estiver implementado." }
Write-Host "Spring Security, probes e integracao SSP fail-closed OK"

Write-Host "[8/10] Validando comunicacao Next.js -> Spring Boot e Ingress..."
if ($conteudo -notmatch 'ESPP_API_URL:\s*"http://espp-api:8081"') { throw "ESPP_API_URL deve apontar para o Service interno http://espp-api:8081." }
$ingressConteudo = Get-Content $ingress -Raw
if ($ingressConteudo -notmatch 'apiVersion:\s*networking.k8s.io/v1') { throw "Ingress deve usar networking.k8s.io/v1." }
if ($ingressConteudo -notmatch 'host:\s*espp\.exemplo\.go\.gov\.br') { throw "Host do frontend ausente no Ingress." }
if ($ingressConteudo -notmatch 'host:\s*api-espp\.exemplo\.go\.gov\.br') { throw "Host da API ausente no Ingress." }
if ($ingressConteudo -notmatch 'secretName:\s*espp-tls') { throw "TLS Secret espp-tls nao configurado no Ingress." }
Write-Host "Comunicacao interna e Ingress OK"

Write-Host "[9/10] Validando template de Secret e separacao de credenciais..."
$secret = Get-Content $segredoExemplo -Raw
if ($secret -notmatch "apiVersion:\s*v1") { throw "Secret sem apiVersion v1." }
if ($secret -notmatch "kind:\s*Secret") { throw "Template nao possui kind Secret." }
if ($secret -notmatch "name:\s*espp-secrets") { throw "Secret deve se chamar espp-secrets." }
$chavesSecret = @(
    "ESPP_DB_URL",
    "ESPP_DB_USERNAME",
    "ESPP_DB_PASSWORD",
    "ESPP_CONFIG_ENCRYPTION_KEY",
    "ESPP_MAIL_HOST",
    "ESPP_MAIL_USERNAME",
    "ESPP_MAIL_PASSWORD",
    "ESPP_MAIL_TO"
)
foreach ($chave in $chavesSecret) {
    if ($secret -notmatch [regex]::Escape($chave)) { throw "Chave obrigatoria ausente no Secret de exemplo: $chave" }
}
if ($conteudo -notmatch "REGISTRY/ppgo-espp-api:TAG") { throw "Placeholder da imagem da API nao encontrado." }
if ($conteudo -notmatch "REGISTRY/ppgo-espp-app:TAG") { throw "Placeholder da imagem do frontend nao encontrado." }
if ($conteudo -match "ESPP_DB_PASSWORD") { throw "Credencial de banco nao deve ficar no manifesto principal." }
if ($conteudo -notmatch "secretRef:\s*\r?\n\s*name:\s*espp-secrets") { throw "Deployment da API deve referenciar o Secret espp-secrets." }
Write-Host "Secrets e placeholders OK"

Write-Host "[10/10] Validacao offline concluida com sucesso."
Write-Host "Hardening de pods, ServiceAccounts, security headers, Spring Security, modo SSP fail-closed, Secrets, health checks, escalabilidade, comunicacao interna e Ingress foram conferidos. Autenticacao SSP real, NetworkPolicies, DNS, PKI, Oracle, SMTP e regras de rede ficam para homologacao com os dados oficiais da SSP."
