import type { Metadata } from "next";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Mapa do site",
  description: `Todas as páginas do site institucional da ${site.sigla}.`,
};

type PaginaLink = { label: string; href: string };

const paginas: PaginaLink[] = [
  { label: "Início", href: "/" },
  ...nav.flatMap((item): PaginaLink[] =>
    "submenu" in item
      ? [{ label: item.label, href: item.href }, ...item.submenu]
      : [{ label: item.label, href: item.href }],
  ),
  { label: "FORTIS", href: "/fortis" },
  { label: "Mapa do site", href: "/mapa-do-site" },
];

export default function MapaDoSitePage() {
  return (
    <section aria-labelledby="mapa-titulo" className="bg-white pt-10 pb-24 lg:pt-14 lg:pb-32">
      <div className="container-espp">
        <SectionHeading
          id="mapa-titulo"
          eyebrow="Mapa do site"
          titulo="Todas as páginas do site"
          texto="Navegue diretamente para qualquer área do site institucional da Escola."
          tone="light"
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
