import { NoticiasCarrossel } from "@/components/noticias-carousel";
import { AtosNormativosCarrossel } from "@/components/atos-normativos-carousel";

export function NoticiasTeaser() {
  return (
    <section aria-label="Notícias e atos normativos" className="bg-white pt-10 pb-14 lg:pt-14 lg:pb-16">
      <div className="container-espp">
        {/* Altura travada em telas grandes: o carrossel de Atos Normativos não deve
            empurrar a altura da linha conforme o slide muda de conteúdo. */}
        <div className="grid gap-6 lg:h-[440px] lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NoticiasCarrossel />
          </div>

          <div className="lg:col-span-1">
            <AtosNormativosCarrossel />
          </div>
        </div>
      </div>
    </section>
  );
}
