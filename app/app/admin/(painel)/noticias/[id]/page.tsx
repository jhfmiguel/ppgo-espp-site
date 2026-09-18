import { notFound } from "next/navigation";

import { exigirPermissao } from "@/lib/auth/dal";
import { buscarNoticia } from "@/lib/data/store";
import { NoticiaForm } from "@/components/admin/noticia-form";
import { TituloPagina } from "@/components/admin/ui";
import { formatarDataHora } from "@/lib/formato";

export const metadata = { title: "Editar notícia" };

export default async function EditarNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirPermissao("noticias");

  const { id } = await params;
  const noticia = await buscarNoticia(id);
  if (!noticia) notFound();

  return (
    <>
      <TituloPagina
        titulo="Editar notícia"
        descricao={`Criada por ${noticia.autor} · última alteração em ${formatarDataHora(noticia.atualizadoEm)}`}
      />
      <div className="rounded-xl border border-ink-200 bg-white p-6 lg:p-8">
        <NoticiaForm noticia={noticia} />
      </div>
    </>
  );
}
