import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { buscarNoticiaPorSlug, listarNoticiasPublicadas } from "@/lib/data/store";
import { formatarData } from "@/lib/formato";
import { NoticiaCard } from "@/components/noticia-card";
import { site } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

// A notícia depende da API e deve ser resolvida em tempo de requisição,
// não durante o build do frontend.
export const dynamic = "force-dynamic";

/** Só notícias publicadas têm página pública — rascunhos retornam 404. */
async function carregar(slug: string) {
  const noticia = await buscarNoticiaPorSlug(slug);
  return noticia && noticia.status === "publicado" ? noticia : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await carregar(slug);
  if (!noticia) return { title: "Notícia não encontrada" };

  return {
    title: noticia.titulo,
    description: noticia.resumo,
    openGraph: {
      type: "article",
      title: noticia.titulo,
      description: noticia.resumo,
      publishedTime: noticia.data,
      images: noticia.imagem ? [{ url: noticia.imagem.src, alt: noticia.imagem.alt }] : undefined,
    },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const noticia = await carregar(slug);
  if (!noticia) notFound();

  const outras = (await listarNoticiasPublicadas())
    .filter((item) => item.id !== noticia.id)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: noticia.titulo,
    description: noticia.resumo,
    datePublished: noticia.data,
    dateModified: noticia.atualizadoEm,
    author: { "@type": "Organization", name: site.nome },
    publisher: { "@type": "Organization", name: site.nome },
    image: noticia.imagem ? `${site.url}${noticia.imagem.src}` : undefined,
  };

  return (
    <article className="bg-white">
      <div className="container-espp pb-20 lg:pb-24">
        <div className="mx-auto max-w-3xl pt-10 lg:pt-14">
          <Link href="/noticias" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-ink-500 uppercase transition-colors hover:text-gold-600">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Todas as notícias
          </Link>

          <header className="mt-6">
            <p className="flex flex-wrap items-center gap-3 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
              <span className="rounded-full bg-gold-050 px-3 py-1 text-gold-700">{noticia.categoria}</span>
              <time dateTime={noticia.data} className="text-ink-500">{formatarData(noticia.data)}</time>
            </p>
            <h1 className="title-display mt-4 text-3xl text-ink-900 sm:text-4xl lg:text-5xl">{noticia.titulo}</h1>
            <p className="mt-5 border-l-2 border-gold-500 pl-4 text-base leading-relaxed text-ink-700 sm:text-lg">{noticia.resumo}</p>
          </header>
        </div>

        {noticia.imagem ? (
          <figure className="mx-auto mt-10 max-w-4xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-ink-200">
              <Image src={noticia.imagem.src} alt={noticia.imagem.alt} fill priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 border-l-2 border-gold-500 pl-3 text-xs text-ink-500">{noticia.imagem.alt}</figcaption>
          </figure>
        ) : null}

        <div className="conteudo-rico mx-auto mt-10 max-w-3xl text-base" dangerouslySetInnerHTML={{ __html: noticia.conteudo }} />
      </div>

      {outras.length > 0 ? (
        <section
          aria-labelledby="outras-noticias"
          className="bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] py-14 text-white lg:py-18"
          data-no-scroll-animation
        >
          <div className="container-espp">
            <div className="mx-auto max-w-5xl">
              <h2 id="outras-noticias" className="title-display text-2xl text-white">Outras notícias</h2>
              <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {outras.map((item) => <NoticiaCard key={item.id} item={item} />)}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
