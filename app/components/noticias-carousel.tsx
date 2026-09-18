"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { formatarData } from "@/lib/formato";
import type { Noticia } from "@/lib/data/types";

const INTERVALO_MS = 6000;

type NoticiaItem = Noticia;

function Capa({ item }: { item: NoticiaItem }) {
  if (item.imagem) {
    return (
      <Image
        src={item.imagem.src}
        alt={item.imagem.alt}
        fill
        sizes="(min-width: 1024px) 35vw, 100vw"
        className="object-cover object-center"
      />
    );
  }
  return (
    <div className="hatch flex size-full items-center justify-center bg-ink-100">
      <Megaphone className="size-10 text-gold-600/70" aria-hidden="true" />
    </div>
  );
}

/** Carrossel com as notícias mais recentes — usado na home, ao lado do widget de Atos Normativos. */
export function NoticiasCarrossel({ noticias }: { noticias: Noticia[] }) {
  const itens = useMemo(
    () => [...noticias].sort((a, b) => (a.data < b.data ? 1 : -1)),
    [noticias],
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

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-all duration-300 hover:border-gold-400/70 hover:shadow-md"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <div className="flex items-center justify-between gap-3 px-6 pt-6">
        <p className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] text-gold-600 uppercase">
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
          Notícias
        </p>
        <Link
          href="/noticias"
          className="text-[0.65rem] font-semibold tracking-wider text-ink-500 uppercase transition-colors hover:text-gold-600"
        >
          Ver todas
        </Link>
      </div>

      <Link
        href={`/noticias/${item.slug}`}
        className="group mt-4 grid min-h-0 grow overflow-hidden lg:grid-cols-2"
      >
        <div className="relative aspect-video overflow-hidden lg:aspect-auto">
          <Capa item={item} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/0 to-transparent lg:from-ink-950/40 lg:via-transparent" />
          <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-gold-500 px-3 py-1 text-[0.65rem] font-bold tracking-wider text-ink-950 uppercase shadow-sm">
            Destaque
          </span>
        </div>
        <div className="flex min-w-0 flex-col justify-center p-6 lg:p-7">
          <p className="flex flex-wrap items-center gap-3 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            <span className="rounded-full bg-gold-050 px-3 py-1 text-gold-700">{item.categoria}</span>
            <span className="flex items-center gap-2 text-ink-500">
              <span aria-hidden="true">·</span>
              <time dateTime={item.data}>{formatarData(item.data)}</time>
            </span>
          </p>
          <h3 className="title-display mt-3 line-clamp-2 text-xl text-ink-900 transition-colors group-hover:text-gold-600 sm:text-2xl">
            {item.titulo}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-700">{item.resumo}</p>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-3 border-t border-ink-100 px-6 py-4">
        <div className="flex items-center gap-1.5">
          {itens.map((it, i) => (
            <button
              key={it.id}
              type="button"
              aria-label={`Ver notícia: ${it.titulo}`}
              aria-current={i === indice}
              onClick={() => setIndice(i)}
              className={`size-2 rounded-full transition-colors ${i === indice ? "bg-gold-500" : "bg-ink-200 hover:bg-ink-300"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Notícia anterior"
            onClick={() => setIndice((i) => (i - 1 + itens.length) % itens.length)}
            className="flex size-8 items-center justify-center rounded-md border border-ink-200 text-ink-500 transition-colors hover:border-gold-500 hover:text-gold-600"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Próxima notícia"
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
