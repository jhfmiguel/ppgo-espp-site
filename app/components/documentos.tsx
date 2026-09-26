import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import { documentos } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";

const total = documentos.categorias.reduce((soma, cat) => soma + cat.itens.length, 0);

export function Documentos() {
  return (
    <section id="documentos" aria-labelledby="documentos-titulo" className="bg-white pt-10 pb-24 lg:pt-14 lg:pb-32">
      <div className="container-espp">
        <PageHeader href="/documentos" id="documentos-titulo" eyebrow={documentos.eyebrow} titulo={documentos.titulo} texto={documentos.texto} />
        <p className="mt-6 flex items-center gap-2 text-xs font-semibold tracking-wider text-ink-500 uppercase"><FileText className="size-4 text-gold-600" aria-hidden="true" />{total} documentos publicados</p>
        <div className="mt-14 space-y-16">
          {documentos.categorias.map((categoria) => (
            <div key={categoria.id} id={categoria.id}>
              <div className="flex items-start gap-4 border-b border-ink-200 pb-5"><span className="flex size-11 shrink-0 items-center justify-center text-[#d9aa00]"><Icon name={categoria.icone} className="size-6" /></span><div><h3 className="title-display text-2xl text-ink-900">{categoria.titulo}</h3><p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-700">{categoria.texto}</p></div></div>
              <ul className="mt-7 grid gap-5 lg:grid-cols-2">
                {categoria.itens.map((doc) => (
                  <li key={doc.slug} className="group relative flex flex-col rounded-2xl border border-[#0b3157]/15 bg-transparent px-6 py-7 text-[#071522] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9aa00]/70">
                    <div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center rounded-md border border-[#0b3157]/15 bg-transparent px-3 py-1.5 text-[0.7rem] font-bold tracking-wider text-[#0b3157] uppercase">{doc.tipo}</span><span className="inline-flex items-center rounded-md border border-[#0b3157]/15 bg-transparent px-3 py-1 text-[0.7rem] font-bold tracking-wider text-[#334155] uppercase">{doc.paginas} páginas</span></div>
                    <h4 className="title-display mt-5 text-xl text-[#071522]"><Link href={`/documentos/${doc.slug}`}><span className="absolute inset-0 rounded-2xl" aria-hidden="true" />{doc.titulo}</Link></h4>
                    <p className="mt-3 grow text-sm leading-7 text-[#334155]">{doc.resumo}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2"><span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-[#d9aa00] uppercase">Ler no site<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span><a href={`/docs/${doc.slug}.pdf`} download className="relative z-10 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#334155] uppercase transition-colors hover:text-[#d9aa00]"><Download className="size-4" aria-hidden="true" />Baixar PDF<span className="sr-only">— {doc.tituloCurto}</span></a></div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-16 rounded-2xl border border-[#0b3157]/15 bg-transparent p-7 text-sm leading-relaxed text-ink-700">{documentos.aviso}</p>
      </div>
    </section>
  );
}
