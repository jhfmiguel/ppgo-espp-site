/**
 * Usuários de exemplo do painel administrativo.
 *
 * Fase de testes: as credenciais estão fixas no código e a senha é comparada
 * em texto puro. Ao integrar com o diretório oficial (ou com um banco), troque
 * `autenticar` por uma consulta real com senha em hash.
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

export const USUARIOS: Usuario[] = [
  {
    id: "usr-comunicacao",
    nome: "Ana Comunicação",
    email: "comunicacao@espp.go.gov.br",
    senha: "comunicacao123",
    perfil: "comunicacao",
    cargo: "Assessoria de Comunicação da ESPP",
  },
  {
    id: "usr-admin",
    nome: "Carlos Administrador",
    email: "admin@espp.go.gov.br",
    senha: "admin123",
    perfil: "admin",
    cargo: "Administração do portal da ESPP",
  },
];

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
