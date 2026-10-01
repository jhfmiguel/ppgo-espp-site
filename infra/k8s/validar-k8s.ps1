$ErrorActionPreference = "Stop"

$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifesto = Join-Path $raiz "espp.yaml"
$segredoExemplo = Join-Path $raiz "secret.example.yaml"

Write-Host "[1/6] Verificando kubectl..."
kubectl version --client | Out-Host

Write-Host "[2/6] Validando manifesto principal (client-side dry-run)..."
kubectl apply --dry-run=client -f $manifesto | Out-Host

Write-Host "[3/6] Validando template de Secret (client-side dry-run)..."
kubectl apply --dry-run=client -f $segredoExemplo | Out-Host

Write-Host "[4/6] Validando Kustomize..."
kubectl kustomize $raiz | Out-Null
Write-Host "Kustomize OK"

Write-Host "[5/6] Conferindo placeholders obrigatorios..."
$conteudo = Get-Content $manifesto -Raw
if ($conteudo -notmatch "REGISTRY/ppgo-espp-api:TAG") { throw "Placeholder da imagem da API nao encontrado." }
if ($conteudo -notmatch "REGISTRY/ppgo-espp-app:TAG") { throw "Placeholder da imagem do frontend nao encontrado." }
if ($conteudo -match "ESPP_DB_PASSWORD") { throw "Credencial de banco nao deve ficar no manifesto principal." }
Write-Host "Separacao de configuracao e segredos OK"

Write-Host "[6/6] Validacao concluida."
Write-Host "Os manifests estao sintaticamente prontos. Para homologacao real, configure as imagens e crie o Secret espp-secrets no cluster da SSP antes do kubectl apply."
