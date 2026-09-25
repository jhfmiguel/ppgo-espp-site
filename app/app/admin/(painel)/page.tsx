import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, Mail, Megaphone, UsersRound, ClipboardList, KeyRound } from "lucide-react";

import { exigirUsuario } from "@/lib/auth/dal";
import { podeGerenciar, ROTULO_PERFIL, type Recurso } from "@/lib/auth/users";
import { listarAssinantesNewsletter, listarAtos, listarEventos, listarMensagensContato, listarNoticias, listarProximosEventos } from "@/lib/data/store";
import { formatarData, formatarDataHora } from "@/lib/formato";
import { Aviso, SeloStatus } from "@/components/admin/ui";
import { DashboardCharts } from "@/components/admin/dashboard-charts";

export const metadata = { title: "Visão geral" };

export default async function PainelPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const [usuario, { ok, erro }] = await Promise.all([exigirUsuario(), searchParams]);

  const [noticias, eventos, atos, proximos, mensagens, assinantes] = await Promise.all([
    listarNoticias(),
    listarEventos(),
    listarAtos(),
    listarProximosEventos(),
    listarMensagensContato(),
    listarAssinantesNewsletter(),
  ]);

  const cartoes: {
    recurso: Recurso;
    href: string;
    rotulo: string;
    Icone: typeof Megaphone;
    total: number;
    publicados: number;
  }[] = [
    {
      recurso: "noticias",
      href: "/admin/noticias",
      rotulo: "Notícias",
      Icone: Megaphone,
      total: noticias.length,
      publicados: noticias.filter((n) => n.status === "publicado").length,
    },
    {
      recurso: "eventos",
      href: "/admin/eventos",
      rotulo: "Eventos",
      Icone: CalendarDays,
      total: eventos.length,
      publicados: eventos.filter((e) => e.status === "publicado").length,
    },
    {
      recurso: "atosNormativos",
      href: "/admin/atos-normativos",
      rotulo: "Atos normativos",
      Icone: FileText,
      total: atos.length,
      publicados: atos.filter((a) => a.status === "publicado").length,
    },
    {
      recurso: "mensagens",
      href: "/admin/mensagens",
      rotulo: "Mensagens",
      Icone: Mail,
      total: mensagens.length,
      publicados: mensagens.filter((m) => m.status !== "NOVA").length,
    },
    {
      recurso: "newsletter",
      href: "/admin/newsletter",
      rotulo: "Newsletter",
      Icone: UsersRound,
      total: assinantes.length,
      publicados: assinantes.filter((a) => a.status === "ATIVO").length,
    },
  ];

  const visiveis = cartoes.filter((c) => podeGerenciar(usuario.perfil, c.recurso));
  const recentes = noticias.slice(0, 5);
  const graficos = visiveis.map(({ rotulo, total, publicados }) => ({
    rotulo,
    total,
    principal: publicados,
    secundario: Math.max(total - publicados, 0),
  }));
  const maiorTotal = Math.max(1, ...graficos.map((item) => item.total));
  const meses = Array.from({ length: 6 }, (_, indice) => {
    const data = new Date();
    data.setDate(1);
    data.setMonth(data.getMonth() - (5 - indice));
    const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
    const mes = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(data).replace(".", "");
    return { chave, mes };
  });
  const dataItem = (item: { data?: string; dataInicio?: string }) => item.data ?? item.dataInicio ?? "";
  const mensalDashboard = meses.map(({ chave, mes }) => {
    const itens = [...noticias, ...eventos, ...atos].filter((item) => dataItem(item).startsWith(chave));
    return { mes, total: itens.length, publicados: itens.filter((item) => item.status === "publicado").length };
  });
  const porModuloDashboard = visiveis.map(({ rotulo, total }) => ({ nome: rotulo, total }));
  const conteudos = [...noticias, ...eventos, ...atos];
  const porSituacaoDashboard = [
    { nome: "Publicados", total: conteudos.filter((item) => item.status === "publicado").length },
    { nome: "Rascunhos", total: conteudos.filter((item) => item.status !== "publicado").length },
  ];
  const porMensagemDashboard = [
    { nome: "Novas", total: mensagens.filter((item) => item.status === "NOVA").length },
    { nome: "Tratadas", total: mensagens.filter((item) => item.status !== "NOVA").length },
  ];
  const newsletterDashboard = [
    { nome: "Ativos", total: assinantes.filter((item) => item.status === "ATIVO").length },
    { nome: "Inativos", total: assinantes.filter((item) => item.status !== "ATIVO").length },
  ];

  const fluxos = [
    {
      titulo: "Publicação de notícias",
      destaque: true,
      Icone: Megaphone,
      etapas: [
        { titulo: "Criar conteúdo", descricao: "A equipe prepara título, imagem e corpo da notícia.", href: "/admin/noticias/nova" },
        { titulo: "Revisar publicação", descricao: "O conteúdo pode permanecer em rascunho antes de ir ao ar.", href: "/admin/noticias" },
        { titulo: "Publicar", descricao: "A notícia passa a aparecer no portal público.", href: "/admin/noticias" },
      ],
    },
    {
      titulo: "Agenda de eventos",
      Icone: CalendarDays,
      etapas: [
        { titulo: "Cadastrar evento", descricao: "Informar programação, período, local e imagem.", href: "/admin/eventos/novo" },
        { titulo: "Definir situação", descricao: "Manter como rascunho ou publicar na agenda.", href: "/admin/eventos" },
        { titulo: "Portal público", descricao: "Eventos publicados passam a compor a agenda da ESPP.", href: "/admin/eventos" },
      ],
    },
    {
      titulo: "Atos normativos",
      Icone: FileText,
      etapas: [
        { titulo: "Cadastrar ato", descricao: "Registrar identificação, ementa, data e fonte oficial.", href: "/admin/atos-normativos/novo" },
        { titulo: "Anexar ou referenciar", descricao: "Disponibilizar PDF ou link da fonte oficial.", href: "/admin/atos-normativos" },
        { titulo: "Publicar", descricao: "O ato fica disponível para consulta no portal.", href: "/admin/atos-normativos" },
      ],
    },
    {
      titulo: "Mensagens de contato",
      Icone: Mail,
      etapas: [
        { titulo: "Mensagem recebida", descricao: "O formulário público registra a solicitação." },
        { titulo: "Triagem", descricao: "A equipe acompanha e trata a mensagem.", href: "/admin/mensagens" },
        { titulo: "Resposta", descricao: "O retorno utiliza a configuração institucional de e-mail.", href: "/admin/mensagens" },
      ],
    },
    {
      titulo: "Newsletter",
      Icone: UsersRound,
      etapas: [
        { titulo: "Assinatura", descricao: "Interessados entram na base de assinantes ativos." },
        { titulo: "Preparar campanha", descricao: "A comunicação cria e revisa a campanha.", href: "/admin/newsletter/campanhas/nova" },
        { titulo: "Envio", descricao: "A campanha é enviada aos assinantes ativos.", href: "/admin/newsletter" },
      ],
    },
    {
      titulo: "Auditoria administrativa",
      Icone: ClipboardList,
      etapas: [
        { titulo: "Ação administrativa", descricao: "Alteração relevante ocorre no painel." },
        { titulo: "Registro do evento", descricao: "A operação é registrada para rastreabilidade." },
        { titulo: "Consulta", descricao: "Administradores consultam a trilha de alterações.", href: "/admin/controle-alteracoes" },
      ],
    },
    {
      titulo: "Autenticação externa",
      Icone: KeyRound,
      etapas: [
        { titulo: "Usuário acessa", descricao: "Início do acesso ao painel administrativo." },
        { titulo: "SSP autentica", descricao: "A identidade institucional será validada pelo provedor externo." },
        { titulo: "ESPP recebe identidade", descricao: "O painel utiliza a identidade e as permissões fornecidas pela integração." },
      ],
    },
  ] as const;

  return (
    <>
      <Aviso ok={ok} erro={erro} />

      <header className="mb-8 border-b border-ink-200 pb-5">
        <p className="text-[0.7rem] font-bold tracking-[0.16em] text-gold-600 uppercase">
          {ROTULO_PERFIL[usuario.perfil]}
        </p>
        <h1 className="title-display mt-1 text-3xl text-ink-900">Olá, {usuario.nome}</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-600">
          {usuario.perfil === "admin"
            ? "Você gerencia notícias, a agenda de eventos e os atos normativos do portal."
            : "Você gerencia as notícias e a agenda de eventos do portal."}
        </p>
      </header>

      <section aria-labelledby="resumo" className="mb-10">
        <h2 id="resumo" className="sr-only">
          Resumo do conteúdo
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visiveis.map(({ href, rotulo, Icone, total, publicados }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-xl border border-ink-200 bg-white p-5 transition-colors hover:border-gold-400"
              >
                <span className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] text-ink-500 uppercase">
                  <Icone className="size-4 text-gold-600" aria-hidden="true" />
                  {rotulo}
                </span>
                <span className="title-display mt-3 text-4xl text-ink-900">{total}</span>
                <span className="mt-1 text-xs text-ink-500">
                  {rotulo === "Mensagens" ? `${total - publicados} nova(s) · ${publicados} tratada(s)` : rotulo === "Newsletter" ? `${publicados} ativo(s) · ${total - publicados} inativo(s)` : `${publicados} no ar · ${total - publicados} em rascunho`}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 uppercase">
                  Gerenciar
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10" aria-labelledby="graficos-dashboard">
        <div className="mb-5">
          <p className="text-[0.7rem] font-bold tracking-[0.14em] text-gold-600 uppercase">Indicadores visuais</p>
          <h2 id="graficos-dashboard" className="title-display mt-1 text-2xl text-ink-900">Gráficos do painel</h2>
          <p className="mt-2 max-w-3xl text-sm text-ink-600">Conjunto completo de gráficos operacionais, seguindo a estrutura visual do dashboard do NASPP e adaptado aos dados da ESPP.</p>
        </div>
        <DashboardCharts mensal={mensalDashboard} porModulo={porModuloDashboard} porSituacao={porSituacaoDashboard} porMensagem={porMensagemDashboard} newsletter={newsletterDashboard} />
      </section>

      <section className="mb-10">
        <div className="mb-5">
          <p className="text-[0.7rem] font-bold tracking-[0.14em] text-gold-600 uppercase">Fluxos operacionais</p>
          <h2 className="title-display mt-1 text-2xl text-ink-900">Como a ESPP opera no sistema</h2>
          <p className="mt-2 max-w-3xl text-sm text-ink-600">
            As etapas mostram o ciclo de publicação, comunicação, atos normativos, auditoria e autenticação institucional.
          </p>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          {fluxos.map(({ titulo, Icone, etapas, ...resto }) => {
            const destaque = "destaque" in resto && resto.destaque;
            return (
              <article key={titulo} className={`admin-form-surface rounded-xl border bg-white p-5 ${destaque ? "border-gold-400 ring-1 ring-gold-400/20" : "border-ink-200"}`}>
                <div className="mb-5 flex items-center gap-3">
                  <span className={`inline-flex size-9 items-center justify-center rounded-lg ${destaque ? "bg-gold-500 text-ink-950" : "bg-ink-100 text-ink-700"}`}><Icone className="size-4" aria-hidden="true" /></span>
                  <div>
                    <h3 className="title-display text-lg text-ink-900">{titulo}</h3>
                    {destaque ? <p className="mt-0.5 text-xs font-bold text-gold-700 uppercase">Fluxo principal</p> : null}
                  </div>
                </div>
                <div className="space-y-2">
                  {etapas.map((etapa, indice) => {
                    const conteudo = (
                      <div className="flex gap-3 rounded-lg border border-ink-100 bg-ink-050 p-3.5 transition-colors group-hover:border-gold-300 group-hover:bg-white">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink-900 text-[0.68rem] font-bold text-white">{indice + 1}</span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-ink-900">{etapa.titulo}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">{etapa.descricao}</span>
                        </span>
                        {"href" in etapa ? <ArrowRight className="ml-auto mt-1 size-4 shrink-0 text-gold-600" aria-hidden="true" /> : null}
                      </div>
                    );
                    return <div key={etapa.titulo}>{"href" in etapa && etapa.href ? <Link href={etapa.href} className="group block">{conteudo}</Link> : conteudo}{indice < etapas.length - 1 ? <div className="ml-[1.65rem] h-4 w-px bg-ink-200" aria-hidden="true" /> : null}</div>;
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="recentes" className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5">
          <h2 id="recentes" className="title-display text-lg text-ink-900">Últimas notícias</h2>
          {recentes.length === 0 ? <p className="mt-3 text-sm text-ink-500">Nenhuma notícia cadastrada.</p> : (
            <ul className="mt-4 divide-y divide-ink-100">{recentes.map((noticia) => (
              <li key={noticia.id} className="flex items-start gap-3 py-3"><span className="min-w-0 flex-1">
                <Link href={`/admin/noticias/${noticia.id}`} className="block truncate text-sm font-semibold text-ink-900 hover:text-gold-700">{noticia.titulo}</Link>
                <span className="text-xs text-ink-500">{formatarData(noticia.data, "curta")} · atualizada em {formatarDataHora(noticia.atualizadoEm)}</span>
              </span><SeloStatus status={noticia.status} /></li>
            ))}</ul>
          )}
        </section>
        <section aria-labelledby="agenda" className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5">
          <h2 id="agenda" className="title-display text-lg text-ink-900">Próximos eventos</h2>
          {proximos.length === 0 ? <p className="mt-3 text-sm text-ink-500">Nenhum evento publicado à frente na agenda.</p> : (
            <ul className="mt-4 divide-y divide-ink-100">{proximos.slice(0, 5).map((evento) => (
              <li key={evento.id} className="py-3"><Link href={`/admin/eventos/${evento.id}`} className="block truncate text-sm font-semibold text-ink-900 hover:text-gold-700">{evento.titulo}</Link>
              <span className="text-xs text-ink-500">{formatarData(evento.dataInicio, "curta")} · {evento.local}</span></li>
            ))}</ul>
          )}
        </section>
      </div>
    </>
  );
}
