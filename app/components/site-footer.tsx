import Image from "next/image";
import { AiFillApple } from "react-icons/ai";
import { FaGooglePlay } from "react-icons/fa";
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
  ["Polícia Penal do Estado de Goiás", "https://www.policiapenal.go.gov.br/"],
  ["Secretaria de Segurança Pública do Estado de Goiás", "https://goias.gov.br/seguranca/"],
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
          <div className="flex min-w-0 items-center overflow-hidden">
            <Image
              src="/images/logo-go-espp-branca.png"
              alt="Estado de Goiás e Escola Superior de Polícia Penal"
              width={2000}
              height={688}
              className="h-[108px] w-auto max-w-[min(74vw,58rem)] scale-[1.16] origin-left object-contain object-left mix-blend-screen" style={{ clipPath: "inset(0)" }}
              data-contrast-ignore
            />
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
                <FaGooglePlay className="mr-[8px] size-[27px] shrink-0" aria-hidden="true" />
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
                <AiFillApple className="mr-[8px] size-[30px] shrink-0" aria-hidden="true" />
                <span className="leading-none">
                  <span className="block text-[8px] font-medium leading-[1]">Baixar na</span>
                  <span className="mt-[2px] block whitespace-nowrap text-[17px] font-semibold leading-[1] tracking-[-0.03em]">App Store</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-10 pt-[15px] md:grid-cols-[0.82fr_1.18fr_1.28fr] md:gap-[56px]">
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
