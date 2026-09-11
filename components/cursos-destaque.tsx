import { Clock, MapPin } from "lucide-react";
import { cursos } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { ActionLink } from "@/components/ui/action-link";

export function CursosDestaque() {
  return (
    <section
      id="cursos"
      aria-labelledby="cursos-titulo"
      className="scroll-mt-24 bg-white pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      <div className="container-espp">
        <SectionHeading
          id="cursos-titulo"
          eyebrow={cursos.eyebrow}
          titulo={cursos.titulo}
          texto={cursos.texto}
          tone="light"
        />

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cursos.itens.map((curso) => (
            <li
              key={curso.nome}
              className="flex flex-col rounded-lg border border-ink-200 bg-white p-7 shadow-sm transition-colors hover:border-gold-500/70"
            >
              <p className="text-[0.7rem] font-bold tracking-[0.14em] text-gold-600 uppercase">
                {curso.nivel}
              </p>
              <h3 className="title-display mt-3 text-xl text-ink-900">
                {curso.nome}
              </h3>
              <p className="mt-3 grow text-sm leading-relaxed text-ink-700">
                {curso.texto}
              </p>
              <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-200 pt-5 text-sm text-ink-500">
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

        <div className="mt-12 flex flex-col gap-4 rounded-lg border border-ink-200 bg-ink-050 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-700">
            Editais, matrizes curriculares e processos seletivos são publicados
            no portal oficial da Polícia Penal de Goiás.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {cursos.links.map((link) => (
              <ActionLink
                key={link.label}
                href={link.href}
                variant="ghost"
                external={link.external}
                className="text-xs"
              >
                {link.label}
              </ActionLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
