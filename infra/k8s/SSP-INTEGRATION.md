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

- hostname/IP;
- porta;
- service name;
- usuário/schema;
- credencial por Secret institucional;
- requisitos de TLS/wallet, se aplicáveis;
- regras de firewall/egress do cluster até o banco.

### Autenticação institucional SSP

O ponto de integração no backend é `SspTokenValidator`. Para implementar a validação real, a SSP deve fornecer o contrato oficial, incluindo o que for aplicável:

- protocolo adotado (OIDC/OAuth2, JWT assinado, introspecção ou gateway institucional);
- issuer;
- audience/client-id;
- JWKS URI ou certificado/chave pública;
- endpoint de introspecção, caso exista;
- credencial de cliente, quando necessária;
- claim que identifica unicamente o usuário institucional;
- claims/grupos/roles fornecidos;
- tempos de expiração e tolerância de relógio;
- política de logout/revogação;
- ambientes e endpoints de homologação e produção.

Até esses dados existirem, `ESPP_AUTH_MODE=ssp` permanece fail-closed: tokens não validados não concedem acesso administrativo.

## Autorização da ESPP

A autenticação institucional identifica o usuário. A autorização do painel continua sob controle da ESPP por meio do cadastro de usuários autorizados e dos perfis internos `ADMIN` e `COMUNICACAO`.

Isso separa duas responsabilidades:

1. SSP confirma quem é o usuário;
2. ESPP decide se esse usuário pode acessar o painel e com qual perfil.

## Secrets

O Secret `espp-secrets` deve ser provisionado pela infraestrutura da SSP ou por seu gerenciador de segredos. Credenciais reais nunca devem ser commitadas.

São atualmente esperadas, no mínimo:

- `ESPP_DB_URL`;
- `ESPP_DB_USERNAME`;
- `ESPP_DB_PASSWORD`;
- `ESPP_CONFIG_ENCRYPTION_KEY`;
- `ESPP_MAIL_HOST`;
- `ESPP_MAIL_USERNAME`;
- `ESPP_MAIL_PASSWORD`;
- `ESPP_MAIL_TO`.

Novas credenciais de autenticação institucional somente devem ser adicionadas ao Secret quando o contrato oficial da SSP definir que são necessárias.

## Hardening já aplicado

- `runAsNonRoot: true`;
- usuários/grupos não-root explícitos;
- `allowPrivilegeEscalation: false`;
- `capabilities.drop: [ALL]`;
- `seccompProfile: RuntimeDefault`;
- ServiceAccounts dedicadas para API e frontend;
- `automountServiceAccountToken: false`;
- Secrets separados de ConfigMaps;
- TLS declarado no Ingress;
- CSP e demais security headers no Next.js;
- CORS restrito ao frontend configurado;
- API administrativa protegida quando `ESPP_AUTH_MODE=ssp`;
- health endpoints separados das rotas administrativas.

## NetworkPolicy

As regras de NetworkPolicy não são ativadas genericamente porque os seletores do Ingress Controller, DNS, Oracle externo, SMTP e demais serviços dependem da topologia real da SSP. Aplicar uma política genérica de `default-deny` antes de conhecer esses seletores poderia indisponibilizar a aplicação.

Na homologação, a SSP deve fornecer os namespaces/labels e destinos permitidos para que sejam fechadas as políticas de:

- Ingress Controller -> `espp-app`;
- Ingress Controller -> `espp-api`, somente se API externa for autorizada;
- `espp-app` -> `espp-api:8081`;
- `espp-api` -> Oracle;
- `espp-api` -> SMTP;
- pods -> DNS do cluster;
- eventuais endpoints de autenticação SSP.

## Checklist de homologação SSP

- substituir `REGISTRY/...:TAG` pelas imagens institucionais;
- criar `espp-secrets` pelo mecanismo oficial;
- criar/provisionar `espp-tls` ou adaptar para Route/Gateway;
- configurar DNS;
- confirmar comunicação Next.js -> Spring Boot;
- confirmar API -> Oracle;
- confirmar API -> SMTP;
- integrar `SspTokenValidator` ao contrato oficial;
- validar login, expiração, revogação e autorização;
- aplicar NetworkPolicies conforme topologia real;
- executar validação server-side dos manifests;
- validar HPA, storage compartilhado e reinício dos pods;
- executar smoke test funcional e de segurança.
