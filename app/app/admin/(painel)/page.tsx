import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, Mail, Megaphone, UsersRound } from "lucide-react";

import { exigirUsuario } from "@/lib/auth/dal";
import { podeGerenciar, ROTULO_PERFIL, type Recurso } from "@/lib/auth/users";
import { listarAssinantesNewsletter, listarAtos, listarEventos, listarMensagensContato, listarNoticias, listarProximosEventos } from "@/lib/data/store";
import { formatarData, formatarDataHora } from "@/lib/formato";
import { Aviso, SeloStatus } from "@/components/admin/ui";

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

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="recentes" className="rounded-xl border border-ink-200 bg-white p-5">
          <h2 id="recentes" className="title-display text-lg text-ink-900">
            Últimas notícias
          </h2>
          {recentes.length === 0 ? (
            <p className="mt-3 text-sm text-ink-500">Nenhuma notícia cadastrada.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink-100">
              {recentes.map((noticia) => (
                <li key={noticia.id} className="flex items-start gap-3 py-3">
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/admin/noticias/${noticia.id}`}
                      className="block truncate text-sm font-semibold text-ink-900 hover:text-gold-700"
                    >
                      {noticia.titulo}
                    </Link>
                    <span className="text-xs text-ink-500">
                      {formatarData(noticia.data, "curta")} · atualizada em{" "}
                      {formatarDataHora(noticia.atualizadoEm)}
                    </span>
                  </span>
                  <SeloStatus status={noticia.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="agenda" className="rounded-xl border border-ink-200 bg-white p-5">
          <h2 id="agenda" className="title-display text-lg text-ink-900">
            Próximos eventos
          </h2>
          {proximos.length === 0 ? (
            <p className="mt-3 text-sm text-ink-500">Nenhum evento publicado à frente na agenda.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink-100">
              {proximos.slice(0, 5).map((evento) => (
                <li key={evento.id} className="py-3">
                  <Link
                    href={`/admin/eventos/${evento.id}`}
                    className="block truncate text-sm font-semibold text-ink-900 hover:text-gold-700"
                  >
                    {evento.titulo}
                  </Link>
                  <span className="text-xs text-ink-500">
                    {formatarData(evento.dataInicio, "curta")} · {evento.local}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
