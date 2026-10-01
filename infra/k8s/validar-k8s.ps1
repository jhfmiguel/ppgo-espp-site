$ErrorActionPreference = "Stop"

$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifesto = Join-Path $raiz "espp.yaml"
$ingress = Join-Path $raiz "ingress.yaml"
$scaling = Join-Path $raiz "scaling.yaml"
$segredoExemplo = Join-Path $raiz "secret.example.yaml"

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

Write-Host "[1/8] Verificando kubectl..."
Invoke-KubectlChecked @("version", "--client")

Write-Host "[2/8] Renderizando manifests com Kustomize (offline)..."
$renderizado = & kubectl kustomize $raiz 2>&1
if ($LASTEXITCODE -ne 0) {
    throw "Falha ao renderizar Kustomize: $($renderizado -join [Environment]::NewLine)"
}
if ([string]::IsNullOrWhiteSpace(($renderizado -join "`n"))) {
    throw "Kustomize nao gerou manifestos."
}
Write-Host "Kustomize renderizado com sucesso"

Write-Host "[3/8] Conferindo recursos Kubernetes esperados..."
$yaml = $renderizado -join "`n"
$recursosObrigatorios = @(
    "kind: Namespace",
    "kind: ConfigMap",
    "kind: PersistentVolumeClaim",
    "kind: Deployment",
    "kind: Service",
    "kind: Ingress",
    "kind: HorizontalPodAutoscaler",
    "kind: PodDisruptionBudget"
)
foreach ($recurso in $recursosObrigatorios) {
    if ($yaml -notmatch [regex]::Escape($recurso)) {
        throw "Recurso obrigatorio ausente no manifesto renderizado: $recurso"
    }
}
if (($yaml | Select-String -Pattern "kind: Deployment" -AllMatches).Matches.Count -lt 2) {
    throw "Esperados dois Deployments: API e frontend."
}
if (($yaml | Select-String -Pattern "kind: Service" -AllMatches).Matches.Count -lt 2) {
    throw "Esperados dois Services: API e frontend."
}
if (($yaml | Select-String -Pattern "kind: HorizontalPodAutoscaler" -AllMatches).Matches.Count -lt 2) {
    throw "Esperados dois HPAs: API e frontend."
}
if (($yaml | Select-String -Pattern "kind: PodDisruptionBudget" -AllMatches).Matches.Count -lt 2) {
    throw "Esperados dois PodDisruptionBudgets: API e frontend."
}
Write-Host "Recursos principais OK"

Write-Host "[4/8] Validando health checks, readiness e restart..."
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
    if ($conteudo -notmatch [regex]::Escape($check)) {
        throw "Configuracao de disponibilidade ausente: $check"
    }
}
Write-Host "Health checks, readiness, restart e rolling update OK"

Write-Host "[5/8] Validando escalabilidade e disponibilidade..."
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

Write-Host "[6/8] Validando comunicacao Next.js -> Spring Boot e Ingress..."
if ($conteudo -notmatch 'ESPP_API_URL:\s*"http://espp-api:8081"') {
    throw "ESPP_API_URL deve apontar para o Service interno http://espp-api:8081."
}
$ingressConteudo = Get-Content $ingress -Raw
if ($ingressConteudo -notmatch 'apiVersion:\s*networking.k8s.io/v1') { throw "Ingress deve usar networking.k8s.io/v1." }
if ($ingressConteudo -notmatch 'host:\s*espp\.exemplo\.go\.gov\.br') { throw "Host do frontend ausente no Ingress." }
if ($ingressConteudo -notmatch 'host:\s*api-espp\.exemplo\.go\.gov\.br') { throw "Host da API ausente no Ingress." }
if ($ingressConteudo -notmatch 'secretName:\s*espp-tls') { throw "TLS Secret espp-tls nao configurado no Ingress." }
Write-Host "Comunicacao interna e Ingress OK"

Write-Host "[7/8] Validando template de Secret e separacao de credenciais..."
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
    if ($secret -notmatch [regex]::Escape($chave)) {
        throw "Chave obrigatoria ausente no Secret de exemplo: $chave"
    }
}
if ($conteudo -notmatch "REGISTRY/ppgo-espp-api:TAG") { throw "Placeholder da imagem da API nao encontrado." }
if ($conteudo -notmatch "REGISTRY/ppgo-espp-app:TAG") { throw "Placeholder da imagem do frontend nao encontrado." }
if ($conteudo -match "ESPP_DB_PASSWORD") { throw "Credencial de banco nao deve ficar no manifesto principal." }
if ($conteudo -notmatch "secretRef:\s*\r?\n\s*name:\s*espp-secrets") { throw "Deployment da API deve referenciar o Secret espp-secrets." }
Write-Host "Secrets e placeholders OK"

Write-Host "[8/8] Validacao offline concluida com sucesso."
Write-Host "Health checks, readiness, restart automatico, rolling update, HPA, PDB, comunicacao interna e Ingress foram conferidos. Metrics Server, storage compartilhado e comportamento de escala real ficam para homologacao no cluster da SSP."
