"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { exigirPermissao } from "@/lib/auth/dal";
import { atualizarNoticia, buscarNoticia, criarNoticia, excluirNoticia } from "@/lib/data/store";
import { sanitizarHtml, textoDeHtml } from "@/lib/sanitize";
import { salvarArquivo } from "@/lib/uploads";
import type { EstadoForm } from "@/lib/actions/estado";
import type { Imagem, Status } from "@/lib/data/types";

/**
 * Server Actions das notícias.
 *
 * Todas começam por `exigirPermissao("noticias")`: Server Actions são POSTs
 * alcançáveis diretamente, então a autorização é verificada aqui e não apenas
 * na navegação que levou ao formulário.
 */

/** Revalida o painel e as páginas públicas afetadas por uma notícia. */
function revalidarNoticias(slug?: string) {
  revalidatePath("/admin/noticias");
  revalidatePath("/noticias");
  revalidatePath("/");
  if (slug) revalidatePath(`/noticias/${slug}`);
}

const DATA_VALIDA = /^\d{4}-\d{2}-\d{2}$/;

type CamposNoticia = {
  titulo: string;
  data: string;
  categoria: string;
  resumo: string;
  conteudo: string;
  status: Status;
  imagem: Imagem | null;
};

/** Lê, valida e normaliza o formulário. Retorna erros por campo quando houver. */
async function lerFormulario(
  formData: FormData,
  imagemAtual: Imagem | null,
): Promise<{ dados: CamposNoticia } | { estado: EstadoForm }> {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const data = String(formData.get("data") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const resumoBruto = String(formData.get("resumo") ?? "").trim();
  const conteudo = sanitizarHtml(String(formData.get("conteudo") ?? ""));
  const status: Status =
    formData.get("status") === "publicado" ? "publicado" : "rascunho";

  const valores = { titulo, data, categoria, resumo: resumoBruto };
  const campos: Record<string, string> = {};

  if (titulo.length < 5) campos.titulo = "O título precisa ter ao menos 5 caracteres.";
  if (!DATA_VALIDA.test(data)) campos.data = "Informe a data de publicação.";
  if (!categoria) campos.categoria = "Informe a editoria da notícia.";
  if (!textoDeHtml(conteudo)) campos.conteudo = "Escreva o corpo da notícia.";

  // Resumo em branco é preenchido com o início do corpo já sanitizado.
  const resumo = resumoBruto || `${textoDeHtml(conteudo).slice(0, 180)}…`;

  // Capa: arquivo enviado tem prioridade sobre a URL digitada.
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
    dados: { titulo, data, categoria, resumo, conteudo, status, imagem },
  };
}

export async function salvarNoticia(
  _estado: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const usuario = await exigirPermissao("noticias");

  const id = String(formData.get("id") ?? "").trim();
  const existente = id ? await buscarNoticia(id) : null;
  if (id && !existente) return { erro: "Notícia não encontrada." };

  const resultado = await lerFormulario(formData, existente?.imagem ?? null);
  if ("estado" in resultado) return resultado.estado;

  const salva = existente
    ? await atualizarNoticia(existente.id, resultado.dados)
    : await criarNoticia({ ...resultado.dados, autor: usuario.nome });

  revalidarNoticias(salva?.slug);
  if (existente && existente.slug !== salva?.slug) revalidarNoticias(existente.slug);

  redirect("/admin/noticias?ok=" + (existente ? "atualizada" : "criada"));
}

export async function removerNoticia(formData: FormData) {
  await exigirPermissao("noticias");

  const id = String(formData.get("id") ?? "");
  const noticia = await buscarNoticia(id);
  if (!noticia) redirect("/admin/noticias?erro=nao-encontrada");

  await excluirNoticia(id);
  revalidarNoticias(noticia.slug);
  redirect("/admin/noticias?ok=excluida");
}

/** Alterna entre rascunho e publicado direto na listagem. */
export async function alternarStatusNoticia(formData: FormData) {
  await exigirPermissao("noticias");

  const id = String(formData.get("id") ?? "");
  const noticia = await buscarNoticia(id);
  if (!noticia) redirect("/admin/noticias?erro=nao-encontrada");

  const status: Status = noticia.status === "publicado" ? "rascunho" : "publicado";
  await atualizarNoticia(id, { status });
  revalidarNoticias(noticia.slug);
  redirect(`/admin/noticias?ok=${status === "publicado" ? "publicada" : "despublicada"}`);
}
