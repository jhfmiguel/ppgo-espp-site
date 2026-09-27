import { cache } from "react";
import { redirect } from "next/navigation";

import { lerSessao } from "@/lib/auth/session";
import { buscarUsuario, podeGerenciar, type Recurso, type Usuario } from "@/lib/auth/users";

/**
 * Camada central de autenticação e autorização do painel.
 * O cookie apenas identifica a sessão; a autorização efetiva continua aqui,
 * próxima dos dados e das Server Actions.
 */
export const obterUsuario = cache(async (): Promise<Usuario | null> => {
  const sessao = await lerSessao();
  if (!sessao) return null;
  return buscarUsuario(sessao.userId, sessao);
});

export async function exigirUsuario(destino?: string) {
  const usuario = await obterUsuario();
  if (!usuario) {
    const query = destino ? `?proximo=${encodeURIComponent(destino)}` : "";
    redirect(`/admin/login${query}`);
  }
  return usuario;
}

export async function exigirPermissao(recurso: Recurso) {
  const usuario = await exigirUsuario();
  if (!podeGerenciar(usuario.perfil, recurso)) redirect("/admin?erro=sem-permissao");
  return usuario;
}
