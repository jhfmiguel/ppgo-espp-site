import { ArrowUpRight, Clock, FileText, GraduationCap, MapPin } from "lucide-react";
import { cursos } from "@/content/site";
import { PageHeader } from "@/components/ui/page-header";
import { ActionLink } from "@/components/ui/action-link";

export function CursosDestaque() {
  return (
    <section
      id="cursos"
      aria-labelledby="cursos-titulo"
      className="bg-white pt-10 lg:pt-14"
    >
      <div className="container-espp">
        <PageHeader
          href="/cursos"
          id="cursos-titulo"
          eyebrow={cursos.eyebrow}
          titulo={cursos.titulo}
          texto={cursos.texto}
        />

        <ul className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {cursos.itens.map((curso) => (
            <li
              key={curso.nome}
              className="group flex flex-col py-2 transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="text-[0.7rem] font-bold tracking-[0.14em] text-gold-600 uppercase">
                {curso.nivel}
              </p>
              <h3 className="title-display mt-4 text-xl text-[#071522]">
                {curso.nome}
              </h3>
              <p className="mt-3 grow text-sm leading-7 text-[#334155]">
                {curso.texto}
              </p>
              <dl className="mt-6 grid gap-2 pt-2 text-sm text-[#334155]">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-gold-600" aria-hidden="true" />
                  <dt className="sr-only">Carga horária</dt>
                  <dd>{curso.cargaHoraria}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-gold-600" aria-hidden="true" />
                  <dt className="sr-only">Modalidade</dt>
                  <dd>{curso.modalidade}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

      </div>

      <div className="cursos-faixa-degrade mt-14 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] py-16 text-white lg:mt-16 lg:py-20">
        <div className="container-espp">
          <div>
            <p className="mx-auto max-w-4xl text-center text-xl leading-8 font-medium !text-white lg:text-2xl lg:leading-9">
              Editais, matrizes curriculares e processos seletivos são publicados no portal oficial da Polícia Penal de Goiás.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {cursos.links.map((link, index) => {
                const LinkIcon = index === 0 ? GraduationCap : FileText;
                return (
                  <ActionLink
                    key={link.label}
                    href={link.href}
                    variant="ghost"
                    external={link.external}
                    className="group flex min-h-20 items-center justify-between gap-4 rounded-lg border border-white/15 px-5 py-4 !text-white transition-colors hover:border-[#f5c400]/70 hover:!text-[#f5c400]"
                  >
                    <span className="flex items-center gap-3">
                      <LinkIcon className="size-5 shrink-0 text-[#f5c400]" aria-hidden="true" />
                      <span className="text-sm font-bold tracking-wide uppercase">{link.label}</span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </ActionLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
