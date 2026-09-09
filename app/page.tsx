import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { StatsBand } from "@/components/stats-band";
import { Institucional } from "@/components/institucional";
import { EixosFormacao } from "@/components/eixos-formacao";
import { CursosDestaque } from "@/components/cursos-destaque";
import { FortisSection } from "@/components/fortis-section";
import { Estrutura } from "@/components/estrutura";
import { Localizacao } from "@/components/localizacao";
import { Contato } from "@/components/contato";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        <Hero />
        <StatsBand />
        <Institucional />
        <EixosFormacao />
        <CursosDestaque />
        <FortisSection />
        <Estrutura />
        <Localizacao />
        <Contato />
      </main>
      <SiteFooter />
    </>
  );
}
