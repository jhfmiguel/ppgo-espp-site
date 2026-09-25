import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock, CalendarDays, MapPin, Monitor } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { listarEventosPublicados } from "@/lib/data/store";
import { diaEMes, formatarPeriodo } from "@/lib/formato";
import { eventos as textos } from "@/content/site";
import type { Evento } from "@/lib/data/types";

/** Selo de data à esquerda do card. */
function SeloData({ evento, encerrado }: { evento: Evento; encerrado: boolean }) {
  const { dia, mes, ano } = diaEMes(evento.dataInicio);
  return (
    <div
      className={`flex w-full shrink-0 flex-col items-center justify-center rounded-lg border px-3 py-3 sm:w-24 ${
        encerrado
          ? "border-ink-200 bg-ink-050 text-ink-500"
          : "border-gold-400/70 bg-gold-050 text-ink-900"
      }`}
    >
      <span className="title-display text-3xl leading-none">{dia}</span>
      <span className="text-[0.7rem] font-bold tracking-wider uppercase">{mes}</span>
      <span className="text-[0.7rem] text-ink-500">{ano}</span>
    </div>
  );
}

function CardEvento({ evento, encerrado }: { evento: Evento; encerrado: boolean }) {
  const Icone = evento.modalidade === "Online" ? Monitor : MapPin;

  return (
    <li>
      <Link
        href={`/eventos/${evento.slug}`}
        className="group flex flex-col gap-5 rounded-xl border border-ink-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-gold-400/70 hover:shadow-md sm:flex-row sm:items-center"
      >
        <SeloData evento={evento} encerrado={encerrado} />

        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-[0.65rem] font-bold tracking-[0.14em] uppercase">
            <span className="rounded-full bg-gold-050 px-2.5 py-1 text-gold-700">
              {evento.categoria}
            </span>
            <span className="rounded-full bg-ink-100 px-2.5 py-1 text-ink-700">
              {evento.modalidade}
            </span>
            {encerrado ? <span className="text-ink-400">Já realizado</span> : null}
          </p>

          <h3 className="title-display mt-2.5 text-xl text-ink-900 transition-colors group-hover:text-gold-600">
            {evento.titulo}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-700">{evento.resumo}</p>

          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="size-3.5 shrink-0" aria-hidden="true" />
              {formatarPeriodo(evento.dataInicio, evento.dataFim)}
              {evento.horario ? ` · ${evento.horario}` : ""}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icone className="size-3.5 shrink-0" aria-hidden="true" />
              {evento.local}
            </span>
          </p>
        </div>

        {evento.imagem ? (
          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg sm:w-40">
            <Image
              src={evento.imagem.src}
              alt={evento.imagem.alt}
              fill
              sizes="160px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : null}

        <ArrowRight
          className="hidden size-5 shrink-0 text-gold-600 transition-transform group-hover:translate-x-0.5 lg:block"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

export async function Eventos() {
  const itens = await listarEventosPublicados();
  const hoje = new Date().toISOString().slice(0, 10);

  const proximos = itens
    .filter((e) => (e.dataFim || e.dataInicio) >= hoje)
    .sort((a, b) => (a.dataInicio < b.dataInicio ? -1 : 1));
  const realizados = itens.filter((e) => (e.dataFim || e.dataInicio) < hoje);

  return (
    <section
      id="eventos"
      aria-labelledby="eventos-titulo"
      className="bg-white pt-10 lg:pt-14"
    >
      <div className="container-espp">
        <PageHeader
          href="/eventos"
          id="eventos-titulo"
          eyebrow={textos.eyebrow}
          titulo={textos.titulo}
          texto={textos.texto}
        />

        {itens.length === 0 ? (
          <p className="mt-12 rounded-xl border border-dashed border-ink-300 bg-ink-050 px-6 py-12 text-center text-sm text-ink-600">
            Nenhum evento na agenda no momento.
          </p>
        ) : null}

        {proximos.length > 0 ? (
          <div className="mt-12">
            <h3 className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.16em] text-gold-600 uppercase">
              <CalendarDays className="size-4" aria-hidden="true" />
              Próximos eventos
            </h3>
            <ul className="mt-5 space-y-4">
              {proximos.map((evento) => (
                <CardEvento key={evento.id} evento={evento} encerrado={false} />
              ))}
            </ul>
          </div>
        ) : null}

        {realizados.length > 0 ? (
          <div className="mt-14">
            <h3 className="text-[0.7rem] font-bold tracking-[0.16em] text-ink-500 uppercase">
              Já realizados
            </h3>
            <ul className="mt-5 space-y-4">
              {realizados.map((evento) => (
                <CardEvento key={evento.id} evento={evento} encerrado />
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="midias-faixa-degrade mt-14 min-h-40 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] lg:mt-16 lg:min-h-52" data-no-scroll-animation />
    </section>
  );
}
