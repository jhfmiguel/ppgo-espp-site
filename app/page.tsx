import { NoticiasTeaser } from "@/components/noticias-teaser";
import { Hero } from "@/components/hero";
import { RecredenciamentoDestaque } from "@/components/recredenciamento-destaque";
import { StatsBand } from "@/components/stats-band";
import { AreaCards } from "@/components/area-cards";

export default function Home() {
  return (
    <>
      <Hero />
      <RecredenciamentoDestaque />
      <NoticiasTeaser />
      <StatsBand />
      <AreaCards />
    </>
  );
}
