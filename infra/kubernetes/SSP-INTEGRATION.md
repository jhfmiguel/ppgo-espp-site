# Integração da ESPP com a infraestrutura da SSP

Este documento define o contrato de implantação da ESPP no ambiente da SSP sem acoplar o código a valores específicos de homologação ou produção.

## Princípios

- frontend Next.js e API Spring Boot permanecem em workloads separados;
- Oracle permanece externo ao cluster da ESPP;
- autenticação institucional opera com `ESPP_AUTH_MODE=ssp`;
- credenciais, chaves e certificados não são versionados;
- o backend falha fechado enquanto o contrato oficial de autenticação SSP não estiver configurado;
- o Next.js acessa o Spring Boot internamente por `http://espp-api:8081`;
- workloads não recebem token da ServiceAccount do Kubernetes;
- containers executam como usuário não-root, sem privilege escalation e sem capabilities Linux adicionais.

## Dados que a SSP deve fornecer

### Registry e imagens

- endereço do registry institucional;
- credencial ou mecanismo de `imagePullSecret`, se necessário;
- política de promoção de tags/imagens entre homologação e produção.

### Kubernetes / OpenShift

- namespace/projeto definitivo;
- classe de Ingress, Route ou Gateway oficial;
- domínio DNS do frontend;
- domínio DNS da API, se a exposição direta for autorizada;
- política TLS/PKI institucional;
- StorageClass para anexos;
- Metrics Server ou equivalente para HPA;
- requisitos de NetworkPolicy, proxy e egress.

### Oracle

- hostname/IP, porta e service name;
- usuário/schema e credencial por Secret institucional;
- requisitos de TLS/wallet, se aplicáveis;
- regras de firewall/egress do cluster até o banco.

### Autenticação institucional SSP

O ponto de integração no backend é `SspTokenValidator`. A SSP deve fornecer o contrato oficial: protocolo, issuer, audience/client-id, JWKS/certificado ou introspecção, claim de identificação, grupos/roles, expiração, logout/revogação e endpoints de homologação/produção.

Até esses dados existirem, `ESPP_AUTH_MODE=ssp` permanece fail-closed.

## Autorização da ESPP

A SSP confirma a identidade institucional. A autorização do painel continua sob controle da ESPP por meio dos usuários autorizados e perfis internos.

## Secrets

O Secret `espp-secrets` deve ser provisionado pela infraestrutura da SSP ou por seu gerenciador de segredos. Credenciais reais nunca devem ser commitadas.

São esperadas, no mínimo:

- `ESPP_DB_URL`;
- `ESPP_DB_USERNAME`;
- `ESPP_DB_PASSWORD`;
- `ESPP_CONFIG_ENCRYPTION_KEY`;
- `ESPP_MAIL_HOST`;
- `ESPP_MAIL_USERNAME`;
- `ESPP_MAIL_PASSWORD`;
- `ESPP_MAIL_TO`.

## Hardening já aplicado

- `runAsNonRoot: true`;
- `allowPrivilegeEscalation: false`;
- `capabilities.drop: [ALL]`;
- `seccompProfile: RuntimeDefault`;
- ServiceAccounts dedicadas;
- `automountServiceAccountToken: false`;
- Secrets separados de ConfigMaps;
- TLS declarado no Ingress;
- security headers no Next.js;
- API administrativa protegida no modo SSP.

## Checklist de homologação SSP

- substituir `REGISTRY/...:TAG` pelas imagens institucionais;
- criar `espp-secrets` e `espp-tls` pelo mecanismo oficial;
- configurar DNS;
- confirmar Next.js -> Spring Boot;
- confirmar API -> Oracle e SMTP;
- integrar `SspTokenValidator` ao contrato oficial;
- validar autenticação, expiração, revogação e autorização;
- aplicar NetworkPolicies conforme a topologia real;
- executar validação server-side dos manifests;
- validar HPA, storage e reinício dos pods;
- executar smoke test funcional e de segurança.
