"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { matrizes } from "@/content/site";
import { PageHeader } from "@/components/ui/page-header";
import { ActionLink } from "@/components/ui/action-link";

const TODOS = "Todos";

export function MatrizesCurriculares() {
  const anos = useMemo(
    () => Array.from(new Set(matrizes.cursos.map((c) => c.ano))).sort((a, b) => b - a),
    [],
  );
  const modalidades = useMemo(
    () => Array.from(new Set(matrizes.cursos.map((c) => c.modalidade))).sort(),
    [],
  );

  const [ano, setAno] = useState<number | typeof TODOS>(TODOS);
  const [modalidade, setModalidade] = useState<string>(TODOS);

  const filtrados = matrizes.cursos.filter(
    (c) => (ano === TODOS || c.ano === ano) && (modalidade === TODOS || c.modalidade === modalidade),
  );

  const porAno = useMemo(() => {
    const grupos = new Map<number, (typeof matrizes.cursos)[number][]>();
    for (const curso of filtrados) {
      const grupo = grupos.get(curso.ano) ?? [];
      grupo.push(curso);
      grupos.set(curso.ano, grupo);
    }
    return Array.from(grupos.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtrados]);

  return (
    <section
      id="matrizes-curriculares"
      aria-labelledby="matrizes-titulo"
      className="bg-white pt-10 lg:pt-14"
    >
      <div className="container-espp">
        <PageHeader
          href="/matrizes-curriculares"
          id="matrizes-titulo"
          eyebrow={matrizes.eyebrow}
          titulo={matrizes.titulo}
          texto={matrizes.texto}
        />

        <div className="mt-10 flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-ink-700 uppercase">
            Ano
            <select
              value={ano}
              onChange={(e) => setAno(e.target.value === TODOS ? TODOS : Number(e.target.value))}
              className="rounded-md border border-ink-300 bg-white px-3 py-2 text-sm font-normal tracking-normal text-ink-900 normal-case"
            >
              <option value={TODOS}>Todos</option>
              {anos.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-ink-700 uppercase">
            Modalidade
            <select
              value={modalidade}
              onChange={(e) => setModalidade(e.target.value)}
              className="rounded-md border border-ink-300 bg-white px-3 py-2 text-sm font-normal tracking-normal text-ink-900 normal-case"
            >
              <option value={TODOS}>Todas</option>
              {modalidades.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-10 max-h-[30rem] space-y-12 overflow-y-auto overscroll-contain pr-3 [scrollbar-gutter:stable]">
          {porAno.map(([anoGrupo, cursosDoAno]) => (
            <div key={anoGrupo}>
              <h3 className="title-display text-2xl text-gold-600">{anoGrupo}</h3>
              <ul className="mt-5 divide-y divide-ink-200 border-y border-ink-200">
                {cursosDoAno.map((curso) => (
                  <li
                    key={curso.nome + curso.portariaHref}
                    className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{curso.nome}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
                        <span>{curso.modalidade}</span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="size-3.5" aria-hidden="true" />
                          {curso.vagas} vagas
                        </span>
                      </p>
                    </div>
                    <ActionLink
                      href={curso.portariaHref}
                      variant="ghost"
                      external
                      showIcon={false}
                      className="shrink-0 text-xs"
                    >
                      Ver portaria
                    </ActionLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {porAno.length === 0 ? (
            <p className="text-sm text-ink-500">Nenhum curso encontrado para os filtros selecionados.</p>
          ) : null}
        </div>

      </div>

      <div className="matrizes-faixa-degrade mt-14 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] py-16 text-white lg:mt-16 lg:py-20">
        <div className="container-espp">
          <p className="mx-auto max-w-4xl text-center text-xl leading-8 font-medium !text-white lg:text-2xl lg:leading-9">
            Esta lista é compilada a partir do portal oficial. Consulte a fonte para a versão mais atualizada e para os detalhes de cada matriz curricular.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <ActionLink
              href={matrizes.fonteHref}
              variant="ghost"
              external
              className="flex min-h-20 w-full items-center justify-center rounded-lg border border-white/15 px-5 py-4 text-center text-sm font-bold tracking-wide !text-white uppercase transition-colors hover:border-[#f5c400]/70 hover:!text-[#f5c400]"
            >
              Portal oficial de matrizes curriculares
            </ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
