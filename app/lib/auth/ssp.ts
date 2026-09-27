import { randomBytes } from "node:crypto";

export type PerfilSsp = "comunicacao" | "admin";
export type IdentidadeSsp = { id:string; nome:string; email:string; cargo:string; perfil:PerfilSsp };

export const COOKIE_SSP_STATE = "espp-ssp-state";
export const COOKIE_SSP_NEXT = "espp-ssp-next";

export function autenticacaoSspConfigurada() {
  return Boolean(process.env.ESPP_SSP_AUTH_URL?.trim() && process.env.ESPP_SSP_CLIENT_ID?.trim() && process.env.ESPP_SSP_CALLBACK_URL?.trim());
}

export function criarStateSsp() { return randomBytes(32).toString("base64url"); }

export function destinoAdminSeguro(valor: string | null | undefined) {
  if (!valor || !valor.startsWith("/admin") || valor.startsWith("//")) return "/admin";
  return valor === "/admin/login" ? "/admin" : valor;
}

export function urlLoginSsp(state: string) {
  const base=process.env.ESPP_SSP_AUTH_URL?.trim();
  const clientId=process.env.ESPP_SSP_CLIENT_ID?.trim();
  const callback=process.env.ESPP_SSP_CALLBACK_URL?.trim();
  if(!base||!clientId||!callback) return null;
  const url=new URL(base);
  url.searchParams.set("client_id",clientId);
  url.searchParams.set("redirect_uri",callback);
  url.searchParams.set("response_type","code");
  url.searchParams.set("state",state);
  const scope=process.env.ESPP_SSP_SCOPE?.trim();
  if(scope) url.searchParams.set("scope",scope);
  return url.toString();
}

export function urlLogoutSsp(retorno:string) {
  const base=process.env.ESPP_SSP_LOGOUT_URL?.trim();
  if(!base) return null;
  const url=new URL(base);
  url.searchParams.set("post_logout_redirect_uri",retorno);
  return url.toString();
}

/** Integração efetiva depende do token endpoint e do contrato de claims fornecidos pela SSP. */
export async function trocarCodigoSsp(_codigo:string):Promise<IdentidadeSsp|null>{ return null; }
