import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import type { AtoNormativo, Evento, Noticia } from "@/lib/data/types";

/**
 * Armazenamento mockado do conteúdo do painel administrativo.
 *
 * Os registros ficam em arquivos JSON sob `content/data/`, de forma que as
 * edições feitas em /admin aparecem imediatamente no site público e sobrevivem
 * a reinícios do servidor de desenvolvimento. É intencionalmente simples: ao
 * migrar para um banco de dados, só este arquivo precisa ser reescrito.
 */

const DIR = path.join(process.cwd(), "content", "data");

const ARQUIVOS = {
  noticias: "noticias.json",
  eventos: "eventos.json",
  atosNormativos: "atos-normativos.json",
} as const;

type Colecao = keyof typeof ARQUIVOS;

type Registro = { noticias: Noticia; eventos: Evento; atosNormativos: AtoNormativo };

async function ler<C extends Colecao>(colecao: C): Promise<Registro[C][]> {
  const conteudo = await fs.readFile(path.join(DIR, ARQUIVOS[colecao]), "utf8");
  return JSON.parse(conteudo) as Registro[C][];
}

async function gravar<C extends Colecao>(colecao: C, itens: Registro[C][]) {
  const destino = path.join(DIR, ARQUIVOS[colecao]);
  // Grava em arquivo temporário e renomeia: evita que uma leitura concorrente
  // encontre o JSON pela metade.
  const temporario = `${destino}.${randomUUID()}.tmp`;
  await fs.writeFile(temporario, `${JSON.stringify(itens, null, 2)}\n`, "utf8");
  await fs.rename(temporario, destino);
}

