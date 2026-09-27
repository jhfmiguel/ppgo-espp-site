# PPGO ESPP API

Backend REST do site institucional e do painel administrativo da Escola Superior de Polícia Penal (ESPP).

## Stack

Java 25, Spring Boot 4.1.1, Spring Data JPA, Spring Security, Bean Validation, Liquibase e Oracle Database.

## Banco de dados

O backend utiliza Oracle. O schema é validado pelo Hibernate (`ddl-auto: validate`) e versionado pelo Liquibase em `src/main/resources/db/changelog/db.changelog-master.yaml`.

Variáveis obrigatórias para o banco:

- `ESPP_DB_URL` (desenvolvimento: `jdbc:oracle:thin:@//localhost:1521/FREEPDB1`)
- `ESPP_DB_USERNAME` (desenvolvimento: `ESPP`)
- `ESPP_DB_PASSWORD`

## Autenticação e autorização

A autenticação administrativa é institucional e deve usar a SSP-GO (`ESPP_AUTH_MODE=ssp`). Não existe usuário/senha administrativo próprio do backend. O token identifica o usuário e a tabela de usuários autorizados da ESPP define se ele pode acessar o painel e qual perfil possui.

Perfis:

- `ADMIN`: acesso administrativo completo;
- `COMUNICACAO`: notícias, eventos, mensagens e newsletter.

Rotas públicas não exigem autenticação. Rotas administrativas exigem Bearer token válido e autorização cadastrada na ESPP.

## Execução

```powershell
mvn spring-boot:run
```

Health check: `GET /actuator/health`.

## APIs

Conteúdo público: `/api/v1/public/**`.

Administração: `/api/v1/admin/**`, incluindo notícias, eventos, atos normativos, mensagens, newsletter, acessos/autorização, configurações e auditoria.

## Validação antes de release

Com Oracle disponível e as variáveis configuradas:

```powershell
mvn clean test
mvn spring-boot:run
```

Na inicialização, Liquibase deve concluir sem erro e o Hibernate deve validar o schema. Em seguida, validar o health check, conteúdo público e os fluxos administrativos com perfis ADMIN e COMUNICACAO. Operações de criação, alteração e exclusão devem persistir no Oracle e produzir a trilha de auditoria correspondente.
