"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { exigirPermissao } from "@/lib/auth/dal";
import { atualizarEvento, buscarEvento, criarEvento, excluirEvento } from "@/lib/data/store";
import { sanitizarHtml, textoDeHtml } from "@/lib/sanitize";
import { salvarArquivo } from "@/lib/uploads";
import type { EstadoForm } from "@/lib/actions/estado";
import type { Imagem, ModalidadeEvento, Status } from "@/lib/data/types";

/** Server Actions da agenda de eventos — disponíveis aos dois perfis. */

function revalidarEventos(slug?: string) {
  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  revalidatePath("/");
  if (slug) revalidatePath(`/eventos/${slug}`);
}

const DATA_VALIDA = /^\d{4}-\d{2}-\d{2}$/;

const MODALIDADES: ModalidadeEvento[] = ["Presencial", "Online", "Híbrido"];

type CamposEvento = {
  titulo: string;
  dataInicio: string;
  dataFim: string | null;
  horario: string;
  local: string;
  modalidade: ModalidadeEvento;
  categoria: string;
  resumo: string;
  conteudo: string;
  inscricaoHref: string;
  status: Status;
  imagem: Imagem | null;
};

async function lerFormulario(
  formData: FormData,
  imagemAtual: Imagem | null,
): Promise<{ dados: CamposEvento } | { estado: EstadoForm }> {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const dataInicio = String(formData.get("dataInicio") ?? "").trim();
  const dataFimBruta = String(formData.get("dataFim") ?? "").trim();
  const horario = String(formData.get("horario") ?? "").trim();
  const local = String(formData.get("local") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const resumoBruto = String(formData.get("resumo") ?? "").trim();
  const inscricaoHref = String(formData.get("inscricaoHref") ?? "").trim();
  const conteudo = sanitizarHtml(String(formData.get("conteudo") ?? ""));

  const modalidadeBruta = String(formData.get("modalidade") ?? "");
  const modalidade = MODALIDADES.includes(modalidadeBruta as ModalidadeEvento)
    ? (modalidadeBruta as ModalidadeEvento)
    : "Presencial";
  const status: Status =
    formData.get("status") === "publicado" ? "publicado" : "rascunho";

  const valores = {
    titulo,
    dataInicio,
    dataFim: dataFimBruta,
    horario,
    local,
    categoria,
    resumo: resumoBruto,
    inscricaoHref,
  };
  const campos: Record<string, string> = {};

  if (titulo.length < 5) campos.titulo = "O título precisa ter ao menos 5 caracteres.";
  if (!DATA_VALIDA.test(dataInicio)) campos.dataInicio = "Informe a data de início.";
  if (dataFimBruta && !DATA_VALIDA.test(dataFimBruta)) {
    campos.dataFim = "Data de término inválida.";
  }
  if (dataFimBruta && DATA_VALIDA.test(dataInicio) && dataFimBruta < dataInicio) {
    campos.dataFim = "O término não pode ser anterior ao início.";
  }
  if (!local) campos.local = "Informe o local ou a plataforma do evento.";
  if (!categoria) campos.categoria = "Informe a categoria do evento.";
  if (inscricaoHref && !/^https?:\/\//i.test(inscricaoHref)) {
    campos.inscricaoHref = "O link de inscrição deve começar com http:// ou https://.";
  }

  const resumo = resumoBruto || `${textoDeHtml(conteudo).slice(0, 180)}…`;

  let imagem = imagemAtual;
  const alt = String(formData.get("imagemAlt") ?? "").trim();
  const urlDigitada = String(formData.get("imagemUrl") ?? "").trim();
  const arquivo = formData.get("imagemArquivo");

  if (formData.get("removerImagem") === "1") {
    imagem = null;
  } else if (arquivo instanceof File && arquivo.size > 0) {
    const envio = await salvarArquivo(arquivo, "imagem");
    if (!envio.ok) {
      campos.imagemArquivo = envio.erro;
    } else {
      imagem = { src: envio.url, alt: alt || titulo };
    }
  } else if (urlDigitada) {
    imagem = { src: urlDigitada, alt: alt || titulo };
  } else if (imagem && alt) {
    imagem = { ...imagem, alt };
  }

  if (imagem && !imagem.alt) {
    campos.imagemAlt = "Descreva a imagem para leitores de tela.";
  }

  if (Object.keys(campos).length > 0) {
    return { estado: { campos, valores, erro: "Verifique os campos destacados." } };
  }

  return {
    dados: {
      titulo,
      dataInicio,
      dataFim: dataFimBruta || null,
      horario,
      local,
      modalidade,
      categoria,
      resumo,
      conteudo,
      inscricaoHref,
      status,
      imagem,
    },
  };
}

export async function salvarEvento(
  _estado: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const usuario = await exigirPermissao("eventos");

  const id = String(formData.get("id") ?? "").trim();
  const existente = id ? await buscarEvento(id) : null;
  if (id && !existente) return { erro: "Evento não encontrado." };

  const resultado = await lerFormulario(formData, existente?.imagem ?? null);
  if ("estado" in resultado) return resultado.estado;

  const salvo = existente
    ? await atualizarEvento(existente.id, resultado.dados)
    : await criarEvento({ ...resultado.dados, autor: usuario.nome });

  revalidarEventos(salvo?.slug);
  if (existente && existente.slug !== salvo?.slug) revalidarEventos(existente.slug);

  redirect("/admin/eventos?ok=" + (existente ? "atualizado" : "criado"));
}

export async function removerEvento(formData: FormData) {
  await exigirPermissao("eventos");

  const id = String(formData.get("id") ?? "");
  const evento = await buscarEvento(id);
  if (!evento) redirect("/admin/eventos?erro=nao-encontrado");

  await excluirEvento(id);
  revalidarEventos(evento.slug);
  redirect("/admin/eventos?ok=excluido");
}

export async function alternarStatusEvento(formData: FormData) {
  await exigirPermissao("eventos");

  const id = String(formData.get("id") ?? "");
  const evento = await buscarEvento(id);
  if (!evento) redirect("/admin/eventos?erro=nao-encontrado");

  const status: Status = evento.status === "publicado" ? "rascunho" : "publicado";
  await atualizarEvento(id, { status });
  revalidarEventos(evento.slug);
  redirect(`/admin/eventos?ok=${status === "publicado" ? "publicado" : "despublicado"}`);
}
