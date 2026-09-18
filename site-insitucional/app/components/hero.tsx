import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { hero } from "@/content/site";
import { ActionLink } from "@/components/ui/action-link";

export function Hero() {
  return (
    <section id="top" className="bg-white pt-12 pb-16 lg:pt-16 lg:pb-24">
      <div className="container-espp grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="fade-up lg:col-span-7">
          <p className="inline-flex items-start gap-2.5 rounded-full border border-gold-500/40 bg-gold-050 px-4 py-2 text-xs font-semibold tracking-wide text-gold-700 sm:items-center">
            <BadgeCheck className="mt-0.5 size-4 shrink-0 sm:mt-0" aria-hidden="true" />
            {hero.selo}
          </p>

          <h1 className="title-display mt-7 text-4xl text-ink-900 sm:text-5xl lg:text-6xl">
            {hero.titulo}
            <span className="mt-1 block text-gold-600">{hero.subtitulo}</span>
          </h1>

          <div
            aria-hidden="true"
            className="mt-7 h-1 w-24 rounded-full bg-gold-500"
          />

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
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

        <div className="lg:col-span-5">
          <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-ink-200 shadow-sm lg:aspect-square">
            <Image
              src={hero.imagem.src}
              alt={hero.imagem.alt}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
