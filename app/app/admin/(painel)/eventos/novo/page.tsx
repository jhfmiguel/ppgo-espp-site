import { exigirPermissao } from "@/lib/auth/dal";
import { EventoForm } from "@/components/admin/evento-form";
import { TituloPagina } from "@/components/admin/ui";

export const metadata = { title: "Novo evento" };

export default async function NovoEventoPage() {
  await exigirPermissao("eventos");

  return (
    <>
      <TituloPagina
        titulo="Novo evento"
        descricao="Eventos publicados entram na agenda pública e, se ainda não tiverem ocorrido, na faixa da home."
      />
      <div className="admin-form-surface rounded-xl border border-ink-200 bg-white p-6 lg:p-8">
        <EventoForm />
      </div>
    </>
  );
}
