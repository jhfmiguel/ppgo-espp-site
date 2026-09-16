"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { exigirPermissao } from "@/lib/auth/dal";
import { atualizarAto, buscarAto, criarAto, excluirAto } from "@/lib/data/store";
import { salvarArquivo } from "@/lib/uploads";
import type { EstadoForm } from "@/lib/actions/estado";
import type { Anexo, SituacaoAto, Status } from "@/lib/data/types";

/**
 * Server Actions dos atos normativos — restritas ao perfil administrador
 * (ver `PERMISSOES` em `lib/auth/users.ts`).
 */

function revalidarAtos() {
  revalidatePath("/admin/atos-normativos");
  revalidatePath("/atos-normativos");
  revalidatePath("/");
}

const DATA_VALIDA = /^\d{4}-\d{2}-\d{2}$/;

const SITUACOES: SituacaoAto[] = ["Vigente", "Revogado", "Encerrado"];

type CamposAto = {
  tipo: string;
  numero: string;
  titulo: string;
  ementa: string;
  situacao: SituacaoAto;
  data: string;
  href: string;
  anexo: Anexo | null;
  status: Status;
};

async function lerFormulario(
  formData: FormData,
  anexoAtual: Anexo | null,
): Promise<{ dados: CamposAto } | { estado: EstadoForm }> {
  const tipo = String(formData.get("tipo") ?? "").trim();
  const numero = String(formData.get("numero") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const ementa = String(formData.get("ementa") ?? "").trim();
  const data = String(formData.get("data") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();

  const situacaoBruta = String(formData.get("situacao") ?? "");
  const situacao = SITUACOES.includes(situacaoBruta as SituacaoAto)
    ? (situacaoBruta as SituacaoAto)
    : "Vigente";
  const status: Status =
    formData.get("status") === "publicado" ? "publicado" : "rascunho";

  const valores = { tipo, numero, titulo, ementa, data, href };
  const campos: Record<string, string> = {};

  if (!tipo) campos.tipo = "Informe o tipo do ato.";
  if (!numero) campos.numero = "Informe a identificação oficial do ato.";
  if (titulo.length < 5) campos.titulo = "O título precisa ter ao menos 5 caracteres.";
  if (ementa.length < 10) campos.ementa = "Escreva a ementa do ato.";
  if (!DATA_VALIDA.test(data)) campos.data = "Informe a data do ato.";
  if (href && !/^https?:\/\//i.test(href)) {
    campos.href = "O link deve começar com http:// ou https://.";
  }

  // Anexo em PDF: o painel aceita tanto o arquivo quanto só o link da fonte.
  let anexo = anexoAtual;
  const arquivo = formData.get("anexoArquivo");

  if (formData.get("removerAnexo") === "1") {
    anexo = null;
  } else if (arquivo instanceof File && arquivo.size > 0) {
    const envio = await salvarArquivo(arquivo, "documento");
    if (!envio.ok) {
      campos.anexoArquivo = envio.erro;
    } else {
      anexo = { nome: envio.nome, url: envio.url, tamanho: envio.tamanho };
    }
  }

  if (!href && !anexo) {
    campos.anexoArquivo = "Anexe o PDF do ato ou informe o link da fonte oficial.";
  }

  if (Object.keys(campos).length > 0) {
    return { estado: { campos, valores, erro: "Verifique os campos destacados." } };
  }

  return {
    dados: { tipo, numero, titulo, ementa, situacao, data, href, anexo, status },
  };
}

export async function salvarAto(
  _estado: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const usuario = await exigirPermissao("atosNormativos");

  const id = String(formData.get("id") ?? "").trim();
  const existente = id ? await buscarAto(id) : null;
  if (id && !existente) return { erro: "Ato normativo não encontrado." };

  const resultado = await lerFormulario(formData, existente?.anexo ?? null);
  if ("estado" in resultado) return resultado.estado;

  if (existente) {
    await atualizarAto(existente.id, resultado.dados);
  } else {
    await criarAto({ ...resultado.dados, autor: usuario.nome });
  }

  revalidarAtos();
  redirect("/admin/atos-normativos?ok=" + (existente ? "atualizado" : "criado"));
}

export async function removerAto(formData: FormData) {
  await exigirPermissao("atosNormativos");

  const id = String(formData.get("id") ?? "");
  if (!(await buscarAto(id))) redirect("/admin/atos-normativos?erro=nao-encontrado");

  await excluirAto(id);
  revalidarAtos();
  redirect("/admin/atos-normativos?ok=excluido");
}

export async function alternarStatusAto(formData: FormData) {
  await exigirPermissao("atosNormativos");

  const id = String(formData.get("id") ?? "");
  const ato = await buscarAto(id);
  if (!ato) redirect("/admin/atos-normativos?erro=nao-encontrado");

  const status: Status = ato.status === "publicado" ? "rascunho" : "publicado";
  await atualizarAto(id, { status });
  revalidarAtos();
  redirect(
    `/admin/atos-normativos?ok=${status === "publicado" ? "publicado" : "despublicado"}`,
  );
}
