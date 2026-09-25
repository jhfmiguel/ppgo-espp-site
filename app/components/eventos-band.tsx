import Link from "next/link";
import { ArrowRight, CalendarClock, MapPin, Monitor } from "lucide-react";

import { listarProximosEventos } from "@/lib/data/store";
import { diaEMes, formatarPeriodo } from "@/lib/formato";
import { eventos } from "@/content/site";

/**
 * Faixa de próximos eventos na home.
 *
 * Mostra até três eventos publicados que ainda não ocorreram; se não houver
 * nenhum, a faixa inteira desaparece em vez de exibir um bloco vazio.
 */
export async function EventosBand() {
  const proximos = (await listarProximosEventos()).slice(0, 3);
  if (proximos.length === 0) return null;

  return (
    <section
      aria-labelledby="proximos-eventos-titulo"
      className="border-y border-[#0b3157] bg-[#071522] py-16 lg:py-20"
    >
      <div className="container-espp">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-[#f5c400] uppercase">
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
              {eventos.eyebrow}
            </p>
            <h2 id="proximos-eventos-titulo" className="title-display mt-3 text-3xl text-white sm:text-4xl">
              Próximos eventos
            </h2>
          </div>
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[#f5c400] uppercase transition-colors hover:text-white"
          >
            Agenda completa
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {proximos.map((evento) => {
            const { dia, mes } = diaEMes(evento.dataInicio);
            const IconeLocal = evento.modalidade === "Online" ? Monitor : MapPin;

            return (
              <li key={evento.id}>
                <Link
                  href={`/eventos/${evento.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-white/15 bg-[#0b3157] p-6 transition-colors hover:border-[#f5c400]/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-[#f5c400] text-[#071522]">
                      <span className="title-display text-xl leading-none">{dia}</span>
                      <span className="text-[0.6rem] font-bold tracking-wider uppercase">{mes}</span>
                    </span>
                    <span className="rounded-full bg-black/25 px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-white/80 uppercase">
                      {evento.categoria}
                    </span>
                  </div>

                  <h3 className="title-display mt-4 line-clamp-2 text-lg text-white transition-colors group-hover:text-[#f5c400]">
                    {evento.titulo}
                  </h3>
                  <p className="mt-2 line-clamp-2 grow text-sm leading-relaxed text-white/80">
                    {evento.resumo}
                  </p>

                  <p className="mt-4 space-y-1.5 border-t border-white/15 pt-4 text-xs text-white/65">
                    <span className="flex items-center gap-2">
                      <CalendarClock className="size-3.5 shrink-0" aria-hidden="true" />
                      {formatarPeriodo(evento.dataInicio, evento.dataFim)}
                      {evento.horario ? ` · ${evento.horario}` : ""}
                    </span>
                    <span className="flex items-center gap-2">
                      <IconeLocal className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{evento.local}</span>
                    </span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
