param(
    [switch]$SkipDockerBuild
)

$ErrorActionPreference = "Stop"
$raiz = Resolve-Path (Join-Path $PSScriptRoot "..\..")

function Invoke-NativeChecked {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Command,
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments,
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

Write-Host "[1/9] Conferindo arvore Git..."
$status = & git -C $raiz status --porcelain
if ($LASTEXITCODE -ne 0) { throw "Falha ao consultar git status." }
if ($status) {
    throw "A arvore Git possui alteracoes locais. Finalize, reverta ou salve-as antes do fechamento.`n$($status -join [Environment]::NewLine)"
}
Write-Host "Git limpo"

Write-Host "[2/9] Frontend typecheck..."
Invoke-NativeChecked "yarn" @("typecheck") (Join-Path $raiz "app")

Write-Host "[3/9] Frontend build..."
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:ESPP_API_URL = "http://127.0.0.1:8081"
Invoke-NativeChecked "yarn" @("build") (Join-Path $raiz "app")

Write-Host "[4/9] Backend tests..."
Invoke-NativeChecked "mvn" @("-B", "test") (Join-Path $raiz "api")

Write-Host "[5/9] Backend package..."
Invoke-NativeChecked "mvn" @("-B", "-DskipTests", "package") (Join-Path $raiz "api")

Write-Host "[6/9] Docker Compose config..."
if (-not $env:ESPP_DB_PASSWORD) {
    $env:ESPP_DB_PASSWORD = "release-validation-placeholder"
}
Invoke-NativeChecked "docker" @("compose", "config", "--quiet") $raiz

Write-Host "[7/9] Containers..."
if ($SkipDockerBuild) {
    Write-Host "Build Docker ignorado por -SkipDockerBuild."
} else {
    Invoke-NativeChecked "docker" @("compose", "build") $raiz
}

Write-Host "[8/9] Kubernetes offline..."
& (Join-Path $raiz "infra\k8s\validar-k8s.ps1")
if ($LASTEXITCODE -ne 0) { throw "Validacao Kubernetes falhou." }

Write-Host "[9/9] Conferindo limpeza final do repositorio..."
$statusFinal = & git -C $raiz status --porcelain
if ($LASTEXITCODE -ne 0) { throw "Falha ao consultar git status final." }
if ($statusFinal) {
    throw "As validacoes alteraram arquivos versionados.`n$($statusFinal -join [Environment]::NewLine)"
}

Write-Host "Fechamento local concluido com sucesso: frontend, backend, Compose, containers e Kubernetes validados."
