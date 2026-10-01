$ErrorActionPreference = "Stop"

$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifesto = Join-Path $raiz "espp.yaml"
$ingress = Join-Path $raiz "ingress.yaml"
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

Write-Host "[1/7] Verificando kubectl..."
Invoke-KubectlChecked @("version", "--client")

Write-Host "[2/7] Renderizando manifests com Kustomize (offline)..."
$renderizado = & kubectl kustomize $raiz 2>&1
if ($LASTEXITCODE -ne 0) {
    throw "Falha ao renderizar Kustomize: $($renderizado -join [Environment]::NewLine)"
}
if ([string]::IsNullOrWhiteSpace(($renderizado -join "`n"))) {
    throw "Kustomize nao gerou manifestos."
}
Write-Host "Kustomize renderizado com sucesso"

Write-Host "[3/7] Conferindo recursos Kubernetes esperados..."
$yaml = $renderizado -join "`n"
$recursosObrigatorios = @(
    "kind: Namespace",
    "kind: ConfigMap",
    "kind: PersistentVolumeClaim",
    "kind: Deployment",
    "kind: Service",
    "kind: Ingress"
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

Write-Host "[4/7] Validando comunicacao Next.js -> Spring Boot..."
$conteudo = Get-Content $manifesto -Raw
if ($conteudo -notmatch 'ESPP_API_URL:\s*"http://espp-api:8081"') {
    throw "ESPP_API_URL deve apontar para o Service interno http://espp-api:8081."
}
if ($conteudo -notmatch 'name:\s*espp-api') {
    throw "Service interno espp-api nao encontrado."
}
if ($conteudo -notmatch 'name:\s*espp-app') {
    throw "Service interno espp-app nao encontrado."
}
Write-Host "Comunicacao interna Next.js -> Spring Boot OK"

Write-Host "[5/7] Validando Ingress e roteamento externo..."
$ingressConteudo = Get-Content $ingress -Raw
if ($ingressConteudo -notmatch 'apiVersion:\s*networking.k8s.io/v1') { throw "Ingress deve usar networking.k8s.io/v1." }
if ($ingressConteudo -notmatch 'kind:\s*Ingress') { throw "Arquivo ingress.yaml nao possui kind Ingress." }
if ($ingressConteudo -notmatch 'host:\s*espp\.exemplo\.go\.gov\.br') { throw "Host do frontend ausente no Ingress." }
if ($ingressConteudo -notmatch 'host:\s*api-espp\.exemplo\.go\.gov\.br') { throw "Host da API ausente no Ingress." }
if ($ingressConteudo -notmatch 'name:\s*espp-app') { throw "Ingress nao roteia o frontend para espp-app." }
if ($ingressConteudo -notmatch 'name:\s*espp-api') { throw "Ingress nao roteia a API para espp-api." }
if ($ingressConteudo -notmatch 'secretName:\s*espp-tls') { throw "TLS Secret espp-tls nao configurado no Ingress." }
Write-Host "Ingress e TLS declarados corretamente"

Write-Host "[6/7] Validando template de Secret e separacao de credenciais..."
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

Write-Host "[7/7] Validacao offline concluida com sucesso."
Write-Host "Deployments, Services, comunicacao interna Next.js -> Spring Boot e Ingress foram conferidos sem depender de cluster. A validacao server-side e o DNS/TLS reais ficam para a homologacao no cluster da SSP."
