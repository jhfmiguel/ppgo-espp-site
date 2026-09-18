import { localizacao, site } from "@/content/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/** Dados estruturados para busca e mapas */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.nome,
  alternateName: site.sigla,
  description: site.descricao,
  url: site.url,
  logo: `${site.url}/images/logo-espp.png`,
  parentOrganization: {
    "@type": "GovernmentOrganization",
    name: site.orgao,
    alternateName: site.siglaOrgao,
    url: "https://www.policiapenal.go.gov.br/",
  },
  email: "ensino.dgpp@goias.gov.br",
  telephone: "+556232708791",
  address: {
    "@type": "PostalAddress",
    streetAddress: localizacao.endereco.logradouro,
    addressLocality: localizacao.endereco.cidade,
    addressRegion: localizacao.endereco.uf,
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: localizacao.geo.lat,
    longitude: localizacao.geo.lng,
  },
  sameAs: [
    "https://www.instagram.com/esppgoias/",
    "https://www.facebook.com/esppgoias/",
  ],
};

/**
 * Casca do site institucional público — header, rodapé e dados estruturados.
 * O painel administrativo (/admin) fica fora deste grupo e tem casca própria.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        Ir para o conteúdo principal
      </a>
      <SiteHeader />
      <main id="conteudo" className="flex-1 pt-header xl:pt-header-xl">
        {children}
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
