import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { areas } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";

export function AreaCards() {
  return (
    <section
      aria-labelledby="areas-titulo"
      className="areas-escola relative overflow-hidden bg-[#f4f7fa] pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      <div className="container-espp relative">
        <SectionHeading
          id="areas-titulo"
          eyebrow={areas.eyebrow}
          titulo={areas.titulo}
          texto={areas.texto}
          tone="light"
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.itens.map((area) => (
            <li key={area.href}>
              <Link
                href={area.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#0b3157]/15 bg-white p-7 shadow-[0_10px_30px_rgba(7,21,34,0.09)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#e5b400] hover:shadow-[0_20px_46px_rgba(7,21,34,0.16)]"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-[#0b3157] transition-colors duration-300 group-hover:bg-[#f5c400]" />
                <span className="flex size-14 items-center justify-center rounded-xl bg-[#0b3157] text-[#f5c400] shadow-[0_7px_18px_rgba(7,21,34,0.20)] transition-all duration-300 group-hover:bg-[#071522] group-hover:scale-105">
                  <Icon name={area.icone} className="size-6" />
                </span>
                <h3 className="title-display mt-6 text-xl text-[#071522]">{area.titulo}</h3>
                <p className="mt-3 grow text-sm leading-7 text-[#29445f]">{area.texto}</p>
                <span className="mt-7 inline-flex w-fit items-center gap-2 border-b border-[#e5b400]/45 pb-1 text-xs font-bold tracking-wide text-[#9a7600] uppercase transition-colors group-hover:border-[#e5b400]">
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
