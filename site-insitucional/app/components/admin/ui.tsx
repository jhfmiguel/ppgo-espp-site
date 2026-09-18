import Link from "next/link";
import { AlertTriangle, CheckCircle2, Eye, EyeOff, Plus } from "lucide-react";

import type { Status } from "@/lib/data/types";

/** Peças de interface compartilhadas pelas telas do painel. */

export function TituloPagina({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao?: string;
  acao?: { href: string; rotulo: string };
}) {
  return (
    <header className="mb-7 flex flex-wrap items-start justify-between gap-4 border-b border-ink-200 pb-5">
      <div>
        <h1 className="title-display text-3xl text-ink-900">{titulo}</h1>
        {descricao ? <p className="mt-1.5 max-w-2xl text-sm text-ink-600">{descricao}</p> : null}
      </div>
      {acao ? (
        <Link
          href={acao.href}
          className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-5 py-2.5 text-xs font-bold tracking-wide text-ink-950 uppercase transition-colors hover:bg-gold-400"
        >
          <Plus className="size-4" aria-hidden="true" />
          {acao.rotulo}
        </Link>
      ) : null}
    </header>
  );
}

export function SeloStatus({ status }: { status: Status }) {
  const publicado = status === "publicado";
  const Icone = publicado ? Eye : EyeOff;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-bold tracking-wider uppercase ${
        publicado ? "bg-forest-500/12 text-forest-600" : "bg-ink-100 text-ink-600"
      }`}
    >
      <Icone className="size-3" aria-hidden="true" />
      {publicado ? "Publicado" : "Rascunho"}
    </span>
  );
}

/** Mensagens de retorno das ações, lidas da query string após o redirect. */
export function Aviso({ ok, erro }: { ok?: string; erro?: string }) {
  const MENSAGENS: Record<string, string> = {
    criada: "Notícia criada com sucesso.",
    criado: "Registro criado com sucesso.",
    atualizada: "Notícia atualizada com sucesso.",
    atualizado: "Registro atualizado com sucesso.",
    excluida: "Notícia excluída.",
    excluido: "Registro excluído.",
    publicada: "Notícia publicada — já aparece no site.",
    publicado: "Registro publicado — já aparece no site.",
    despublicada: "Notícia voltou para rascunho e saiu do site público.",
    despublicado: "Registro voltou para rascunho e saiu do site público.",
  };

  const ERROS: Record<string, string> = {
    "sem-permissao": "Seu perfil não tem permissão para acessar essa seção.",
    "nao-encontrada": "Registro não encontrado.",
    "nao-encontrado": "Registro não encontrado.",
  };

  if (erro && ERROS[erro]) {
    return (
      <p
        role="alert"
        className="mb-6 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
      >
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        {ERROS[erro]}
      </p>
    );
  }

  if (ok && MENSAGENS[ok]) {
    return (
      <p
        role="status"
        className="mb-6 flex items-start gap-2.5 rounded-lg border border-forest-500/30 bg-forest-500/8 px-4 py-3 text-sm font-semibold text-forest-600"
      >
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        {MENSAGENS[ok]}
      </p>
    );
  }

  return null;
}

export function ListaVazia({
  titulo,
  texto,
  acao,
}: {
  titulo: string;
  texto: string;
  acao?: { href: string; rotulo: string };
}) {
  return (
    <div className="rounded-xl border border-dashed border-ink-300 bg-white px-6 py-14 text-center">
      <p className="title-display text-xl text-ink-900">{titulo}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">{texto}</p>
      {acao ? (
        <Link
          href={acao.href}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-gold-500 px-5 py-2.5 text-xs font-bold tracking-wide text-ink-950 uppercase transition-colors hover:bg-gold-400"
        >
          <Plus className="size-4" aria-hidden="true" />
          {acao.rotulo}
        </Link>
      ) : null}
    </div>
  );
}

/** Botão de alternar publicação, usado nas listagens. */
export function BotaoPublicar({
  acao,
  id,
  status,
}: {
  acao: (formData: FormData) => void;
  id: string;
  status: Status;
}) {
  const publicado = status === "publicado";
  return (
    <form action={acao}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-md border border-ink-200 px-2.5 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-gold-400 hover:bg-gold-050 hover:text-ink-900"
      >
        {publicado ? (
          <EyeOff className="size-3.5" aria-hidden="true" />
        ) : (
          <Eye className="size-3.5" aria-hidden="true" />
        )}
        {publicado ? "Despublicar" : "Publicar"}
      </button>
    </form>
  );
}
