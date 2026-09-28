import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { hero } from "@/content/site";

export function HeroMobile() {
  return (
    <section id="top-mobile" className="relative bg-white px-4 pb-5 pt-10 md:hidden">
      <div className="relative h-[calc(100dvh-7.5rem)] min-h-[36rem] overflow-hidden rounded-[1.6rem] bg-[#071522] shadow-[0_14px_34px_rgba(7,21,34,.18)]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/espp-hero-background.png"
            alt=""
            priority
            fill
            sizes="100vw"
            className="object-cover"
            style={{objectPosition:"56% 30%"}}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/80 via-black/34 to-transparent" aria-hidden="true" />

        <div className="relative z-10 flex h-full min-h-[36rem] flex-col justify-end px-5 pb-24 pt-5 text-white">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-white/80">
            <BadgeCheck className="size-4" aria-hidden="true" />
            <span>{hero.selo}</span>
          </p>

          <h1 className="max-w-[18rem] font-black uppercase leading-[.96] tracking-[-.035em]">
            <span className="block text-[1.75rem]">Escola Superior de</span>
            <span className="block text-[1.75rem]">Polícia Penal</span>
            <strong className="mt-1 block text-[1.5rem] text-[#f5c400]">Goiás</strong>
          </h1>

          <div className="my-3 h-[2px] w-14 bg-[#f5c400]" aria-hidden="true" />

          <p className="max-w-[19rem] text-[13px] leading-[1.5] text-white/90">{hero.texto}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={hero.ctaPrimario.href} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#f5c400] px-3.5 text-[11px] font-extrabold uppercase tracking-wide text-[#071522]">
              <span>{hero.ctaPrimario.label}</span><ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href={hero.ctaSecundario.href} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-white/55 bg-black/20 px-3.5 text-[11px] font-extrabold uppercase tracking-wide text-white backdrop-blur-[2px]">
              <span>{hero.ctaSecundario.label}</span><ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
