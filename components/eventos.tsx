import { CalendarDays, Clock, MapPin, Ticket, Users } from "lucide-react";
import { eventos, type Evento } from "@/content/site";
import { PageHeader } from "@/components/ui/page-header";
import { ActionLink } from "@/components/ui/action-link";

const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function comoData(iso: string) {
  return new Date(`${iso}T00:00:00`);
}

function porExtenso(iso: string) {
  return comoData(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** "22 e 23 de outubro de 2026" vira apenas a data final quando há período. */
function periodo(evento: Evento) {
  if (!evento.dataFim) return porExtenso(evento.data);
  const inicio = comoData(evento.data);
  const fim = comoData(evento.dataFim);
  const mesmoMes = inicio.getMonth() === fim.getMonth() && inicio.getFullYear() === fim.getFullYear();
  if (mesmoMes) {
    return `${String(inicio.getDate()).padStart(2, "0")} a ${porExtenso(evento.dataFim)}`;
  }
  return `${porExtenso(evento.data)} a ${porExtenso(evento.dataFim)}`;
}

/** Data em que o evento deixa de ser "próximo" (fim do último dia). */
function terminaEm(evento: Evento) {
  const fim = comoData(evento.dataFim ?? evento.data);
  fim.setHours(23, 59, 59, 999);
  return fim;
}

const ESTILO_MODALIDADE: Record<Evento["modalidade"], string> = {
  Presencial: "border-forest-500/40 bg-forest-500/10 text-forest-600",
  Online: "border-gov-blue/40 bg-gov-blue/10 text-gov-blue",
  Híbrido: "border-gold-500/50 bg-gold-050 text-gold-700",
};

function BlocoData({ evento, passado }: { evento: Evento; passado?: boolean }) {
  const inicio = comoData(evento.data);
  return (
    <div
      aria-hidden="true"
      className={[
        "flex size-16 shrink-0 flex-col items-center justify-center rounded-md",
        passado ? "bg-ink-100 text-ink-500" : "bg-ink-900 text-gold-500",
      ].join(" ")}
    >
      <span className="title-display text-2xl leading-none">
        {String(inicio.getDate()).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[0.6rem] font-bold tracking-[0.16em] uppercase">
        {MESES_CURTOS[inicio.getMonth()]}
      </span>
    </div>
  );
}

function Meta({ evento }: { evento: Evento }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-600">
      <li className="flex items-center gap-2">
        <Clock className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
        <span className="sr-only">Horário: </span>
        {evento.horario}
      </li>
      <li className="flex items-center gap-2">
        <MapPin className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
        <span className="sr-only">Local: </span>
        {evento.local}
      </li>
      {evento.vagas ? (
        <li className="flex items-center gap-2">
          <Users className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
          {evento.vagas} vagas
        </li>
      ) : null}
    </ul>
  );
}

function CardProximo({ evento }: { evento: Evento }) {
  return (
    <li className="flex gap-5 rounded-lg border border-ink-200 bg-white p-6 shadow-sm transition-colors hover:border-gold-500 sm:p-7">
      <BlocoData evento={evento} />

      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-ink-900 px-3 py-1.5 text-[0.7rem] font-bold tracking-wider text-gold-500 uppercase">
            {evento.categoria}
          </span>
          <span
            className={`inline-flex items-center rounded-md border px-3 py-1 text-[0.7rem] font-bold tracking-wider uppercase ${ESTILO_MODALIDADE[evento.modalidade]}`}
          >
            {evento.modalidade}
          </span>
        </p>

        <h3 className="title-display mt-4 text-xl leading-snug text-ink-900">{evento.titulo}</h3>

        <p className="mt-2 text-xs font-semibold tracking-wider text-ink-500 uppercase">
          <time dateTime={evento.data}>{periodo(evento)}</time>
        </p>

        <p className="mt-3 text-sm leading-relaxed text-ink-700">{evento.resumo}</p>

        <Meta evento={evento} />

        {evento.inscricao ? (
          <ActionLink
            href={evento.inscricao.href}
            external={evento.inscricao.external}
            variant="ghost"
            className="mt-4 text-xs"
          >
            {evento.inscricao.label}
          </ActionLink>
        ) : null}
      </div>
    </li>
  );
}

function CardRealizado({ evento }: { evento: Evento }) {
  return (
    <li className="flex gap-4 rounded-lg border border-ink-200 bg-ink-050 px-5 py-4">
      <BlocoData evento={evento} passado />
      <div className="min-w-0">
        <p className="text-[0.7rem] font-bold tracking-wider text-ink-500 uppercase">
          {evento.categoria} · <time dateTime={evento.data}>{periodo(evento)}</time>
        </p>
        <h3 className="title-display mt-1.5 text-base leading-snug text-ink-900">{evento.titulo}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{evento.resumo}</p>
      </div>
    </li>
  );
}

export function Eventos() {
  // calculado no build — ver a nota em `eventos`, em content/site.ts
  const agora = new Date();
  const proximos = eventos.itens
    .filter((e) => terminaEm(e) >= agora)
    .sort((a, b) => a.data.localeCompare(b.data));
  const realizados = eventos.itens
    .filter((e) => terminaEm(e) < agora)
    .sort((a, b) => b.data.localeCompare(a.data));

  return (
    <section
      id="eventos"
      aria-labelledby="eventos-titulo"
      className="bg-white pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      <div className="container-espp">
        <PageHeader
          href="/eventos"
          id="eventos-titulo"
          eyebrow={eventos.eyebrow}
          titulo={eventos.titulo}
          texto={eventos.texto}
        />

        <h2 className="title-display mt-14 flex items-center gap-3 text-2xl text-ink-900">
          <CalendarDays className="size-6 text-gold-600" aria-hidden="true" />
          Próximos eventos
        </h2>

        {proximos.length > 0 ? (
          <ul className="mt-7 space-y-5">
            {proximos.map((evento) => (
              <CardProximo key={`${evento.data}-${evento.titulo}`} evento={evento} />
            ))}
          </ul>
        ) : (
          <p className="mt-7 flex items-start gap-3 rounded-lg border border-ink-200 bg-ink-050 p-7 text-sm leading-relaxed text-ink-700">
            <Ticket className="mt-0.5 size-5 shrink-0 text-gold-600" aria-hidden="true" />
            {eventos.avisoVazio}
          </p>
        )}

        {realizados.length > 0 ? (
          <>
            <h2 className="title-display mt-16 text-2xl text-ink-900">Eventos realizados</h2>
            <ul className="mt-7 grid gap-4 lg:grid-cols-2">
              {realizados.map((evento) => (
                <CardRealizado key={`${evento.data}-${evento.titulo}`} evento={evento} />
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}
