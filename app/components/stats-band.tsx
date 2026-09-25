import { indicadores } from "@/content/site";
import { AnimatedCounter } from "@/components/animated-counter";

export function StatsBand() {
  return (
    <section aria-label="Indicadores da Escola" className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="container-espp">
        <div className="mb-9 flex items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-gov-blue uppercase">
              <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
              ESPP em números
            </p>
            <h2 className="title-display mt-3 max-w-2xl text-3xl text-ink-900 sm:text-4xl">Formação que gera impacto</h2>
          </div>
          <span aria-hidden="true" className="hidden h-16 w-1 rounded-full bg-gold-500 lg:block" />
        </div>
        <div className="grid overflow-hidden rounded-2xl border border-ink-200 bg-ink-900 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {indicadores.map((item, index) => (
            <article key={item.label} data-animate-scroll data-animate-effect={index % 2 === 0 ? "fade-up" : "zoom-up"} className="relative min-h-56 border-b border-white/10 p-7 sm:[&:nth-child(odd)]:border-r lg:border-r lg:border-b-0 lg:last:border-r-0">
              <span aria-hidden="true" className="absolute top-0 left-7 h-1 w-12 bg-gold-500" />
              <p className="flex items-end gap-2 pt-3">
                <span className="title-display text-5xl text-white lg:text-6xl"><AnimatedCounter valor={item.valor} /></span>
                <span className="pb-1 text-[0.68rem] font-bold tracking-[0.16em] text-gold-500 uppercase">{item.unidade}</span>
              </p>
              <p className="mt-5 text-sm font-bold text-white">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{item.detalhe}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
