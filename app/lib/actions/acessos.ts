"use server";

import { revalidatePath } from "next/cache";
import { exigirPermissao } from "@/lib/auth/dal";

const API_URL = (process.env.ESPP_API_URL ?? "http://localhost:8081").replace(/\/$/, "");

async function enviar(caminho: string, method: string, body?: unknown) {
  const operador = await exigirPermissao("acessos");
  const resposta = await fetch(`${API_URL}${caminho}`, {
    method,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-ESPP-Usuario": operador.email,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!resposta.ok) {
    let mensagem = "Não foi possível concluir a operação.";
    try {
      const erro = await resposta.json();
      mensagem = erro.detail || erro.message || mensagem;
    } catch {}
    throw new Error(mensagem);
  }
  revalidatePath("/admin/acessos");
}

export async function salvarAcesso(form: FormData) {
  const id = String(form.get("id") || "").trim();
  const payload = {
    identificadorInstitucional: String(form.get("identificadorInstitucional") || "").trim(),
    nome: String(form.get("nome") || "").trim() || null,
    perfil: String(form.get("perfil") || "COMUNICACAO"),
    ativo: String(form.get("ativo") || "true") === "true",
  };
  if (!payload.identificadorInstitucional) {
    throw new Error("Informe o identificador institucional.");
  }
  await enviar(
    `/api/v1/admin/usuarios-autorizados${id ? `/${encodeURIComponent(id)}` : ""}`,
    id ? "PUT" : "POST",
    payload,
  );
}

export async function revogarAcesso(form: FormData) {
  const id = String(form.get("id") || "").trim();
  if (!id) throw new Error("Usuário inválido.");
  await enviar(`/api/v1/admin/usuarios-autorizados/${encodeURIComponent(id)}`, "DELETE");
}
