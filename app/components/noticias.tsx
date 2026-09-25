import { noticias } from "@/content/site";
import { PageHeader } from "@/components/ui/page-header";
import { NoticiaCard, NoticiaDestaque } from "@/components/noticia-card";
import { listarNoticiasPublicadas } from "@/lib/data/store";

export async function Noticias() {
  const itens = await listarNoticiasPublicadas();
  const [destaque, ...resto] = itens;

  return (
    <section
      id="noticias"
      aria-labelledby="noticias-titulo"
      className="bg-white pt-10 lg:pt-14"
    >
      <div className="container-espp">
        <PageHeader
          href="/noticias"
          id="noticias-titulo"
          eyebrow={noticias.eyebrow}
          titulo={noticias.titulo}
          texto={noticias.texto}
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

      <div className="midias-faixa-degrade mt-14 min-h-40 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] lg:mt-16 lg:min-h-52" data-no-scroll-animation />
    </section>
  );
}
