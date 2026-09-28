import { NoticiasTeaser } from "@/components/noticias-teaser";
import { Hero } from "@/components/hero";
import { HeroMobile } from "@/components/hero-mobile";
import { RecredenciamentoDestaque } from "@/components/recredenciamento-destaque";
import { StatsBand } from "@/components/stats-band";
import { EventosBand } from "@/components/eventos-band";
import { AreaCards } from "@/components/area-cards";
import { NewsletterHome } from "@/components/newsletter-home";

export default function Home() {
  return (
    <>
      <div className="espp-home-mobile">
        <HeroMobile />
        <RecredenciamentoDestaque />
        <NoticiasTeaser />
        <StatsBand />
        <EventosBand />
        <AreaCards />
        <NewsletterHome />
      </div>

      <div className="espp-home-desktop">
        <Hero />
        <RecredenciamentoDestaque />
        <NoticiasTeaser />
        <StatsBand />
        <EventosBand />
        <AreaCards />
        <NewsletterHome />
      </div>
      <style>{`
        .espp-home-mobile{display:block}.espp-home-desktop{display:none}
        @media(min-width:768px){.espp-home-mobile{display:none}.espp-home-desktop{display:block}}
        @media (orientation:landscape) and (max-height:600px) and (pointer:coarse){.espp-home-mobile{display:block!important}.espp-home-desktop{display:none!important}}
      `}</style>
    </>
  );
}
