/**
 * Usuários do painel administrativo.
 *
 * Em produção, as credenciais são obrigatoriamente lidas de variáveis de
 * ambiente. Os valores locais existem apenas para facilitar desenvolvimento.
 * A integração futura com o diretório oficial deve substituir esta camada.
 */

export type Perfil = "comunicacao" | "admin";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
  cargo: string;
};

const PRODUCAO = process.env.NODE_ENV === "production";

function usuarioDeAmbiente(
  perfil: Perfil,
  padrao: { nome: string; email: string; senha: string; cargo: string },
): Usuario | null {
  const prefixo = perfil === "admin" ? "ESPP_ADMIN" : "ESPP_COMUNICACAO";
  const email = process.env[`${prefixo}_EMAIL`] ?? (PRODUCAO ? "" : padrao.email);
  const senha = process.env[`${prefixo}_PASSWORD`] ?? (PRODUCAO ? "" : padrao.senha);
  const nome = process.env[`${prefixo}_NAME`] ?? padrao.nome;

  if (!email || !senha) return null;

  return {
    id: perfil === "admin" ? "usr-admin" : "usr-comunicacao",
    nome,
    email,
    senha,
    perfil,
    cargo: padrao.cargo,
  };
}

export const USUARIOS: Usuario[] = [
  usuarioDeAmbiente("comunicacao", {
    nome: "Comunicação ESPP",
    email: "comunicacao@localhost",
    senha: "comunicacao-dev",
    cargo: "Assessoria de Comunicação da ESPP",
  }),
  usuarioDeAmbiente("admin", {
    nome: "Administrador ESPP",
    email: "admin@localhost",
    senha: "admin-dev",
    cargo: "Administração do portal da ESPP",
  }),
].filter((usuario): usuario is Usuario => usuario !== null);

export const ROTULO_PERFIL: Record<Perfil, string> = {
  comunicacao: "Comunicação",
  admin: "Administrador",
};

/** Recursos do painel e quais perfis podem gerenciá-los. */
export const PERMISSOES = {
  noticias: ["comunicacao", "admin"],
  eventos: ["comunicacao", "admin"],
  atosNormativos: ["admin"],
} as const satisfies Record<string, readonly Perfil[]>;

export type Recurso = keyof typeof PERMISSOES;

export function podeGerenciar(perfil: Perfil, recurso: Recurso) {
  return (PERMISSOES[recurso] as readonly Perfil[]).includes(perfil);
}

export function autenticar(email: string, senha: string) {
  const usuario = USUARIOS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!usuario || usuario.senha !== senha) return null;
  return usuario;
}

export function buscarUsuario(id: string) {
  return USUARIOS.find((u) => u.id === id) ?? null;
}
