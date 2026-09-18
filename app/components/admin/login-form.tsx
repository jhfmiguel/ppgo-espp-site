"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { entrar } from "@/lib/actions/auth";
import { ESTADO_INICIAL } from "@/lib/actions/estado";

function Botao() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold-500 px-6 py-3 text-xs font-bold tracking-wide text-ink-950 uppercase transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
      {pending ? "Entrando…" : "Entrar no painel"}
    </button>
  );
}

const campo =
  "mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-gold-500";

export function LoginForm({ proximo }: { proximo?: string }) {
  const [estado, acao] = useActionState(entrar, ESTADO_INICIAL);

  return (
    <form action={acao} className="space-y-5">
      {proximo ? <input type="hidden" name="proximo" value={proximo} /> : null}

      {estado.erro ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {estado.erro}
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-ink-900">
          E-mail institucional
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          defaultValue={estado.valores?.email ?? ""}
          aria-invalid={estado.campos?.email ? true : undefined}
          className={`${campo} ${estado.campos?.email ? "border-red-400" : "border-ink-200"}`}
          placeholder="nome@espp.go.gov.br"
        />
        {estado.campos?.email ? (
          <p className="mt-1.5 text-xs font-semibold text-red-600">{estado.campos.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="senha" className="block text-sm font-semibold text-ink-900">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          aria-invalid={estado.campos?.senha ? true : undefined}
          className={`${campo} ${estado.campos?.senha ? "border-red-400" : "border-ink-200"}`}
        />
        {estado.campos?.senha ? (
          <p className="mt-1.5 text-xs font-semibold text-red-600">{estado.campos.senha}</p>
        ) : null}
      </div>

      <Botao />
    </form>
  );
}
