import { notFound } from "next/navigation";

import { exigirPermissao } from "@/lib/auth/dal";
import { buscarAto } from "@/lib/data/store";
import { AtoForm } from "@/components/admin/ato-form";
import { TituloPagina } from "@/components/admin/ui";
import { formatarDataHora } from "@/lib/formato";

export const metadata = { title: "Editar ato normativo" };

export default async function EditarAtoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirPermissao("atosNormativos");

  const { id } = await params;
  const ato = await buscarAto(id);
  if (!ato) notFound();

  return (
    <>
      <TituloPagina
        titulo="Editar ato normativo"
        descricao={`Cadastrado por ${ato.autor} · última alteração em ${formatarDataHora(ato.atualizadoEm)}`}
      />
      <div className="rounded-xl border border-ink-200 bg-white p-6 lg:p-8">
        <AtoForm ato={ato} />
      </div>
    </>
  );
}
