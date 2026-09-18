import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import { documentos } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";

const total = documentos.categorias.reduce((soma, cat) => soma + cat.itens.length, 0);

export function Documentos() {
  return (
    <section
      id="documentos"
      aria-labelledby="documentos-titulo"
      className="bg-white pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      <div className="container-espp">
        <PageHeader
          href="/documentos"
          id="documentos-titulo"
          eyebrow={documentos.eyebrow}
          titulo={documentos.titulo}
          texto={documentos.texto}
        />

        <p className="mt-6 flex items-center gap-2 text-xs font-semibold tracking-wider text-ink-500 uppercase">
          <FileText className="size-4 text-gold-600" aria-hidden="true" />
          {total} documentos publicados
        </p>

        <div className="mt-14 space-y-16">
          {documentos.categorias.map((categoria) => (
            <div key={categoria.id} id={categoria.id}>
              <div className="flex items-start gap-4 border-b border-ink-200 pb-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-ink-900 text-gold-500">
                  <Icon name={categoria.icone} className="size-5" />
                </span>
                <div>
                  <h3 className="title-display text-2xl text-ink-900">{categoria.titulo}</h3>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-700">
                    {categoria.texto}
                  </p>
                </div>
              </div>

              <ul className="mt-7 grid gap-5 lg:grid-cols-2">
                {categoria.itens.map((doc) => (
                  <li
                    key={doc.slug}
                    className="group relative flex flex-col rounded-lg border border-ink-200 bg-white p-6 shadow-sm transition-colors hover:border-gold-500"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-ink-900 px-3 py-1.5 text-[0.7rem] font-bold tracking-wider text-gold-500 uppercase">
                        {doc.tipo}
                      </span>
                      <span className="inline-flex items-center rounded-md border border-ink-200 bg-ink-050 px-3 py-1 text-[0.7rem] font-bold tracking-wider text-ink-500 uppercase">
                        {doc.paginas} páginas
                      </span>
                    </div>

                    <h4 className="title-display mt-4 text-lg leading-snug text-ink-900">
                      <Link
                        href={`/documentos/${doc.slug}`}
                        className="transition-colors group-hover:text-gold-600"
                      >
                        {/* torna todo o card clicável sem aninhar elementos interativos */}
                        <span className="absolute inset-0 rounded-lg" aria-hidden="true" />
                        {doc.titulo}
                      </Link>
                    </h4>

                    <p className="mt-3 grow text-sm leading-relaxed text-ink-700">{doc.resumo}</p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-gold-600 uppercase">
                        Ler no site
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                      <a
                        href={`/docs/${doc.slug}.pdf`}
                        download
                        className="relative z-10 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-ink-500 uppercase transition-colors hover:text-gold-600"
                      >
                        <Download className="size-4" aria-hidden="true" />
                        Baixar PDF
                        <span className="sr-only">— {doc.tituloCurto}</span>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-16 rounded-lg border border-ink-200 bg-ink-050 p-7 text-sm leading-relaxed text-ink-700">
          {documentos.aviso}
        </p>
      </div>
    </section>
  );
}
