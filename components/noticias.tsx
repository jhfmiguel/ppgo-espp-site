import { noticias } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { NoticiaCard, NoticiaDestaque } from "@/components/noticia-card";
import { listarNoticiasPublicadas } from "@/lib/data/store";

export async function Noticias() {
  const itens = await listarNoticiasPublicadas();
  const [destaque, ...resto] = itens;

  return (
    <section
      id="noticias"
      aria-labelledby="noticias-titulo"
      className="scroll-mt-24 bg-white pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      <div className="container-espp">
        <SectionHeading
          id="noticias-titulo"
          eyebrow={noticias.eyebrow}
          titulo={noticias.titulo}
          texto={noticias.texto}
          tone="light"
        />

        {destaque ? (
          <div className="mt-12">
            <NoticiaDestaque item={destaque} />
          </div>
        ) : null}

        {resto.length > 0 ? (
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {resto.map((item) => (
              <NoticiaCard key={item.id} item={item} />
            ))}
          </ul>
        ) : null}

        {itens.length === 0 ? (
          <p className="mt-12 rounded-xl border border-dashed border-ink-300 bg-ink-050 px-6 py-12 text-center text-sm text-ink-600">
            Nenhuma notícia publicada no momento.
          </p>
        ) : null}
      </div>
    </section>
  );
}
