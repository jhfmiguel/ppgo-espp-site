# ESPP no Kubernetes

Este diretório contém os artefatos de homologação e produção da ESPP no ambiente da SSP. No desenvolvimento local, Spring Boot e Next.js executam fora do Docker; somente o Oracle local usa Docker.

## Arquivos

- `espp.yaml`: Namespace, ConfigMap, PVC, Deployments e Services.
- `ingress.yaml`: exposição HTTP(S) do frontend e da API.
- `scaling.yaml`: HorizontalPodAutoscalers e PodDisruptionBudgets.
- `security.yaml`: ServiceAccounts e hardening básico.
- `secret.example.yaml`: modelo de Secret sem credenciais reais.
- `kustomization.yaml`: entrada do Kustomize.
- `validar-k8s.ps1`: validação offline dos manifests.
- `homologar-k8s.ps1`: dry-run/aplicação no cluster de homologação.
- `SSP-INTEGRATION.md`: contrato pendente com a infraestrutura da SSP.

## Desenvolvimento local

O fluxo diário não usa estes manifests:

```text
Oracle      Docker       localhost:1521/FREEPDB1
Spring Boot local        localhost:8081
Next.js     local        localhost:3001
```

## Validação Kubernetes

Na raiz do repositório:

```powershell
.\infra\kubernetes\validar-k8s.ps1
```

## Homologação

```powershell
.\infra\kubernetes\homologar-k8s.ps1 `
  -Context "CONTEXTO-SSP" `
  -ApiImage "REGISTRY/ppgo-espp-api:TAG" `
  -AppImage "REGISTRY/ppgo-espp-app:TAG"
```

Use `-Apply` apenas depois do dry-run server-side aprovado.

## Implantação manual

Depois de configurar imagens, Secrets, DNS e TLS:

```powershell
kubectl apply -k .\infra\kubernetes
kubectl -n espp rollout status deployment/espp-api
kubectl -n espp rollout status deployment/espp-app
kubectl -n espp get pods,svc,pvc,ingress,hpa,pdb
```

O Oracle de produção é externo ao cluster e deve ser fornecido pela SSP por configuração/Secret.
