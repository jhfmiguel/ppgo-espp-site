import { indicadores } from "@/content/site";
import { AnimatedCounter } from "@/components/animated-counter";

export function StatsBand() {
  return (
    <section
      aria-label="Indicadores da Escola"
      className="relative border-y border-[#0b3157]/15 bg-white"
    >
      <div className="container-espp relative grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
        {indicadores.map((item) => (
          <div
            key={item.label}
            className="border-b border-[#0b3157]/15 px-1 py-10 last:border-b-0 lg:border-r lg:border-b-0 lg:px-8 lg:last:border-r-0"
          >
            <p className="flex items-baseline gap-2">
              <span className="title-display text-5xl text-[#d9aa00] lg:text-6xl">
                <AnimatedCounter valor={item.valor} />
              </span>
              <span className="text-xs font-semibold tracking-[0.18em] text-[#0b3157]/65 uppercase">
                {item.unidade}
              </span>
            </p>
            <p className="mt-4 text-sm font-semibold text-[#071522]">
              {item.label}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[#0b3157]/75">
              {item.detalhe}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
