import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Sessão sem estado, guardada num cookie httpOnly assinado com HMAC-SHA256.
 *
 * Em produção, ESPP_SESSION_SECRET é obrigatório e deve possuir pelo menos
 * 32 caracteres. O segredo padrão existe exclusivamente para desenvolvimento.
 */
export const COOKIE_SESSAO = "espp-admin-session";

const DURACAO_MS = 8 * 60 * 60 * 1000; // 8 horas
const SEGREDO_DESENVOLVIMENTO = "espp-painel-administrativo-dev-secret";

function obterSegredoSessao(): string {
  const configurado = process.env.ESPP_SESSION_SECRET?.trim();

  if (configurado) {
    if (process.env.NODE_ENV === "production" && configurado.length < 32) {
      throw new Error(
        "ESPP_SESSION_SECRET deve possuir pelo menos 32 caracteres em produção.",
      );
    }

    return configurado;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ESPP_SESSION_SECRET é obrigatório em produção. Configure um segredo forte no ambiente.",
    );
  }

  return SEGREDO_DESENVOLVIMENTO;
}

export type Sessao = {
  userId: string;
  expiraEm: number;
};

const base64url = (valor: Buffer | string) =>
  Buffer.from(valor).toString("base64url");

function assinar(payload: string) {
  return createHmac("sha256", obterSegredoSessao())
    .update(payload)
    .digest("base64url");
}

function encriptar(sessao: Sessao) {
  const payload = base64url(JSON.stringify(sessao));
  return `${payload}.${assinar(payload)}`;
}

export function decriptar(token: string | undefined): Sessao | null {
  if (!token) return null;

  const [payload, assinatura] = token.split(".");
  if (!payload || !assinatura) return null;

  const esperada = Buffer.from(assinar(payload));
  const recebida = Buffer.from(assinatura);

  if (
    esperada.length !== recebida.length ||
    !timingSafeEqual(esperada, recebida)
  ) {
    return null;
  }

  try {
    const sessao = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Sessao;

    if (
      typeof sessao.userId !== "string" ||
      typeof sessao.expiraEm !== "number"
    ) {
      return null;
    }

    if (sessao.expiraEm < Date.now()) return null;

    return sessao;
  } catch {
    return null;
  }
}

export async function criarSessao(userId: string) {
  const expiraEm = Date.now() + DURACAO_MS;
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_SESSAO, encriptar({ userId, expiraEm }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiraEm),
  });
}

export async function lerSessao() {
  const cookieStore = await cookies();
  return decriptar(cookieStore.get(COOKIE_SESSAO)?.value);
}

export async function encerrarSessao() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_SESSAO);
}
