# ESPP 1.0.0

Release final do site institucional e painel administrativo da Escola Superior de Polícia Penal de Goiás.

## Estado da release

- Versão: `1.0.0`
- Frontend: Next.js 16.3.4 / React 19.2.8
- Backend: Spring Boot 4.1.1 / Java 25
- Banco: Oracle externo compatível com a configuração JDBC da aplicação
- Migrações: Liquibase
- Gerenciador do frontend: Yarn
- Autenticação de produção: modo `ssp`, com integração institucional real dependente do contrato oficial da SSP-GO

## Critérios de aceite concluídos

- regressão funcional das áreas públicas e administrativas;
- temas claro, escuro e misto revisados;
- `yarn typecheck` e `yarn build` no frontend;
- `mvn test` e `mvn package` no backend;
- integração Oracle em CI;
- Liquibase e Hibernate/JPA validados;
- smoke tests das APIs públicas;
- Dockerfiles separados para Next.js e Spring Boot;
- Docker Compose local com frontend e API separados e Oracle externo;
- manifests Kubernetes com Deployments, Services, ConfigMap, Secrets externos, Ingress, HPA e PDB;
- health checks, startup/readiness/liveness probes e rolling update;
- hardening de pods e ServiceAccounts;
- comunicação interna `Next.js -> espp-api:8081`;
- validação Kubernetes offline automatizada;
- pipeline de CI para frontend, backend, Oracle, imagens Docker, Compose e manifests Kubernetes;
- procedimento de homologação Kubernetes server-side preparado;
- script local de fechamento da release preparado.

## CI/CD

O workflow `.github/workflows/quality.yml` executa em `push` e `pull_request` para `main`, além de permitir execução manual. Ele valida:

1. frontend: instalação imutável, typecheck e build;
2. backend: testes e package;
3. integração com Oracle;
4. build das imagens Docker de API e frontend;
5. `docker compose config`;
6. manifests Kubernetes pelo `infra/k8s/validar-k8s.ps1`.

O CD real para a SSP não contém credenciais no repositório. O deploy depende do kubeconfig/contexto, registry, Secrets, DNS, TLS/PKI, Oracle e demais dados fornecidos pela infraestrutura da SSP.

## Fechamento local

No PowerShell, na raiz do repositório:

```powershell
.\infra\release\fechar-release.ps1
```

O script exige árvore Git limpa e executa typecheck/build do frontend, testes/package do backend, validação do Compose, build dos containers e validação Kubernetes offline.

Quando as imagens Docker já tiverem sido verificadas no mesmo ciclo, é possível omitir o rebuild:

```powershell
.\infra\release\fechar-release.ps1 -SkipDockerBuild
```

## Homologação Kubernetes

Com acesso ao cluster da SSP e imagens já publicadas no registry, primeiro executar somente o dry-run server-side:

```powershell
.\infra\k8s\homologar-k8s.ps1 `
  -Context "CONTEXTO-SSP" `
  -ApiImage "REGISTRY/ppgo-espp-api:TAG" `
  -AppImage "REGISTRY/ppgo-espp-app:TAG"
```

O script exige que o namespace `espp`, o Secret `espp-secrets` e o Secret TLS `espp-tls` já estejam provisionados. Ele renderiza o Kustomize, troca os placeholders de imagem e executa `kubectl apply --server-side --dry-run=server`.

Após aprovação do dry-run e dentro da janela de homologação:

```powershell
.\infra\k8s\homologar-k8s.ps1 `
  -Context "CONTEXTO-SSP" `
  -ApiImage "REGISTRY/ppgo-espp-api:TAG" `
  -AppImage "REGISTRY/ppgo-espp-app:TAG" `
  -Apply `
  -FrontendUrl "https://HOST-FRONTEND" `
  -ApiUrl "https://HOST-API"
```

O modo `-Apply` acompanha os rollouts e pode executar smoke externo do frontend e da readiness da API.

## Configuração de produção

Usar `.env.production.example` e `infra/k8s/SSP-INTEGRATION.md` como referências. Valores secretos devem ser fornecidos pelo ambiente de implantação e nunca versionados.

Variáveis e integrações incluem, no mínimo:

- `NEXT_PUBLIC_SITE_URL`;
- `ESPP_API_URL`;
- `ESPP_FRONTEND_URL`;
- `ESPP_SESSION_SECRET`;
- `ESPP_AUTH_MODE=ssp`;
- parâmetros oficiais da autenticação SSP quando fornecidos;
- `ESPP_DB_URL`;
- `ESPP_DB_USERNAME`;
- `ESPP_DB_PASSWORD`;
- `ESPP_CONFIG_ENCRYPTION_KEY`;
- parâmetros SMTP institucionais;
- armazenamento persistente de anexos.

## Dependências externas de homologação

A aplicação está preparada para homologação, mas estes itens só podem ser validados no ambiente real da SSP:

- autenticação institucional SSP-GO e seu contrato de token/claims;
- registry oficial e política de pull das imagens;
- kubeconfig/RBAC do cluster;
- DNS, Ingress/Route/Gateway e certificado TLS;
- conectividade com Oracle e SMTP institucionais;
- Metrics Server ou equivalente;
- storage compartilhado para múltiplas réplicas da API, se exigido;
- NetworkPolicies/regras de firewall conforme a topologia oficial.

## Rollback

Manter a imagem/configuração da versão anterior durante a implantação. Em rollback da aplicação, reutilizar a tag anterior das imagens e reaplicar os manifests aprovados. Não reverter manualmente as tabelas de controle do Liquibase; qualquer rollback de schema deve ser realizado por changeset específico e previamente testado.
