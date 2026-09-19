"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function DescadastrarNewsletter() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [mensagem, setMensagem] = useState("");

  async function confirmarDescadastramento() {
    if (!token) {
      setMensagem("Link de descadastramento inválido.");
      return;
    }

    const resposta = await fetch(
      `/api/newsletter/descadastrar/${encodeURIComponent(token)}`,
      { method: "POST" },
    );

    setMensagem(
      resposta.ok
        ? "Seu e-mail foi descadastrado com sucesso."
        : "Não foi possível concluir o descadastramento.",
    );
  }

  return (
    <main className="container-espp py-20">
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-8">
        <h1 className="title-display text-3xl">Descadastrar newsletter</h1>
        <p className="mt-4">
          Confirme para deixar de receber comunicações da ESPP.
        </p>
        <button
          className="mt-6 rounded-md bg-gold-500 px-5 py-2.5 font-bold"
          onClick={confirmarDescadastramento}
        >
          Confirmar descadastramento
        </button>
        {mensagem ? <p className="mt-4">{mensagem}</p> : null}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DescadastrarNewsletter />
    </Suspense>
  );
}