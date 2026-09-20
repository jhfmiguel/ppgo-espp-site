"use client";

import { useActionState, useId, useState } from "react";
import Link from "next/link";
import { FileText, Save, Trash2, Upload, X } from "lucide-react";

import { salvarAto } from "@/lib/actions/atos";
import { ESTADO_INICIAL } from "@/lib/actions/estado";
import {
  Area,
  AvisoErro,
  BotaoSalvar,
  Campo,
  EscolhaStatus,
  Selecao,
} from "@/components/admin/campos";
import {
  ACCEPT_DOCUMENTO,
  erroDeTamanho,
  formatarTamanho,
  TAMANHO_MAXIMO_ARQUIVO,
} from "@/lib/limites";
import type { AtoNormativo } from "@/lib/data/types";

const TIPOS = [
  "Portaria",
  "Edital",
  "Instrução Normativa",
  "Resolução",
  "Ato Normativo Conjunto",
  "Decreto",
] as const;

const SITUACOES = ["Vigente", "Revogado", "Encerrado"] as const;

const hoje = () => new Date().toISOString().slice(0, 10);

/** Anexo em PDF do ato: envio, pré-visualização do arquivo atual e remoção. */
function CampoAnexo({
  anexoAtual,
  erro,
}: {
  anexoAtual: AtoNormativo["anexo"];
  erro?: string;
}) {
  const id = useId();
  const [removido, setRemovido] = useState(false);
  const [novoNome, setNovoNome] = useState<string | null>(null);
  const [erroLocal, setErroLocal] = useState<string | null>(null);

  /** Ver a nota sobre `bodySizeLimit` em `lib/limites.ts`. */
  function aoEscolher(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) {
      setNovoNome(null);
      return;
    }
    const excedeu = erroDeTamanho(arquivo.size);
    if (excedeu) {
      evento.target.value = "";
      setNovoNome(null);
      setErroLocal(excedeu);
      return;
    }
    setErroLocal(null);
    setNovoNome(arquivo.name);
  }

  return (
    <fieldset className="rounded-lg border border-ink-200 bg-ink-050/40 p-4">
      <legend className="px-1 text-sm font-semibold text-ink-900">Arquivo do ato (PDF)</legend>
      <p className="text-xs text-ink-500">
        Anexe o PDF do ato para que ele fique disponível para download na página pública. Se o ato já
        estiver publicado na Casa Civil, o link da fonte oficial acima é suficiente.
      </p>

      {anexoAtual && !removido && !novoNome ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-md border border-ink-200 bg-white px-3 py-2.5">
          <FileText className="size-5 shrink-0 text-gold-600" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <a
              href={anexoAtual.url}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-sm font-semibold text-ink-900 underline underline-offset-4"
            >
              {anexoAtual.nome}
            </a>
            <span className="text-xs text-ink-500">{formatarTamanho(anexoAtual.tamanho)}</span>
          </span>
          <button
            type="button"
            onClick={() => setRemovido(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-ink-200 px-2.5 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:border-red-300 hover:text-red-600"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Remover
          </button>
        </div>
      ) : null}

      {removido ? <input type="hidden" name="removerAnexo" value="1" /> : null}

      <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-ink-300 bg-white px-3 py-2.5">
        <Upload className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
        <input
          id={id}
          name="anexoArquivo"
          type="file"
          accept={ACCEPT_DOCUMENTO}
          aria-label="Enviar PDF do ato normativo"
          onChange={aoEscolher}
          className="min-w-0 flex-1 text-xs text-ink-600 file:mr-3 file:rounded file:border-0 file:bg-ink-100 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-ink-800"
        />
      </div>

      {erroLocal || erro ? (
        <p className="mt-1.5 text-xs font-semibold text-red-600" role="alert">
          {erroLocal ?? erro}
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-ink-500">
          Somente PDF, até {formatarTamanho(TAMANHO_MAXIMO_ARQUIVO)}.
        </p>
      )}
    </fieldset>
  );
}

export function AtoForm({ ato }: { ato?: AtoNormativo }) {
  const [estado, acao] = useActionState(salvarAto, ESTADO_INICIAL);

 const valor = (campo: string, padrao = "") =>
  estado.valores?.[campo] ??
  (ato?.[campo as keyof AtoNormativo] as string | undefined) ??
  padrao;

  return (
    <form action={acao} className="space-y-7">
      {ato ? <input type="hidden" name="id" value={ato.id} /> : null}

      <AvisoErro mensagem={estado.erro} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Selecao
          name="tipo"
          rotulo="Tipo do ato"
          opcoes={TIPOS}
          defaultValue={valor("tipo", "Portaria")}
        />
        <Selecao
          name="situacao"
          rotulo="Situação"
          opcoes={SITUACOES}
          defaultValue={ato?.situacao ?? "Vigente"}
        />
      </div>

      <Campo
        name="numero"
        rotulo="Identificação oficial"
        obrigatorio
        defaultValue={valor("numero")}
        erro={estado.campos?.numero}
        placeholder="Portaria DGPP nº 285, de 01 de setembro de 2026"
        ajuda="Como o ato é citado oficialmente, com número e data por extenso."
      />

      <Campo
        name="titulo"
        rotulo="Título"
        obrigatorio
        defaultValue={valor("titulo")}
        erro={estado.campos?.titulo}
        placeholder="Aprova o Regimento Interno da ESPP"
        ajuda="Uma linha curta que identifica o assunto do ato."
      />

      <Area
        name="ementa"
        rotulo="Ementa"
        obrigatorio
        linhas={4}
        defaultValue={valor("ementa")}
        erro={estado.campos?.ementa}
        placeholder="Aprova o Regimento Interno da Escola Superior de Polícia Penal e revoga…"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          name="data"
          rotulo="Data do ato"
          type="date"
          obrigatorio
          defaultValue={valor("data", hoje())}
          erro={estado.campos?.data}
          ajuda="O ano da listagem é derivado desta data."
        />
        <Campo
          name="href"
          rotulo="Link da fonte oficial"
          type="url"
          defaultValue={valor("href")}
          erro={estado.campos?.href}
          placeholder="https://legisla.casacivil.go.gov.br/…"
        />
      </div>

      <CampoAnexo anexoAtual={ato?.anexo ?? null} erro={estado.campos?.anexoArquivo} />

      <EscolhaStatus defaultValue={ato?.status ?? "publicado"} />

      <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6">
        <BotaoSalvar>{ato ? "Salvar alterações" : "Cadastrar ato"}</BotaoSalvar>
      <Link
        href="/admin/atos-normativos"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-1.5 transition-colors text-white hover:bg-blue-700"
      >
        <X className="size-4" aria-hidden="true" />
        <span>Cancelar</span>
      </Link>
      </div>
    </form>
  );
}
