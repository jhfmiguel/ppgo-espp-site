import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

import { gerarSlug } from "@/lib/data/store";
import { erroDeTamanho, TIPOS_DOCUMENTO, TIPOS_IMAGEM } from "@/lib/limites";

/**
 * Gravação dos arquivos enviados pelo painel.
 *
 * Nesta fase os arquivos vão para `public/uploads/`, servidos estaticamente
 * pelo Next. Ao migrar para produção, troque `salvarArquivo` por um envio a
 * um bucket — o resto do painel só depende da URL retornada.
 */

const DIR = path.join(process.cwd(), "public", "uploads");

const EXTENSOES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "application/pdf": ".pdf",
};

export type TipoUpload = "imagem" | "documento";

export type ResultadoUpload =
  | { ok: true; url: string; nome: string; tamanho: number }
  | { ok: false; erro: string };

function aceitos(tipo: TipoUpload): readonly string[] {
  return tipo === "imagem" ? TIPOS_IMAGEM : TIPOS_DOCUMENTO;
}

/**
 * Valida e grava um arquivo enviado por formulário.
 *
 * O nome final é gerado a partir do slug do nome original mais bytes
 * aleatórios: nunca se confia no nome enviado pelo cliente, que poderia conter
 * `../` e escapar do diretório de destino.
 */
export async function salvarArquivo(
  arquivo: File,
  tipo: TipoUpload,
): Promise<ResultadoUpload> {
  if (!arquivo || arquivo.size === 0) {
    return { ok: false, erro: "Nenhum arquivo enviado." };
  }
  const excedeu = erroDeTamanho(arquivo.size);
  if (excedeu) {
    return { ok: false, erro: excedeu };
  }

  const extensao = aceitos(tipo).includes(arquivo.type) ? EXTENSOES[arquivo.type] : undefined;
  if (!extensao) {
    const lista =
      tipo === "imagem" ? "JPG, PNG, WEBP, GIF ou AVIF" : "PDF";
    return { ok: false, erro: `Formato não aceito. Envie um arquivo ${lista}.` };
  }

  const base = gerarSlug(arquivo.name.replace(/\.[^.]+$/, "")) || tipo;
  const data = new Date().toISOString().slice(0, 10);
  const nomeArquivo = `${data}-${base}-${randomBytes(3).toString("hex")}${extensao}`;

  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(
    path.join(DIR, nomeArquivo),
    Buffer.from(await arquivo.arrayBuffer()),
  );

  return {
    ok: true,
    url: `/uploads/${nomeArquivo}`,
    nome: arquivo.name,
    tamanho: arquivo.size,
  };
}
