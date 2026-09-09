"use client";

import { useState } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { fortis } from "@/content/site";

/**
 * Formulário de aviso de lançamento do FORTIS.
 *
 * Ainda não há backend: a submissão apenas confirma visualmente e orienta o
 * contato por e-mail. Para ativar o envio, plugar uma Server Action ou uma
 * rota /api que grave o e-mail (ex.: Vercel Postgres, Resend, planilha).
 */
export function NotifyForm() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900 p-7">
      <h3 className="title-display text-xl text-white">{fortis.cta.titulo}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-200">
        {fortis.cta.texto}
      </p>

      {enviado ? (
        <p
          role="status"
          className="mt-6 flex items-start gap-2.5 rounded-md border border-forest-500/40 bg-forest-500/10 p-4 text-sm text-ink-100"
        >
          <CheckCircle2
            className="mt-0.5 size-4 shrink-0 text-forest-500"
            aria-hidden="true"
          />
          <span>
            Interesse registrado localmente. O envio automático ainda não está
            ativo — para garantir seu cadastro, escreva para{" "}
            <a
              href="mailto:ensino.dgpp@goias.gov.br"
              className="font-semibold text-gold-500 underline underline-offset-2"
            >
              ensino.dgpp@goias.gov.br
            </a>
            .
          </span>
        </p>
      ) : (
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setEnviado(true);
          }}
        >
          <div className="flex-1">
            <label htmlFor="fortis-email" className="sr-only">
              E-mail institucional
            </label>
            <input
              id="fortis-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@goias.gov.br"
              autoComplete="email"
              className="w-full rounded-md border border-ink-600 bg-ink-850 px-4 py-3 text-sm text-white placeholder:text-ink-400 focus:border-gold-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-gold-500 px-6 py-3 text-sm font-bold tracking-wide text-ink-950 uppercase transition-colors hover:bg-gold-400"
          >
            {fortis.cta.botao}
          </button>
        </form>
      )}

      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        {fortis.aviso}
      </p>
    </div>
  );
}
