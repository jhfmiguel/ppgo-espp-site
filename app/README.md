# ESPP — Site institucional

Landing page institucional da **Escola Superior de Polícia Penal (ESPP)** da Polícia Penal de Goiás,
com seção dedicada ao **FORTIS**, a plataforma de ensino e gestão escolar em desenvolvimento.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- lucide-react (ícones)
- Google Maps em modo embed público (não exige chave de API)

## Rodar localmente

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
npm start       # servir o build
```

## Onde editar o conteúdo

Todo o texto, números, contatos e links da página ficam em **`content/site.ts`**.
Editar esse arquivo é suficiente para atualizar o site — os componentes só consomem esses dados.

Marcações no arquivo:

- `// VALIDAR` — conteúdo redigido como rascunho, pendente de aprovação da Escola
  (missão, visão, valores, horário de atendimento e o domínio em `site.url`).
- `// FONTE` — dado extraído de fonte pública oficial.

## Estrutura

```
app/
  layout.tsx      metadata, fontes, JSON-LD (EducationalOrganization + geo)
  page.tsx        composição das seções
  globals.css     tokens do tema institucional (grafite / amarelo / verde)
  sitemap.ts, robots.ts, icon.png
components/       uma seção por arquivo
content/site.ts   fonte única de conteúdo
public/images/    brasão e fotos institucionais
```

## Deploy na Vercel

O projeto é estático (SSG) e **não exige variáveis de ambiente**.

1. `git init && git add . && git commit -m "site institucional ESPP"` e publicar o repositório.
2. Na Vercel: *Add New → Project* → importar o repositório. O framework é detectado
   automaticamente (Next.js); build `next build`, sem configuração extra.
3. Após o primeiro deploy, ajustar `site.url` em `content/site.ts` para o domínio definitivo
   (usado em metadata, Open Graph, `sitemap.xml` e `robots.txt`).

## Pendências conhecidas

- **Formulários sem backend**: tanto o "avise-me" do FORTIS quanto o formulário de contato
  apenas confirmam visualmente e orientam o envio por e-mail. Para ativar, plugar uma Server
  Action (ex.: Resend para e-mail, ou gravação em banco).
- **Notícias** não foram incluídas: o portal do Governo de Goiás está com a divulgação de
  notícias suspensa por período eleitoral, sem fonte estável para popular a seção.
- **Conteúdo institucional** marcado com `// VALIDAR` precisa de aprovação antes da publicação.
