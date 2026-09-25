import { exigirPermissao } from "@/lib/auth/dal";
import { NoticiaForm } from "@/components/admin/noticia-form";
import { TituloPagina } from "@/components/admin/ui";

export const metadata = { title: "Nova notícia" };

export default async function NovaNoticiaPage() {
  await exigirPermissao("noticias");

  return (
    <>
      <TituloPagina
        titulo="Nova notícia"
        descricao="Publique para que a notícia apareça no site, ou salve como rascunho para continuar depois."
      />
      <div className="admin-form-surface rounded-xl border border-ink-200 bg-white p-6 lg:p-8">
        <NoticiaForm />
      </div>
    </>
  );
}
