import Image from "next/image";
import { estrutura } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { trilhaDe } from "@/components/ui/page-header";

export function Estrutura() {
  return (
    <section id="estrutura" aria-labelledby="estrutura-titulo" className="bg-white pt-10">
      <div className="container-espp relative z-20 overflow-visible lg:pt-4">
        <Breadcrumb itens={trilhaDe("/estrutura")} />

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="mb-10 lg:col-span-7 lg:mb-16">
            <SectionHeading
              as="h1"
              id="estrutura-titulo"
              eyebrow={estrutura.eyebrow}
              titulo={estrutura.titulo}
              texto={estrutura.texto}
              tone="light"
            />
          </div>
          <div className="relative z-[60] hidden overflow-visible lg:col-span-5 lg:block">
            <div className="absolute inset-x-0 top-0 z-[70] h-[calc(100%+27rem)] overflow-hidden rounded-lg bg-white shadow-[0_18px_45px_rgba(7,21,34,0.24)]">
              <Image
                src={estrutura.imagem.src}
                alt={estrutura.imagem.alt}
                fill
                sizes="40vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="estrutura-faixa-degrade relative z-10 mt-10 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] pt-12 pb-28 text-white lg:mt-0 lg:pt-14 lg:pb-36">
        <div className="container-espp">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {estrutura.itens.map((item) => (
                <div
                  key={item.label}
                  className="flex min-h-[9rem] items-start gap-3 p-5"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center text-[#f5c400]">
                    <Icon name={item.icone} className="size-5 fill-none stroke-current" />
                  </span>
                  <div>
                    <dt className="flex items-baseline gap-1.5">
                      {item.valor !== "—" ? (
                        <span className="title-display text-3xl !text-white">{item.valor}</span>
                      ) : null}
                      <span className="text-base font-semibold !text-white">{item.label}</span>
                    </dt>
                    <dd className="mt-2 text-base leading-relaxed !text-white/80">{item.texto}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="relative min-h-[20rem] overflow-hidden rounded-lg shadow-[0_18px_45px_rgba(7,21,34,0.24)] lg:col-span-5 lg:min-h-0 lg:overflow-visible lg:rounded-none lg:shadow-none">
              <Image
                src={estrutura.imagem.src}
                alt={estrutura.imagem.alt}
                fill
                sizes="100vw"
                className="object-cover object-center lg:hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
