import type { Metadata } from "next";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Mapa do site",
  description: `Todas as páginas do site institucional da ${site.sigla}.`,
};

type PaginaLink = { label: string; href: string };

/**
 * A Central de Acessos é pública e concentra os pontos de entrada para os
 * serviços autenticados. O painel administrativo continua fora do mapa,
 * do sitemap.xml e protegido contra indexação.
 */
const ehPublica = (href: string) => !href.startsWith("/admin");

const paginasBase: PaginaLink[] = [
  ...nav.flatMap((item): PaginaLink[] =>
    "submenu" in item
      ? item.submenu.flatMap((sub): PaginaLink[] =>
          "href" in sub && !("external" in sub && sub.external) ? [{ label: sub.label, href: sub.href }] : [],
        )
      : "external" in item && item.external
        ? []
        : [{ label: item.label, href: item.href }],
  ),
  { label: "Acessos", href: "/acessos" },
  { label: "FORTIS", href: "/fortis" },
  { label: "Acessibilidade", href: "/acessibilidade" },
  { label: "Mapa do site", href: "/mapa-do-site" },
].filter((pagina) => ehPublica(pagina.href));

const paginas = paginasBase.filter(
  (pagina, indice, todas) => todas.findIndex((item) => item.href === pagina.href) === indice,
);

export default function MapaDoSitePage() {
  return (
    <section aria-labelledby="mapa-titulo" className="bg-white pt-10 pb-24 lg:pt-14 lg:pb-32">
      <div className="container-espp">
        <PageHeader
          href="/mapa-do-site"
          trilha={[{ label: "Mapa do site" }]}
          id="mapa-titulo"
          eyebrow="Mapa do site"
          titulo="Todas as páginas do site"
          texto="Navegue diretamente para qualquer área do site institucional da Escola."
        />

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {paginas.map((pagina) => (
            <li key={pagina.href}>
              <Link
                href={pagina.href}
                className="block rounded-lg border border-ink-200 bg-white px-5 py-4 text-sm font-semibold text-ink-900 shadow-sm transition-colors hover:border-gold-500 hover:text-gold-600"
              >
                {pagina.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
