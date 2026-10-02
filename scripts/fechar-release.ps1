param(
    [switch]$SkipDockerBuild
)

$ErrorActionPreference = "Stop"
$raiz = Resolve-Path (Join-Path $PSScriptRoot "..")

function Invoke-NativeChecked {
    param(
        [Parameter(Mandatory = $true)][string]$Command,
        [Parameter(Mandatory = $true)][string[]]$Arguments,
        [string]$WorkingDirectory = $raiz
    )

    Push-Location $WorkingDirectory
    try {
        & $Command @Arguments
        if ($LASTEXITCODE -ne 0) {
            throw "$Command falhou com exit code ${LASTEXITCODE}: $Command $($Arguments -join ' ')"
        }
    } finally {
        Pop-Location
    }
}

Write-Host "[1/8] Conferindo arvore Git..."
$status = & git -C $raiz status --porcelain
if ($LASTEXITCODE -ne 0) { throw "Falha ao consultar git status." }
if ($status) { throw "A arvore Git possui alteracoes locais.`n$($status -join [Environment]::NewLine)" }

Write-Host "[2/8] Frontend typecheck..."
Invoke-NativeChecked "yarn" @("typecheck") (Join-Path $raiz "app")

Write-Host "[3/8] Frontend build..."
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:ESPP_API_URL = "http://127.0.0.1:8081"
Invoke-NativeChecked "yarn" @("build") (Join-Path $raiz "app")

Write-Host "[4/8] Backend tests..."
Invoke-NativeChecked "mvn" @("-B", "test") (Join-Path $raiz "api")

Write-Host "[5/8] Backend package..."
Invoke-NativeChecked "mvn" @("-B", "-DskipTests", "package") (Join-Path $raiz "api")

Write-Host "[6/8] Imagens Docker para SSP..."
if ($SkipDockerBuild) {
    Write-Host "Build das imagens ignorado por -SkipDockerBuild."
} else {
    Invoke-NativeChecked "docker" @("build", "-t", "ppgo-espp-api:release-check", ".") (Join-Path $raiz "api")
    Invoke-NativeChecked "docker" @("build", "-t", "ppgo-espp-app:release-check", ".") (Join-Path $raiz "app")
}

Write-Host "[7/8] Kubernetes offline..."
& (Join-Path $raiz "infra\kubernetes\validar-k8s.ps1")
if ($LASTEXITCODE -ne 0) { throw "Validacao Kubernetes falhou." }

Write-Host "[8/8] Conferindo limpeza final do repositorio..."
$statusFinal = & git -C $raiz status --porcelain
if ($LASTEXITCODE -ne 0) { throw "Falha ao consultar git status final." }
if ($statusFinal) { throw "As validacoes alteraram arquivos versionados.`n$($statusFinal -join [Environment]::NewLine)" }

Write-Host "Fechamento local concluido: frontend, backend, imagens SSP e Kubernetes validados."
