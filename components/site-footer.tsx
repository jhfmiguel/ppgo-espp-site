import Image from "next/image";
import { contato, localizacao, rodape, site } from "@/content/site";

export function SiteFooter() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-700 bg-ink-950">
      <div className="container-espp py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo-espp.png"
                alt=""
                width={56}
                height={72}
                className="h-16 w-auto"
              />
              <div>
                <p className="title-display text-lg text-white">{site.nome}</p>
                <p className="text-xs font-medium tracking-[0.16em] text-gold-500 uppercase">
                  {site.siglaOrgao} · Goiás
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-400">
              {rodape.texto}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {contato.redes.map((rede) => (
                <a
                  key={rede.label}
                  href={rede.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-200 transition-colors hover:text-gold-500"
                >
                  {rede.label}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <h2 className="text-xs font-bold tracking-[0.18em] text-white uppercase">
              Links oficiais
            </h2>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {rodape.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-400 transition-colors hover:text-gold-500"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-bold tracking-[0.18em] text-white uppercase">
              Contato
            </h2>
            <address className="mt-5 text-sm leading-relaxed text-ink-400 not-italic">
              {localizacao.endereco.completo}
            </address>
            <p className="mt-3 text-sm text-ink-400">
              <a
                href="tel:+556232708791"
                className="transition-colors hover:text-gold-500"
              >
                (62) 3270-8791
              </a>
            </p>
            <p className="mt-1 text-sm text-ink-400">
              <a
                href="mailto:ensino.dgpp@goias.gov.br"
                className="break-all transition-colors hover:text-gold-500"
              >
                ensino.dgpp@goias.gov.br
              </a>
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink-800 pt-7 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {ano} {site.nome} — {site.orgao} · {site.secretaria}
          </p>
          <p>Governo do Estado de Goiás</p>
        </div>
      </div>
    </footer>
  );
}
