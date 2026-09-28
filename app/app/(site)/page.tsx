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
      {/* Apenas o hero possui versões distintas. O restante da home é compartilhado
          entre desktop e mobile para que notícias e demais conteúdos publicados
          apareçam de forma idêntica nos dois layouts. */}
      <div className="espp-hero-mobile">
        <HeroMobile />
      </div>
      <div className="espp-hero-desktop">
        <Hero />
      </div>

      <RecredenciamentoDestaque />
      <NoticiasTeaser />
      <StatsBand />
      <EventosBand />
      <AreaCards />
      <NewsletterHome />

      <style>{`
        .espp-hero-mobile{display:block}.espp-hero-desktop{display:none}
        @media(min-width:768px){.espp-hero-mobile{display:none}.espp-hero-desktop{display:block}}
        @media (orientation:landscape) and (max-height:600px) and (pointer:coarse){.espp-hero-mobile{display:block!important}.espp-hero-desktop{display:none!important}}
      `}</style>
    </>
  );
}
