import Image from "next/image";
import { institucional } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";

export function Institucional() {
  return (
    <section
      id="institucional"
      aria-labelledby="institucional-titulo"
      className="scroll-mt-24 bg-ink-900 py-24 lg:py-32"
    >
      <div className="container-espp">
        <SectionHeading
          id="institucional-titulo"
          eyebrow={institucional.eyebrow}
          titulo={institucional.titulo}
        />

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="space-y-6 border-l-2 border-gold-500/70 pl-6">
              {institucional.paragrafos.map((p) => (
                <p key={p.slice(0, 24)} className="text-base leading-relaxed text-ink-200">
                  {p}
                </p>
              ))}
            </div>

            <dl className="mt-12 grid gap-6 sm:grid-cols-3">
              {institucional.pilares.map((pilar) => (
                <div
                  key={pilar.titulo}
                  className="rounded-lg border border-ink-700 bg-ink-850 p-6"
                >
                  <dt className="title-display text-lg text-gold-500">
                    {pilar.titulo}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-200">
                    {pilar.texto}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-ink-700">
              <Image
                src={institucional.imagem.src}
                alt={institucional.imagem.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>

            <h3 className="title-display mt-10 text-xl text-white">
              Linha do tempo
            </h3>
            <ol className="mt-5 space-y-5">
              {institucional.marcos.map((marco, i) => (
                <li key={`${marco.ano}-${i}`} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-1 flex size-14 shrink-0 items-center justify-center rounded-md bg-gold-500/12 text-sm font-bold text-gold-500"
                  >
                    {marco.ano}
                  </span>
                  <p className="text-sm leading-relaxed text-ink-200">
                    <span className="sr-only">{marco.ano}: </span>
                    {marco.texto}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
