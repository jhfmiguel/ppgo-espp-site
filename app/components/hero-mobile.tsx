import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { hero } from "@/content/site";

export function HeroMobile() {
  return (
    <section id="top-mobile" className="relative bg-white pb-6">
      <div className="relative h-[100dvh] min-h-[40rem] w-full overflow-hidden bg-[#071522]">
        <Image src="/images/espp-hero-background.png" alt="" priority fill sizes="100vw" className="object-cover espp-mobile-hero-image" style={{objectPosition:"58% 30%"}} />
        <div className="espp-mobile-hero-overlay absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/80 via-black/34 to-transparent" aria-hidden="true" />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-40 pt-5 text-white">
          <p className="espp-mobile-hero-item espp-mobile-hero-badge mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-white/80"><BadgeCheck className="size-4" aria-hidden="true" /><span>{hero.selo}</span></p>
          <h1 className="espp-mobile-hero-item espp-mobile-hero-title font-black uppercase leading-[.96] tracking-[-.035em]"><span className="block whitespace-nowrap text-[1.55rem]">Escola Superior de</span><span className="block text-[1.75rem]">Polícia Penal</span><strong className="mt-1 block text-[1.5rem] text-[#f5c400]">Goiás</strong></h1>
          <div className="espp-mobile-hero-rule my-3 h-[2px] w-14 bg-[#f5c400]" aria-hidden="true" />
          <p className="espp-mobile-hero-item espp-mobile-hero-subtitle max-w-[19rem] text-[13px] leading-[1.5] text-white/90">{hero.texto}</p>
        </div>
        <style>{`
          @keyframes esppHeroImageFadeIn{from{opacity:0;transform:scale(1.025)}to{opacity:1;transform:scale(1)}}
          @keyframes esppHeroItemIn{from{opacity:0;transform:translateY(18px);filter:blur(3px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
          @keyframes esppHeroRuleIn{from{opacity:0;transform:scaleX(0);transform-origin:left center}to{opacity:1;transform:scaleX(1);transform-origin:left center}}
          @keyframes esppHeroOverlayIn{from{opacity:0}to{opacity:1}}
          .espp-mobile-hero-image{animation:esppHeroImageFadeIn 900ms ease-out both}.espp-mobile-hero-overlay{animation:esppHeroOverlayIn 700ms 180ms ease-out both}.espp-mobile-hero-item{animation:esppHeroItemIn 650ms cubic-bezier(.22,1,.36,1) both}.espp-mobile-hero-badge{animation-delay:180ms}.espp-mobile-hero-title{animation-delay:270ms}.espp-mobile-hero-rule{animation:esppHeroRuleIn 600ms 390ms cubic-bezier(.22,1,.36,1) both}.espp-mobile-hero-subtitle{animation-delay:450ms}
          @media (orientation:landscape) and (max-height:600px) and (pointer:coarse){#top-mobile>div{min-height:100dvh}.espp-mobile-hero-title span:first-child{font-size:1.25rem}.espp-mobile-hero-title span:nth-child(2){font-size:1.45rem}.espp-mobile-hero-title strong{font-size:1.25rem}.espp-mobile-hero-subtitle{font-size:11px}.espp-mobile-hero-item.espp-mobile-hero-badge{margin-bottom:.35rem}.espp-mobile-hero-rule{margin-top:.5rem;margin-bottom:.5rem}.espp-mobile-hero-image{object-position:58% 24%!important}}
          @media(prefers-reduced-motion:reduce){.espp-mobile-hero-image,.espp-mobile-hero-overlay,.espp-mobile-hero-item,.espp-mobile-hero-rule{animation:none!important;opacity:1!important;transform:none!important;filter:none!important}}
        `}</style>
      </div>
    </section>
  );
}
