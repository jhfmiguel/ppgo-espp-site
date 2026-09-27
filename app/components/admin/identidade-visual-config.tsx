"use client";

import { ImageUp, RotateCcw } from "lucide-react";
import { useState } from "react";

const itens = [
  ["site-light", "Logo do site — modo claro"],
  ["site-dark", "Logo do site — modo escuro"],
  ["admin-light", "Logo do painel — modo claro"],
  ["admin-dark", "Logo do painel — modo escuro"],
  ["brasao-light", "Brasão do painel — modo claro"],
  ["brasao-dark", "Brasão do painel — modo escuro"],
] as const;

export function IdentidadeVisualConfig() {
  // O primeiro HTML do servidor e do cliente precisa ser idêntico.
  // O cache-buster só muda depois de upload/restauração, nunca durante hydration.
  const [versao, setVersao] = useState(0);
  const [msg, setMsg] = useState("");

  function atualizarVersao() {
    setVersao((atual) => atual + 1);
  }

  async function upload(chave: string, arquivo: File) {
    const dados = new FormData();
    dados.append("arquivo", arquivo);
    const resposta = await fetch(`/api/admin/identidade-visual/${chave}`, {
      method: "PUT",
      body: dados,
    });
    setMsg(
      resposta.ok
        ? "Imagem salva com sucesso."
        : `Não foi possível salvar: ${await resposta.text()}`,
    );
    if (resposta.ok) atualizarVersao();
  }

  async function remover(chave: string) {
    const resposta = await fetch(`/api/admin/identidade-visual/${chave}`, {
      method: "DELETE",
    });
    setMsg(
      resposta.ok
        ? "Imagem padrão restaurada."
        : "Não foi possível restaurar.",
    );
    if (resposta.ok) atualizarVersao();
  }

  return (
    <section className="rounded-xl border border-ink-200 bg-white p-6">
      <div className="mb-5 flex items-center gap-2">
        <ImageUp className="size-5 text-gold-600" aria-hidden="true" />
        <div>
          <h2 className="title-display text-xl text-ink-900">Identidade visual</h2>
          <p className="mt-1 text-sm text-ink-600">
            Logos e brasões independentes para claro e escuro. PNG, JPG, WebP ou SVG, até 3 MB.
          </p>
        </div>
      </div>

      {msg ? (
        <p className="mb-4 rounded-md border border-ink-200 bg-ink-050 px-3 py-2 text-sm" role="status" aria-live="polite">
          {msg}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {itens.map(([chave, label]) => {
          const src = `/api/identidade-visual/${chave}${versao ? `?v=${versao}` : ""}`;
          return (
            <div key={chave} className="rounded-lg border border-ink-200 p-4">
              <p className="mb-3 text-sm font-bold">{label}</p>
              <div className="mb-3 flex h-28 items-center justify-center rounded border border-dashed bg-ink-050">
                <img
                  src={src}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = "block";
                  }}
                  alt={label}
                  className="max-h-24 max-w-full object-contain"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer rounded bg-gold-500 px-3 py-2 text-xs font-bold text-ink-950 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold-600">
                  Selecionar imagem
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(event) => {
                      const arquivo = event.target.files?.[0];
                      if (arquivo) void upload(chave, arquivo);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void remover(chave)}
                  className="inline-flex items-center gap-1 rounded border px-3 py-2 text-xs font-bold"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  Restaurar padrão
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
