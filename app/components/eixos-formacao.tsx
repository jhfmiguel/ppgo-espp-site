import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formacao } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";

const IMAGEM_FORMACAO = "/images/formacao-espp.png";

export function EixosFormacao() {
  return (
    <section id="formacao" aria-labelledby="formacao-titulo" className="w-full overflow-x-clip bg-white pt-8 md:pt-10 lg:pt-14">
      <div className="container-espp min-w-0">
        <PageHeader href="/formacao" id="formacao-titulo" eyebrow={formacao.eyebrow} titulo={formacao.titulo} texto={formacao.texto} />
        <ul className="mt-10 grid min-w-0 grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {formacao.eixos.map((eixo) => {
            const conteudo = <><span className="inline-flex w-fit items-center justify-center text-[#d9aa00] transition-transform duration-300 group-hover:scale-110"><Icon name={eixo.icone} className="size-7 fill-none stroke-current" /></span><h3 className="title-display mt-5 break-words text-xl text-[#071522]">{eixo.titulo}</h3><p className="mt-3 grow break-words text-sm leading-7 text-[#334155]">{eixo.texto}</p><span className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-bold tracking-wide text-[#d9aa00] uppercase">{eixo.tag}{"href" in eixo && eixo.href ? <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /> : null}</span></>;
            const className = "group flex h-full min-w-0 w-full flex-col rounded-2xl border border-[#0b3157]/15 bg-transparent px-5 py-6 text-[#071522] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9aa00]/70 sm:px-6 sm:py-7";
            return <li key={eixo.titulo} className="min-w-0 w-full">{"href" in eixo && eixo.href ? <Link href={eixo.href} className={className}>{conteudo}</Link> : <div className={className}>{conteudo}</div>}</li>;
          })}
        </ul>
      </div>
      <div className="formacao-faixa-degrade mt-12 w-full overflow-hidden bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] pt-10 pb-20 text-white sm:mt-14 sm:pt-14 sm:pb-24 lg:mt-16 lg:pt-16 lg:pb-32"><div className="container-espp flex min-w-0 justify-center"><div className="relative aspect-[16/10] w-full min-w-0 max-w-[1216px] overflow-hidden rounded-2xl shadow-[0_24px_60px_-12px_rgba(7,21,34,0.42),0_8px_24px_-8px_rgba(7,21,34,0.28)] sm:aspect-21/9"><Image src={IMAGEM_FORMACAO} alt="Formação de policiais penais na Escola Superior de Polícia Penal de Goiás" fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover object-center" priority /></div></div></div>
    </section>
  );
}
