import Image from "next/image";
import { BadgeCheck, ChevronDown } from "lucide-react";
import { hero } from "@/content/site";
import { ActionLink } from "@/components/ui/action-link";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink-950">
      <Image
        src={hero.imagem.src}
        alt={hero.imagem.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-45"
      />
      {/* camadas de escurecimento para garantir contraste do texto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-900 to-transparent"
      />

      <div className="container-espp relative flex min-h-[100svh] flex-col justify-center pt-28 pb-24">
        <div className="fade-up max-w-3xl">
          <p className="inline-flex items-start gap-2.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-gold-400 sm:items-center">
            <BadgeCheck className="mt-0.5 size-4 shrink-0 sm:mt-0" aria-hidden="true" />
            {hero.selo}
          </p>

          <h1 className="title-display mt-7 text-5xl text-white sm:text-6xl lg:text-7xl">
            {hero.titulo}
            <span className="mt-1 block text-gold-500">{hero.subtitulo}</span>
          </h1>

          <div
            aria-hidden="true"
            className="mt-7 h-1 w-24 rounded-full bg-gold-500"
          />

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg">
            {hero.texto}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <ActionLink href={hero.ctaPrimario.href}>
              {hero.ctaPrimario.label}
            </ActionLink>
            <ActionLink href={hero.ctaSecundario.href} variant="outline">
              {hero.ctaSecundario.label}
            </ActionLink>
          </div>
        </div>

        <a
          href="#institucional"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-ink-400 transition-colors hover:text-gold-500 lg:block"
        >
          <ChevronDown className="size-7" />
        </a>
      </div>
    </section>
  );
}
