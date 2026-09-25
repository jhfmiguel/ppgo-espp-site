import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText } from "lucide-react";
import { recredenciamento } from "@/content/site";

const { destaque } = recredenciamento;

export function RecredenciamentoDestaque() {
  return (
    <section aria-labelledby="recredenciamento-destaque-titulo" className="relative overflow-hidden bg-[#f4f7fa] py-16 lg:py-20">
      <div className="container-espp">
        <div className="relative overflow-hidden rounded-2xl bg-[#062f53] shadow-[0_20px_60px_rgb(15_23_42/0.12)]">
          <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[38%] skew-x-[-18deg] translate-x-24 bg-gold-500/90 lg:block" />
          <div aria-hidden="true" className="absolute inset-y-0 right-[24%] hidden w-24 skew-x-[-18deg] bg-white/5 lg:block" />
          <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.35fr_.65fr] lg:items-center lg:p-12">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-white/5 px-4 py-2 text-xs font-bold tracking-wide text-gold-500">
                <BadgeCheck className="size-4" aria-hidden="true" /> {destaque.selo}
              </p>
              <h2 id="recredenciamento-destaque-titulo" className="title-display mt-6 max-w-3xl text-3xl text-white sm:text-4xl lg:text-5xl">{destaque.titulo}</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75">{destaque.texto}</p>
              <dl className="mt-7 grid gap-4 sm:grid-cols-3">
                {destaque.fatos.map((fato) => (
                  <div key={fato.label} className="border-l-2 border-gold-500 pl-3">
                    <dt className="text-[0.62rem] font-bold tracking-[0.14em] text-white/50 uppercase">{fato.label}</dt>
                    <dd className="mt-1 text-sm font-bold text-white">{fato.valor}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={destaque.ctaPdi.href} className="group inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-extrabold text-ink-950 transition hover:bg-gold-400">
                  <FileText className="size-4" aria-hidden="true" /> {destaque.ctaPdi.label} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link href={destaque.ctaDossie.href} className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:border-white/50 hover:bg-white/10">{destaque.ctaDossie.label}</Link>
              </div>
            </div>
            <div className="relative lg:justify-self-end">
              <Link href={destaque.ctaPdi.href} className="group block max-w-sm rounded-2xl border border-white/20 bg-[#041f38]/90 p-7 backdrop-blur transition hover:-translate-y-1 hover:border-gold-500">
                <span className="flex size-12 items-center justify-center rounded-xl bg-gold-500 text-ink-950"><FileText className="size-6" aria-hidden="true" /></span>
                <span className="mt-6 block text-[0.65rem] font-bold tracking-[0.18em] text-gold-500 uppercase">Documento principal</span>
                <span className="title-display mt-2 block text-2xl text-white">Plano de Desenvolvimento Institucional</span>
                <span className="mt-2 block text-sm text-white/60">PDI 2026–2030 · 24 páginas</span>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-gold-500 uppercase">Ler no site <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
