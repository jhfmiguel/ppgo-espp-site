import { NextResponse } from "next/server";

const API_URL = (process.env.ESPP_API_URL ?? "http://localhost:8081").replace(/\/$/, "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resposta = await fetch(`${API_URL}/api/v1/public/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ...body, origem: body.origem || "FORTIS" }),
      cache: "no-store",
    });

    if (!resposta.ok) {
      if (resposta.status === 409) {
        return NextResponse.json(
          { erro: "O e-mail informado já foi cadastrado anteriormente." },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { erro: "Não foi possível cadastrar o e-mail. Tente novamente." },
        { status: resposta.status },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { erro: "Serviço temporariamente indisponível." },
      { status: 503 },
    );
  }
}