"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { matrizes } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
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
      className="scroll-mt-24 bg-white pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      <div className="container-espp">
        <SectionHeading
          id="matrizes-titulo"
          eyebrow={matrizes.eyebrow}
          titulo={matrizes.titulo}
          texto={matrizes.texto}
          tone="light"
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

        <div className="mt-10 space-y-12">
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

        <div className="mt-12 flex flex-col gap-4 rounded-lg border border-ink-200 bg-ink-050 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-700">
            Esta lista é compilada a partir do portal oficial. Consulte a fonte para a versão mais atualizada e para os detalhes de cada matriz curricular.
          </p>
          <ActionLink href={matrizes.fonteHref} variant="ghost" external className="text-xs">
            Portal oficial de matrizes curriculares
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
