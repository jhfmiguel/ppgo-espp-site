import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { hero } from "@/content/site";

export function HeroMobile() {
  return (
    <section id="top-mobile" className="relative bg-white px-4 pb-5 pt-10 md:hidden">
      <div className="relative min-h-[27rem] overflow-hidden rounded-[1.6rem] bg-[#071522] shadow-[0_14px_34px_rgba(7,21,34,.18)]">
        <Image
          src="/images/espp-hero-background.png"
          alt=""
          priority
          fill
          sizes="100vw"
          className="object-cover object-[78%_center]"
        />

        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/80 via-black/38 to-transparent" aria-hidden="true" />

        <div className="relative z-10 flex min-h-[27rem] flex-col justify-end p-5 text-white">
          <p className="mb-2 flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[.12em] text-white/80">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            <span>{hero.selo}</span>
          </p>

          <h1 className="max-w-[15rem] font-black uppercase leading-[.96] tracking-[-.035em]">
            <span className="block text-[1.45rem]">Escola Superior de</span>
            <span className="block text-[1.45rem]">Polícia Penal</span>
            <strong className="mt-1 block text-[1.25rem] text-[#f5c400]">Goiás</strong>
          </h1>

          <div className="my-3 h-[2px] w-12 bg-[#f5c400]" aria-hidden="true" />

          <p className="max-w-[17rem] text-[11px] leading-[1.45] text-white/90">{hero.texto}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={hero.ctaPrimario.href} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#f5c400] px-3 text-[10px] font-extrabold uppercase tracking-wide text-[#071522]">
              <span>{hero.ctaPrimario.label}</span><ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link href={hero.ctaSecundario.href} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/55 bg-black/20 px-3 text-[10px] font-extrabold uppercase tracking-wide text-white backdrop-blur-[2px]">
              <span>{hero.ctaSecundario.label}</span><ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
