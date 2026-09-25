import Image from "next/image";
import { estrutura } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { trilhaDe } from "@/components/ui/page-header";

export function Estrutura() {
  return (
    <section
      id="estrutura"
      aria-labelledby="estrutura-titulo"
      className="bg-white pt-10 lg:pt-14"
    >
      <div className="container-espp">
        <Breadcrumb itens={trilhaDe("/estrutura")} />

        <div className="mt-8">
          <SectionHeading
            as="h1"
            id="estrutura-titulo"
            eyebrow={estrutura.eyebrow}
            titulo={estrutura.titulo}
            texto={estrutura.texto}
            tone="light"
          />
        </div>
      </div>

      <div className="estrutura-faixa-degrade mt-10 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] py-16 text-white lg:mt-12 lg:py-20">
        <div className="container-espp">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <dl className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
              {estrutura.itens.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 rounded-lg border border-white/15 bg-[#0b3157]/70 p-6 shadow-sm"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center text-[#f5c400]">
                    <Icon name={item.icone} className="size-5 fill-none stroke-current" />
                  </span>
                  <div>
                    <dt className="flex items-baseline gap-1.5">
                      {item.valor !== "—" ? (
                        <span className="title-display text-2xl !text-white">
                          {item.valor}
                        </span>
                      ) : null}
                      <span className="text-sm font-semibold !text-white">
                        {item.label}
                      </span>
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed !text-white/80">
                      {item.texto}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="relative aspect-3/4 overflow-hidden rounded-lg border border-white/15 shadow-sm sm:aspect-4/3 lg:col-span-5 lg:aspect-4/5">
              <Image
                src={estrutura.imagem.src}
                alt={estrutura.imagem.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#071522]/80 to-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
