# ESPP no Kubernetes

Este diretório contém a base de implantação da ESPP em Kubernetes, mantendo frontend Next.js e API Spring Boot em workloads separados e Oracle externo ao cluster.

## Arquivos

- `espp.yaml`: Namespace, ConfigMap, PVC, Deployments e Services.
- `ingress.yaml`: exposição HTTP(S) do frontend e da API.
- `secret.example.yaml`: modelo de Secret. Não contém credenciais reais e não deve ser usado em produção sem substituição.
- `kustomization.yaml`: entrada para `kubectl kustomize`/`kubectl apply -k`.
- `validar-k8s.ps1`: validação local dos manifests usando `kubectl`.

## Componentes

### API

- Deployment `espp-api`
- Service `espp-api` (`ClusterIP`, porta 8081)
- `startupProbe`, `readinessProbe` e `livenessProbe` em `/actuator/health`
- Configuração por ConfigMap e Secret
- Volume persistente em `/data/espp/attachments`
- execução como usuário não-root, sem escalation e com capabilities removidas

### Frontend

- Deployment `espp-app`
- Service `espp-app` (`ClusterIP`, porta 3001)
- comunicação interna com a API por `http://espp-api:8081`
- `startupProbe`, `readinessProbe` e `livenessProbe`
- execução como usuário não-root

## Comunicação Next.js ↔ Spring Boot

O Next.js usa `ESPP_API_URL=http://espp-api:8081` dentro do cluster. Como `espp-api` é um Service `ClusterIP`, chamadas server-side do Next.js chegam diretamente ao Spring Boot pela rede interna do Kubernetes, sem passar pelo Ingress ou pela internet.

Esse desenho também preserva as rotas `/api` do próprio Next.js, usadas como BFF/proxy pelo frontend. Por isso o Ingress não redireciona `/api` do host principal diretamente ao Spring Boot.

Fluxo principal:

```text
Navegador
   |
   | HTTPS
   v
Ingress espp.exemplo.go.gov.br
   |
   v
Service espp-app:3001
   |
   | ESPP_API_URL=http://espp-api:8081
   v
Service espp-api:8081
   |
   v
Spring Boot
```

## Ingress

O manifesto base publica dois hosts:

- `espp.exemplo.go.gov.br` → Service `espp-app`
- `api-espp.exemplo.go.gov.br` → Service `espp-api`

O segundo host permite exposição controlada da API para integrações que realmente precisem chegar diretamente ao Spring Boot. O tráfego normal do frontend continua usando a comunicação interna entre os Services.

O manifesto usa:

- `networking.k8s.io/v1`
- `ingressClassName: nginx`
- TLS pelo Secret `espp-tls`

Na SSP, substitua os hosts, a classe de Ingress e o mecanismo TLS pelos valores fornecidos pela infraestrutura. Se o ambiente usar OpenShift Route ou Gateway API em vez de Ingress NGINX, o arquivo serve como contrato de roteamento e deve ser adaptado ao controlador oficial.

## TLS

O certificado não deve ser versionado. O Secret `espp-tls` deve ser criado no cluster pelo mecanismo adotado pela SSP, por exemplo cert-manager, PKI institucional ou Secret previamente provisionado.

Exemplo apenas para homologação controlada com arquivos fornecidos pela infraestrutura:

```powershell
kubectl -n espp create secret tls espp-tls `
  --cert=.\tls.crt `
  --key=.\tls.key
```

## Oracle externo

O Oracle não é criado pelo Kubernetes da ESPP. A API recebe os dados do banco por Secret:

- `ESPP_DB_URL`
- `ESPP_DB_USERNAME`
- `ESPP_DB_PASSWORD`

A URL deve apontar para o Oracle fornecido pela SSP, por exemplo `jdbc:oracle:thin:@//host:1521/SERVICO`.

## Segredos

Não versione credenciais reais. O objeto `espp-secrets` deve ser criado no ambiente de destino pelo mecanismo de segredos adotado pela SSP.

Exemplo manual para homologação controlada:

```powershell
kubectl create namespace espp --dry-run=client -o yaml | kubectl apply -f -
kubectl -n espp create secret generic espp-secrets `
  --from-literal=ESPP_DB_URL='jdbc:oracle:thin:@//HOST:1521/SERVICO' `
  --from-literal=ESPP_DB_USERNAME='ESPP' `
  --from-literal=ESPP_DB_PASSWORD='SENHA' `
  --from-literal=ESPP_CONFIG_ENCRYPTION_KEY='CHAVE' `
  --from-literal=ESPP_MAIL_HOST='SMTP' `
  --from-literal=ESPP_MAIL_USERNAME='USUARIO' `
  --from-literal=ESPP_MAIL_PASSWORD='SENHA_SMTP' `
  --from-literal=ESPP_MAIL_TO='DESTINATARIO'
```

## Imagens

Antes da implantação, substitua no manifesto:

- `REGISTRY/ppgo-espp-api:TAG`
- `REGISTRY/ppgo-espp-app:TAG`

pelas imagens publicadas no registry definido pela SSP.

## Validação local

No PowerShell, na raiz do projeto:

```powershell
.\infra\k8s\validar-k8s.ps1
```

A validação local confere também:

- renderização Kustomize;
- presença do Ingress;
- roteamento externo para `espp-app` e `espp-api`;
- configuração TLS declarativa;
- comunicação interna `Next.js -> espp-api:8081`;
- separação entre configurações e Secrets.

## Implantação

Depois de configurar imagens, Secret, DNS e TLS:

```powershell
kubectl apply -k .\infra\k8s
kubectl -n espp rollout status deployment/espp-api
kubectl -n espp rollout status deployment/espp-app
kubectl -n espp get pods,svc,pvc,ingress
```

A validação server-side, resolução DNS, certificado TLS e acesso externo real devem ser realizados na homologação do cluster da SSP.
