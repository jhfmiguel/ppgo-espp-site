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
      className="bg-ink-900 pt-28 pb-14 lg:pt-32 lg:pb-16"
    >
      <div className="container-espp">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            id="noticias-teaser-titulo"
            eyebrow={noticias.eyebrow}
            titulo={noticias.titulo}
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
            <ul className="divide-y divide-ink-800 rounded-xl border border-ink-700 bg-ink-850 px-5">
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
