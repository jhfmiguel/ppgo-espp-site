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
            const conteudo = <><span className="inline-flex w-fit items-center justify-center text-[#d9aa00] transition-transform duration-300 group-hover:scale-110"><Icon name={eixo.icone} className="size-7 fill-none stroke-current" /></span><h3 className="title-display mt-5 text-xl text-[#071522]">{eixo.titulo}</h3><p className="mt-3 grow text-sm leading-7 text-[#334155]">{eixo.texto}</p><span className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-bold tracking-wide text-[#d9aa00] uppercase">{eixo.tag}{"href" in eixo && eixo.href ? <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /> : null}</span></>;
            const className = "group flex h-full flex-col rounded-2xl border border-[#0b3157]/15 bg-transparent px-6 py-7 text-[#071522] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9aa00]/70";
            return <li key={eixo.titulo}>{"href" in eixo && eixo.href ? <Link href={eixo.href} className={className}>{conteudo}</Link> : <div className={className}>{conteudo}</div>}</li>;
          })}
        </ul>
      </div>
      <div className="formacao-faixa-degrade mt-14 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] pt-14 pb-24 text-white lg:mt-16 lg:pt-16 lg:pb-32"><div className="container-espp flex justify-center"><div className="relative aspect-21/9 w-full max-w-[1216px] overflow-hidden rounded-lg shadow-[0_24px_60px_-12px_rgba(7,21,34,0.42),0_8px_24px_-8px_rgba(7,21,34,0.28)]"><Image src={formacao.imagem.src} alt={formacao.imagem.alt} fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover object-center" /></div></div></div>
    </section>
  );
}
