"use server";

import { redirect } from "next/navigation";

import { criarSessao, encerrarSessao } from "@/lib/auth/session";
import { autenticar } from "@/lib/auth/users";
import type { EstadoForm } from "@/lib/actions/estado";

/** Destino seguro pós-login: só caminhos internos do painel. */
function destinoSeguro(valor: string | null) {
  if (!valor || !valor.startsWith("/admin") || valor.startsWith("//")) {
    return "/admin";
  }
  return valor === "/admin/login" ? "/admin" : valor;
}

export async function entrar(
  _estado: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  const proximo = destinoSeguro(formData.get("proximo") as string | null);

  const campos: Record<string, string> = {};
  if (!email) campos.email = "Informe o e-mail institucional.";
  if (!senha) campos.senha = "Informe a senha.";
  if (Object.keys(campos).length > 0) {
    return { campos, valores: { email } };
  }

  const usuario = autenticar(email, senha);
  if (!usuario) {
    return { erro: "E-mail ou senha inválidos.", valores: { email } };
  }

  await criarSessao(usuario.id);
  redirect(proximo);
}

export async function sair() {
  await encerrarSessao();
  redirect("/admin/login");
}
