import { indicadores } from "@/content/site";

export function StatsBand() {
  return (
    <section
      aria-label="Indicadores da Escola"
      className="relative border-y border-ink-700 bg-ink-850"
    >
      <div aria-hidden="true" className="hatch absolute inset-0 opacity-70" />
      <div className="container-espp relative grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
        {indicadores.map((item) => (
          <div
            key={item.label}
            className="border-b border-ink-700 px-1 py-10 last:border-b-0 lg:border-r lg:border-b-0 lg:px-8 lg:last:border-r-0"
          >
            <p className="flex items-baseline gap-2">
              <span className="title-display text-5xl text-gold-500 lg:text-6xl">
                {item.valor}
              </span>
              <span className="text-xs font-semibold tracking-[0.18em] text-ink-400 uppercase">
                {item.unidade}
              </span>
            </p>
            <p className="mt-4 text-sm font-semibold text-white">
              {item.label}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
              {item.detalhe}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
