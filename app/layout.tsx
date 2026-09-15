import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { localizacao, site } from "@/content/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Aplica preferências salvas de acessibilidade (tamanho da fonte e alto
 * contraste) antes da hidratação, para não haver "flash" do estado padrão.
 * Mantido em sincronia com as chaves usadas em components/site-header.tsx.
 */
const scriptAcessibilidade = `
(function () {
  try {
    var escalas = { sm: "93.75%", md: "100%", lg: "112.5%" };
    var fonte = localStorage.getItem("espp-font-size");
    if (fonte && escalas[fonte]) document.documentElement.style.fontSize = escalas[fonte];
    if (localStorage.getItem("espp-contraste") === "alto") {
      document.documentElement.setAttribute("data-contrast", "alto");
    }
  } catch (e) {}
})();
`;

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nome} | ${site.sigla} Goiás`,
    template: `%s | ${site.sigla}`,
  },
  description: site.descricao,
  keywords: [
    "Escola Superior de Polícia Penal",
    "ESPP",
    "Polícia Penal de Goiás",
    "escola de governo",
    "formação policial penal",
    "execução penal",
    "CAESP",
    "CEGESP",
    "FORTIS",
  ],
  authors: [{ name: site.orgao }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.nome,
    title: `${site.nome} — Goiás`,
    description: site.descricao,
    images: [
      {
        url: "/images/formacao-policial-01.jpg",
        width: 1280,
        height: 853,
        alt: "Policiais penais de Goiás em formação",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nome} — Goiás`,
    description: site.descricao,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-white">
        <Script
          id="acessibilidade-inicial"
          strategy="beforeInteractive"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: scriptAcessibilidade }}
        />
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
      </body>
    </html>
  );
}
