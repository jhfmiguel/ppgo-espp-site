# Infraestrutura ESPP

A estrutura de desenvolvimento local da ESPP segue o mesmo padrão do NASPP:

```text
ppgo-espp-site/
├─ api/        # Spring Boot, executado localmente
├─ app/        # Next.js, executado localmente
└─ infra/
   ├─ docker/  # apoio e validação do Docker local
   ├─ k8s/     # manifests de homologação/produção da SSP
   ├─ oracle/  # preparação e documentação Oracle
   └─ release/ # artefatos de release
```

## Desenvolvimento local

No desenvolvimento, somente o Oracle é executado em Docker.

### Oracle

```powershell
docker start oracle
```

Oracle local:

```text
localhost:1521/FREEPDB1
```

### API Spring Boot

```powershell
cd C:\workspace\ppgo\espp\site-institucional\api
mvn spring-boot:run
```

API:

```text
http://localhost:8081
```

### Frontend Next.js

```powershell
cd C:\workspace\ppgo\espp\site-institucional\app
yarn dev -p 3001
```

Frontend:

```text
http://localhost:3001
```

## Docker e Kubernetes da SSP

Os Dockerfiles da API e do frontend continuam versionados porque são artefatos de empacotamento para homologação/produção na infraestrutura da SSP e para uso com Kubernetes.

Eles não fazem parte do fluxo diário de desenvolvimento local.

Não existe mais `docker-compose.yml` na raiz para subir `api` e `app`.

## Validação

Com Oracle, API e frontend já iniciados:

```powershell
powershell -ExecutionPolicy Bypass -File .\infra\docker\validar-espp.ps1
```

O script valida:

1. container Oracle em execução;
2. porta 1521;
3. API ESPP em `localhost:8081`;
4. frontend ESPP em `localhost:3001`.
