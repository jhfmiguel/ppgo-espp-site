import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import type { noticias } from "@/content/site";

type NoticiaItem = (typeof noticias)["itens"][number];

function formatarData(data: string, formato: "curta" | "longa" = "longa") {
  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: formato === "longa" ? "long" : "short",
    year: "numeric",
  });
}

function Capa({ item, sizes }: { item: NoticiaItem; sizes: string }) {
  if ("imagem" in item && item.imagem) {
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
export function NoticiaDestaque({ item, compacto }: { item: NoticiaItem; compacto?: boolean }) {
  return (
    <Link
      href="/noticias"
      className="group grid h-full overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm lg:grid-cols-2"
    >
      <div className={`relative overflow-hidden ${compacto ? "aspect-video" : "aspect-video lg:aspect-auto"}`}>
        <Capa item={item} sizes="(min-width: 1024px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent lg:hidden" />
      </div>
      <div className={`flex flex-col justify-center ${compacto ? "p-6 lg:p-7" : "p-7 lg:p-10"}`}>
        <p className="flex items-center gap-3 text-[0.7rem] font-bold tracking-[0.14em] text-gold-600 uppercase">
          <span>{item.categoria}</span>
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
          <time dateTime={item.data}>{formatarData(item.data)}</time>
        </p>
        <h3 className={`title-display mt-3 text-ink-900 ${compacto ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>
          {item.titulo}
        </h3>
        {compacto ? null : (
          <p className="mt-4 text-sm leading-relaxed text-ink-700 sm:text-base">
            {item.resumo}
          </p>
        )}
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

/** Linha compacta (miniatura + título + data), para listas laterais enxutas. */
export function NoticiaLinha({ item }: { item: NoticiaItem }) {
  return (
    <li>
      <Link href="/noticias" className="group flex items-center gap-4 py-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
          <Capa item={item} sizes="64px" />
        </div>
        <div className="min-w-0 grow">
          <p className="text-[0.65rem] font-bold tracking-[0.12em] text-gold-600 uppercase">
            {item.categoria}
          </p>
          <h4 className="mt-0.5 line-clamp-2 text-sm leading-snug font-semibold text-ink-900 transition-colors group-hover:text-gold-600">
            {item.titulo}
          </h4>
          <time dateTime={item.data} className="mt-0.5 block text-xs text-ink-500">
            {formatarData(item.data, "curta")}
          </time>
        </div>
        <span className="relative shrink-0">
          <span
            role="tooltip"
            className="pointer-events-none absolute right-0 bottom-full mb-2 w-max rounded-md bg-ink-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
          >
            Ler notícia
          </span>
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-full border border-ink-300 text-ink-500 transition-colors group-hover:border-gold-500 group-hover:text-gold-600"
          >
            <ArrowRight className="size-4" />
          </span>
        </span>
      </Link>
    </li>
  );
}

/** Card padrão de listagem, com ou sem imagem de capa. */
export function NoticiaCard({ item }: { item: NoticiaItem }) {
  return (
    <li className="group flex h-full flex-col overflow-hidden rounded-lg border border-ink-200 bg-white shadow-sm transition-colors hover:border-gold-500/70">
      <div className="relative aspect-video w-full overflow-hidden">
        <Capa item={item} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
      </div>
      <div className="flex grow flex-col p-6">
        <p className="flex items-center justify-between text-[0.7rem] font-bold tracking-[0.14em] text-gold-600 uppercase">
          <span>{item.categoria}</span>
          <time dateTime={item.data}>{formatarData(item.data, "curta")}</time>
        </p>
        <h3 className="title-display mt-3 text-lg text-ink-900">{item.titulo}</h3>
        <p className="mt-3 grow text-sm leading-relaxed text-ink-700">{item.resumo}</p>
      </div>
    </li>
  );
}
