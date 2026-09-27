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

O painel usa `ESPP_SESSION_SECRET` para a sessão e está preparado para autenticação institucional SSP-GO. Em produção, mantenha `ESPP_AUTH_MODE=ssp`. O modo `development` é exclusivamente técnico para desenvolvimento/homologação e usa `ESPP_TEST_ADMIN_USER` e `ESPP_TEST_ADMIN_PASSWORD`.

A integração SSP aguarda o contrato oficial (authorization/token endpoints, client ID/secret ou PKCE, scopes, claims/perfis e logout). O fluxo, callback, state anti-CSRF, sessão, autorização e logout já estão preparados.

## Navegação pública

Não existe Central de Acessos pública. O cadastro de **Acessos** pertence exclusivamente ao painel administrativo e controla quais identidades institucionais estão autorizadas a utilizar o sistema e com qual perfil.

No site público, o Portal do Aluno permanece como destino próprio da navegação. No mobile, os três atalhos persistentes são **Ensino**, **Portal do Aluno** e **Normas e Regulamentos**. Contato reúne canais da Escola, Ouvidoria e mapa/localização.

## Painel administrativo

O módulo **Acessos** fica em `/admin/acessos` e é administrativo. Ele mantém identificador institucional, nome, perfil e situação da autorização. Os perfis atualmente tratados são **Administrador** e **Comunicação**.

A autenticação do usuário do painel é feita pela camada de sessão/SSP (ou pelo modo de desenvolvimento). As chamadas internas do frontend para a API não dependem mais do antigo Basic Auth técnico com `ESPP_API_ADMIN_USER`/`ESPP_API_ADMIN_PASSWORD`. Operações administrativas encaminham a identidade do operador quando necessário para autorização/auditoria.

## Conteúdo

O conteúdo institucional permanece em `content/site.ts`. A navegação pública consolidada está em `content/navigation.ts`. Marcações `VALIDAR` indicam conteúdo que ainda precisa de aprovação institucional; `FONTE` identifica dados provenientes de fonte oficial.

## Qualidade e release

Antes de publicar:

```bash
yarn check
```

Também valide desktop/mobile, navegação por teclado, links externos, formulários, estados de loading/erro/vazio e os perfis Administrador/Comunicação. O diretório `/admin` não deve ser indexado.

## Backend

O frontend usa `ESPP_API_URL` (padrão local `http://localhost:8081`). Banco, criptografia de configurações, integração SSP e URL do frontend são configurados pelas variáveis documentadas em `.env.example`.
