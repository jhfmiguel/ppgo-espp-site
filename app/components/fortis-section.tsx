import { ExternalLink } from "lucide-react";
import { fortis } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FortisMockup } from "@/components/fortis-mockup";
import { NotifyForm } from "@/components/notify-form";

export function FortisSection() {
  return (
    <section
      id="fortis"
      aria-labelledby="fortis-titulo"
      className="relative overflow-hidden bg-white pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      {/* brilho de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[70rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl"
      />

      <div className="container-espp relative">
        <Breadcrumb itens={[{ label: fortis.nome }]} />

        <div className="mt-8 max-w-3xl">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-gold-500/40 bg-gold-050 px-4 py-1.5 text-[0.7rem] font-bold tracking-[0.18em] text-gold-600 uppercase">
            <span
              aria-hidden="true"
              className="pulse-dot size-1.5 rounded-full bg-gold-500"
            />
            {fortis.eyebrow}
          </p>

          <h1 id="fortis-titulo" className="title-display mt-6 text-5xl text-ink-900 sm:text-6xl">
            {fortis.nome}
          </h1>
          <p className="title-display mt-3 text-2xl text-gold-600 sm:text-3xl">
            {fortis.titulo}
          </p>

          <p className="mt-7 text-base leading-relaxed text-ink-700 sm:text-lg">
            {fortis.texto}
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-700">
            {fortis.texto2}
          </p>

          <p className="mt-7 inline-flex items-center gap-2 rounded-md border border-ink-200 bg-ink-050 px-4 py-2 text-xs font-medium text-ink-700">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-forest-500"
            />
            {fortis.status}
          </p>
        </div>

        <div className="mt-16">
          <FortisMockup />
        </div>

        <h3 className="title-display mt-20 text-2xl text-ink-900">
          O que o FORTIS vai entregar
        </h3>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fortis.modulos.map((mod) => (
            <li
              key={mod.titulo}
              className="rounded-lg border border-ink-200 bg-white p-6 shadow-sm transition-colors hover:border-gold-500/60"
            >
              <span className="flex size-11 items-center justify-center rounded-md bg-gold-050 text-gold-600">
                <Icon name={mod.icone} className="size-5" />
              </span>
              <h4 className="title-display mt-5 text-lg text-ink-900">
                {mod.titulo}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {mod.texto}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <NotifyForm />
          </div>
          <div className="flex flex-col justify-center rounded-lg border border-ink-200 bg-ink-050 p-7 lg:col-span-2">
            <h3 className="title-display text-lg text-ink-900">
              Enquanto o FORTIS não chega
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              O acesso do servidor ao portal do aluno da Escola continua
              disponível no ambiente atual.
            </p>
            <a
              href={fortis.portalAtual.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 self-start rounded-md border border-gold-500 px-5 py-2.5 text-xs font-bold tracking-wider text-gold-600 uppercase transition-colors hover:bg-gold-500 hover:text-ink-950"
            >
              {fortis.portalAtual.label}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
