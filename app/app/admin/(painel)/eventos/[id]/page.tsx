import { notFound } from "next/navigation";

import { exigirPermissao } from "@/lib/auth/dal";
import { buscarEvento } from "@/lib/data/store";
import { EventoForm } from "@/components/admin/evento-form";
import { TituloPagina } from "@/components/admin/ui";
import { formatarDataHora } from "@/lib/formato";

export const metadata = { title: "Editar evento" };

export default async function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirPermissao("eventos");

  const { id } = await params;
  const evento = await buscarEvento(id);
  if (!evento) notFound();

  return (
    <>
      <TituloPagina
        titulo="Editar evento"
        descricao={`Criado por ${evento.autor} · última alteração em ${formatarDataHora(evento.atualizadoEm)}`}
      />
      <div className="rounded-xl border border-ink-200 bg-white p-6 lg:p-8">
        <EventoForm evento={evento} />
      </div>
    </>
  );
}
