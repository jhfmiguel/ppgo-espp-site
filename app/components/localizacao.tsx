import { Building2, Clock, MapPin, Navigation } from "lucide-react";
import { localizacao } from "@/content/site";
import { PageHeader } from "@/components/ui/page-header";
import { MapEmbed } from "@/components/map-embed";

const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(localizacao.mapaQuery)}`;
const rotaLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(localizacao.mapaQuery)}`;

export function Localizacao() {
  return (
    <section
      id="localizacao"
      aria-labelledby="localizacao-titulo"
      className="bg-white pt-10 lg:pt-14"
    >
      <div className="container-espp">
        <PageHeader
          href="/localizacao"
          id="localizacao-titulo"
          eyebrow={localizacao.eyebrow}
          titulo={localizacao.titulo}
          texto={localizacao.texto}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <MapEmbed
              query={localizacao.mapaQuery}
              title={`Mapa da localização da Escola Superior de Polícia Penal — ${localizacao.endereco.completo}`}
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-ink-300 px-5 py-2.5 text-xs font-bold tracking-wider text-ink-900 uppercase transition-colors hover:border-gold-500 hover:text-gold-600"
              >
                <MapPin className="size-4" aria-hidden="true" />
                Abrir no Google Maps
              </a>
              <a
                href={rotaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-5 py-2.5 text-xs font-bold tracking-wider text-ink-950 uppercase transition-colors hover:bg-gold-400"
              >
                <Navigation className="size-4" aria-hidden="true" />
                Traçar rota
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-lg border border-ink-200 bg-white p-7 shadow-sm">
              <h3 className="title-display flex items-center gap-2.5 text-xl text-ink-900">
                <MapPin className="size-5 text-gold-600" aria-hidden="true" />
                Sede da Escola
              </h3>
              <address className="mt-4 text-base leading-relaxed text-ink-800 not-italic">
                {localizacao.endereco.logradouro}
                <br />
                {localizacao.endereco.bairro} — {localizacao.endereco.cidade}/
                {localizacao.endereco.uf}
              </address>

              <p className="mt-5 flex items-center gap-2 text-sm text-ink-500">
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                {localizacao.horario}
              </p>

              <dl className="mt-6 divide-y divide-ink-200 border-t border-ink-200">
                {localizacao.contatos.map((c) => (
                  <div
                    key={`${c.label}-${c.valor}`}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <dt className="text-xs font-semibold tracking-[0.14em] text-ink-500 uppercase">
                      {c.label}
                    </dt>
                    <dd>
                      <a
                        href={c.href}
                        className="text-sm font-medium text-ink-800 transition-colors hover:text-gold-600"
                      >
                        {c.valor}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 rounded-lg border border-ink-200 bg-ink-050 p-7">
              <h3 className="title-display flex items-center gap-2.5 text-base text-ink-900">
                <Building2 className="size-4 text-gold-600" aria-hidden="true" />
                {localizacao.sedeDgpp.titulo}
              </h3>
              <address className="mt-3 text-sm leading-relaxed text-ink-700 not-italic">
                {localizacao.sedeDgpp.endereco}
              </address>
              <p className="mt-3 text-sm text-ink-700">
                <a
                  href="tel:+556232708711"
                  className="transition-colors hover:text-gold-600"
                >
                  {localizacao.sedeDgpp.telefone}
                </a>
                {" · "}
                <a
                  href={`mailto:${localizacao.sedeDgpp.email}`}
                  className="break-all transition-colors hover:text-gold-600"
                >
                  {localizacao.sedeDgpp.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="localizacao-faixa-degrade mt-10 w-full bg-[#071522] bg-[linear-gradient(135deg,#071522_0%,#0b3157_58%,#123f6a_100%)] py-16 text-white lg:mt-12 lg:py-20">
        <div className="container-espp">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="title-display flex items-center gap-3 text-2xl text-white">
                <MapPin className="size-6 text-[#f5c400]" aria-hidden="true" />
                Localização e acesso
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
                Consulte o mapa acima ou utilize os atalhos para abrir a localização e traçar sua rota até a Escola Superior de Polícia Penal.
              </p>
            </div>
            <div>
              <h3 className="title-display flex items-center gap-3 text-lg text-white">
                <Building2 className="size-5 text-[#f5c400]" aria-hidden="true" />
                Atendimento
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                {localizacao.horario}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
