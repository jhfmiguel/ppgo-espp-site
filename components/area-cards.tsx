import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { areas } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";

export function AreaCards() {
  return (
    <section
      aria-labelledby="areas-titulo"
      className="bg-ink-100 py-24 lg:py-32"
    >
      <div className="container-espp">
        <SectionHeading
          id="areas-titulo"
          eyebrow={areas.eyebrow}
          titulo={areas.titulo}
          texto={areas.texto}
          tone="light"
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {areas.itens.map((area) => (
            <li key={area.href}>
              <Link
                href={area.href}
                className="group flex h-full flex-col rounded-lg border border-ink-200 bg-white p-6 transition-colors hover:border-gold-500"
              >
                <span className="flex size-11 items-center justify-center rounded-md bg-ink-900 text-gold-500">
                  <Icon name={area.icone} className="size-5" />
                </span>
                <h3 className="title-display mt-5 text-lg text-ink-900">{area.titulo}</h3>
                <p className="mt-2 grow text-sm leading-relaxed text-ink-700">{area.texto}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-gold-600 uppercase">
                  Saiba mais
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
