import { Building2, Clock, MapPin, Navigation } from "lucide-react";
import { localizacao } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { MapEmbed } from "@/components/map-embed";

const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(localizacao.mapaQuery)}`;
const rotaLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(localizacao.mapaQuery)}`;

export function Localizacao() {
  return (
    <section
      id="localizacao"
      aria-labelledby="localizacao-titulo"
      className="scroll-mt-24 bg-ink-900 py-24 lg:py-32"
    >
      <div className="container-espp">
        <SectionHeading
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
                className="inline-flex items-center gap-2 rounded-md border border-ink-600 px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:border-gold-500 hover:text-gold-500"
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
            <div className="rounded-lg border border-ink-700 bg-ink-850 p-7">
              <h3 className="title-display flex items-center gap-2.5 text-xl text-white">
                <MapPin className="size-5 text-gold-500" aria-hidden="true" />
                Sede da Escola
              </h3>
              <address className="mt-4 text-base leading-relaxed text-ink-100 not-italic">
                {localizacao.endereco.logradouro}
                <br />
                {localizacao.endereco.bairro} — {localizacao.endereco.cidade}/
                {localizacao.endereco.uf}
              </address>

              <p className="mt-5 flex items-center gap-2 text-sm text-ink-400">
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                {localizacao.horario}
              </p>

              <dl className="mt-6 divide-y divide-ink-700 border-t border-ink-700">
                {localizacao.contatos.map((c) => (
                  <div
                    key={`${c.label}-${c.valor}`}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <dt className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
                      {c.label}
                    </dt>
                    <dd>
                      <a
                        href={c.href}
                        className="text-sm font-medium text-ink-100 transition-colors hover:text-gold-500"
                      >
                        {c.valor}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 rounded-lg border border-ink-700 bg-ink-900 p-7">
              <h3 className="title-display flex items-center gap-2.5 text-base text-white">
                <Building2 className="size-4 text-gold-500" aria-hidden="true" />
                {localizacao.sedeDgpp.titulo}
              </h3>
              <address className="mt-3 text-sm leading-relaxed text-ink-200 not-italic">
                {localizacao.sedeDgpp.endereco}
              </address>
              <p className="mt-3 text-sm text-ink-200">
                <a
                  href="tel:+556232708711"
                  className="transition-colors hover:text-gold-500"
                >
                  {localizacao.sedeDgpp.telefone}
                </a>
                {" · "}
                <a
                  href={`mailto:${localizacao.sedeDgpp.email}`}
                  className="break-all transition-colors hover:text-gold-500"
                >
                  {localizacao.sedeDgpp.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
