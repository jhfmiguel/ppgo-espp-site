import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { areas } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";

export function AreaCards() {
  return (
    <section
      aria-labelledby="areas-titulo"
      className="areas-escola relative overflow-hidden bg-[#071522] pt-10 pb-24 text-white lg:pt-14 lg:pb-32"
    >
      <div className="container-espp relative">
        <SectionHeading
          id="areas-titulo"
          eyebrow={areas.eyebrow}
          titulo={areas.titulo}
          texto={areas.texto}
          tone="dark"
        />

        <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {areas.itens.map((area) => (
            <li key={area.href}>
              <Link
                href={area.href}
                className="group flex h-full flex-col py-2 text-white transition-transform duration-300 hover:-translate-y-1"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-[#0b3157] transition-colors duration-300 group-hover:bg-[#f5c400]" />
                <span className="flex size-14 items-center justify-center rounded-xl bg-[#0b3157] text-[#f5c400] shadow-[0_7px_18px_rgba(7,21,34,0.20)] transition-all duration-300 group-hover:bg-[#071522] group-hover:scale-105">
                  <Icon name={area.icone} className="size-7 fill-none stroke-current" />
                </span>
                <h3 className="title-display mt-5 text-xl text-white">{area.titulo}</h3>
                <p className="mt-3 grow text-sm leading-7 text-white/75">{area.texto}</p>
                <span className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-bold tracking-wide text-[#f5c400] uppercase transition-colors group-hover:text-white">
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
