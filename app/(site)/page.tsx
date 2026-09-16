import { NoticiasTeaser } from "@/components/noticias-teaser";
import { Hero } from "@/components/hero";
import { StatsBand } from "@/components/stats-band";
import { EventosBand } from "@/components/eventos-band";
import { AreaCards } from "@/components/area-cards";

export default function Home() {
  return (
    <>
      <Hero />
      <NoticiasTeaser />
      <StatsBand />
      <EventosBand />
      <AreaCards />
    </>
  );
}
