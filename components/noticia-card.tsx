import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";

import { formatarData } from "@/lib/formato";
import type { Noticia } from "@/lib/data/types";

function Capa({ item, sizes }: { item: Noticia; sizes: string }) {
  if (item.imagem) {
    return (
      <Image
        src={item.imagem.src}
        alt={item.imagem.alt}
        fill
        sizes={sizes}
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
    );
  }
  return (
    <div className="hatch flex size-full items-center justify-center bg-ink-100">
      <Megaphone className="size-8 text-gold-600/70" aria-hidden="true" />
    </div>
  );
}

/** Card em destaque — usado para a notícia mais recente. */
export function NoticiaDestaque({ item, compacto }: { item: Noticia; compacto?: boolean }) {
  return (
    <Link
      href={`/noticias/${item.slug}`}
      className="group grid h-full overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-all duration-300 hover:border-gold-400/70 hover:shadow-md lg:grid-cols-2"
    >
      <div className={`relative overflow-hidden ${compacto ? "aspect-video" : "aspect-video lg:aspect-auto"}`}>
        <Capa item={item} sizes="(min-width: 1024px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/0 to-transparent lg:from-ink-950/50 lg:via-transparent" />
        <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-gold-500 px-3 py-1 text-[0.65rem] font-bold tracking-wider text-ink-950 uppercase shadow-sm">
          Destaque
        </span>
      </div>
      <div className={`flex flex-col justify-center ${compacto ? "p-6 lg:p-7" : "p-7 lg:p-10"}`}>
        <p className="flex flex-wrap items-center gap-3 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
          <span className="rounded-full bg-gold-050 px-3 py-1 text-gold-700">{item.categoria}</span>
          <span className="flex items-center gap-2 text-ink-500">
            <span aria-hidden="true">·</span>
            <time dateTime={item.data}>{formatarData(item.data)}</time>
          </span>
        </p>
        <h3
          className={`title-display mt-3 line-clamp-2 text-ink-900 transition-colors group-hover:text-gold-600 ${compacto ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}
        >
          {item.titulo}
        </h3>
        <p className={`mt-4 text-sm leading-relaxed text-ink-700 sm:text-base ${compacto ? "line-clamp-2" : ""}`}>
          {item.resumo}
        </p>
        <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-md bg-gold-500 px-5 py-2.5 text-xs font-bold tracking-wide text-ink-950 uppercase transition-colors group-hover:bg-gold-400">
          Ler notícia
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}

/** Card padrão de listagem, com ou sem imagem de capa. */
export function NoticiaCard({ item }: { item: Noticia }) {
  return (
    <li className="group h-full">
      <Link
        href={`/noticias/${item.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-lg border border-ink-200 bg-white shadow-sm transition-colors hover:border-gold-500/70"
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <Capa item={item} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
        </div>
        <div className="flex grow flex-col p-6">
          <p className="flex items-center justify-between text-[0.7rem] font-bold tracking-[0.14em] text-gold-600 uppercase">
            <span>{item.categoria}</span>
            <time dateTime={item.data}>{formatarData(item.data, "curta")}</time>
          </p>
          <h3 className="title-display mt-3 text-lg text-ink-900 transition-colors group-hover:text-gold-600">
            {item.titulo}
          </h3>
          <p className="mt-3 grow text-sm leading-relaxed text-ink-700">{item.resumo}</p>
        </div>
      </Link>
    </li>
  );
}
