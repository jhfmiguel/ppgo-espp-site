import { Clock, MapPin } from "lucide-react";
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
              <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-[#334155]">
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
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed !text-white/80">
              Editais, matrizes curriculares e processos seletivos são publicados
              no portal oficial da Polícia Penal de Goiás.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {cursos.links.map((link) => (
                <ActionLink
                  key={link.label}
                  href={link.href}
                  variant="ghost"
                  external={link.external}
                  className="text-xs !text-white hover:!text-[#f5c400]"
                >
                  {link.label}
                </ActionLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
