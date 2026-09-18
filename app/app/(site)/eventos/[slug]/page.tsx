import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarClock, MapPin, Monitor } from "lucide-react";

import { buscarEventoPorSlug, listarEventosPublicados } from "@/lib/data/store";
import { formatarPeriodo } from "@/lib/formato";
import { site } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

/** Só eventos publicados têm página pública — rascunhos retornam 404. */
async function carregar(slug: string) {
  const evento = await buscarEventoPorSlug(slug);
  return evento && evento.status === "publicado" ? evento : null;
}

export async function generateStaticParams() {
  const itens = await listarEventosPublicados();
  return itens.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const evento = await carregar(slug);
  if (!evento) return { title: "Evento não encontrado" };

  return {
    title: evento.titulo,
    description: evento.resumo,
    openGraph: {
      type: "article",
      title: evento.titulo,
      description: evento.resumo,
      images: evento.imagem ? [{ url: evento.imagem.src, alt: evento.imagem.alt }] : undefined,
    },
  };
}

export default async function EventoPage({ params }: Props) {
  const { slug } = await params;
  const evento = await carregar(slug);
  if (!evento) notFound();

  const hoje = new Date().toISOString().slice(0, 10);
  const encerrado = (evento.dataFim || evento.dataInicio) < hoje;
  const IconeLocal = evento.modalidade === "Online" ? Monitor : MapPin;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: evento.titulo,
    description: evento.resumo,
    startDate: evento.dataInicio,
    endDate: evento.dataFim ?? evento.dataInicio,
    eventAttendanceMode:
      evento.modalidade === "Online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : evento.modalidade === "Híbrido"
          ? "https://schema.org/MixedEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: evento.local },
    organizer: { "@type": "Organization", name: site.nome, url: site.url },
    image: evento.imagem ? `${site.url}${evento.imagem.src}` : undefined,
  };

  return (
    <article className="bg-white pb-24 lg:pb-32">
      <div className="container-espp">
        <div className="mx-auto max-w-3xl pt-10 lg:pt-14">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-ink-500 uppercase transition-colors hover:text-gold-600"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Agenda completa
          </Link>

          <header className="mt-6">
            <p className="flex flex-wrap items-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
              <span className="rounded-full bg-gold-050 px-3 py-1 text-gold-700">
                {evento.categoria}
              </span>
              <span className="rounded-full bg-ink-100 px-3 py-1 text-ink-700">
                {evento.modalidade}
              </span>
              {encerrado ? (
                <span className="rounded-full bg-ink-100 px-3 py-1 text-ink-500">Já realizado</span>
              ) : null}
            </p>

            <h1 className="title-display mt-4 text-3xl text-ink-900 sm:text-4xl lg:text-5xl">
              {evento.titulo}
            </h1>
            <p className="mt-5 border-l-2 border-gold-500 pl-4 text-base leading-relaxed text-ink-700 sm:text-lg">
              {evento.resumo}
            </p>
          </header>

          <dl className="mt-8 grid gap-4 rounded-xl border border-ink-200 bg-ink-050 p-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <CalendarClock className="mt-0.5 size-5 shrink-0 text-gold-600" aria-hidden="true" />
              <div>
                <dt className="text-[0.65rem] font-bold tracking-wider text-ink-500 uppercase">
                  Data
                </dt>
                <dd className="text-sm font-semibold text-ink-900">
                  {formatarPeriodo(evento.dataInicio, evento.dataFim)}
                </dd>
                {evento.horario ? (
                  <dd className="text-sm text-ink-600">{evento.horario}</dd>
                ) : null}
              </div>
            </div>

            <div className="flex gap-3">
              <IconeLocal className="mt-0.5 size-5 shrink-0 text-gold-600" aria-hidden="true" />
              <div>
                <dt className="text-[0.65rem] font-bold tracking-wider text-ink-500 uppercase">
                  Local
                </dt>
                <dd className="text-sm font-semibold text-ink-900">{evento.local}</dd>
              </div>
            </div>
          </dl>

          {evento.inscricaoHref && !encerrado ? (
            <a
              href={evento.inscricaoHref}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold-500 px-6 py-3 text-xs font-bold tracking-wide text-ink-950 uppercase transition-colors hover:bg-gold-400"
            >
              Inscreva-se
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>

        {evento.imagem ? (
          <figure className="mx-auto mt-10 max-w-4xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-ink-200">
              <Image
                src={evento.imagem.src}
                alt={evento.imagem.alt}
                fill
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 border-l-2 border-gold-500 pl-3 text-xs text-ink-500">
              {evento.imagem.alt}
            </figcaption>
          </figure>
        ) : null}

        <div
          className="conteudo-rico mx-auto mt-10 max-w-3xl text-base"
          // Conteúdo produzido no painel e sanitizado em `lib/sanitize.ts`
          // antes de ser gravado.
          dangerouslySetInnerHTML={{ __html: evento.conteudo }}
        />
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
