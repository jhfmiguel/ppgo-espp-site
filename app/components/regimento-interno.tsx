import { FileText } from "lucide-react";
import { regimentoInterno } from "@/content/site";
import { PageHeader } from "@/components/ui/page-header";
import { ActionLink } from "@/components/ui/action-link";

export function RegimentoInterno() {
  return (
    <section
      id="regimento-interno"
      aria-labelledby="regimento-interno-titulo"
      className="bg-white pt-10 lg:pt-14"
    >
      <div className="container-espp">
        <PageHeader
          href="/regimento-interno"
          id="regimento-interno-titulo"
          eyebrow={regimentoInterno.eyebrow}
          titulo={regimentoInterno.titulo}
          texto={regimentoInterno.texto}
        />

        <div className="mt-12 grid max-w-4xl gap-x-10 gap-y-10 md:grid-cols-2">
          <div className="group flex items-start gap-4 py-2 transition-transform duration-300 hover:-translate-y-1">
            <span className="flex size-11 shrink-0 items-center justify-center text-[#f5c400]">
              <FileText className="size-7 fill-none stroke-current" aria-hidden="true" />
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

          <div className="group flex items-start gap-4 py-2 transition-transform duration-300 hover:-translate-y-1">
            <span className="flex size-11 shrink-0 items-center justify-center text-[#f5c400]">
              <FileText className="size-7 fill-none stroke-current" aria-hidden="true" />
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

      <div className="regimento-faixa-degrade mt-14 min-h-40 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] lg:mt-16 lg:min-h-52" data-no-scroll-animation />
    </section>
  );
}
