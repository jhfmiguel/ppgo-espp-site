import { NextRequest, NextResponse } from "next/server";

import { urlLoginSsp } from "@/lib/auth/ssp";

function destinoSeguro(valor: string | null) {
  if (!valor || !valor.startsWith("/admin") || valor.startsWith("//")) return "/admin";
  return valor === "/admin/login" ? "/admin" : valor;
}

export async function GET(request: NextRequest) {
  const proximo = destinoSeguro(request.nextUrl.searchParams.get("proximo"));
  const destino = urlLoginSsp(proximo);

  if (!destino) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("ssp", "indisponivel");
    if (proximo !== "/admin") login.searchParams.set("proximo", proximo);
    return NextResponse.redirect(login);
  }

  return NextResponse.redirect(destino);
}
