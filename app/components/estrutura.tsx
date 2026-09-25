import Image from "next/image";
import { estrutura } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { trilhaDe } from "@/components/ui/page-header";

export function Estrutura() {
  return (
    <section id="estrutura" aria-labelledby="estrutura-titulo" className="bg-white pt-10">
      <div className="container-espp lg:pt-4">
        <Breadcrumb itens={trilhaDe("/estrutura")} />

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <SectionHeading
              as="h1"
              id="estrutura-titulo"
              eyebrow={estrutura.eyebrow}
              titulo={estrutura.titulo}
              texto={estrutura.texto}
              tone="light"
            />
          </div>
          <div className="relative hidden min-h-[12rem] overflow-hidden rounded-t-lg border border-b-0 border-ink-200 lg:col-span-5 lg:block">
            <Image
              src={estrutura.imagem.src}
              alt={estrutura.imagem.alt}
              fill
              sizes="40vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>

      <div className="estrutura-faixa-degrade mt-10 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] py-12 text-white lg:mt-0 lg:py-14">
        <div className="container-espp">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {estrutura.itens.map((item) => (
                <div
                  key={item.label}
                  className="flex min-h-[9rem] items-start gap-3 rounded-lg border border-white/15 bg-[#0b3157]/70 p-5 shadow-sm"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center text-[#f5c400]">
                    <Icon name={item.icone} className="size-4 fill-none stroke-current" />
                  </span>
                  <div>
                    <dt className="flex items-baseline gap-1.5">
                      {item.valor !== "—" ? (
                        <span className="title-display text-xl !text-white">{item.valor}</span>
                      ) : null}
                      <span className="text-xs font-semibold !text-white">{item.label}</span>
                    </dt>
                    <dd className="mt-1 text-xs leading-relaxed !text-white/80">{item.texto}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="relative min-h-[20rem] overflow-hidden rounded-b-lg border border-white/15 shadow-sm lg:col-span-5 lg:-mt-14 lg:min-h-[27rem] lg:border-t-0">
              <Image
                src={estrutura.imagem.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#071522]/55 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
