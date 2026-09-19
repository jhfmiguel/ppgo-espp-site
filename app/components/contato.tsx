"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Info } from "lucide-react";
import { contato } from "@/content/site";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";

/**
 * Seção de contato. O formulário está sem backend nesta fase: a submissão
 * confirma visualmente e reforça os canais oficiais. Para ativar, trocar o
 * onSubmit por uma Server Action que envie o e-mail.
 */
export function Contato() {
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [protocolo, setProtocolo] = useState("");

  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      className="bg-ink-100 pt-10 pb-24 lg:pt-14 lg:pb-32"
    >
      <div className="container-espp">
        <PageHeader
          href="/contato"
          id="contato-titulo"
          eyebrow={contato.eyebrow}
          titulo={contato.titulo}
          texto={contato.texto}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {contato.canais.map((canal) => (
              <li key={canal.titulo}>
                <a
                  href={canal.href}
                  target={canal.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    canal.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex h-full items-start gap-4 rounded-lg border border-ink-200 bg-white p-5 transition-colors hover:border-gold-500"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-ink-900 text-gold-500">
                    <Icon name={canal.icone} className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink-900">
                      {canal.titulo}
                    </span>
                    <span className="mt-0.5 block text-sm break-words text-ink-700">
                      {canal.valor}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="ml-auto size-4 shrink-0 text-ink-400 transition-colors group-hover:text-gold-600"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}

            <li className="rounded-lg border border-ink-200 bg-white p-5">
              <p className="text-sm font-semibold text-ink-900">
                Redes sociais
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {contato.redes.map((rede) => (
                  <a
                    key={rede.label}
                    href={rede.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-ink-700 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-ink-900"
                  >
                    {rede.label} <span className="text-ink-400">{rede.handle}</span>
                  </a>
                ))}
              </div>
            </li>
          </ul>

          <div className="lg:col-span-7">
            <div className="rounded-lg border border-ink-200 bg-white p-7">
              <h3 className="title-display text-xl text-ink-900">
                {contato.formulario.titulo}
              </h3>

              <p className="mt-4 flex items-start gap-2.5 rounded-md border border-gold-500/50 bg-gold-050 p-4 text-sm leading-relaxed text-ink-800">
                <Info
                  className="mt-0.5 size-4 shrink-0 text-gold-600"
                  aria-hidden="true"
                />
                {contato.formulario.aviso}
              </p>

              {enviado ? (
                <p
                  role="status"
                  className="mt-6 flex items-start gap-2.5 rounded-md border border-forest-500/40 bg-forest-500/8 p-4 text-sm text-ink-800"
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-forest-600"
                    aria-hidden="true"
                  />
                  <span>
                    Mensagem recebida com sucesso. A equipe da ESPP poderá acompanhar
                    o atendimento pelo painel administrativo.
                  </span>
                </p>
              ) : (
                <form
                  className="mt-6 grid gap-4 sm:grid-cols-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setErro("");
                    setEnviando(true);
                    const form = new FormData(e.currentTarget);
                    try {
                      const resposta = await fetch("/api/contato", {
                        method: "POST",
                        body: form,
                      });
                      if (!resposta.ok) throw new Error();
                      setEnviado(true);
                    } catch {
                      setErro("Não foi possível enviar a mensagem. Tente novamente.");
                    } finally {
                      setEnviando(false);
                    }
                  }}
                >
                  <Campo id="nome" label="Nome completo" required />
                  <Campo
                    id="email"
                    label="E-mail"
                    type="email"
                    required
                    autoComplete="email"
                  />
                  <Campo id="telefone" label="Telefone" type="tel" />
                  <Campo id="assunto" label="Assunto" required />
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="mensagem"
                      className="block text-xs font-semibold tracking-[0.12em] text-ink-700 uppercase"
                    >
                      Mensagem
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      rows={5}
                      required
                      className="mt-2 w-full rounded-md border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="anexos"
                      className="block text-xs font-semibold tracking-[0.12em] text-ink-700 uppercase"
                    >
                      Anexos
                    </label>
                    <input
                      id="anexos"
                      name="anexos"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      className="mt-2 w-full rounded-md border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900"
                    />
                    <p className="mt-1 text-xs text-ink-500">
                      PDF, JPG, PNG ou WEBP. Até 8 MB por arquivo.
                    </p>
                  </div>                  <div className="sm:col-span-2">
                    <button
                      disabled={enviando}
                      type="submit"
                      className="rounded-md bg-ink-900 px-7 py-3 text-sm font-bold tracking-wide text-gold-500 uppercase transition-colors hover:bg-ink-800"
                    >
                      Enviar mensagem
                    </button>
                  </div>                  {erro ? <p role="alert" className="sm:col-span-2 text-sm font-semibold text-red-700">{erro}</p> : null}

                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Campo({
  id,
  label,
  type = "text",
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold tracking-[0.12em] text-ink-700 uppercase"
      >
        {label}
        {required ? <span className="text-gold-600"> *</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-md border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 focus:border-gold-500 focus:outline-none"
      />
    </div>
  );
}
