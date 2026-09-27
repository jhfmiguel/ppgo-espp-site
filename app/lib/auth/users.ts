import type { Sessao } from "@/lib/auth/session";

export type Perfil = "comunicacao" | "admin";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  cargo: string;
};

export const ROTULO_PERFIL: Record<Perfil, string> = {
  comunicacao: "Comunicação",
  admin: "Administrador",
};

export const PERMISSOES = {
  noticias: ["comunicacao", "admin"],
  eventos: ["comunicacao", "admin"],
  mensagens: ["comunicacao", "admin"],
  newsletter: ["comunicacao", "admin"],
  atosNormativos: ["admin"],
  auditoria: ["admin"],
  configuracoes: ["admin"],
} as const satisfies Record<string, readonly Perfil[]>;

export type Recurso = keyof typeof PERMISSOES;

export function podeGerenciar(perfil: Perfil, recurso: Recurso) {
  return (PERMISSOES[recurso] as readonly Perfil[]).includes(perfil);
}

function usuarioLocal(): Usuario | null {
  if (process.env.NODE_ENV === "production") return null;
  if (process.env.ESPP_AUTH_MODE?.trim().toLowerCase() !== "local") return null;
  const usuario = process.env.ESPP_TEST_ADMIN_USER?.trim();
  if (!usuario) return null;
  return { id: "local-admin-test", nome: "Administrador de Teste", email: usuario, perfil: "admin", cargo: "Administrador local de desenvolvimento" };
}

export function usuarioDaSessaoSsp(sessao: Sessao): Usuario | null {
  if (sessao.provedor !== "ssp" || !sessao.nome || !sessao.email || !sessao.perfil) return null;
  if (sessao.perfil !== "admin" && sessao.perfil !== "comunicacao") return null;
  return {
    id: sessao.userId.replace(/^ssp:/, ""),
    nome: sessao.nome,
    email: sessao.email,
    perfil: sessao.perfil,
    cargo: sessao.cargo?.trim() || "Servidor autorizado",
  };
}

export async function buscarUsuario(id: string, sessao?: Sessao): Promise<Usuario | null> {
  if (sessao) {
    const institucional = usuarioDaSessaoSsp(sessao);
    if (institucional && (`ssp:${institucional.id}` === id || institucional.id === id)) return institucional;
  }
  const local = usuarioLocal();
  return local?.id === id ? local : null;
}
