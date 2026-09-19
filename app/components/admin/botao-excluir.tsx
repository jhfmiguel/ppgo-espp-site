"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Loader2, Trash2, X } from "lucide-react";

/**
 * Exclusão em dois passos, confirmada na própria linha da listagem.
 *
 * Evita `window.confirm`, que bloqueia a página inteira e não acompanha o
 * visual do painel.
 */

function Confirmar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex size-8 items-center justify-center rounded-md bg-red-600 text-white transition-colors hover:bg-red-700 disabled:opacity-60"
      title={pending ? "Excluindo…" : "Confirmar exclusão"}
      aria-label={pending ? "Excluindo…" : "Confirmar exclusão"}
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Check className="size-3.5" aria-hidden="true" />
      )}
    </button>
  );
}

export function BotaoExcluir({
  acao,
  id,
  descricao,
}: {
  acao: (formData: FormData) => void;
  id: string;
  /** Aparece no aviso de confirmação e no rótulo acessível do botão. */
  descricao: string;
}) {
  const [confirmando, setConfirmando] = useState(false);

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        aria-label={`Excluir ${descricao}`}
        className="inline-flex size-8 items-center justify-center rounded-md border border-ink-200 text-ink-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
        title={`Excluir ${descricao}`}
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <form action={acao} className="flex items-center gap-1.5">
      <input type="hidden" name="id" value={id} />
      <span role="alert" className="text-xs font-semibold text-red-700">
        Excluir?
      </span>
      <Confirmar />
      <button
        type="button"
        onClick={() => setConfirmando(false)}
        className="inline-flex size-8 items-center justify-center rounded-md text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
        title="Cancelar exclusão"
        aria-label="Cancelar exclusão"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </form>
  );
}
