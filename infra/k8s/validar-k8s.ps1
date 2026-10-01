$ErrorActionPreference = "Stop"

$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifesto = Join-Path $raiz "espp.yaml"
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

Write-Host "[1/6] Verificando kubectl..."
Invoke-KubectlChecked @("version", "--client")

Write-Host "[2/6] Renderizando manifests com Kustomize (offline)..."
$renderizado = & kubectl kustomize $raiz 2>&1
if ($LASTEXITCODE -ne 0) {
    throw "Falha ao renderizar Kustomize: $($renderizado -join [Environment]::NewLine)"
}
if ([string]::IsNullOrWhiteSpace(($renderizado -join "`n"))) {
    throw "Kustomize nao gerou manifestos."
}
Write-Host "Kustomize renderizado com sucesso"

Write-Host "[3/6] Conferindo recursos Kubernetes esperados..."
$yaml = $renderizado -join "`n"
$recursosObrigatorios = @(
    "kind: Namespace",
    "kind: ConfigMap",
    "kind: PersistentVolumeClaim",
    "kind: Deployment",
    "kind: Service"
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
Write-Host "Recursos principais OK"

Write-Host "[4/6] Validando template de Secret sem acessar cluster..."
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
Write-Host "Template de Secret OK"

Write-Host "[5/6] Conferindo placeholders e separacao de segredos..."
$conteudo = Get-Content $manifesto -Raw
if ($conteudo -notmatch "REGISTRY/ppgo-espp-api:TAG") { throw "Placeholder da imagem da API nao encontrado." }
if ($conteudo -notmatch "REGISTRY/ppgo-espp-app:TAG") { throw "Placeholder da imagem do frontend nao encontrado." }
if ($conteudo -match "ESPP_DB_PASSWORD") { throw "Credencial de banco nao deve ficar no manifesto principal." }
if ($conteudo -notmatch "secretRef:\s*\r?\n\s*name:\s*espp-secrets") { throw "Deployment da API deve referenciar o Secret espp-secrets." }
Write-Host "Separacao de configuracao e segredos OK"

Write-Host "[6/6] Validacao offline concluida com sucesso."
Write-Host "Os manifests foram renderizados e conferidos sem depender de cluster Kubernetes. A validacao server-side fica para a homologacao no cluster da SSP."
