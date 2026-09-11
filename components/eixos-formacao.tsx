import Image from "next/image";
import Link from "next/link";
import { formacao } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";

export function EixosFormacao() {
  return (
    <section
      id="formacao"
      aria-labelledby="formacao-titulo"
      className="scroll-mt-24 bg-ink-100 py-24 lg:py-32"
    >
      <div className="container-espp">
        <SectionHeading
          id="formacao-titulo"
          eyebrow={formacao.eyebrow}
          titulo={formacao.titulo}
          texto={formacao.texto}
          tone="light"
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {formacao.eixos.map((eixo) => {
            const conteudo = (
              <>
                <span className="flex size-11 items-center justify-center rounded-md bg-ink-900 text-gold-500">
                  <Icon name={eixo.icone} className="size-5" />
                </span>
                <h3 className="title-display mt-5 text-lg text-ink-900">
                  {eixo.titulo}
                </h3>
                <p className="mt-2 grow text-sm leading-relaxed text-ink-700">
                  {eixo.texto}
                </p>
                <p className="mt-5 text-[0.7rem] font-bold tracking-[0.14em] text-gold-600 uppercase">
                  {eixo.tag}
                </p>
              </>
            );
            const className =
              "group flex flex-col rounded-lg border border-ink-200 bg-white p-6 transition-colors hover:border-gold-500";

            return (
              <li key={eixo.titulo}>
                {"href" in eixo && eixo.href ? (
                  <Link href={eixo.href} className={`h-full ${className}`}>
                    {conteudo}
                  </Link>
                ) : (
                  <div className={className}>{conteudo}</div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="relative mt-16 aspect-21/9 overflow-hidden rounded-lg">
          <Image
            src={formacao.imagem.src}
            alt={formacao.imagem.alt}
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
