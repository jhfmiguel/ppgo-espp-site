import { noticias } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { NoticiaCard, NoticiaDestaque } from "@/components/noticia-card";

export function Noticias() {
  const [destaque, ...resto] = noticias.itens;

  return (
    <section
      id="noticias"
      aria-labelledby="noticias-titulo"
      className="scroll-mt-24 bg-ink-900 py-24 lg:py-32"
    >
      <div className="container-espp">
        <SectionHeading
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
