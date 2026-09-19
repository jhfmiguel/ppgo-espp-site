import { NextResponse } from "next/server";

import { exigirPermissao } from "@/lib/auth/dal";

const API_URL = (process.env.ESPP_API_URL ?? "http://localhost:8081").replace(/\/$/, "");
const ADMIN_USER = process.env.ESPP_API_ADMIN_USER?.trim();
const ADMIN_PASSWORD = process.env.ESPP_API_ADMIN_PASSWORD;

function autorizacaoAdmin() {
  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    throw new Error("Credenciais administrativas da API ESPP nao configuradas.");
  }
  return `Basic ${Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString("base64")}`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string; anexoId: string }> },
) {
  await exigirPermissao("mensagens");

  try {
    const { id, anexoId } = await context.params;
    const resposta = await fetch(
      `${API_URL}/api/v1/admin/mensagens/${encodeURIComponent(id)}/anexos/${encodeURIComponent(anexoId)}`,
      {
        headers: { Authorization: autorizacaoAdmin() },
        cache: "no-store",
      },
    );

    if (!resposta.ok) {
      return new NextResponse(null, { status: resposta.status });
    }

    const headers = new Headers();
    for (const nome of ["content-type", "content-disposition", "content-length"]) {
      const valor = resposta.headers.get(nome);
      if (valor) headers.set(nome, valor);
    }
    headers.set("cache-control", "private, no-store");
    headers.set("x-content-type-options", "nosniff");

    return new NextResponse(await resposta.arrayBuffer(), {
      status: 200,
      headers,
    });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
