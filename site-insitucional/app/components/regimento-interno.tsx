import { FileText } from "lucide-react";
import { regimentoInterno } from "@/content/site";
import { PageHeader } from "@/components/ui/page-header";
import { ActionLink } from "@/components/ui/action-link";

export function RegimentoInterno() {
  return (
    <section
      id="regimento-interno"
      aria-labelledby="regimento-interno-titulo"
      className="bg-white pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      <div className="container-espp">
        <PageHeader
          href="/regimento-interno"
          id="regimento-interno-titulo"
          eyebrow={regimentoInterno.eyebrow}
          titulo={regimentoInterno.titulo}
          texto={regimentoInterno.texto}
        />

        <div className="mt-12 max-w-3xl space-y-5">
          <div className="flex items-start gap-4 rounded-lg border border-ink-200 bg-ink-050 p-6">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-ink-900 text-gold-500">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-900">{regimentoInterno.portaria.numero}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-700">{regimentoInterno.portaria.ementa}</p>
              <ActionLink
                href={regimentoInterno.portaria.href}
                external
                variant="ghost"
                className="mt-3"
              >
                Ver publicação oficial
              </ActionLink>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-lg border border-ink-200 bg-white p-6">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-ink-100 text-ink-500">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-500 line-through decoration-ink-400">
                {regimentoInterno.revogada.numero}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-700">{regimentoInterno.revogada.texto}</p>
              <ActionLink
                href={regimentoInterno.revogada.href}
                external
                variant="ghost"
                className="mt-3"
              >
                Ver norma revogada
              </ActionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