/** Gera um slug seguro para URL a partir do título. */
export function gerarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Garante que o slug não colida com outro registro da mesma coleção. */
function slugUnico(slugs: string[], desejado: string) {
  const base = desejado || "item";
  if (!slugs.includes(base)) return base;
  let n = 2;
  while (slugs.includes(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

const agora = () => new Date().toISOString();

/* ------------------------------------------------------------------ notícias */

export async function listarNoticias() {
  const itens = await ler("noticias");
  return itens.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}

export async function listarNoticiasPublicadas() {
  return (await listarNoticias()).filter((item) => item.status === "publicado");
}

export async function buscarNoticia(id: string) {
  return (await ler("noticias")).find((item) => item.id === id) ?? null;
}

export async function buscarNoticiaPorSlug(slug: string) {
  return (await ler("noticias")).find((item) => item.slug === slug) ?? null;
}

type NovaNoticia = Omit<Noticia, "id" | "slug" | "criadoEm" | "atualizadoEm">;

export async function criarNoticia(dados: NovaNoticia) {
  const itens = await ler("noticias");
  const novo: Noticia = {
    ...dados,
    id: randomUUID(),
    slug: slugUnico(
      itens.map((i) => i.slug),
      gerarSlug(dados.titulo),
    ),
    criadoEm: agora(),
    atualizadoEm: agora(),
  };
  await gravar("noticias", [novo, ...itens]);
  return novo;
}

export async function atualizarNoticia(id: string, dados: Partial<NovaNoticia>) {
  const itens = await ler("noticias");
  const indice = itens.findIndex((item) => item.id === id);
  if (indice === -1) return null;

  const atual = itens[indice];
  const tituloMudou = dados.titulo !== undefined && dados.titulo !== atual.titulo;
  const atualizado: Noticia = {
    ...atual,
    ...dados,
    slug: tituloMudou
      ? slugUnico(
          itens.filter((i) => i.id !== id).map((i) => i.slug),
          gerarSlug(dados.titulo as string),
        )
      : atual.slug,
    atualizadoEm: agora(),
  };
  itens[indice] = atualizado;
  await gravar("noticias", itens);
  return atualizado;
}

export async function excluirNoticia(id: string) {
  const itens = await ler("noticias");
  const restantes = itens.filter((item) => item.id !== id);
  if (restantes.length === itens.length) return false;
  await gravar("noticias", restantes);
  return true;
}

/* ------------------------------------------------------------------- eventos */

export async function listarEventos() {
  const itens = await ler("eventos");
  return itens.sort((a, b) =>
    a.dataInicio < b.dataInicio ? 1 : a.dataInicio > b.dataInicio ? -1 : 0,
  );
}

export async function listarEventosPublicados() {
  return (await listarEventos()).filter((item) => item.status === "publicado");
}

/** Eventos publicados que ainda não terminaram, do mais próximo ao mais distante. */
export async function listarProximosEventos(hoje = new Date()) {
  const referencia = hoje.toISOString().slice(0, 10);
  return (await listarEventosPublicados())
    .filter((item) => (item.dataFim || item.dataInicio) >= referencia)
    .sort((a, b) => (a.dataInicio < b.dataInicio ? -1 : a.dataInicio > b.dataInicio ? 1 : 0));
}

export async function buscarEvento(id: string) {
  return (await ler("eventos")).find((item) => item.id === id) ?? null;
}

export async function buscarEventoPorSlug(slug: string) {
  return (await ler("eventos")).find((item) => item.slug === slug) ?? null;
}

type NovoEvento = Omit<Evento, "id" | "slug" | "criadoEm" | "atualizadoEm">;

export async function criarEvento(dados: NovoEvento) {
  const itens = await ler("eventos");
  const novo: Evento = {
    ...dados,
    id: randomUUID(),
    slug: slugUnico(
      itens.map((i) => i.slug),
      gerarSlug(dados.titulo),
    ),
    criadoEm: agora(),
    atualizadoEm: agora(),
  };
  await gravar("eventos", [novo, ...itens]);
  return novo;
}

export async function atualizarEvento(id: string, dados: Partial<NovoEvento>) {
  const itens = await ler("eventos");
  const indice = itens.findIndex((item) => item.id === id);
  if (indice === -1) return null;

  const atual = itens[indice];
  const tituloMudou = dados.titulo !== undefined && dados.titulo !== atual.titulo;
  const atualizado: Evento = {
    ...atual,
    ...dados,
    slug: tituloMudou
      ? slugUnico(
          itens.filter((i) => i.id !== id).map((i) => i.slug),
          gerarSlug(dados.titulo as string),
        )
      : atual.slug,
    atualizadoEm: agora(),
  };
  itens[indice] = atualizado;
  await gravar("eventos", itens);
  return atualizado;
}

export async function excluirEvento(id: string) {
  const itens = await ler("eventos");
  const restantes = itens.filter((item) => item.id !== id);
  if (restantes.length === itens.length) return false;
  await gravar("eventos", restantes);
  return true;
}

/* ----------------------------------------------------------- atos normativos */

export async function listarAtos() {
  const itens = await ler("atosNormativos");
  return itens.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}

export async function listarAtosPublicados() {
  return (await listarAtos()).filter((item) => item.status === "publicado");
}

export async function buscarAto(id: string) {
  return (await ler("atosNormativos")).find((item) => item.id === id) ?? null;
}

type NovoAto = Omit<AtoNormativo, "id" | "ano" | "criadoEm" | "atualizadoEm">;

export async function criarAto(dados: NovoAto) {
  const itens = await ler("atosNormativos");
  const novo: AtoNormativo = {
    ...dados,
    id: randomUUID(),
    ano: Number(dados.data.slice(0, 4)),
    criadoEm: agora(),
    atualizadoEm: agora(),
  };
  await gravar("atosNormativos", [novo, ...itens]);
  return novo;
}

export async function atualizarAto(id: string, dados: Partial<NovoAto>) {
  const itens = await ler("atosNormativos");
  const indice = itens.findIndex((item) => item.id === id);
  if (indice === -1) return null;

  const atual = itens[indice];
  const atualizado: AtoNormativo = {
    ...atual,
    ...dados,
    ano: Number((dados.data ?? atual.data).slice(0, 4)),
    atualizadoEm: agora(),
  };
  itens[indice] = atualizado;
  await gravar("atosNormativos", itens);
  return atualizado;
}

export async function excluirAto(id: string) {
  const itens = await ler("atosNormativos");
  const restantes = itens.filter((item) => item.id !== id);
  if (restantes.length === itens.length) return false;
  await gravar("atosNormativos", restantes);
  return true;
}
