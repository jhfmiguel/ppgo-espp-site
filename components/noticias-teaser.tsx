import { NoticiasCarrossel } from "@/components/noticias-carousel";
import { AtosNormativosCarrossel } from "@/components/atos-normativos-carousel";
import { listarAtosPublicados, listarNoticiasPublicadas } from "@/lib/data/store";

export async function NoticiasTeaser() {
  const [noticias, atos] = await Promise.all([
    listarNoticiasPublicadas(),
    listarAtosPublicados(),
  ]);

  if (noticias.length === 0 && atos.length === 0) return null;

  return (
    <section aria-label="Notícias e atos normativos" className="bg-white pt-10 pb-14 lg:pt-14 lg:pb-16">
      <div className="container-espp">
        {/* Altura travada em telas grandes: o carrossel de Atos Normativos não deve
            empurrar a altura da linha conforme o slide muda de conteúdo. */}
        <div className="grid gap-6 lg:h-[440px] lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NoticiasCarrossel noticias={noticias} />
          </div>

          <div className="lg:col-span-1">
            <AtosNormativosCarrossel atos={atos} />
          </div>
        </div>
      </div>
    </section>
  );
}
