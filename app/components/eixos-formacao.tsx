import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formacao } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";

export function EixosFormacao() {
  return (
    <section id="formacao" aria-labelledby="formacao-titulo" className="bg-white pt-10 lg:pt-14">
      <div className="container-espp">
        <PageHeader href="/formacao" id="formacao-titulo" eyebrow={formacao.eyebrow} titulo={formacao.titulo} texto={formacao.texto} />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {formacao.eixos.map((eixo) => {
            const conteudo = <>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-md bg-ink-900 px-3 py-2 text-gold-500"><Icon name={eixo.icone} className="size-5 fill-none stroke-current" /></span>
                <span className="inline-flex items-center rounded-md border border-ink-200 bg-ink-050 px-3 py-1 text-[0.7rem] font-bold tracking-wider text-ink-500 uppercase">{eixo.tag}</span>
              </div>
              <h3 className="title-display mt-4 text-lg leading-snug text-ink-900 transition-colors group-hover:text-gold-600">{eixo.titulo}</h3>
              <p className="mt-3 grow text-sm leading-relaxed text-ink-700">{eixo.texto}</p>
              {"href" in eixo && eixo.href ? <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-gold-600 uppercase">Saiba mais<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span> : null}
            </>;
            const className = "group flex h-full flex-col rounded-lg border border-ink-200 bg-white p-6 shadow-sm transition-colors hover:border-gold-500";
            return <li key={eixo.titulo}>{"href" in eixo && eixo.href ? <Link href={eixo.href} className={className}>{conteudo}</Link> : <div className={className}>{conteudo}</div>}</li>;
          })}
        </ul>
      </div>

      <div className="formacao-faixa-degrade mt-14 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] pt-14 pb-24 text-white lg:mt-16 lg:pt-16 lg:pb-32">
        <div className="container-espp flex justify-center"><div className="relative aspect-21/9 w-full max-w-[1216px] overflow-hidden rounded-lg shadow-[0_24px_60px_-12px_rgba(7,21,34,0.42),0_8px_24px_-8px_rgba(7,21,34,0.28)]"><Image src={formacao.imagem.src} alt={formacao.imagem.alt} fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover object-center" /></div></div>
      </div>
    </section>
  );
}
