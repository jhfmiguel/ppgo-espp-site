"use server";

import { obterUsuario } from "@/lib/auth/dal";
import { salvarArquivo } from "@/lib/uploads";

/**
 * Envio de imagem a partir do editor de texto rico.
 *
 * Chamada direto do `onClick` do editor (Server Function fora de formulário),
 * porque um `<form>` de upload não pode ser aninhado no formulário da notícia.
 */
export async function enviarImagemDoEditor(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; erro: string }> {
  const usuario = await obterUsuario();
  if (!usuario) return { ok: false, erro: "Sessão expirada. Entre novamente." };

  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File)) {
    return { ok: false, erro: "Nenhum arquivo enviado." };
  }

  const envio = await salvarArquivo(arquivo, "imagem");
  return envio.ok ? { ok: true, url: envio.url } : { ok: false, erro: envio.erro };
}
