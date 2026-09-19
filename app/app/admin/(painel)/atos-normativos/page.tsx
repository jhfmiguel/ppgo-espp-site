import Link from "next/link";
import { ExternalLink, FileText, Paperclip, SquarePen } from "lucide-react";

import { exigirPermissao } from "@/lib/auth/dal";
import { listarAtos } from "@/lib/data/store";
import { alternarStatusAto, removerAto } from "@/lib/actions/atos";
import { formatarData, formatarDataHora } from "@/lib/formato";
import { formatarTamanho } from "@/lib/limites";
import { Aviso, BotaoPublicar, ListaVazia, SeloStatus, TituloPagina } from "@/components/admin/ui";
import { BotaoExcluir } from "@/components/admin/botao-excluir";
import { ESTILO_SITUACAO_ATO } from "@/components/atos-normativos-styles";

export const metadata = { title: "Atos normativos" };

export default async function AdminAtosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await exigirPermissao("atosNormativos");
  const [{ ok, erro }, atos] = await Promise.all([searchParams, listarAtos()]);

  return (
    <>
      <TituloPagina
        titulo="Atos normativos"
        descricao="Portarias, editais, resoluções e instruções normativas exibidos na página de Atos Normativos."
        acao={{ href: "/admin/atos-normativos/novo", rotulo: "Novo ato" }}
      />

      <Aviso ok={ok} erro={erro} />

      {atos.length === 0 ? (
        <ListaVazia
          titulo="Nenhum ato cadastrado"
          texto="Cadastre o primeiro ato normativo para que ele apareça na linha do tempo pública."
          acao={{ href: "/admin/atos-normativos/novo", rotulo: "Novo ato" }}
        />
      ) : (
        <ul className="space-y-3">
          {atos.map((ato) => (
            <li
              key={ato.id}
              className="flex flex-col gap-4 rounded-xl border border-ink-200 bg-white p-4 sm:flex-row sm:items-start"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gold-050">
                <FileText className="size-5 text-gold-700" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <SeloStatus status={ato.status} />
                  <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wider text-ink-700 uppercase">
                    {ato.tipo}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wider uppercase ${ESTILO_SITUACAO_ATO[ato.situacao] ?? "bg-ink-100 text-ink-700"}`}
                  >
                    {ato.situacao}
                  </span>
                </div>

                <Link
                  href={`/admin/atos-normativos/${ato.id}`}
                  className="mt-1.5 block text-base font-semibold text-ink-900 hover:text-gold-700"
                >
                  {ato.titulo}
                </Link>
                <p className="text-xs font-semibold text-ink-600">{ato.numero}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-600">{ato.ementa}</p>

                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
                  <span>{formatarData(ato.data)}</span>
                  {ato.anexo ? (
                    <a
                      href={ato.anexo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-gov-blue underline underline-offset-4"
                    >
                      <Paperclip className="size-3.5" aria-hidden="true" />
                      PDF anexado ({formatarTamanho(ato.anexo.tamanho)})
                    </a>
                  ) : null}
                  {ato.href ? (
                    <a
                      href={ato.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-gov-blue underline underline-offset-4"
                    >
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                      Fonte oficial
                    </a>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  atualizado em {formatarDataHora(ato.atualizadoEm)}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Link
                  href={`/admin/atos-normativos/${ato.id}`}
                  className="inline-flex size-8 items-center justify-center rounded-md border border-ink-200 text-ink-700 transition-colors hover:border-gold-400 hover:bg-gold-050"
                  title="Editar"
                  aria-label="Editar"
                >
                  <SquarePen className="size-3.5" aria-hidden="true" />
                </Link>
                <BotaoPublicar acao={alternarStatusAto} id={ato.id} status={ato.status} />
                <BotaoExcluir
                  acao={removerAto}
                  id={ato.id}
                  descricao={`o ato ${ato.numero}`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
