"use client";

import { useState } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { fortis } from "@/content/site";

/**
 * Formulário de aviso de lançamento do FORTIS.
 * */
export function NotifyForm() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  return (
    <div className="rounded-lg border border-ink-200 bg-ink-050 p-7">
      <h3 className="title-display text-xl text-ink-900">{fortis.cta.titulo}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">
        {fortis.cta.texto}
      </p>

      {enviado ? (
        <p
          role="status"
          className="mt-6 flex items-start gap-2.5 rounded-md border border-forest-500/40 bg-forest-500/10 p-4 text-sm text-ink-800"
        >
          <CheckCircle2
            className="mt-0.5 size-4 shrink-0 text-forest-500"
            aria-hidden="true"
          />
          <span>
            E-mail cadastrado com sucesso. Você está na lista de interessados do FORTIS.
          </span>
        </p>
      ) : (
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            setErro("");
            setEnviando(true);
            try {
              const resposta = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, origem: "FORTIS" }),
              });
              if (!resposta.ok) {
                if (resposta.status === 409) {
                  throw new Error(
                    "O e-mail informado já foi cadastrado anteriormente.",
                  );
                }

                const dados = (await resposta.json().catch(() => null)) as
                  | { erro?: string }
                  | null;
                throw new Error(
                  dados?.erro ?? "Não foi possível cadastrar o e-mail. Tente novamente.",
                );
              }

              setEnviado(true);
            } catch (erro) {
              setErro(
                erro instanceof Error
                  ? erro.message
                  : "Não foi possível cadastrar o e-mail. Tente novamente.",
              );
            } finally {
              setEnviando(false);
            }
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (erro) setErro("");
              }}
              placeholder="nome@goias.gov.br"
              autoComplete="email"
              aria-invalid={erro ? "true" : undefined}
              aria-describedby={erro ? "fortis-email-erro" : undefined}
              className="w-full rounded-md border border-ink-300 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none"
            />
            {erro ? (
              <p id="fortis-email-erro" role="alert" className="mt-2 text-sm font-semibold text-red-700">
                {erro}
              </p>
            ) : null}
          </div>
          <button
            disabled={enviando}
            type="submit"
            className="h-[46px] shrink-0 rounded-md bg-gold-500 px-6 text-sm font-bold tracking-wide text-ink-950 uppercase transition-colors hover:bg-gold-400"
          >
            {enviando ? "Cadastrando..." : fortis.cta.botao}
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
