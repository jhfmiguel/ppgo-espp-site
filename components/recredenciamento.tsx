import Link from "next/link";
import { FileText } from "lucide-react";
import { documentos, recredenciamento } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { ActionLink } from "@/components/ui/action-link";

/**
 * Documentos citados nesta seção: os instrumentos de planejamento (PDI e PED)
 * e as peças técnicas do dossiê apresentado ao CEE/GO.
 */
const DESTACADAS = ["planejamento", "recredenciamento"];

const pecas: { slug: string; titulo: string; tipo: string; paginas: number }[] = [];
for (const categoria of documentos.categorias) {
  if (!DESTACADAS.includes(categoria.id)) continue;
  for (const doc of categoria.itens) {
    pecas.push({
      slug: doc.slug,
      titulo: doc.titulo,
      tipo: doc.tipo,
      paginas: doc.paginas,
    });
  }
}

export function Recredenciamento() {
  return (
    <section
      id="recredenciamento"
      aria-labelledby="recredenciamento-titulo"
      className="border-t border-ink-200 bg-ink-050 py-20 lg:py-24"
    >
      <div className="container-espp">
        <SectionHeading
          id="recredenciamento-titulo"
          eyebrow={recredenciamento.eyebrow}
          titulo={recredenciamento.titulo}
          tone="light"
        />

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {recredenciamento.paragrafos.map((p) => (
                <p key={p.slice(0, 24)} className="text-base leading-relaxed text-ink-700">
                  {p}
                </p>
              ))}
            </div>

            <h3 className="title-display mt-12 text-xl text-ink-900">Documentos do processo</h3>
            <ul className="mt-5 space-y-3">
              {pecas.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/documentos/${doc.slug}`}
                    className="group flex items-center gap-4 rounded-lg border border-ink-200 bg-white px-5 py-4 transition-colors hover:border-gold-500"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-ink-900 text-gold-500">
                      <FileText className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink-900 transition-colors group-hover:text-gold-600">
                        {doc.titulo}
                      </span>
                      <span className="mt-0.5 block text-xs font-semibold tracking-wider text-ink-500 uppercase">
                        {doc.tipo} · {doc.paginas} páginas
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <ActionLink href={recredenciamento.cta.href} variant="outline" className="mt-8">
              {recredenciamento.cta.label}
            </ActionLink>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-lg border border-ink-200 bg-white p-7">
              <h3 className="title-display text-xl text-ink-900">Ficha institucional</h3>
              <dl className="mt-6 divide-y divide-ink-100">
                {recredenciamento.ficha.map((linha) => (
                  <div key={linha.label} className="py-4 first:pt-0 last:pb-0">
                    <dt className="text-xs font-semibold tracking-wider text-ink-500 uppercase">
                      {linha.label}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink-900">{linha.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
