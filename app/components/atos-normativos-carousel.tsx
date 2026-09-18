"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatarData } from "@/lib/formato";
import type { AtoNormativo } from "@/lib/data/types";
import { ESTILO_SITUACAO_ATO, ICONE_TIPO_ATO } from "@/components/atos-normativos-styles";

const INTERVALO_MS = 6000;

export function AtosNormativosCarrossel({ atos }: { atos: AtoNormativo[] }) {
  const itens = useMemo(
    () => [...atos].sort((a, b) => (a.data < b.data ? 1 : -1)).slice(0, 3),
    [atos],
  );
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado || itens.length <= 1) return;
    const id = setInterval(() => setIndice((i) => (i + 1) % itens.length), INTERVALO_MS);
    return () => clearInterval(id);
  }, [pausado, itens.length]);

  if (itens.length === 0) return null;

  const item = itens[indice];
  const IconeTipo = ICONE_TIPO_ATO[item.tipo] ?? ICONE_TIPO_ATO.Portaria;

  return (
    <div
      className="flex h-full flex-col rounded-xl border border-ink-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gold-400/70 hover:shadow-md"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] text-gold-600 uppercase">
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
          Atos Normativos
        </p>
        <Link
          href="/atos-normativos"
          className="text-[0.65rem] font-semibold tracking-wider text-ink-500 uppercase transition-colors hover:text-gold-600"
        >
          Ver todos
        </Link>
      </div>

      <Link
        href="/atos-normativos"
        className="group mt-5 flex grow flex-col justify-center"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-ink-900 px-2.5 py-1.5 text-[0.65rem] font-bold tracking-wider text-gold-500 uppercase">
            <IconeTipo className="size-3.5" aria-hidden="true" />
            {item.tipo}
          </span>
          <span
            className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[0.65rem] font-bold tracking-wider uppercase ${ESTILO_SITUACAO_ATO[item.situacao] ?? "border-ink-200 bg-ink-100 text-ink-500"}`}
          >
            {item.situacao}
          </span>
        </div>

        <p className="mt-4 text-xs font-semibold tracking-wider text-ink-500 uppercase">
          {item.numero} <span aria-hidden="true" className="text-ink-300">·</span>{" "}
          <time dateTime={item.data}>{formatarData(item.data, "curta")}</time>
        </p>
        <h3 className="title-display mt-1 line-clamp-2 text-lg text-ink-900 transition-colors group-hover:text-gold-600">
          {item.titulo}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-700">{item.ementa}</p>
      </Link>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
        <div className="flex items-center gap-1.5">
          {itens.map((it, i) => (
            <button
              key={it.numero}
              type="button"
              aria-label={`Ver ${it.titulo}`}
              aria-current={i === indice}
              onClick={() => setIndice(i)}
              className={`size-2 rounded-full transition-colors ${i === indice ? "bg-gold-500" : "bg-ink-200 hover:bg-ink-300"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Ato normativo anterior"
            onClick={() => setIndice((i) => (i - 1 + itens.length) % itens.length)}
            className="flex size-8 items-center justify-center rounded-md border border-ink-200 text-ink-500 transition-colors hover:border-gold-500 hover:text-gold-600"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Próximo ato normativo"
            onClick={() => setIndice((i) => (i + 1) % itens.length)}
            className="flex size-8 items-center justify-center rounded-md border border-ink-200 text-ink-500 transition-colors hover:border-gold-500 hover:text-gold-600"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
