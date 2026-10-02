# ESPP 1.0.0

Release do site institucional e painel administrativo da Escola Superior de Polícia Penal de Goiás.

## Estado da release

- Frontend: Next.js 16.3.4 / React 19.2.8
- Backend: Spring Boot 4.1.1 / Java 25
- Banco: Oracle
- Migrações: Liquibase
- Desenvolvimento local: Oracle em Docker; Spring Boot e Next.js fora do Docker
- Produção SSP: imagens separadas de API/frontend e Kubernetes
- Autenticação de produção: `ESPP_AUTH_MODE=ssp`, dependente do contrato oficial da SSP-GO

## Desenvolvimento local

```text
Oracle      Docker       localhost:1521/FREEPDB1
Spring Boot local        localhost:8081
Next.js     local        localhost:3001
```

Não existe `docker-compose.yml` para subir API e frontend no desenvolvimento local.

## Critérios técnicos

- `yarn typecheck` e `yarn build` no frontend;
- `mvn test` e `mvn package` no backend;
- integração Oracle;
- Liquibase e Hibernate/JPA;
- smoke tests das APIs públicas;
- Dockerfiles separados para empacotamento SSP;
- manifests Kubernetes com Deployments, Services, ConfigMap, Secret externo, Ingress, HPA e PDB;
- startup/readiness/liveness probes e rolling update;
- hardening de pods e ServiceAccounts;
- comunicação interna `Next.js -> espp-api:8081` no cluster;
- validação Kubernetes offline;
- homologação Kubernetes server-side preparada.

## CI

O workflow `.github/workflows/quality.yml` valida frontend, backend, integração Oracle, build das imagens destinadas à SSP e manifests Kubernetes em `infra/kubernetes`.

## Fechamento local

Na raiz do repositório:

```powershell
.\scripts\fechar-release.ps1
```

Para omitir o rebuild das imagens destinadas à SSP:

```powershell
.\scripts\fechar-release.ps1 -SkipDockerBuild
```

## Homologação Kubernetes

Dry-run server-side:

```powershell
.\infra\kubernetes\homologar-k8s.ps1 `
  -Context "CONTEXTO-SSP" `
  -ApiImage "REGISTRY/ppgo-espp-api:TAG" `
  -AppImage "REGISTRY/ppgo-espp-app:TAG"
```

Aplicação após aprovação:

```powershell
.\infra\kubernetes\homologar-k8s.ps1 `
  -Context "CONTEXTO-SSP" `
  -ApiImage "REGISTRY/ppgo-espp-api:TAG" `
  -AppImage "REGISTRY/ppgo-espp-app:TAG" `
  -Apply `
  -FrontendUrl "https://HOST-FRONTEND" `
  -ApiUrl "https://HOST-API"
```

## Configuração de produção

Usar `.env.production.example` e `infra/kubernetes/SSP-INTEGRATION.md` como referências. Credenciais reais nunca devem ser versionadas.

Dependências ainda fornecidas pela SSP:

- contrato de autenticação institucional;
- registry oficial;
- kubeconfig/RBAC;
- DNS, Ingress/Route/Gateway e TLS/PKI;
- Oracle e SMTP institucionais;
- storage e métricas do cluster;
- regras de rede/NetworkPolicy.
