import Image from "next/image";
import { estrutura } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";

export function Estrutura() {
  return (
    <section
      id="estrutura"
      aria-labelledby="estrutura-titulo"
      className="scroll-mt-24 bg-ink-100 pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      <div className="container-espp">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              id="estrutura-titulo"
              eyebrow={estrutura.eyebrow}
              titulo={estrutura.titulo}
              texto={estrutura.texto}
              tone="light"
            />

            <dl className="mt-12 grid gap-4 sm:grid-cols-2">
              {estrutura.itens.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 rounded-lg border border-ink-200 bg-white p-5"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-ink-900 text-gold-500">
                    <Icon name={item.icone} className="size-5" />
                  </span>
                  <div>
                    <dt className="flex items-baseline gap-1.5">
                      {item.valor !== "—" ? (
                        <span className="title-display text-2xl text-ink-900">
                          {item.valor}
                        </span>
                      ) : null}
                      <span className="text-sm font-semibold text-ink-900">
                        {item.label}
                      </span>
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink-700">
                      {item.texto}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative aspect-3/4 overflow-hidden rounded-lg lg:aspect-4/5">
            <Image
              src={estrutura.imagem.src}
              alt={estrutura.imagem.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950/70 to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
