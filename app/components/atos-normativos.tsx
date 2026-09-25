"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Search } from "lucide-react";
import { atosNormativos } from "@/content/site";
import { formatarData } from "@/lib/formato";
import { formatarTamanho } from "@/lib/limites";
import type { AtoNormativo } from "@/lib/data/types";
import { PageHeader } from "@/components/ui/page-header";
import { ActionLink } from "@/components/ui/action-link";
import { ICONE_TIPO_ATO } from "@/components/atos-normativos-styles";

const TODOS = "Todos";

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function AtosNormativos({ atos }: { atos: AtoNormativo[] }) {
  const tipos = useMemo(
    () => Array.from(new Set(atos.map((ato) => ato.tipo))).sort(),
    [atos],
  );
  const anos = useMemo(
    () => Array.from(new Set(atos.map((ato) => ato.ano))).sort((a, b) => b - a),
    [atos],
  );

  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState<string>(TODOS);
  const [ano, setAno] = useState<number | typeof TODOS>(TODOS);

  const filtrados = useMemo(() => {
    const termo = normalizar(busca.trim());
    return atos
      .filter((ato) => tipo === TODOS || ato.tipo === tipo)
      .filter((ato) => ano === TODOS || ato.ano === ano)
      .filter(
        (ato) =>
          termo === "" ||
          normalizar(ato.titulo).includes(termo) ||
          normalizar(ato.ementa).includes(termo) ||
          normalizar(ato.numero).includes(termo),
      )
      .sort((a, b) => (a.data < b.data ? 1 : -1));
  }, [atos, busca, tipo, ano]);

  return (
    <section
      id="atos-normativos"
      aria-labelledby="atos-normativos-titulo"
      className="bg-white pt-10 lg:pt-14"
    >
      <div className="container-espp">
        <PageHeader
          href="/atos-normativos"
          id="atos-normativos-titulo"
          eyebrow={atosNormativos.eyebrow}
          titulo={atosNormativos.titulo}
          texto={atosNormativos.texto}
        />

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <label className="flex min-w-[240px] flex-1 flex-col gap-2 text-xs font-semibold tracking-wider text-ink-700 uppercase">
            Pesquisar
            <span className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por título, ementa ou número"
                aria-label="Pesquisar atos normativos por texto ou título"
                className="w-full rounded-md border border-ink-300 bg-white py-2.5 pr-3 pl-9 text-sm font-normal tracking-normal text-ink-900 normal-case placeholder:text-ink-400"
              />
            </span>
          </label>

          <label className="flex flex-col gap-2 text-xs font-semibold tracking-wider text-ink-700 uppercase">
            Categoria
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="rounded-md border border-ink-300 bg-white px-3 py-2.5 text-sm font-normal tracking-normal text-ink-900 normal-case"
            >
              <option value={TODOS}>Todas</option>
              {tipos.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-xs font-semibold tracking-wider text-ink-700 uppercase">
            Ano
            <select
              value={ano}
              onChange={(e) => setAno(e.target.value === TODOS ? TODOS : Number(e.target.value))}
              className="rounded-md border border-ink-300 bg-white px-3 py-2.5 text-sm font-normal tracking-normal text-ink-900 normal-case"
            >
              <option value={TODOS}>Todos</option>
              {anos.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-6 text-xs font-semibold tracking-wider text-ink-500 uppercase">
          {filtrados.length} {filtrados.length === 1 ? "ato encontrado" : "atos encontrados"}
        </p>

        <div className="mt-8 max-h-[30rem] overflow-y-auto overscroll-contain pr-3 [scrollbar-gutter:stable]">
          {filtrados.length > 0 ? (
            <ul className="divide-y divide-ink-200 border-y border-ink-200">
              {filtrados.map((ato) => {
                const IconeTipo = ICONE_TIPO_ATO[ato.tipo] ?? FileText;
                return (
                  <li key={ato.id} className="py-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold tracking-wider uppercase">
                          <span className="inline-flex items-center gap-1.5 text-gold-700">
                            <IconeTipo className="size-4" aria-hidden="true" />
                            {ato.tipo}
                          </span>
                          <span className="text-ink-500">{ato.numero}</span>
                          <time className="text-ink-500" dateTime={ato.data}>{formatarData(ato.data)}</time>
                          <span className={`font-bold ${ato.situacao === "Vigente" ? "text-gold-700" : "text-ink-500"}`}>
                            {ato.situacao}
                          </span>
                        </p>
                        <h3 className="title-display mt-2 text-lg text-ink-900">{ato.titulo}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-700">{ato.ementa}</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-4 sm:justify-end">
                        {ato.anexo ? (
                          <a href={ato.anexo.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-gold-700 uppercase hover:text-gold-600">
                            <Download className="size-3.5" aria-hidden="true" />
                            Baixar PDF ({formatarTamanho(ato.anexo.tamanho)})
                          </a>
                        ) : null}
                        {ato.href ? (
                          <ActionLink href={ato.href} external variant="ghost" className="text-xs">
                            Ver publicação oficial
                          </ActionLink>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-10 text-sm text-ink-500">Nenhum ato normativo encontrado para os filtros selecionados.</p>
          )}
        </div>

      </div>

      <div className="atos-faixa-degrade mt-14 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] py-16 text-white lg:mt-16 lg:py-20" data-no-scroll-animation>
        <div className="container-espp">
          <p className="mx-auto max-w-4xl text-center text-xl leading-8 font-medium !text-white lg:text-2xl lg:leading-9">
            Esta linha do tempo traz uma seleção de exemplo. A relação completa e atualizada dos atos normativos está disponível no Diário Oficial e no portal da Polícia Penal de Goiás.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <ActionLink
              href={atosNormativos.fonteHref}
              variant="ghost"
              external
              className="flex min-h-20 w-full items-center justify-center rounded-lg border border-white/15 px-5 py-4 text-center text-sm font-bold tracking-wide !text-white uppercase transition-colors hover:border-[#f5c400]/70 hover:!text-[#f5c400]"
            >
              Portal de atos normativos
            </ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
