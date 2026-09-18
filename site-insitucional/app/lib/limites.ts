/**
 * Limites de upload compartilhados entre cliente e servidor.
 *
 * Fica num módulo sem dependências de Node porque os formulários do painel
 * (componentes de cliente) checam o tamanho antes de enviar, e as Server
 * Actions checam de novo — a validação do cliente é conveniência, a do
 * servidor é a que vale.
 *
 * `TAMANHO_MAXIMO_ARQUIVO` precisa caber dentro de
 * `serverActions.bodySizeLimit` no `next.config.ts`: o Next rejeita o corpo da
 * requisição antes de a Server Action rodar, e esse erro não é capturável.
 */

export const TAMANHO_MAXIMO_ARQUIVO = 8 * 1024 * 1024; // 8 MB

export const TIPOS_IMAGEM = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export const TIPOS_DOCUMENTO = ["application/pdf"] as const;

/** Valor do atributo `accept` dos campos de arquivo. */
export const ACCEPT_IMAGEM = TIPOS_IMAGEM.join(",");
export const ACCEPT_DOCUMENTO = TIPOS_DOCUMENTO.join(",");

export function formatarTamanho(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Mensagem de erro quando o arquivo estoura o limite, ou `null` quando cabe.
 * Usada no cliente (antes do envio) e no servidor.
 */
export function erroDeTamanho(tamanho: number) {
  if (tamanho <= TAMANHO_MAXIMO_ARQUIVO) return null;
  return `O arquivo tem ${formatarTamanho(tamanho)} e o limite é ${formatarTamanho(
    TAMANHO_MAXIMO_ARQUIVO,
  )}. Reduza a imagem antes de enviar.`;
}
