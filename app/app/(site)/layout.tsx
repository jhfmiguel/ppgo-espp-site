import { localizacao, site } from "@/content/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteMain } from "@/components/site-main";
import { EsppMobileShell } from "@/components/espp-mobile-shell";
import { EsppMobileHeader } from "@/components/espp-mobile-header";
import { MobileSiteEffects } from "@/components/mobile-site-effects";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.nome,
  alternateName: site.sigla,
  description: site.descricao,
  url: site.url,
  logo: `${site.url}/images/logo-espp.png`,
  parentOrganization: { "@type": "GovernmentOrganization", name: site.orgao, alternateName: site.siglaOrgao, url: "https://www.policiapenal.go.gov.br/" },
  email: "ensino.dgpp@goias.gov.br",
  telephone: "+556232708791",
  address: { "@type": "PostalAddress", streetAddress: localizacao.endereco.logradouro, addressLocality: localizacao.endereco.cidade, addressRegion: localizacao.endereco.uf, addressCountry: "BR" },
  geo: { "@type": "GeoCoordinates", latitude: localizacao.geo.lat, longitude: localizacao.geo.lng },
  sameAs: ["https://www.instagram.com/esppgoias/", "https://www.facebook.com/esppgoias/"],
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <>
    <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950">Ir para o conteúdo principal</a>
    <div className="espp-desktop-site hidden md:block"><SiteHeader /></div>
    <style>{`@media (max-width:767px){html{width:100%!important;max-width:100%!important;overflow-x:hidden!important}body{position:relative!important;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:0!important;overflow-x:hidden!important}body>div,body>main{max-width:100%!important}.site-public-main{position:relative!important;box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding-left:0!important;padding-right:0!important;transform:none!important;translate:none!important;overflow-x:clip!important}.site-public-main section,.site-public-main article,.site-public-main .container-espp{box-sizing:border-box!important;max-width:100%!important;min-width:0!important}.site-public-main .container-espp{width:100%!important;margin-left:auto!important;margin-right:auto!important}.site-public-main img{max-width:100%!important}#rodape{box-sizing:border-box!important;width:100%!important;max-width:100%!important;margin-left:0!important;margin-right:0!important;padding-bottom:6rem}.espp-mobile-header{left:0!important;right:0!important;width:100%!important;max-width:100%!important;margin:0!important;transform:none!important}.espp-mobile-bottom-nav{position:fixed!important;z-index:1000!important;left:.75rem!important;right:.75rem!important;bottom:max(.6rem,env(safe-area-inset-bottom))!important;width:auto!important;max-width:calc(100% - 1.5rem)!important;margin:0!important;transform:none!important;translate:none!important;display:grid!important;visibility:visible!important;opacity:1!important}}`}</style>
    <EsppMobileHeader />
    <MobileSiteEffects />
    <SiteMain>{children}</SiteMain>
    <SiteFooter />
    <EsppMobileShell />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </>;
}
