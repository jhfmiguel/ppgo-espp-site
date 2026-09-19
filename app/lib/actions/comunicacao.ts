"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { exigirPermissao } from "@/lib/auth/dal";
import {
  atualizarAssinanteNewsletter,
  atualizarMensagemContato,
  atualizarMensagemContatoMultipart,
  excluirAssinanteNewsletter,
  excluirMensagemContato,
  criarCampanhaNewsletter,
  atualizarCampanhaNewsletter,
  enviarCampanhaNewsletter,
} from "@/lib/data/store";
import type { StatusMensagem, StatusNewsletter } from "@/lib/data/types";

const STATUS_MENSAGEM: StatusMensagem[] = [
  "NOVA",
  "LIDA",
  "EM_ATENDIMENTO",
  "RESPONDIDA",
  "ARQUIVADA",
];

const STATUS_NEWSLETTER: StatusNewsletter[] = [
  "ATIVO",
  "DESCADASTRADO",
  "BLOQUEADO",
];

export async function atualizarMensagem(formData: FormData) {
  const usuario = await exigirPermissao("mensagens");
  const id = String(formData.get("id") ?? "");
  const statusBruto = String(formData.get("status") ?? "");
  const resposta = String(formData.get("resposta") ?? "").trim();
  const notaInterna = String(formData.get("notaInterna") ?? "").trim();
  const responsavel = String(formData.get("responsavel") ?? usuario.nome).trim();
  const status = STATUS_MENSAGEM.includes(statusBruto as StatusMensagem)
    ? (statusBruto as StatusMensagem)
    : undefined;

  const payload = new FormData();
  if (status) payload.set("status", status);
  payload.set("responsavel", responsavel);
  if (resposta) payload.set("resposta", resposta);
  if (notaInterna) payload.set("notaInterna", notaInterna);
  payload.set("enviarEmail", formData.get("enviarEmail") === "on" ? "true" : "false");
  for (const arquivo of formData.getAll("anexos")) {
    if (arquivo instanceof File && arquivo.size > 0) payload.append("anexos", arquivo);
  }

  await atualizarMensagemContatoMultipart(id, payload);

  revalidatePath("/admin");
  revalidatePath("/admin/mensagens");
  revalidatePath(`/admin/mensagens/${id}`);
  redirect(`/admin/mensagens/${id}?ok=atualizado`);
}
export async function removerMensagem(formData: FormData) {
  await exigirPermissao("mensagens");
  const id = String(formData.get("id") ?? "");
  await excluirMensagemContato(id);
  revalidatePath("/admin");
  revalidatePath("/admin/mensagens");
  redirect("/admin/mensagens?ok=excluido");
}

export async function alterarStatusAssinante(formData: FormData) {
  await exigirPermissao("newsletter");
  const id = String(formData.get("id") ?? "");
  const bruto = String(formData.get("status") ?? "");
  if (!STATUS_NEWSLETTER.includes(bruto as StatusNewsletter)) {
    redirect("/admin/newsletter?erro=status-invalido");
  }

  await atualizarAssinanteNewsletter(id, bruto as StatusNewsletter);
  revalidatePath("/admin");
  revalidatePath("/admin/newsletter");
  redirect("/admin/newsletter?ok=atualizado");
}

export async function removerAssinante(formData: FormData) {
  await exigirPermissao("newsletter");
  const id = String(formData.get("id") ?? "");
  await excluirAssinanteNewsletter(id);
  revalidatePath("/admin");
  revalidatePath("/admin/newsletter");
  redirect("/admin/newsletter?ok=excluido");
}
export async function criarCampanha(formData:FormData){
  await exigirPermissao("newsletter");
  const assunto=String(formData.get("assunto")??"").trim();
  const conteudo=String(formData.get("conteudo")??"").trim();
  if(!assunto||!conteudo) redirect("/admin/newsletter/campanhas/nova?erro=campos-obrigatorios");
  const c=await criarCampanhaNewsletter(assunto,conteudo);
  revalidatePath("/admin/newsletter/campanhas");
  redirect(`/admin/newsletter/campanhas/${c.id}?ok=criada`);
}
export async function atualizarCampanha(formData:FormData){
  await exigirPermissao("newsletter");
  const id=String(formData.get("id")??"");
  const assunto=String(formData.get("assunto")??"").trim();
  const conteudo=String(formData.get("conteudo")??"").trim();
  if(!assunto||!conteudo) redirect(`/admin/newsletter/campanhas/${id}?erro=campos-obrigatorios`);
  await atualizarCampanhaNewsletter(id,assunto,conteudo);
  revalidatePath("/admin/newsletter/campanhas");
  revalidatePath(`/admin/newsletter/campanhas/${id}`);
  redirect(`/admin/newsletter/campanhas/${id}?ok=atualizada`);
}
export async function enviarCampanha(formData:FormData){
  await exigirPermissao("newsletter");
  const id=String(formData.get("id")??"");
  await enviarCampanhaNewsletter(id);
  revalidatePath("/admin/newsletter/campanhas");
  revalidatePath(`/admin/newsletter/campanhas/${id}`);
  redirect(`/admin/newsletter/campanhas/${id}?ok=enviada`);
}
