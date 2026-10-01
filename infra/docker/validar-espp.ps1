$ErrorActionPreference = "Stop"

$repo = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $repo

Write-Host "[1/6] Validando docker-compose.yml..." -ForegroundColor Cyan
docker compose config --quiet

Write-Host "[2/6] Construindo API e frontend..." -ForegroundColor Cyan
docker compose build --pull

Write-Host "[3/6] Subindo containers..." -ForegroundColor Cyan
docker compose up -d

Write-Host "[4/6] Conferindo containers..." -ForegroundColor Cyan
docker compose ps

Write-Host "[5/6] Testando API..." -ForegroundColor Cyan
$api = Invoke-RestMethod -Uri "http://localhost:8081/actuator/health" -TimeoutSec 15
if ($api.status -ne "UP") {
    throw "API ESPP não retornou status UP."
}
Write-Host "API ESPP: UP" -ForegroundColor Green

Write-Host "[6/6] Testando frontend..." -ForegroundColor Cyan
$front = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 15
if ($front.StatusCode -lt 200 -or $front.StatusCode -ge 400) {
    throw "Frontend ESPP retornou HTTP $($front.StatusCode)."
}
Write-Host "Frontend ESPP: HTTP $($front.StatusCode)" -ForegroundColor Green

Write-Host "Validação Docker da ESPP concluída." -ForegroundColor Green
