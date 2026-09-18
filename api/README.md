# PPGO ESPP API
Backend REST do site institucional da ESPP.

Stack: Java 25, Spring Boot 4.1.1, Spring Data JPA, Spring Security, Liquibase e Oracle.

Variaveis: ESPP_DB_URL, ESPP_DB_USERNAME, ESPP_DB_PASSWORD, ESPP_ADMIN_USER, ESPP_ADMIN_PASSWORD, ESPP_FRONTEND_URL.

Executar: mvn spring-boot:run

API publica: /api/v1/public/noticias, /eventos e /atos-normativos.
API administrativa: /api/v1/admin/* protegida por HTTP Basic nesta primeira integracao.