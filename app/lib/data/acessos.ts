const API_URL = (process.env.ESPP_API_URL ?? "http://localhost:8081").replace(/\/$/, "");

export type PerfilAcesso = "ADMIN" | "COMUNICACAO";
export type UsuarioAutorizado = {
  id: string;
  identificadorInstitucional: string;
  nome: string | null;
  perfil: PerfilAcesso;
  ativo: boolean;
};

export async function listarAcessos(): Promise<UsuarioAutorizado[]> {
  const resposta = await fetch(`${API_URL}/api/v1/admin/usuarios-autorizados`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os acessos autorizados.");
  }
  return resposta.json() as Promise<UsuarioAutorizado[]>;
}
