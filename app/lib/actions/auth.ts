"use server";

import { timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";

import { criarSessao, encerrarSessao } from "@/lib/auth/session";
import type { EstadoForm } from "@/lib/actions/estado";

function compararSeguro(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

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
  const usuario = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  const proximo = destinoSeguro(formData.get("proximo") as string | null);

  const campos: Record<string, string> = {};

  if (!usuario) {
    campos.email = "Informe o usuário.";
  }

  if (!senha) {
    campos.senha = "Informe a senha.";
  }

  if (Object.keys(campos).length > 0) {
    return { campos, valores: { email: usuario } };
  }

  const modo = process.env.ESPP_AUTH_MODE?.trim().toLowerCase();

  if (modo === "local") {
    if (process.env.NODE_ENV === "production") {
      return { erro: "Autenticação local desabilitada em produção." };
    }

    const esperadoUsuario = process.env.ESPP_TEST_ADMIN_USER?.trim() ?? "";
    const esperadaSenha = process.env.ESPP_TEST_ADMIN_PASSWORD ?? "";

    const credenciaisValidas =
      esperadoUsuario.length > 0 &&
      esperadaSenha.length > 0 &&
      compararSeguro(usuario, esperadoUsuario) &&
      compararSeguro(senha, esperadaSenha);

    if (!credenciaisValidas) {
      return {
        erro: "Usuário ou senha inválidos.",
        valores: { email: usuario },
      };
    }

    await criarSessao("local-admin-test");
    redirect(proximo);
  }

  return {
    erro:
      "A autenticação institucional da SSP ainda não está conectada neste ambiente.",
    valores: { email: usuario },
  };
}

export async function sair() {
  await encerrarSessao();
  redirect("/admin/login");
}