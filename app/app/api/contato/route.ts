import { NextResponse } from "next/server";

const API_URL = (process.env.ESPP_API_URL ?? "http://localhost:8081").replace(/\/$/, "");

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const multipart = contentType.includes("multipart/form-data");
    const body = multipart ? await request.formData() : await request.text();

    const resposta = await fetch(`${API_URL}/api/v1/public/contato`, {
      method: "POST",
      ...(multipart
        ? { body: body as FormData }
        : {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: body as string,
          }),
      cache: "no-store",
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text().catch(() => "");
      return NextResponse.json(
        { erro: detalhe || "Não foi possível registrar a mensagem." },
        { status: resposta.status },
      );
    }

    const mensagem = (await resposta.json()) as { protocolo: string };
    return NextResponse.json({ ok: true, protocolo: mensagem.protocolo }, { status: 201 });
  } catch {
    return NextResponse.json(
      { erro: "Serviço temporariamente indisponível." },
      { status: 503 },
    );
  }
}