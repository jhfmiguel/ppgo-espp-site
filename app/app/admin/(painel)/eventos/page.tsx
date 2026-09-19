import Link from "next/link";
import { CalendarClock, MapPin, SquarePen } from "lucide-react";

import { exigirPermissao } from "@/lib/auth/dal";
import { listarEventos } from "@/lib/data/store";
import { alternarStatusEvento, removerEvento } from "@/lib/actions/eventos";
import { diaEMes, formatarDataHora, formatarPeriodo } from "@/lib/formato";
import { Aviso, BotaoPublicar, ListaVazia, SeloStatus, TituloPagina } from "@/components/admin/ui";
import { BotaoExcluir } from "@/components/admin/botao-excluir";

export const metadata = { title: "Eventos" };

const hoje = () => new Date().toISOString().slice(0, 10);

export default async function AdminEventosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await exigirPermissao("eventos");
  const [{ ok, erro }, eventos] = await Promise.all([searchParams, listarEventos()]);

  const referencia = hoje();

  return (
    <>
      <TituloPagina
        titulo="Eventos"
        descricao="Agenda da Escola, exibida na página de eventos e na faixa de próximos eventos da home."
        acao={{ href: "/admin/eventos/novo", rotulo: "Novo evento" }}
      />

      <Aviso ok={ok} erro={erro} />

      {eventos.length === 0 ? (
        <ListaVazia
          titulo="Agenda vazia"
          texto="Cadastre o primeiro evento para que ele apareça na agenda pública da Escola."
          acao={{ href: "/admin/eventos/novo", rotulo: "Novo evento" }}
        />
      ) : (
        <ul className="space-y-3">
          {eventos.map((evento) => {
            const selo = diaEMes(evento.dataInicio);
            const encerrado = (evento.dataFim || evento.dataInicio) < referencia;

            return (
              <li
                key={evento.id}
                className="flex flex-col gap-4 rounded-xl border border-ink-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <div
                  className={`flex w-full shrink-0 flex-col items-center justify-center rounded-md border px-3 py-2 sm:w-20 ${
                    encerrado
                      ? "border-ink-200 bg-ink-050 text-ink-500"
                      : "border-gold-400/60 bg-gold-050 text-ink-900"
                  }`}
                >
                  <span className="title-display text-2xl leading-none">{selo.dia}</span>
                  <span className="text-[0.65rem] font-bold tracking-wider uppercase">
                    {selo.mes}
                  </span>
                  <span className="text-[0.65rem] text-ink-500">{selo.ano}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeloStatus status={evento.status} />
                    <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wider text-ink-700 uppercase">
                      {evento.modalidade}
                    </span>
                    <span className="rounded-full bg-gold-050 px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wider text-gold-700 uppercase">
                      {evento.categoria}
                    </span>
                    {encerrado ? (
                      <span className="text-[0.65rem] font-bold tracking-wider text-ink-400 uppercase">
                        Já realizado
                      </span>
                    ) : null}
                  </div>
                  <Link
                    href={`/admin/eventos/${evento.id}`}
                    className="mt-1.5 block text-base font-semibold text-ink-900 hover:text-gold-700"
                  >
                    {evento.titulo}
                  </Link>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock className="size-3.5" aria-hidden="true" />
                      {formatarPeriodo(evento.dataInicio, evento.dataFim)}
                      {evento.horario ? ` · ${evento.horario}` : ""}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {evento.local}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-ink-500">
                    por {evento.autor} · atualizado em {formatarDataHora(evento.atualizadoEm)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/eventos/${evento.id}`}
                    className="inline-flex size-8 items-center justify-center rounded-md border border-ink-200 text-ink-700 transition-colors hover:border-gold-400 hover:bg-gold-050"
                    title="Editar"
                    aria-label="Editar"
                  >
                    <SquarePen className="size-3.5" aria-hidden="true" />
                  </Link>
                  <BotaoPublicar
                    acao={alternarStatusEvento}
                    id={evento.id}
                    status={evento.status}
                  />
                  <BotaoExcluir
                    acao={removerEvento}
                    id={evento.id}
                    descricao={`o evento ${evento.titulo}`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
