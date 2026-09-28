import Link from "next/link";
import { Download, ExternalLink, FileText, Info } from "lucide-react";
import { documentos } from "@/content/site";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export type Documento = {
  slug: string;
  titulo: string;
  tituloCurto: string;
  tipo: string;
  ano: number;
  paginas: number;
  resumo: string;
  referencia?: string;
};

type Props = {
  doc: Documento;
  categoria: { id: string; titulo: string };
  irmaos: { slug: string; tituloCurto: string }[];
};

export function DocumentoViewer({ doc, categoria, irmaos }: Props) {
  const arquivo = `/docs/${doc.slug}.pdf`;

  return (
    <article className="bg-white pt-8 pb-0 lg:pt-10">
      <div className="container-espp">
        <Breadcrumb
          itens={[
            { label: "Normas e Regulamentos" },
            { label: documentos.titulo, href: "/documentos" },
            { label: doc.tituloCurto },
          ]}
        />

        <div className="mt-8 max-w-3xl">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold tracking-wider uppercase">
            <span className="inline-flex items-center rounded-md bg-ink-900 px-3 py-1.5 text-gold-500">
              {doc.tipo}
            </span>
            <Link
              href={`/documentos#${categoria.id}`}
              className="text-gold-600 transition-colors hover:text-gold-500"
            >
              {categoria.titulo}
            </Link>
            <span aria-hidden="true" className="text-ink-300">·</span>
            <span className="text-ink-500">{doc.ano}</span>
            <span aria-hidden="true" className="text-ink-300">·</span>
            <span className="text-ink-500">{doc.paginas} páginas</span>
          </p>

          <h1 className="title-display mt-5 text-3xl text-ink-900 sm:text-4xl">{doc.titulo}</h1>

          <p className="mt-5 text-base leading-relaxed text-ink-700">{doc.resumo}</p>

          {doc.referencia ? (
            <p className="mt-5 flex gap-3 border-l-2 border-gold-500/70 pl-5 text-sm leading-relaxed text-ink-600">
              <Info className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden="true" />
              {doc.referencia}
            </p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={arquivo}
            download
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-6 py-3 text-sm font-semibold tracking-wide text-ink-950 uppercase transition-colors hover:bg-gold-400"
          >
            <Download className="size-4" aria-hidden="true" />
            Baixar PDF
          </a>
          <a
            href={arquivo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-ink-300 px-6 py-3 text-sm font-semibold tracking-wide text-ink-800 uppercase transition-colors hover:border-gold-500 hover:text-gold-600"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Abrir em nova aba
          </a>
        </div>

        <div className="mt-10 hidden overflow-hidden rounded-lg border border-ink-200 bg-ink-050 shadow-sm md:block">
          <iframe
            src={`${arquivo}#view=FitH`}
            title={`Leitor de PDF — ${doc.titulo}`}
            className="h-[80vh] min-h-[520px] w-full"
          />
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-lg border border-ink-200 bg-ink-050 p-7 md:hidden">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-ink-900 text-gold-500">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <p className="text-sm leading-relaxed text-ink-700">
            Este documento tem {doc.paginas} páginas. Para uma leitura confortável no celular,
            abra o PDF em tela cheia ou baixe o arquivo.
          </p>
          <a
            href={arquivo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-6 py-3 text-sm font-semibold tracking-wide text-ink-950 uppercase transition-colors hover:bg-gold-400"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Abrir o PDF
          </a>
        </div>

        <p className="mt-4 pb-12 text-xs leading-relaxed text-ink-500">
          Não conseguiu visualizar o documento? Use o botão{" "}
          <span className="font-semibold">Abrir em nova aba</span> ou baixe o arquivo em PDF.
        </p>

        {irmaos.length > 0 ? (
          <nav
            aria-labelledby="outros-documentos"
            className="relative left-1/2 w-screen -translate-x-1/2 bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] py-12 text-white lg:py-14"
            data-no-scroll-animation
          >
            <div className="container-espp">
              <h2
                id="outros-documentos"
                className="title-display text-xl text-yellow-300 sm:text-2xl"
              >
                Outros documentos · {categoria.titulo}
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {irmaos.map((irmao) => (
                  <li key={irmao.slug}>
                    <Link
                      href={`/documentos/${irmao.slug}`}
                      className="group flex h-full items-center gap-3 rounded-xl border border-white/15 bg-white/[0.08] px-5 py-4 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,.14)] backdrop-blur-sm transition-colors hover:border-gold-500/80 hover:bg-white/[0.12] hover:text-yellow-300"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white/10 text-yellow-300 transition-colors group-hover:bg-gold-500 group-hover:text-ink-950">
                        <FileText className="size-4" aria-hidden="true" />
                      </span>
                      <span>{irmao.tituloCurto}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        ) : (
          <div className="pb-24 lg:pb-32" />
        )}
      </div>
    </article>
  );
}
