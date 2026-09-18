import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText } from "lucide-react";
import { recredenciamento } from "@/content/site";

const { destaque } = recredenciamento;

export function RecredenciamentoDestaque() {
  return (
    <section
      aria-labelledby="recredenciamento-destaque-titulo"
      className="relative overflow-hidden border-y border-ink-200 bg-ink-900 py-16 lg:py-20"
    >
      <div aria-hidden="true" className="hatch absolute inset-0 opacity-60" />

      <div className="container-espp relative grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-gold-500">
            <BadgeCheck className="size-4 shrink-0" aria-hidden="true" />
            {destaque.selo}
          </p>

          <h2
            id="recredenciamento-destaque-titulo"
            className="title-display mt-6 text-3xl text-white sm:text-4xl lg:text-5xl"
          >
            {destaque.titulo}
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg">
            {destaque.texto}
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {destaque.fatos.map((fato) => (
              <div key={fato.label}>
                <dt className="text-[0.7rem] font-semibold tracking-[0.16em] text-ink-400 uppercase">
                  {fato.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-white">{fato.valor}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={destaque.ctaPdi.href}
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-7 py-3.5 text-sm font-bold tracking-wide text-ink-950 uppercase transition-colors hover:bg-gold-400"
            >
              <FileText className="size-4" aria-hidden="true" />
              {destaque.ctaPdi.label}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href={destaque.ctaDossie.href}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-7 py-3.5 text-sm font-semibold tracking-wide text-white uppercase transition-colors hover:border-gold-500 hover:text-gold-500"
            >
              {destaque.ctaDossie.label}
            </Link>
          </div>

          <p className="mt-4 text-xs text-ink-400">{destaque.ctaPdi.detalhe}</p>
        </div>

        {/* Card do PDI: reforça o acesso ao documento principal do processo */}
        <div className="lg:col-span-5">
          <Link
            href={destaque.ctaPdi.href}
            className="group block rounded-xl border border-white/15 bg-white/5 p-7 transition-colors hover:border-gold-500/70"
          >
            <span className="flex size-12 items-center justify-center rounded-md bg-gold-500 text-ink-950">
              <FileText className="size-6" aria-hidden="true" />
            </span>
            <span className="mt-6 block text-[0.7rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">
              Documento principal
            </span>
            <span className="title-display mt-2 block text-2xl text-white transition-colors group-hover:text-gold-500">
              Plano de Desenvolvimento Institucional
            </span>
            <span className="mt-2 block text-sm text-ink-300">PDI 2026–2030 · 24 páginas</span>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-gold-500 uppercase">
              Ler no site
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>

          <Link
            href={destaque.ctaProcesso.href}
            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-ink-300 uppercase transition-colors hover:text-gold-500"
          >
            {destaque.ctaProcesso.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
