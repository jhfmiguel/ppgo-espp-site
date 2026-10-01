# ESPP no Kubernetes

Este diretório contém a base de implantação da ESPP em Kubernetes, mantendo frontend Next.js e API Spring Boot em workloads separados e Oracle externo ao cluster.

## Arquivos

- `espp.yaml`: Namespace, ConfigMap, PVC, Deployments e Services.
- `ingress.yaml`: exposição HTTP(S) do frontend e da API.
- `scaling.yaml`: HorizontalPodAutoscalers e PodDisruptionBudgets.
- `secret.example.yaml`: modelo de Secret. Não contém credenciais reais e não deve ser usado em produção sem substituição.
- `kustomization.yaml`: entrada para `kubectl kustomize`/`kubectl apply -k`.
- `validar-k8s.ps1`: validação local dos manifests usando `kubectl`.

## Componentes

### API

- Deployment `espp-api`
- Service `espp-api` (`ClusterIP`, porta 8081)
- `startupProbe` e `livenessProbe` em `/actuator/health/liveness`
- `readinessProbe` em `/actuator/health/readiness`
- restart automático com `restartPolicy: Always`
- atualização `RollingUpdate` com `maxUnavailable: 0` e `maxSurge: 1`
- `terminationGracePeriodSeconds: 30`
- HPA de 1 a 4 réplicas por CPU e memória
- PodDisruptionBudget com `minAvailable: 1`
- Configuração por ConfigMap e Secret
- Volume persistente em `/data/espp/attachments`
- execução como usuário não-root, sem escalation e com capabilities removidas

### Frontend

- Deployment `espp-app`
- Service `espp-app` (`ClusterIP`, porta 3001)
- endpoint dedicado `GET /api/health`
- `startupProbe`, `readinessProbe` e `livenessProbe` em `/api/health`
- 2 réplicas iniciais
- restart automático com `restartPolicy: Always`
- atualização `RollingUpdate` com `maxUnavailable: 0` e `maxSurge: 1`
- `terminationGracePeriodSeconds: 30`
- HPA de 2 a 6 réplicas por CPU e memória
- PodDisruptionBudget com `minAvailable: 1`
- comunicação interna com a API por `http://espp-api:8081`
- execução como usuário não-root

## Health checks e readiness

A API usa os grupos de disponibilidade do Spring Boot Actuator:

- liveness: `/actuator/health/liveness`
- readiness: `/actuator/health/readiness`

O frontend possui um endpoint leve e sem cache em `/api/health`, retornando `status: UP` quando o processo Next.js está atendendo requisições.

O `startupProbe` impede que liveness mate um pod durante a inicialização. O `readinessProbe` retira pods indisponíveis do balanceamento do Service. O `livenessProbe` permite ao kubelet reiniciar containers que ficaram travados.

## Restart e atualização sem indisponibilidade planejada

Os dois Deployments declaram `restartPolicy: Always`. Em falha do processo/container, o kubelet tenta restaurá-lo automaticamente.

As atualizações usam `RollingUpdate` com:

```yaml
maxUnavailable: 0
maxSurge: 1
```

Assim o Kubernetes cria uma nova réplica antes de remover a antiga, respeitando o readiness check.

Os PodDisruptionBudgets reduzem indisponibilidade durante manutenções voluntárias do cluster, exigindo ao menos um pod disponível de cada workload.

## Escalabilidade

O arquivo `scaling.yaml` usa `autoscaling/v2`.

Frontend:

- mínimo: 2 pods
- máximo: 6 pods
- alvo de CPU: 70%
- alvo de memória: 75%

API:

- mínimo: 1 pod
- máximo: 4 pods
- alvo de CPU: 70%
- alvo de memória: 75%

O scale-down possui janela de estabilização para evitar sobe/desce frequente de réplicas.

O HPA depende de Metrics Server ou serviço equivalente fornecido pelo cluster da SSP. Sem métricas de recursos, os objetos HPA podem existir, mas não conseguirão calcular a quantidade desejada de réplicas.

### Observação sobre anexos da API

A API ainda usa o PVC `espp-attachments` com `ReadWriteOnce`. Para escalar a API horizontalmente de forma irrestrita entre nós, a infraestrutura da SSP deverá fornecer storage compartilhado compatível (`ReadWriteMany`) ou migrar anexos para storage de objetos/serviço externo. O HPA já deixa a aplicação preparada, mas o storage deve ser homologado antes de usar múltiplas réplicas da API em produção.

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

A validação local confere:

- renderização Kustomize;
- Deployments, Services, Ingress, HPA e PDB;
- startup/readiness/liveness probes;
- restart automático e RollingUpdate;
- limites de escala e métricas do HPA;
- comunicação interna `Next.js -> espp-api:8081`;
- TLS declarativo;
- separação entre configurações e Secrets.

## Implantação

Depois de configurar imagens, Secret, DNS e TLS:

```powershell
kubectl apply -k .\infra\k8s
kubectl -n espp rollout status deployment/espp-api
kubectl -n espp rollout status deployment/espp-app
kubectl -n espp get pods,svc,pvc,ingress,hpa,pdb
```

A validação server-side, Metrics Server, comportamento real dos HPAs, storage compartilhado da API, resolução DNS, certificado TLS e acesso externo real devem ser realizados na homologação do cluster da SSP.
