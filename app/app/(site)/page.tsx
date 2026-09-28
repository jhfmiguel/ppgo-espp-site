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
      <div className="md:hidden">
        <HeroMobile />
        <RecredenciamentoDestaque />
        <NoticiasTeaser />
        <StatsBand />
        <EventosBand />
        <AreaCards />
        <NewsletterHome />
      </div>

      <div className="hidden md:block">
        <Hero />
        <RecredenciamentoDestaque />
        <NoticiasTeaser />
        <StatsBand />
        <EventosBand />
        <AreaCards />
        <NewsletterHome />
      </div>
    </>
  );
}
