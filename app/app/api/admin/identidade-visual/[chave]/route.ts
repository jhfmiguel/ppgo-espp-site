import { exigirPermissao } from "@/lib/auth/dal";

const API = (process.env.ESPP_API_URL ?? "http://localhost:8081").replace(/\/$/, "");

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ chave: string }> },
) {
  await exigirPermissao("configuracoes");
  const { chave } = await params;
  const resposta = await fetch(
    `${API}/api/v1/admin/configuracoes/identidade-visual/${encodeURIComponent(chave)}`,
    { method: "PUT", body: await req.formData() },
  );
  return new Response(await resposta.text(), {
    status: resposta.status,
    headers: {
      "content-type": resposta.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ chave: string }> },
) {
  await exigirPermissao("configuracoes");
  const { chave } = await params;
  const resposta = await fetch(
    `${API}/api/v1/admin/configuracoes/identidade-visual/${encodeURIComponent(chave)}`,
    { method: "DELETE" },
  );
  return new Response(null, { status: resposta.status });
}
