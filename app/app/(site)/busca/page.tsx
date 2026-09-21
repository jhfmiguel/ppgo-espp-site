import Link from "next/link";

import { listarAtosPublicados, listarEventosPublicados, listarNoticiasPublicadas } from "@/lib/data/store";

type SearchParams = Promise<{ q?: string }>;

type Resultado = {
  tipo: string;
  titulo: string;
  resumo: string;
  href: string;
};

export default async function BuscaPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = "" } = await searchParams;
  const termo = q.trim().toLocaleLowerCase("pt-BR");

  const [noticias, eventos, atos] = await Promise.all([
    listarNoticiasPublicadas(),
    listarEventosPublicados(),
    listarAtosPublicados(),
  ]);

  const resultados: Resultado[] = termo
    ? [
        ...noticias.map((item) => ({
          tipo: "Notícia",
          titulo: item.titulo,
          resumo: item.resumo,
          href: `/noticias/${item.slug}`,
        })),
        ...eventos.map((item) => ({
          tipo: "Evento",
          titulo: item.titulo,
          resumo: item.resumo,
          href: `/eventos/${item.slug}`,
        })),
        ...atos.map((item) => ({
          tipo: "Ato normativo",
          titulo: `${item.tipo} ${item.numero} — ${item.titulo}`,
          resumo: item.ementa,
          href: "/atos-normativos",
        })),
      ].filter((item) =>
        `${item.titulo} ${item.resumo}`.toLocaleLowerCase("pt-BR").includes(termo),
      )
    : [];

  return (
    <section className="container-espp py-12 lg:py-16">
      <div className="max-w-4xl">
        <p className="text-xs font-bold tracking-[0.18em] text-gov-teal uppercase">Busca</p>
        <h1 className="title-display mt-2 text-4xl text-ink-950">Buscar no site</h1>

        <form action="/busca" method="get" role="search" className="mt-8 flex overflow-hidden rounded-md border border-ink-300 bg-white">
          <label htmlFor="busca-pagina" className="sr-only">Termo de busca</label>
          <input
            id="busca-pagina"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="O que você procura?"
            className="min-w-0 flex-1 px-4 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-400"
          />
          <button type="submit" className="bg-gov-teal px-5 py-3 text-sm font-bold text-white hover:bg-gov-teal-dark">
            Buscar
          </button>
        </form>

        {termo ? (
          <p className="mt-6 text-sm text-ink-600">
            {resultados.length} resultado{resultados.length === 1 ? "" : "s"} para <strong>“{q.trim()}”</strong>.
          </p>
        ) : (
          <p className="mt-6 text-sm text-ink-600">Digite um termo para pesquisar notícias, eventos e atos normativos publicados.</p>
        )}

        <div className="mt-8 divide-y divide-ink-200">
          {resultados.map((item, index) => (
            <article key={`${item.tipo}-${item.href}-${index}`} className="py-6 first:pt-0">
              <p className="text-xs font-bold tracking-wide text-gov-teal uppercase">{item.tipo}</p>
              <h2 className="mt-1 text-xl font-bold text-ink-950">
                <Link href={item.href} className="hover:text-gov-teal">{item.titulo}</Link>
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">{item.resumo}</p>
            </article>
          ))}
          {termo && resultados.length === 0 ? (
            <p className="py-8 text-sm text-ink-500">Nenhum conteúdo publicado encontrado.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
