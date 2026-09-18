import { CheckCircle2 } from "lucide-react";
import { acessibilidade } from "@/content/site";
import { PageHeader } from "@/components/ui/page-header";

export function Acessibilidade() {
  return (
    <section
      id="acessibilidade"
      aria-labelledby="acessibilidade-titulo"
      className="bg-white pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      <div className="container-espp">
        <PageHeader
          href="/acessibilidade"
          trilha={[{ label: "Acessibilidade" }]}
          id="acessibilidade-titulo"
          eyebrow={acessibilidade.eyebrow}
          titulo={acessibilidade.titulo}
          texto={acessibilidade.texto}
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {acessibilidade.recursos.map((recurso) => (
            <li
              key={recurso.titulo}
              className="flex items-start gap-3 rounded-lg border border-ink-200 bg-ink-050 p-5"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gov-teal" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-ink-900">{recurso.titulo}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-700">{recurso.texto}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-lg border border-gold-500/50 bg-gold-050 p-6">
          <p className="text-sm leading-relaxed text-ink-800">{acessibilidade.limitacoes}</p>
          <a
            href={acessibilidade.contato.href}
            className="mt-3 inline-block text-sm font-semibold text-gold-600 underline underline-offset-2 hover:text-gold-500"
          >
            {acessibilidade.contato.valor}
          </a>
        </div>
      </div>
    </section>
  );
}
