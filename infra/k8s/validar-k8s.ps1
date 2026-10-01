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

Write-Host "[2/6] Validando manifesto principal offline (client-side dry-run)..."
Invoke-KubectlChecked @("apply", "--dry-run=client", "--validate=false", "-f", $manifesto)

Write-Host "[3/6] Validando template de Secret offline (client-side dry-run)..."
Invoke-KubectlChecked @("apply", "--dry-run=client", "--validate=false", "-f", $segredoExemplo)

Write-Host "[4/6] Validando Kustomize..."
Invoke-KubectlChecked @("kustomize", $raiz) | Out-Null
Write-Host "Kustomize OK"

Write-Host "[5/6] Conferindo placeholders obrigatorios..."
$conteudo = Get-Content $manifesto -Raw
if ($conteudo -notmatch "REGISTRY/ppgo-espp-api:TAG") { throw "Placeholder da imagem da API nao encontrado." }
if ($conteudo -notmatch "REGISTRY/ppgo-espp-app:TAG") { throw "Placeholder da imagem do frontend nao encontrado." }
if ($conteudo -match "ESPP_DB_PASSWORD") { throw "Credencial de banco nao deve ficar no manifesto principal." }
Write-Host "Separacao de configuracao e segredos OK"

Write-Host "[6/6] Validacao offline concluida com sucesso."
Write-Host "Os manifests passaram pelo dry-run client-side sem depender de cluster. Para homologacao real, configure imagens, Secret, acesso ao Oracle e o endpoint de exposicao da SSP antes do kubectl apply."
