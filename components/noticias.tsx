import { noticias } from "@/content/site";
import { PageHeader } from "@/components/ui/page-header";
import { NoticiaCard, NoticiaDestaque } from "@/components/noticia-card";

export function Noticias() {
  const [destaque, ...resto] = noticias.itens;

  return (
    <section
      id="noticias"
      aria-labelledby="noticias-titulo"
      className="bg-white pt-10 pb-24 lg:pt-14 lg:pb-32"
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
              <NoticiaCard key={item.titulo} item={item} />
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
