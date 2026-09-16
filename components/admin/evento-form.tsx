"use client";

import { useActionState } from "react";
import Link from "next/link";

import { salvarEvento } from "@/lib/actions/eventos";
import { ESTADO_INICIAL } from "@/lib/actions/estado";
import { EditorRico } from "@/components/admin/editor-rico";
import {
  Area,
  AvisoErro,
  BotaoSalvar,
  Campo,
  CampoImagem,
  CampoSugerido,
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

const MODALIDADES = ["Presencial", "Online", "Híbrido"] as const;

const hoje = () => new Date().toISOString().slice(0, 10);

export function EventoForm({ evento }: { evento?: Evento }) {
  const [estado, acao] = useActionState(salvarEvento, ESTADO_INICIAL);

  const valor = (campo: string, padrao = "") =>
    estado.valores?.[campo] ??
    ((evento?.[campo as keyof Evento] as string | null | undefined) ?? undefined) ??
    padrao;

  return (
    <form action={acao} className="space-y-7">
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
        <Campo
          name="dataInicio"
          rotulo="Data de início"
          type="date"
          obrigatorio
          defaultValue={valor("dataInicio", hoje())}
          erro={estado.campos?.dataInicio}
        />
        <Campo
          name="dataFim"
          rotulo="Data de término"
          type="date"
          defaultValue={valor("dataFim")}
          erro={estado.campos?.dataFim}
          ajuda="Preencha apenas se o evento durar mais de um dia."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          name="horario"
          rotulo="Horário"
          defaultValue={valor("horario")}
          erro={estado.campos?.horario}
          placeholder="8h30 às 17h"
          ajuda="Texto livre, como aparece na agenda."
        />
        <Selecao
          name="modalidade"
          rotulo="Modalidade"
          opcoes={MODALIDADES}
          defaultValue={evento?.modalidade ?? "Presencial"}
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
        <CampoSugerido
          name="categoria"
          rotulo="Categoria"
          obrigatorio
          sugestoes={CATEGORIAS}
          defaultValue={valor("categoria")}
          erro={estado.campos?.categoria}
          placeholder="Seminário"
        />
      </div>

      <Campo
        name="inscricaoHref"
        rotulo="Link de inscrição"
        type="url"
        defaultValue={valor("inscricaoHref")}
        erro={estado.campos?.inscricaoHref}
        placeholder="https://www.policiapenal.go.gov.br/"
        ajuda="Opcional. Exibe o botão “Inscreva-se” na página do evento."
      />

      <Area
        name="resumo"
        rotulo="Resumo"
        linhas={3}
        defaultValue={valor("resumo")}
        erro={estado.campos?.resumo}
        placeholder="Uma ou duas frases sobre o evento."
        ajuda="Exibido na agenda e nos cards da home."
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
        descricao="Programação, público-alvo, certificação e demais informações do evento."
      />

      <EscolhaStatus defaultValue={evento?.status ?? "rascunho"} />

      <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6">
        <BotaoSalvar>{evento ? "Salvar alterações" : "Criar evento"}</BotaoSalvar>
        <Link
          href="/admin/eventos"
          className="rounded-md px-4 py-2.5 text-xs font-bold tracking-wide text-ink-600 uppercase transition-colors hover:text-ink-900"
        >
          Cancelar
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
