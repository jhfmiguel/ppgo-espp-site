import Image from "next/image";
import Link from "next/link";

import { goias, localizacao, rodape, site } from "@/content/site";

const outrosSites = [
  ["Governo Federal", "https://www.gov.br/"],
  ["Assembleia Legislativa do Estado de Goiás", "https://portal.al.go.leg.br/"],
  ["Tribunal de Justiça do Estado de Goiás", "https://www.tjgo.jus.br/"],
  ["Ministério Público do Estado de Goiás", "https://www.mpgo.mp.br/"],
  ["Procuradoria-Geral do Estado de Goiás", "https://goias.gov.br/procuradoria/"],
  ["Controladoria-Geral do Estado de Goiás", "https://goias.gov.br/controladoria/"],
  ["Diário Oficial", "https://diariooficial.abc.go.gov.br/"],
] as const;

const transparencia = [
  ["LGPD", "https://lgpd.go.gov.br/"],
  ["Goiás Transparência", "https://transparencia.go.gov.br/"],
  ["Dados Abertos Goiás", "https://dadosabertos.go.gov.br/"],
  ["SIC – Serviço de Informação ao Cidadão", "https://www.go.gov.br/servicos-digitais/cge/nova-ouvidoria-go/sic-servico-de-informacao-ao-cidadao"],
  ["e-SIC – Serviço Eletrônico de Informação ao Cidadão", "https://www.go.gov.br/servicos-digitais/cge/nova-ouvidoria-go/e-sic-servico-eletronico-de-informacao-ao-cidadao"],
  ["Ouvidoria", "https://www.go.gov.br/servicos-digitais/cge/nova-ouvidoria-go"],
] as const;

export function SiteFooter() {
  return (
    <footer id="rodape" className="bg-gov-teal-dark text-white">
      <div className="container-espp py-9">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2.5">
              <img
                src={goias.brasao.src}
                alt={goias.brasao.alt}
                className="h-[4.5rem] w-auto shrink-0 brightness-0 invert"
              />
              <span className="leading-[0.95]">
                <span className="block text-[1.15rem] font-medium text-white">Estado de</span>
                <span className="title-display block text-[2rem] font-bold text-white">GOIÁS</span>
              </span>
            </span>

            <span aria-hidden="true" className="mx-2 hidden h-16 w-px bg-white/20 sm:block" />

            <span className="flex items-center gap-3">
              <Image
                src="/images/logo-espp.png"
                alt="Escola Superior de Polícia Penal"
                width={64}
                height={78}
                className="h-[4.5rem] w-auto shrink-0"
              />
              <span className="hidden sm:block">
                <span className="title-display block text-xl font-bold text-white">ESPP</span>
                <span className="block max-w-56 text-[0.7rem] font-semibold tracking-[0.05em] text-white/75 uppercase">
                  Escola Superior de Polícia Penal
                </span>
              </span>
            </span>
          </div>

          <div className="lg:text-right">
            <p className="text-xl font-bold">Governo na palma da mão</p>
            <div className="mt-3 flex flex-wrap gap-2 lg:justify-end">
              <a
                href="https://goias.gov.br/administracao/app-expresso/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-white/70 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                Google Play
              </a>
              <a
                href="https://goias.gov.br/administracao/app-expresso/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-white/70 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                App Store
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-10 py-7 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-bold">Serviços</h2>
            <ul className="mt-4 space-y-1.5 text-sm">
              {rodape.links.map((link) =>
                "interno" in link && link.interno ? (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/90 hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ) : (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:underline">
                      {link.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold">Outros Sites</h2>
            <ul className="mt-4 space-y-1.5 text-sm">
              {outrosSites.map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold">Transparência e Ouvidoria</h2>
            <ul className="mt-4 space-y-1.5 text-sm">
              {transparencia.map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:underline">
                    {label}
                  </a>
                </li>
              ))}
              <li className="text-white/90">Canal Telefônico Gratuito – 162 ou 0800 000 0333</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 text-center text-xs font-semibold text-white/90">
          <p>{localizacao.endereco.completo}</p>
          <p className="mt-1 text-white/60">
            {site.nome} · {site.orgao}
          </p>
        </div>
      </div>
    </footer>
  );
}
