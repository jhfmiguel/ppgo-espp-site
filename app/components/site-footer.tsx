import Image from "next/image";
import { localizacao } from "@/content/site";

const servicos = [
  ["Expresso Goiás", "https://www.go.gov.br/"],
  ["Expresso Aplicações", "https://portal.go.gov.br/"],
  ["Expresso Servidor", "https://www.go.gov.br/"],
  ["SEI Governadoria", "https://sei.go.gov.br/"],
  ["Cadastro de Autoridades", "https://goias.gov.br/cadastro-de-autoridades/"],
  ["Escola de Governo", "https://goias.gov.br/escoladegoverno/"],
] as const;

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
  ["SIC – Serviço de Informação ao Cidadão", "https://goias.gov.br/acessoainformacao/"],
  ["e-SIC – Serviço Eletrônico de Informação ao Cidadão", "https://www.go.gov.br/servicos-digitais/cge/nova-ouvidoria-go/e-sic-servico-eletronico-de-informacao-ao-cidadao"],
  ["Regulamentação da LAI", "https://transparencia.go.gov.br/"],
  ["Relatório Estatístico da Ouvidoria", "https://www.ouvidoriageral.go.gov.br/"],
] as const;

function GooglePlayMark() {
  return (
    <svg
      viewBox="0 0 30 34"
      className="mr-[7px] h-[28px] w-[25px] shrink-0"
      aria-hidden="true"
    >
      <path d="M2.4 2.1 17.8 17 2.4 31.9c-.5-.5-.8-1.3-.8-2.2V4.3c0-.9.3-1.7.8-2.2Z" fill="#fff" />
      <path d="m17.8 17 4.7-4.5L5.9 2.9c-1.4-.8-2.6-.9-3.5-.8L17.8 17Z" fill="#dbe9e7" />
      <path d="m17.8 17 4.7 4.5L5.9 31.1c-1.4.8-2.6.9-3.5.8L17.8 17Z" fill="#fff" opacity=".92" />
      <path d="m22.5 12.5 4.8 2.8c1.5.9 1.5 2.5 0 3.4l-4.8 2.8-4.7-4.5 4.7-4.5Z" fill="#fff" />
    </svg>
  );
}

function AppleStoreMark() {
  return (
    <svg
      viewBox="0 0 28 34"
      className="mr-[8px] h-[28px] w-[24px] shrink-0"
      aria-hidden="true"
    >
      <path
        d="M18.1 5.4c1.2-1.4 2-3.3 1.8-5.1-1.7.1-3.7 1.2-4.9 2.6-1.1 1.2-2 3.1-1.8 4.9 1.9.1 3.7-.9 4.9-2.4Z"
        fill="#fff"
      />
      <path
        d="M23.2 18.1c0-4.3 3.5-6.4 3.7-6.5-2-2.9-5.1-3.3-6.2-3.4-2.6-.3-5.1 1.5-6.4 1.5-1.4 0-3.5-1.5-5.7-1.5-2.9 0-5.6 1.7-7.1 4.3-3.1 5.3-.8 13.2 2.2 17.5 1.5 2.1 3.2 4.5 5.4 4.4 2.1-.1 3-1.4 5.6-1.4 2.5 0 3.4 1.4 5.7 1.3 2.4 0 3.9-2.1 5.3-4.2 1.7-2.4 2.4-4.8 2.4-4.9-.1 0-4.9-1.9-4.9-7.1Z"
        fill="#fff"
      />
    </svg>
  );
}

function ListaLinks({
  itens,
}: {
  itens: readonly (readonly [string, string])[];
}) {
  return (
    <ul className="mt-[22px] space-y-[2px] text-[16px] leading-[1.34]">
      {itens.map(([label, href]) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-opacity hover:opacity-75 hover:underline"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter() {
  return (
    <footer id="rodape" className="bg-[#00534b] text-white">
      <div className="mx-auto w-full max-w-[1248px] px-6 pt-[28px] pb-[22px] md:px-8">
        <div className="grid min-h-[136px] items-start gap-8 border-b border-white/10 pb-[26px] lg:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-[22px]">
            <img
              src="/images/goias-white.png"
              alt="Estado de Goiás"
              className="h-[72px] w-auto shrink-0"
              data-contrast-ignore
            />

            <span aria-hidden="true" className="hidden h-[72px] w-px bg-white/25 sm:block" />

            <span className="flex items-center gap-[14px]">
              <Image
                src="/images/logo-espp.png"
                alt="Escola Superior de Polícia Penal"
                width={320}
                height={104}
                className="h-[58px] w-auto shrink-0 object-contain"
                data-contrast-ignore
              />
              <span className="hidden leading-tight sm:block">
                <span className="block text-[18px] font-bold tracking-[0.04em] text-white">
                  ESPP
                </span>
                <span className="mt-[2px] block whitespace-nowrap text-[12px] font-semibold leading-[1.2] tracking-[0.04em] text-white/90 uppercase">
                  Escola Superior de Polícia Penal
                </span>
              </span>
            </span>
          </div>

          <div className="min-w-[330px] pt-[12px] lg:pr-[23px]">
            <p className="text-[22px] font-bold leading-none">Governo na palma da mão</p>
            <div className="mt-[28px] flex items-center gap-[7px]">
              <a
                href="https://play.google.com/store/apps/details?id=br.gov.goias.expresso"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Disponível no Google Play"
                className="flex h-[45px] w-[149px] items-center rounded-[5px] border border-white bg-transparent px-[7px] text-white transition-opacity hover:opacity-85"
              >
                <GooglePlayMark />
                <span className="leading-none">
                  <span className="block text-[8px] font-medium leading-[1]">Disponível no</span>
                  <span className="mt-[2px] block whitespace-nowrap text-[17px] font-semibold leading-[1] tracking-[-0.03em]">Google Play</span>
                </span>
              </a>

              <a
                href="https://apps.apple.com/br/app/expresso-goi%C3%A1s/id1555278927"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Baixar na App Store"
                className="flex h-[45px] w-[150px] items-center rounded-[5px] border border-white bg-transparent px-[9px] text-white transition-opacity hover:opacity-85"
              >
                <AppleStoreMark />
                <span className="leading-none">
                  <span className="block text-[8px] font-medium leading-[1]">Baixar na</span>
                  <span className="mt-[2px] block whitespace-nowrap text-[17px] font-semibold leading-[1] tracking-[-0.03em]">App Store</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-10 pt-[15px] md:grid-cols-[0.85fr_0.95fr_1.35fr] md:gap-[58px]">
          <section>
            <h2 className="text-[17px] font-bold leading-[1.25]">Serviços</h2>
            <ListaLinks itens={servicos} />
          </section>

          <section>
            <h2 className="text-[17px] font-bold leading-[1.25]">Outros Sites</h2>
            <ListaLinks itens={outrosSites} />
          </section>

          <section>
            <h2 className="text-[17px] font-bold leading-[1.25]">Transparência e Ouvidoria</h2>
            <ListaLinks itens={transparencia} />
            <p className="mt-[2px] text-[16px] leading-[1.34] text-white">
              Canal Telefônico Gratuito – 162 ou 0800 000 0333
            </p>
          </section>
        </div>

        <div className="pt-[39px] text-center">
          <p className="text-[13px] font-bold leading-[1.25] text-white">
            {localizacao.endereco.completo}
          </p>
        </div>
      </div>
    </footer>
  );
}
