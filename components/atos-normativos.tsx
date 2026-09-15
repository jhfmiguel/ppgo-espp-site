"use client";

import { useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";
import { atosNormativos } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { ActionLink } from "@/components/ui/action-link";
import { ESTILO_SITUACAO_ATO, ICONE_TIPO_ATO } from "@/components/atos-normativos-styles";

const TODOS = "Todos";

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function formatarData(data: string) {
  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function AtosNormativos() {
  const tipos = useMemo(
    () => Array.from(new Set(atosNormativos.itens.map((ato) => ato.tipo))).sort(),
    [],
  );
  const anos = useMemo(
    () => Array.from(new Set(atosNormativos.itens.map((ato) => ato.ano))).sort((a, b) => b - a),
    [],
  );

  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState<string>(TODOS);
  const [ano, setAno] = useState<number | typeof TODOS>(TODOS);

  const filtrados = useMemo(() => {
    const termo = normalizar(busca.trim());
    return atosNormativos.itens
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
  }, [busca, tipo, ano]);

  return (
    <section
      id="atos-normativos"
      aria-labelledby="atos-normativos-titulo"
      className="scroll-mt-24 bg-white pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      <div className="container-espp">
        <SectionHeading
          id="atos-normativos-titulo"
          eyebrow={atosNormativos.eyebrow}
          titulo={atosNormativos.titulo}
          texto={atosNormativos.texto}
          tone="light"
        />

        <div className="mt-10 flex flex-wrap items-end gap-4">
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

        {filtrados.length > 0 ? (
          <ol className="relative mt-8 ml-3 space-y-8 border-l-2 border-ink-200">
            {filtrados.map((ato) => {
              const IconeTipo = ICONE_TIPO_ATO[ato.tipo] ?? FileText;
              return (
                <li key={ato.numero} className="relative pl-8">
                  <span
                    aria-hidden="true"
                    className="absolute top-6 -left-[9px] size-4 rounded-full border-4 border-white bg-gold-500"
                  />
                  <div className="rounded-lg border border-ink-200 bg-white p-6 shadow-sm transition-colors hover:border-gold-500/60">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-md bg-ink-900 px-3 py-1.5 text-[0.7rem] font-bold tracking-wider text-gold-500 uppercase">
                        <IconeTipo className="size-3.5" aria-hidden="true" />
                        {ato.tipo}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md border px-3 py-1 text-[0.7rem] font-bold tracking-wider uppercase ${ESTILO_SITUACAO_ATO[ato.situacao] ?? "border-ink-200 bg-ink-100 text-ink-500"}`}
                      >
                        {ato.situacao}
                      </span>
                    </div>

                    <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-wider text-ink-500 uppercase">
                      <span>{ato.numero}</span>
                      <span aria-hidden="true" className="text-ink-300">·</span>
                      <time dateTime={ato.data}>{formatarData(ato.data)}</time>
                    </p>

                    <h3 className="title-display mt-2 text-lg text-ink-900">{ato.titulo}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-700">{ato.ementa}</p>

                    <ActionLink href={ato.href} external variant="ghost" className="mt-4 text-xs">
                      Ver publicação oficial
                    </ActionLink>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="mt-10 text-sm text-ink-500">
            Nenhum ato normativo encontrado para os filtros selecionados.
          </p>
        )}

        <div className="mt-12 flex flex-col gap-4 rounded-lg border border-ink-200 bg-ink-050 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-700">
            Esta linha do tempo traz uma seleção de exemplo. A relação completa e atualizada dos atos normativos está disponível no Diário Oficial e no portal da Polícia Penal de Goiás.
          </p>
          <ActionLink href={atosNormativos.fonteHref} variant="ghost" external className="shrink-0 text-xs">
            Portal de atos normativos
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
