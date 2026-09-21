export type AuditoriaAlteracao = {
  id: string;
  modulo: string;
  acao: "CRIACAO" | "EDICAO" | "EXCLUSAO";
  entidadeId: string | null;
  titulo: string | null;
  usuario: string;
  dadosAntes: string | null;
  dadosDepois: string | null;
  criadoEm: string;
};

const API_URL = (process.env.ESPP_API_URL ?? "http://localhost:8081").replace(/\/$/, "");
const ADMIN_USER = process.env.ESPP_API_ADMIN_USER?.trim();
const ADMIN_PASSWORD = process.env.ESPP_API_ADMIN_PASSWORD;

function autorizacaoAdmin() {
  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    throw new Error("Credenciais técnicas da API não configuradas.");
  }
  return `Basic ${Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString("base64")}`;
}

export async function listarAuditoria(): Promise<AuditoriaAlteracao[]> {
  const resposta = await fetch(`${API_URL}/api/v1/admin/auditoria`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: autorizacaoAdmin(),
    },
  });

  if (!resposta.ok) {
    throw new Error(`Falha ao consultar auditoria: HTTP ${resposta.status}`);
  }

  return resposta.json();
}
