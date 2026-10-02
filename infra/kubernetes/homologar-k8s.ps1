param(
    [Parameter(Mandatory = $true)]
    [string]$Context,

    [Parameter(Mandatory = $true)]
    [string]$ApiImage,

    [Parameter(Mandatory = $true)]
    [string]$AppImage,

    [string]$Namespace = "espp",
    [switch]$Apply,
    [string]$FrontendUrl,
    [string]$ApiUrl
)

$ErrorActionPreference = "Stop"
$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path

function Invoke-KubectlChecked {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments,
        [string]$InputText
    )

    if ($PSBoundParameters.ContainsKey("InputText")) {
        $InputText | & kubectl --context $Context @Arguments
    } else {
        & kubectl --context $Context @Arguments
    }

    if ($LASTEXITCODE -ne 0) {
        throw "kubectl falhou com exit code ${LASTEXITCODE}: kubectl --context $Context $($Arguments -join ' ')"
    }
}

Write-Host "[1/9] Conferindo contexto Kubernetes..."
$contextoAtual = (& kubectl config current-context).Trim()
if ($LASTEXITCODE -ne 0) { throw "Nao foi possivel ler o contexto atual do kubectl." }
if ($contextoAtual -ne $Context) {
    Write-Host "Contexto atual: $contextoAtual"
    Write-Host "Contexto solicitado: $Context"
}
Invoke-KubectlChecked @("cluster-info") | Out-Host

Write-Host "[2/9] Conferindo namespace e permissoes..."
Invoke-KubectlChecked @("get", "namespace", $Namespace) | Out-Host
Invoke-KubectlChecked @("auth", "can-i", "get", "pods", "-n", $Namespace) | Out-Host
Invoke-KubectlChecked @("auth", "can-i", "create", "deployments.apps", "-n", $Namespace) | Out-Host

Write-Host "[3/9] Conferindo Secrets obrigatorios..."
Invoke-KubectlChecked @("-n", $Namespace, "get", "secret", "espp-secrets") | Out-Host
Invoke-KubectlChecked @("-n", $Namespace, "get", "secret", "espp-tls") | Out-Host

Write-Host "[4/9] Renderizando Kustomize e substituindo imagens..."
$renderizado = & kubectl kustomize $raiz 2>&1
if ($LASTEXITCODE -ne 0) {
    throw "Falha ao renderizar Kustomize: $($renderizado -join [Environment]::NewLine)"
}
$yaml = $renderizado -join "`n"
$yaml = $yaml.Replace("REGISTRY/ppgo-espp-api:TAG", $ApiImage)
$yaml = $yaml.Replace("REGISTRY/ppgo-espp-app:TAG", $AppImage)
if ($yaml -match "REGISTRY/ppgo-espp-(api|app):TAG") {
    throw "Ainda existem placeholders de imagem apos a substituicao."
}

Write-Host "[5/9] Executando dry-run server-side..."
Invoke-KubectlChecked @("apply", "--server-side", "--dry-run=server", "-f", "-") -InputText $yaml | Out-Host

if (-not $Apply) {
    Write-Host "[6/9] Aplicacao real nao solicitada."
    Write-Host "[7/9] Rollout nao executado."
    Write-Host "[8/9] Smoke externo nao executado."
    Write-Host "[9/9] Homologacao server-side concluida em modo dry-run."
    exit 0
}

Write-Host "[6/9] Aplicando manifests no cluster..."
Invoke-KubectlChecked @("apply", "--server-side", "-f", "-") -InputText $yaml | Out-Host

Write-Host "[7/9] Aguardando rollouts..."
Invoke-KubectlChecked @("-n", $Namespace, "rollout", "status", "deployment/espp-api", "--timeout=180s") | Out-Host
Invoke-KubectlChecked @("-n", $Namespace, "rollout", "status", "deployment/espp-app", "--timeout=180s") | Out-Host
Invoke-KubectlChecked @("-n", $Namespace, "get", "pods,svc,ingress,hpa,pdb,pvc") | Out-Host

Write-Host "[8/9] Executando smoke externo quando URLs forem informadas..."
if ($FrontendUrl) {
    $frontendResponse = Invoke-WebRequest -Uri $FrontendUrl -UseBasicParsing -TimeoutSec 30
    if ($frontendResponse.StatusCode -lt 200 -or $frontendResponse.StatusCode -ge 400) {
        throw "Frontend respondeu HTTP $($frontendResponse.StatusCode)."
    }
}

if ($ApiUrl) {
    $healthUrl = $ApiUrl.TrimEnd('/') + "/actuator/health/readiness"
    $apiResponse = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 30
    if ($apiResponse.StatusCode -lt 200 -or $apiResponse.StatusCode -ge 400) {
        throw "API readiness respondeu HTTP $($apiResponse.StatusCode)."
    }
}

Write-Host "[9/9] Homologacao Kubernetes concluida com sucesso."
