import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { areas } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";

export function AreaCards() {
  return (
    <section
      aria-labelledby="areas-titulo"
      className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#eef4f9_38%,#e8f0f7_70%,#fff8d9_100%)] pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -top-28 -right-24 size-96 rounded-full bg-[#f5c400]/12 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 size-[30rem] rounded-full bg-[#0b3157]/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e5b400]/60 to-transparent" />
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
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#0b3157]/15 bg-white/90 p-6 shadow-[0_14px_40px_rgba(7,21,34,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#e5b400]/80 hover:shadow-[0_20px_46px_rgba(7,21,34,0.12)]"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0b3157] via-[#f5c400] to-[#0b3157]" />
                <span className="flex size-11 items-center justify-center rounded-lg bg-[linear-gradient(145deg,#071522,#0b3157)] text-[#f5c400] shadow-md shadow-[#071522]/15">
                  <Icon name={area.icone} className="size-5" />
                </span>
                <h3 className="title-display mt-5 text-lg text-[#071522]">{area.titulo}</h3>
                <p className="mt-2 grow text-sm leading-relaxed text-[#29445f]">{area.texto}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#b78d00] uppercase">
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
