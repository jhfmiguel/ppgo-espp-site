import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { site } from "@/content/site";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-white">
        <Script
          id="acessibilidade-inicial"
          strategy="beforeInteractive"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: scriptAcessibilidade }}
        />
        {children}
      </body>
    </html>
  );
}

