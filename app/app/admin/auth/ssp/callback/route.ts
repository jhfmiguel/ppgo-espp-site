import { NextRequest, NextResponse } from "next/server";

import { criarSessao } from "@/lib/auth/session";
import { trocarCodigoSsp } from "@/lib/auth/ssp";

function destinoSeguro(valor: string | null) {
  if (!valor || !valor.startsWith("/admin") || valor.startsWith("//")) return "/admin";
  return valor === "/admin/login" ? "/admin" : valor;
}

export async function GET(request: NextRequest) {
  const codigo = request.nextUrl.searchParams.get("code")?.trim();
  const proximo = destinoSeguro(request.nextUrl.searchParams.get("state"));

  if (!codigo) return NextResponse.redirect(new URL("/admin/login?ssp=retorno-invalido", request.url));

  const identidade = await trocarCodigoSsp(codigo);
  if (!identidade) return NextResponse.redirect(new URL("/admin/login?ssp=nao-integrado", request.url));

  await criarSessao(`ssp:${identidade.id}`, {
    provedor: "ssp",
    nome: identidade.nome,
    email: identidade.email,
    cargo: identidade.cargo,
    perfil: identidade.perfil,
  });

  return NextResponse.redirect(new URL(proximo, request.url));
}
