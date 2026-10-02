$ErrorActionPreference = "Stop"

Write-Host "[1/4] Conferindo Docker/Oracle..." -ForegroundColor Cyan
$oracle = docker ps --filter "name=oracle" --format "{{.Names}}|{{.Status}}"
if (-not $oracle) {
    throw "O container Oracle não está em execução. Use: docker start oracle"
}
Write-Host "Oracle: $oracle" -ForegroundColor Green

Write-Host "[2/4] Testando porta do Oracle..." -ForegroundColor Cyan
$oraclePort = Test-NetConnection localhost -Port 1521 -WarningAction SilentlyContinue
if (-not $oraclePort.TcpTestSucceeded) {
    throw "Oracle não está respondendo em localhost:1521."
}
Write-Host "Oracle: localhost:1521 OK" -ForegroundColor Green

Write-Host "[3/4] Testando API local da ESPP..." -ForegroundColor Cyan
$api = Invoke-RestMethod -Uri "http://localhost:8081/actuator/health" -TimeoutSec 15
if ($api.status -ne "UP") {
    throw "API ESPP não retornou status UP. Suba localmente em api com: mvn spring-boot:run"
}
Write-Host "API ESPP local: UP" -ForegroundColor Green

Write-Host "[4/4] Testando frontend local da ESPP..." -ForegroundColor Cyan
$front = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 15
if ($front.StatusCode -lt 200 -or $front.StatusCode -ge 400) {
    throw "Frontend ESPP retornou HTTP $($front.StatusCode). Suba localmente em app com: yarn dev -p 3001"
}
Write-Host "Frontend ESPP local: HTTP $($front.StatusCode)" -ForegroundColor Green

Write-Host "Validação local da ESPP concluída: Oracle em Docker, API e frontend fora do Docker." -ForegroundColor Green
