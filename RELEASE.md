# ESPP 1.0.0

Release final do site institucional e painel administrativo da Escola Superior de Polícia Penal de Goiás.

## Estado da release

- Versão: `1.0.0`
- Frontend: Next.js 16.3.4 / React 19.2.8
- Backend: Spring Boot 4.1.1 / Java 25
- Banco: Oracle Free 23 / Oracle 23 compatível
- Migrações: Liquibase
- Gerenciador do frontend: Yarn
- Autenticação de produção: SSP-GO

## Critérios de aceite concluídos

- Regressão funcional das áreas públicas e administrativas concluída.
- Temas claro, escuro e misto revisados e corrigidos.
- Build do frontend com `yarn typecheck` e `yarn build` validado.
- Backend validado com `mvn test` e `mvn package`.
- Inicialização do Spring contra Oracle real validada em CI.
- Liquibase executado contra banco Oracle limpo.
- Hibernate/JPA e health check validados.
- Smoke tests das APIs públicas de notícias, eventos e atos normativos validados.
- Verificação de repositório limpo incluída no CI.
- Avisos de API HTTP depreciada removidos do backend.

## Configuração de produção

Usar `.env.production.example` como referência. Valores secretos devem ser fornecidos pelo ambiente de implantação e nunca versionados.

Variáveis obrigatórias de produção incluem, no mínimo:

- `NEXT_PUBLIC_SITE_URL`
- `ESPP_API_URL`
- `ESPP_FRONTEND_URL`
- `ESPP_SESSION_SECRET`
- `ESPP_AUTH_MODE=ssp`
- `ESPP_SSP_ISSUER`
- `ESPP_SSP_JWKS_URI`
- `ESPP_SSP_AUDIENCE`
- `ESPP_DB_URL`
- `ESPP_DB_USERNAME`
- `ESPP_DB_PASSWORD`
- `ESPP_CONFIG_ENCRYPTION_KEY`
- parâmetros SMTP institucionais
- `ESPP_ATTACHMENTS_DIR` apontando para armazenamento persistente

## Dependência externa conhecida

A homologação real do login institucional SSP-GO permanece dependente do contrato e dos dados fornecidos pela SSP-GO: issuer, JWKS, audience, callback/token e claims/perfis. A aplicação mantém essa integração isolada da regressão funcional e da persistência Oracle já validadas.

## Implantação

Frontend:

```bash
cd app
yarn install --immutable
yarn typecheck
yarn build
yarn start
```

Backend:

```bash
cd api
mvn clean package
java -jar target/ppgo-espp-api-1.0.0.jar
```

Antes da publicação, confirmar as variáveis de produção, conectividade Oracle, diretório persistente de anexos e credenciais SMTP/SSP.

## Rollback

Manter o artefato e a configuração da versão anterior durante a implantação. Em caso de rollback de aplicação, não reverter manualmente as tabelas de controle do Liquibase. Qualquer rollback de schema deve ser tratado por changeset específico e previamente testado.
