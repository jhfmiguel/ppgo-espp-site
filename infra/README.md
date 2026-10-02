# Infraestrutura ESPP

A estrutura da ESPP segue o mesmo padrão do NASPP:

```text
ppgo-espp-site/
├─ api/               # Spring Boot, executado localmente no desenvolvimento
├─ app/               # Next.js, executado localmente no desenvolvimento
└─ infra/
   ├─ docker/          # validação do Oracle/Docker local
   ├─ kubernetes/      # manifests de homologação/produção da SSP
   ├─ oracle/          # preparação e validação Oracle
   └─ release/         # fechamento técnico de release
```

## Desenvolvimento local

Somente o Oracle é executado em Docker.

```powershell
docker start oracle
```

Oracle:

```text
localhost:1521/FREEPDB1
```

API Spring Boot:

```powershell
cd C:\workspace\ppgo\espp\site-institucional\api
mvn spring-boot:run
```

Frontend Next.js:

```powershell
cd C:\workspace\ppgo\espp\site-institucional\app
yarn dev -p 3001
```

Endpoints locais:

```text
Spring Boot  http://localhost:8081
Next.js      http://localhost:3001
```

## Docker e Kubernetes da SSP

Os Dockerfiles da API e do frontend permanecem versionados para empacotamento de homologação/produção na SSP. Eles não fazem parte do fluxo diário de desenvolvimento local.

Não existe `docker-compose.yml` na raiz para subir `api` e `app`.

Os manifests Kubernetes ficam em:

```text
infra/kubernetes/
```

## Validação local

Com Oracle, API e frontend iniciados:

```powershell
powershell -ExecutionPolicy Bypass -File .\infra\docker\validar-espp.ps1
```

Validação Kubernetes offline:

```powershell
.\infra\kubernetes\validar-k8s.ps1
```
