import { ArrowUpRight, Clock, FileText, GraduationCap, MapPin } from "lucide-react";
import { cursos } from "@/content/site";
import { PageHeader } from "@/components/ui/page-header";
import { ActionLink } from "@/components/ui/action-link";

export function CursosDestaque() {
  return (
    <section id="cursos" aria-labelledby="cursos-titulo" className="bg-white pt-10 lg:pt-14">
      <div className="container-espp">
        <PageHeader href="/cursos" id="cursos-titulo" eyebrow={cursos.eyebrow} titulo={cursos.titulo} texto={cursos.texto} />
        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cursos.itens.map((curso) => (
            <li key={curso.nome} className="group flex flex-col rounded-2xl border border-[#0b3157]/15 bg-transparent p-6 text-[#071522] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9aa00]/70">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-[#0b3157]/15 bg-transparent px-3 py-1.5 text-[0.7rem] font-bold tracking-wider text-[#0b3157] uppercase">{curso.nivel}</span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-[#0b3157]/15 bg-transparent px-3 py-1 text-[0.7rem] font-bold tracking-wider text-[#334155] uppercase"><Clock className="size-3.5 text-[#d9aa00]" aria-hidden="true" />{curso.cargaHoraria}</span>
              </div>
              <h3 className="title-display mt-5 text-xl text-[#071522]">{curso.nome}</h3>
              <p className="mt-3 grow text-sm leading-7 text-[#334155]">{curso.texto}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold tracking-wide text-[#d9aa00] uppercase"><MapPin className="size-4" aria-hidden="true" />{curso.modalidade}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="cursos-faixa-degrade mt-14 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] py-16 text-white lg:mt-16 lg:py-20">
        <div className="container-espp"><p className="mx-auto max-w-4xl text-center text-xl leading-8 font-medium !text-white lg:text-2xl lg:leading-9">Editais, matrizes curriculares e processos seletivos são publicados no portal oficial da Polícia Penal de Goiás.</p><div className="mt-8 grid gap-4 md:grid-cols-3">{cursos.links.map((link,index)=>{const LinkIcon=index===0?GraduationCap:FileText;return <ActionLink key={link.label} href={link.href} variant="ghost" external={link.external} className="group flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-white/15 bg-transparent px-5 py-4 !text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#f5c400]/70 hover:!text-[#f5c400]"><span className="flex items-center gap-3"><LinkIcon className="size-5 shrink-0 text-[#f5c400]" aria-hidden="true"/><span className="text-sm font-bold tracking-wide uppercase">{link.label}</span></span><ArrowUpRight className="size-4 shrink-0 opacity-70" aria-hidden="true"/></ActionLink>})}</div></div>
      </div>
    </section>
  );
}
