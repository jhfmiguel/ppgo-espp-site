import { cache } from "react";
import { redirect } from "next/navigation";

import { lerSessao } from "@/lib/auth/session";
import { buscarUsuario, podeGerenciar, type Recurso, type Usuario } from "@/lib/auth/users";

/**
 * Camada de acesso a dados de autenticação (DAL).
 *
 * Toda página e Server Action do painel passa por aqui. O `proxy.ts` faz apenas
 * uma checagem otimista da presença do cookie; a verificação que vale é esta,
 * o mais perto possível dos dados — inclusive porque Server Actions são
 * alcançáveis por POST direto, sem passar pela navegação da interface.
 */

/** Sessão do usuário logado, ou `null`. Memoizada por render. */
export const obterUsuario = cache(async (): Promise<Usuario | null> => {
  const sessao = await lerSessao();
  if (!sessao) return null;
  return buscarUsuario(sessao.userId);
});

/** Exige um usuário autenticado; redireciona para o login caso contrário. */
export async function exigirUsuario(destino?: string) {
  const usuario = await obterUsuario();
  if (!usuario) {
    const query = destino ? `?proximo=${encodeURIComponent(destino)}` : "";
    redirect(`/admin/login${query}`);
  }
  return usuario;
}

/** Exige permissão sobre um recurso; redireciona para o painel caso não tenha. */
export async function exigirPermissao(recurso: Recurso) {
  const usuario = await exigirUsuario();
  if (!podeGerenciar(usuario.perfil, recurso)) {
    redirect("/admin?erro=sem-permissao");
  }
  return usuario;
}
