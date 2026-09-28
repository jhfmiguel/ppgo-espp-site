import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { hero } from "@/content/site";

export function HeroMobile() {
  return (
    <section id="top-mobile" className="relative bg-white pb-6 md:hidden">
      <div className="relative h-[100dvh] min-h-[40rem] w-full overflow-hidden bg-[#071522]">
        <Image
          src="/images/espp-hero-background.png"
          alt=""
          priority
          fill
          sizes="100vw"
          className="object-cover"
          style={{objectPosition:"58% 30%"}}
        />

        <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/80 via-black/34 to-transparent" aria-hidden="true" />

        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-44 pt-5 text-white">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-white/80">
            <BadgeCheck className="size-4" aria-hidden="true" />
            <span>{hero.selo}</span>
          </p>

          <h1 className="font-black uppercase leading-[.96] tracking-[-.035em]">
            <span className="block whitespace-nowrap text-[1.55rem]">Escola Superior de</span>
            <span className="block text-[1.75rem]">Polícia Penal</span>
            <strong className="mt-1 block text-[1.5rem] text-[#f5c400]">Goiás</strong>
          </h1>

          <div className="my-3 h-[2px] w-14 bg-[#f5c400]" aria-hidden="true" />

          <p className="max-w-[19rem] text-[13px] leading-[1.5] text-white/90">{hero.texto}</p>

          <div className="mt-4 grid w-full grid-cols-2 gap-2">
            <Link href={hero.ctaPrimario.href} className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#f5c400] px-3 text-center text-[11px] font-extrabold uppercase tracking-wide text-[#071522]">
              <span>{hero.ctaPrimario.label}</span><ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>
            <Link href={hero.ctaSecundario.href} className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-white/55 bg-black/20 px-3 text-center text-[11px] font-extrabold uppercase tracking-wide text-white backdrop-blur-[2px]">
              <span>{hero.ctaSecundario.label}</span><ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
