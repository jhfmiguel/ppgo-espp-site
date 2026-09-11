import { noticias } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { ActionLink } from "@/components/ui/action-link";
import { NoticiaDestaque, NoticiaLinha } from "@/components/noticia-card";

export function NoticiasTeaser() {
  const [destaque, ...resto] = noticias.itens;
  const proximas = resto.slice(0, 3);

  return (
    <section
      aria-labelledby="noticias-teaser-titulo"
      className="bg-white pt-10 pb-14 lg:pt-14 lg:pb-16"
    >
      <div className="container-espp">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            id="noticias-teaser-titulo"
            eyebrow={noticias.eyebrow}
            titulo={noticias.titulo}
            tone="light"
          />
          <ActionLink href="/noticias" variant="ghost" className="text-xs">
            Ver todas as notícias
          </ActionLink>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {destaque ? (
            <div className="lg:col-span-2">
              <NoticiaDestaque item={destaque} compacto />
            </div>
          ) : null}

          {proximas.length > 0 ? (
            <ul className="divide-y divide-ink-100 rounded-xl border border-ink-200 bg-white px-5 shadow-sm">
              {proximas.map((item) => (
                <NoticiaLinha key={item.titulo} item={item} />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
