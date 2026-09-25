import { exigirPermissao } from "@/lib/auth/dal";
import { AtoForm } from "@/components/admin/ato-form";
import { TituloPagina } from "@/components/admin/ui";

export const metadata = { title: "Novo ato normativo" };

export default async function NovoAtoPage() {
  await exigirPermissao("atosNormativos");

  return (
    <>
      <TituloPagina
        titulo="Novo ato normativo"
        descricao="Anexe o PDF do ato ou aponte para a publicação oficial na Casa Civil."
      />
      <div className="admin-form-surface rounded-xl border border-ink-200 bg-white p-6 lg:p-8">
        <AtoForm />
      </div>
    </>
  );
}
