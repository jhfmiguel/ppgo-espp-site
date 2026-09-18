import { NoticiasTeaser } from "@/components/noticias-teaser";
import { Hero } from "@/components/hero";
import { RecredenciamentoDestaque } from "@/components/recredenciamento-destaque";
import { StatsBand } from "@/components/stats-band";
import { EventosBand } from "@/components/eventos-band";
import { AreaCards } from "@/components/area-cards";

export default function Home() {
  return (
    <>
      <Hero />
      <RecredenciamentoDestaque />
      <NoticiasTeaser />
      <StatsBand />
      <EventosBand />
      <AreaCards />
    </>
  );
}
