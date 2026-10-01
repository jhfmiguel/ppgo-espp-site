# ESPP no Kubernetes

Este diretório contém a base de implantação da ESPP em Kubernetes, mantendo frontend Next.js e API Spring Boot em workloads separados e Oracle externo ao cluster.

## Arquivos

- `espp.yaml`: Namespace, ConfigMap, PVC, Deployments e Services.
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

## Implantação

Depois de configurar imagens e Secret:

```powershell
kubectl apply -f .\infra\k8s\espp.yaml
kubectl -n espp rollout status deployment/espp-api
kubectl -n espp rollout status deployment/espp-app
kubectl -n espp get pods,svc,pvc
```

Ou, quando os overlays do ambiente forem adicionados:

```powershell
kubectl apply -k .\infra\k8s
```

O acesso externo (Ingress/Route/Gateway), storage class e integração com o gerenciador de Secrets devem seguir o padrão fornecido pela infraestrutura da SSP.
