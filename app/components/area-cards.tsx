import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { areas } from "@/content/site";
import { Icon } from "@/components/ui/icon";

export function AreaCards() {
  return (
    <section aria-labelledby="areas-titulo" className="relative overflow-hidden bg-[#f4f7fa] py-20 lg:py-28">
      <div aria-hidden="true" className="absolute -right-24 top-0 h-72 w-72 rotate-12 border-[42px] border-gold-500/10" />
      <div className="container-espp relative">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-gov-blue uppercase">
              <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
              {areas.eyebrow}
            </p>
            <h2 id="areas-titulo" className="title-display mt-3 text-3xl text-ink-900 sm:text-4xl lg:text-5xl">{areas.titulo}</h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-ink-600 lg:justify-self-end">{areas.texto}</p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.itens.map((area, index) => (
            <li key={area.href} data-animate-scroll data-animate-effect={index % 3 === 1 ? "zoom-up" : "fade-up"}>
              <Link href={area.href} className="group relative flex h-full min-h-64 flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white p-7 shadow-[0_12px_40px_rgb(15_23_42/0.04)] transition duration-300 hover:-translate-y-1 hover:border-gold-500 hover:shadow-[0_18px_48px_rgb(15_23_42/0.10)]">
                <span aria-hidden="true" className="absolute top-0 right-0 h-20 w-20 translate-x-8 -translate-y-8 rotate-45 bg-gold-500/10 transition-transform duration-300 group-hover:translate-x-6 group-hover:-translate-y-6" />
                <span className="flex size-12 items-center justify-center rounded-xl bg-[#073b67] text-gold-500"><Icon name={area.icone} className="size-5" /></span>
                <h3 className="title-display mt-6 text-xl text-ink-900">{area.titulo}</h3>
                <p className="mt-3 grow text-sm leading-relaxed text-ink-600">{area.texto}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-wide text-gov-blue uppercase">Explorar <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
