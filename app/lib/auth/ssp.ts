export type PerfilSsp = "comunicacao" | "admin";

export type IdentidadeSsp = {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  perfil: PerfilSsp;
};

export function autenticacaoSspConfigurada() {
  return Boolean(
    process.env.ESPP_SSP_AUTH_URL?.trim() &&
      process.env.ESPP_SSP_CLIENT_ID?.trim() &&
      process.env.ESPP_SSP_CALLBACK_URL?.trim(),
  );
}

export function urlLoginSsp(proximo = "/admin") {
  const base = process.env.ESPP_SSP_AUTH_URL?.trim();
  const clientId = process.env.ESPP_SSP_CLIENT_ID?.trim();
  const callback = process.env.ESPP_SSP_CALLBACK_URL?.trim();

  if (!base || !clientId || !callback) return null;

  const url = new URL(base);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", callback);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", proximo.startsWith("/admin") ? proximo : "/admin");
  return url.toString();
}

/**
 * Ponto único de adaptação do retorno da SSP.
 * A troca do authorization code por identidade será implementada quando a SSP
 * fornecer endpoints, escopos e contrato oficial. Nenhum segredo é exposto ao cliente.
 */
export async function trocarCodigoSsp(_codigo: string): Promise<IdentidadeSsp | null> {
  return null;
}
