"use client";

import { useActionState } from "react";
import Link from "next/link";

import { X } from "lucide-react";

import { salvarNoticia } from "@/lib/actions/noticias";
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
} from "@/components/admin/campos";
import type { Noticia } from "@/lib/data/types";

const EDITORIAS = [
  "Formação",
  "Pós-graduação",
  "Institucional",
  "Tecnologia",
  "Eventos",
  "Parcerias",
] as const;

const hoje = () => new Date().toISOString().slice(0, 10);

export function NoticiaForm({ noticia }: { noticia?: Noticia }) {
  const [estado, acao] = useActionState(salvarNoticia, ESTADO_INICIAL);

  // Depois de um erro, o formulário é remontado: os valores rejeitados voltam
  // do estado da action para o usuário não perder o que digitou.
  const valor = (campo: keyof Noticia, padrao = "") =>
    estado.valores?.[campo] ?? (noticia?.[campo] as string | undefined) ?? padrao;

  return (
    <form action={acao} className="space-y-7">
      {noticia ? <input type="hidden" name="id" value={noticia.id} /> : null}

      <AvisoErro mensagem={estado.erro} />

      <Campo
        name="titulo"
        rotulo="Título"
        obrigatorio
        defaultValue={valor("titulo")}
        erro={estado.campos?.titulo}
        placeholder="ESPP abre inscrições para nova turma"
        ajuda="Aparece no card da listagem e no topo da notícia."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          name="data"
          rotulo="Data de publicação"
          type="date"
          obrigatorio
          defaultValue={valor("data", hoje())}
          erro={estado.campos?.data}
        />
        <CampoSugerido
          name="categoria"
          rotulo="Editoria"
          obrigatorio
          sugestoes={EDITORIAS}
          defaultValue={valor("categoria")}
          erro={estado.campos?.categoria}
          placeholder="Formação"
        />
      </div>

      <Area
        name="resumo"
        rotulo="Resumo"
        linhas={3}
        defaultValue={valor("resumo")}
        erro={estado.campos?.resumo}
        placeholder="Uma ou duas frases que resumem a notícia."
        ajuda="Exibido nos cards e na busca. Se ficar em branco, usamos o início do texto."
      />

      <CampoImagem
        imagemAtual={noticia?.imagem ?? null}
        erroArquivo={estado.campos?.imagemArquivo}
        erroAlt={estado.campos?.imagemAlt}
      />

      <EditorRico
        name="conteudo"
        rotulo="Corpo da notícia"
        valorInicial={noticia?.conteudo ?? ""}
        erro={estado.campos?.conteudo}
        descricao="Use a barra para formatar o texto e inserir imagens dentro da notícia."
      />

      <EscolhaStatus defaultValue={noticia?.status ?? "rascunho"} />

      <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6">
        <BotaoSalvar>{noticia ? "Salvar alterações" : "Criar notícia"}</BotaoSalvar>
      <Link
        href="/admin/noticias"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-1.5 transition-colors text-white hover:bg-blue-700"
      >
        <X className="size-4" aria-hidden="true" />
        <span>Cancelar</span>
      </Link>
        {noticia?.status === "publicado" ? (
          <Link
            href={`/noticias/${noticia.slug}`}
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
