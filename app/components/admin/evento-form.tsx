"use client";

import { useActionState, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { salvarEvento } from "@/lib/actions/eventos";
import { ESTADO_INICIAL } from "@/lib/actions/estado";
import { EditorRico } from "@/components/admin/editor-rico";
import {
  Area,
  AvisoErro,
  BotaoSalvar,
  Campo,
  CampoImagem,
  EscolhaStatus,
  Selecao,
} from "@/components/admin/campos";
import type { Evento } from "@/lib/data/types";

const CATEGORIAS = [
  "Formação",
  "Seminário",
  "Capacitação",
  "Solenidade",
  "Encontro",
  "Institucional",
] as const;

const MODALIDADES = [
  "Selecione a modalidade",
  "Presencial",
  "Online",
  "Híbrido",
] as const;

const hoje = () => new Date().toISOString().slice(0, 10);

const CLASSE_CAMPO_DATA =
  "mt-1.5 w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-gold-500";

export function EventoForm({ evento }: { evento?: Evento }) {
  const [estado, acao] = useActionState(salvarEvento, ESTADO_INICIAL);
  const dataFimRef = useRef<HTMLInputElement>(null);

  const valor = (campo: string, padrao = "") =>
    estado.valores?.[campo] ??
    ((evento?.[campo as keyof Evento] as string | null | undefined) ?? padrao);

  const dataInicio = valor("dataInicio", hoje());
  const dataFim = valor("dataFim");

  function aoAlterarInicio(event: React.ChangeEvent<HTMLInputElement>) {
    const fim = dataFimRef.current;
    if (!fim) return;

    fim.min = event.currentTarget.value;

    // A data de término é opcional. Se já houver uma data anterior ao novo
    // início, limpamos o campo para não manter o formulário em estado inválido.
    if (fim.value && event.currentTarget.value && fim.value < event.currentTarget.value) {
      fim.value = "";
      fim.setCustomValidity("");
    }
  }

  function aoAlterarFim(event: React.ChangeEvent<HTMLInputElement>) {
    const inicio = event.currentTarget.form?.elements.namedItem("dataInicio");
    const valorInicio = inicio instanceof HTMLInputElement ? inicio.value : "";

    if (event.currentTarget.value && valorInicio && event.currentTarget.value < valorInicio) {
      event.currentTarget.setCustomValidity("A data de término não pode ser anterior à data de início.");
    } else {
      event.currentTarget.setCustomValidity("");
    }
  }

  function sincronizarEditor(event: React.FormEvent<HTMLFormElement>) {
    const formulario = event.currentTarget;
    const editor = formulario.querySelector<HTMLElement>(
      '[contenteditable="true"][aria-label="Programação e detalhes"]',
    );
    const campoConteudo = formulario.querySelector<HTMLInputElement>(
      'input[type="hidden"][name="conteudo"]',
    );

    if (editor && campoConteudo) {
      const vazio = editor.textContent?.trim() === "" && !editor.querySelector("img");
      campoConteudo.value = vazio ? "" : editor.innerHTML;
    }
  }

  return (
    <form
      action={acao}
      onSubmitCapture={sincronizarEditor}
      className="admin-form-surface space-y-7 rounded-xl border border-ink-200 bg-white p-6"
    >
      {evento ? <input type="hidden" name="id" value={evento.id} /> : null}

      <AvisoErro mensagem={estado.erro} />

      <Campo
        name="titulo"
        rotulo="Título do evento"
        obrigatorio
        defaultValue={valor("titulo")}
        erro={estado.campos?.titulo}
        placeholder="Seminário de Inteligência Prisional"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="evento-data-inicio" className="block text-sm font-semibold text-ink-900">
            Data de início <span className="ml-1 text-gold-600">*</span>
          </label>
          <input
            id="evento-data-inicio"
            name="dataInicio"
            type="date"
            required
            defaultValue={dataInicio}
            onChange={aoAlterarInicio}
            aria-invalid={estado.campos?.dataInicio ? true : undefined}
            className={`${CLASSE_CAMPO_DATA} ${estado.campos?.dataInicio ? "border-red-400" : ""}`}
          />
          {estado.campos?.dataInicio ? (
            <p className="mt-1.5 text-xs font-semibold text-red-600">{estado.campos.dataInicio}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="evento-data-fim" className="block text-sm font-semibold text-ink-900">
            Data de término
          </label>
          <input
            ref={dataFimRef}
            id="evento-data-fim"
            name="dataFim"
            type="date"
            defaultValue={dataFim}
            min={dataInicio}
            onChange={aoAlterarFim}
            aria-invalid={estado.campos?.dataFim ? true : undefined}
            className={`${CLASSE_CAMPO_DATA} ${estado.campos?.dataFim ? "border-red-400" : ""}`}
          />
          {estado.campos?.dataFim ? (
            <p className="mt-1.5 text-xs font-semibold text-red-600">{estado.campos.dataFim}</p>
          ) : (
            <p className="mt-1.5 text-xs text-ink-500">
              Preencha apenas se o evento durar mais de um dia.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          name="horario"
          rotulo="Horário"
          defaultValue={valor("horario")}
          erro={estado.campos?.horario}
          placeholder="8h30 às 17h"
        />
        <Selecao
          name="modalidade"
          rotulo="Modalidade"
          obrigatorio
          opcoes={MODALIDADES}
          defaultValue={valor("modalidade", "Selecione a modalidade")}
          erro={estado.campos?.modalidade}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          name="local"
          rotulo="Local"
          obrigatorio
          defaultValue={valor("local")}
          erro={estado.campos?.local}
          placeholder="Auditório da ESPP — Goiânia/GO"
        />
        <Selecao
          name="categoria"
          rotulo="Categoria"
          obrigatorio
          opcoes={CATEGORIAS}
          defaultValue={valor("categoria", "Formação")}
          erro={estado.campos?.categoria}
        />
      </div>

      <Campo
        name="inscricaoHref"
        rotulo="Link de inscrição"
        type="url"
        defaultValue={valor("inscricaoHref")}
        erro={estado.campos?.inscricaoHref}
      />

      <Area
        name="resumo"
        rotulo="Resumo"
        linhas={3}
        defaultValue={valor("resumo")}
        erro={estado.campos?.resumo}
      />

      <CampoImagem
        imagemAtual={evento?.imagem ?? null}
        erroArquivo={estado.campos?.imagemArquivo}
        erroAlt={estado.campos?.imagemAlt}
      />

      <EditorRico
        name="conteudo"
        rotulo="Programação e detalhes"
        valorInicial={evento?.conteudo ?? ""}
        erro={estado.campos?.conteudo}
      />

      <EscolhaStatus defaultValue={evento?.status ?? "rascunho"} />

      <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6">
        <BotaoSalvar>{evento ? "Salvar alterações" : "Criar evento"}</BotaoSalvar>
        <Link
          href="/admin/eventos"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-ink-300 bg-transparent px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-050"
        >
          <X className="size-4" />
          <span>Cancelar</span>
        </Link>
        {evento?.status === "publicado" ? (
          <Link
            href={`/eventos/${evento.slug}`}
            target="_blank"
            className="ml-auto text-xs font-semibold text-gov-blue underline underline-offset-4"
          >
            Ver no site público
          </Link>
        ) : null}
      </div>
    </form>
  );
}
