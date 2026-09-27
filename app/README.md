# ESPP — Site institucional

Site institucional e painel administrativo da **Escola Superior de Polícia Penal (ESPP)** da Polícia Penal do Estado de Goiás.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- lucide-react
- API Spring Boot + Oracle
- Google Maps embed público

## Rodar o frontend

```bash
yarn install
yarn dev        # http://localhost:3001
yarn typecheck
yarn build
yarn check      # typecheck + build
yarn start      # http://localhost:3001
```

## Configuração

Copie `.env.example` para o ambiente apropriado. Nunca versione segredos reais.

O painel usa `ESPP_SESSION_SECRET` para a sessão e está preparado para autenticação institucional SSP-GO. Em produção, mantenha `ESPP_AUTH_MODE=ssp`. O modo `local` é exclusivamente técnico para desenvolvimento/homologação e exige `ESPP_TEST_ADMIN_USER` e `ESPP_TEST_ADMIN_PASSWORD`.

A integração SSP aguarda o contrato oficial (authorization/token endpoints, client ID/secret ou PKCE, scopes, claims/perfis e logout). O fluxo, callback, state anti-CSRF, sessão, autorização e logout já estão preparados.

## Navegação pública

A Central de **Acessos** (`/acessos`) concentra Portal do Aluno e Painel Administrativo. No mobile, os três atalhos persistentes são **Ensino**, **Portal do Aluno** e **Normas e Regulamentos**. Contato reúne canais da Escola, Ouvidoria e mapa/localização.

## Conteúdo

O conteúdo institucional permanece em `content/site.ts`. A navegação pública consolidada está em `content/navigation.ts`. Marcações `VALIDAR` indicam conteúdo que ainda precisa de aprovação institucional; `FONTE` identifica dados provenientes de fonte oficial.

## Qualidade e release

Antes de publicar:

```bash
yarn check
```

Também valide desktop/mobile, navegação por teclado, links externos, formulários, estados de loading/erro/vazio e os perfis Administrador/Comunicação. O diretório `/admin` não deve ser indexado.

## Backend

O frontend usa `ESPP_API_URL` (padrão local `http://localhost:8081`). Banco, credenciais administrativas da API e URL do frontend são configurados pelas variáveis documentadas em `.env.example`.
