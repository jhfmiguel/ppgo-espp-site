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

export async function listarAuditoria(): Promise<AuditoriaAlteracao[]> {
  const resposta = await fetch(`${API_URL}/api/v1/admin/auditoria`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!resposta.ok) {
    throw new Error(`Falha ao consultar auditoria: HTTP ${resposta.status}`);
  }

  return resposta.json();
}
