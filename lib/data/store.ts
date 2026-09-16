import type {
  Anexo,
  AtoNormativo,
  Evento,
  Imagem,
  Noticia,
  Status,
} from "@/lib/data/types";

/**
 * Adaptador de persistência do site institucional.
 *
 * O restante do frontend continua trabalhando com os tipos definidos em
 * `lib/data/types.ts`; somente este arquivo conhece o contrato HTTP da API
 * Spring Boot. Isso mantém páginas, componentes e Server Actions desacoplados
 * do formato usado pelo backend.
 */

const API_URL = (process.env.ESPP_API_URL ?? "http://localhost:8081").replace(/\/$/, "");
const ADMIN_USER = process.env.ESPP_API_ADMIN_USER ?? "admin";
const ADMIN_PASSWORD = process.env.ESPP_API_ADMIN_PASSWORD ?? "troque-esta-senha";

function statusDaApi(status: string): Status {
  return status === "PUBLICADO" ? "publicado" : "rascunho";
}

function statusParaApi(status: Status) {
  return status === "publicado" ? "PUBLICADO" : "RASCUNHO";
}

function imagemDaApi(src?: string | null, alt?: string | null): Imagem | null {
  return src ? { src, alt: alt ?? "" } : null;
}

function anexoDaApi(
  nome?: string | null,
  url?: string | null,
  tamanho?: number | null,
): Anexo | null {
  return nome && url ? { nome, url, tamanho: tamanho ?? 0 } : null;
}

function basicAuth() {
  return `Basic ${Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`, "utf8").toString("base64")}`;
}

async function requisicao<T>(
  caminho: string,
  init: RequestInit = {},
  admin = false,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  if (admin) headers.set("Authorization", basicAuth());

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (resposta.status === 404) return null as T;
  if (!resposta.ok) {
    const detalhe = await resposta.text().catch(() => "");
    throw new Error(
      `API ESPP respondeu ${resposta.status} ${resposta.statusText}${detalhe ? `: ${detalhe}` : ""}`,
    );
  }

  if (resposta.status === 204) return undefined as T;
  return (await resposta.json()) as T;
}

/* --------------------------------------------------------- contrato da API */

type ApiNoticia = {
  id: string;
  slug: string;
  titulo: string;
  data: string;
  categoria: string;
  resumo: string;
  conteudo: string;
  imagemUrl: string | null;
  imagemAlt: string | null;
  status: string;
  autor: string;
  criadoEm: string;
  atualizadoEm: string;
};

type ApiEvento = {
  id: string;
  slug: string;
  titulo: string;
  dataInicio: string;
  dataFim: string | null;
  horario: string | null;
  local: string | null;
  modalidade: string;
  categoria: string;
  resumo: string;
  conteudo: string;
  imagemUrl: string | null;
  imagemAlt: string | null;
  inscricaoHref: string | null;
  status: string;
  autor: string;
  criadoEm: string;
  atualizadoEm: string;
};

type ApiAto = {
  id: string;
  tipo: string;
  numero: string;
  titulo: string;
  ementa: string;
  situacao: AtoNormativo["situacao"];
  ano: number;
  data: string;
  href: string | null;
  anexoNome: string | null;
  anexoUrl: string | null;
  anexoTamanho: number | null;
  status: string;
  autor: string;
  criadoEm: string;
  atualizadoEm: string;
};

function noticiaDaApi(item: ApiNoticia): Noticia {
  return {
    id: item.id,
    slug: item.slug,
    titulo: item.titulo,
    data: item.data,
    categoria: item.categoria,
    resumo: item.resumo,
    conteudo: item.conteudo,
    imagem: imagemDaApi(item.imagemUrl, item.imagemAlt),
    status: statusDaApi(item.status),
    autor: item.autor,
    criadoEm: item.criadoEm,
    atualizadoEm: item.atualizadoEm,
  };
}

function eventoDaApi(item: ApiEvento): Evento {
  return {
    id: item.id,
    slug: item.slug,
    titulo: item.titulo,
    dataInicio: item.dataInicio,
    dataFim: item.dataFim,
    horario: item.horario ?? "",
    local: item.local ?? "",
    modalidade: item.modalidade as Evento["modalidade"],
    categoria: item.categoria,
    resumo: item.resumo,
    conteudo: item.conteudo,
    imagem: imagemDaApi(item.imagemUrl, item.imagemAlt),
    inscricaoHref: item.inscricaoHref ?? "",
    status: statusDaApi(item.status),
    autor: item.autor,
    criadoEm: item.criadoEm,
    atualizadoEm: item.atualizadoEm,
  };
}

function atoDaApi(item: ApiAto): AtoNormativo {
  return {
    id: item.id,
    tipo: item.tipo,
    numero: item.numero,
    titulo: item.titulo,
    ementa: item.ementa,
    situacao: item.situacao,
    ano: item.ano,
    data: item.data,
    href: item.href ?? "",
    anexo: anexoDaApi(item.anexoNome, item.anexoUrl, item.anexoTamanho),
    status: statusDaApi(item.status),
    autor: item.autor,
    criadoEm: item.criadoEm,
    atualizadoEm: item.atualizadoEm,
  };
}

/* ---------------------------------------------------------------- notícias */

type NovaNoticia = Omit<Noticia, "id" | "slug" | "criadoEm" | "atualizadoEm">;

function noticiaParaApi(dados: NovaNoticia) {
  return {
    titulo: dados.titulo,
    data: dados.data,
    categoria: dados.categoria,
    resumo: dados.resumo,
    conteudo: dados.conteudo,
    imagemUrl: dados.imagem?.src ?? null,
    imagemAlt: dados.imagem?.alt ?? null,
    status: statusParaApi(dados.status),
    autor: dados.autor,
  };
}

export async function listarNoticias() {
  const itens = await requisicao<ApiNoticia[]>("/api/v1/admin/noticias", {}, true);
  return itens.map(noticiaDaApi).sort((a, b) => b.data.localeCompare(a.data));
}

export async function listarNoticiasPublicadas() {
  const itens = await requisicao<ApiNoticia[]>("/api/v1/public/noticias");
  return itens.map(noticiaDaApi).sort((a, b) => b.data.localeCompare(a.data));
}

export async function buscarNoticia(id: string) {
  return (await listarNoticias()).find((item) => item.id === id) ?? null;
}

export async function buscarNoticiaPorSlug(slug: string) {
  return (await listarNoticiasPublicadas()).find((item) => item.slug === slug) ?? null;
}

export async function criarNoticia(dados: NovaNoticia) {
  const item = await requisicao<ApiNoticia>(
    "/api/v1/admin/noticias",
    { method: "POST", body: JSON.stringify(noticiaParaApi(dados)) },
    true,
  );
  return noticiaDaApi(item);
}

export async function atualizarNoticia(id: string, dados: Partial<NovaNoticia>) {
  const atual = await buscarNoticia(id);
  if (!atual) return null;

  const completo: NovaNoticia = {
    data: dados.data ?? atual.data,
    titulo: dados.titulo ?? atual.titulo,
    categoria: dados.categoria ?? atual.categoria,
    resumo: dados.resumo ?? atual.resumo,
    conteudo: dados.conteudo ?? atual.conteudo,
    imagem: dados.imagem === undefined ? atual.imagem : dados.imagem,
    status: dados.status ?? atual.status,
    autor: dados.autor ?? atual.autor,
  };

  const item = await requisicao<ApiNoticia>(
    `/api/v1/admin/noticias/${encodeURIComponent(id)}`,
    { method: "PUT", body: JSON.stringify(noticiaParaApi(completo)) },
    true,
  );
  return noticiaDaApi(item);
}

export async function excluirNoticia(id: string) {
  if (!(await buscarNoticia(id))) return false;
  await requisicao<void>(
    `/api/v1/admin/noticias/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    true,
  );
  return true;
}

/* ------------------------------------------------------------------- eventos */

type NovoEvento = Omit<Evento, "id" | "slug" | "criadoEm" | "atualizadoEm">;

function eventoParaApi(dados: NovoEvento) {
  return {
    titulo: dados.titulo,
    dataInicio: dados.dataInicio,
    dataFim: dados.dataFim || null,
    horario: dados.horario || null,
    local: dados.local || null,
    modalidade: dados.modalidade,
    categoria: dados.categoria,
    resumo: dados.resumo,
    conteudo: dados.conteudo,
    imagemUrl: dados.imagem?.src ?? null,
    imagemAlt: dados.imagem?.alt ?? null,
    inscricaoHref: dados.inscricaoHref || null,
    status: statusParaApi(dados.status),
    autor: dados.autor,
  };
}

export async function listarEventos() {
  const itens = await requisicao<ApiEvento[]>("/api/v1/admin/eventos", {}, true);
  return itens.map(eventoDaApi).sort((a, b) => b.dataInicio.localeCompare(a.dataInicio));
}

export async function listarEventosPublicados() {
  const itens = await requisicao<ApiEvento[]>("/api/v1/public/eventos");
  return itens.map(eventoDaApi).sort((a, b) => b.dataInicio.localeCompare(a.dataInicio));
}

export async function listarProximosEventos(hoje = new Date()) {
  const referencia = hoje.toISOString().slice(0, 10);
  return (await listarEventosPublicados())
    .filter((item) => (item.dataFim || item.dataInicio) >= referencia)
    .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio));
}

export async function buscarEvento(id: string) {
  return (await listarEventos()).find((item) => item.id === id) ?? null;
}

export async function buscarEventoPorSlug(slug: string) {
  return (await listarEventosPublicados()).find((item) => item.slug === slug) ?? null;
}

export async function criarEvento(dados: NovoEvento) {
  const item = await requisicao<ApiEvento>(
    "/api/v1/admin/eventos",
    { method: "POST", body: JSON.stringify(eventoParaApi(dados)) },
    true,
  );
  return eventoDaApi(item);
}

export async function atualizarEvento(id: string, dados: Partial<NovoEvento>) {
  const atual = await buscarEvento(id);
  if (!atual) return null;

  const completo: NovoEvento = {
    titulo: dados.titulo ?? atual.titulo,
    dataInicio: dados.dataInicio ?? atual.dataInicio,
    dataFim: dados.dataFim === undefined ? atual.dataFim : dados.dataFim,
    horario: dados.horario ?? atual.horario,
    local: dados.local ?? atual.local,
    modalidade: dados.modalidade ?? atual.modalidade,
    categoria: dados.categoria ?? atual.categoria,
    resumo: dados.resumo ?? atual.resumo,
    conteudo: dados.conteudo ?? atual.conteudo,
    imagem: dados.imagem === undefined ? atual.imagem : dados.imagem,
    inscricaoHref: dados.inscricaoHref ?? atual.inscricaoHref,
    status: dados.status ?? atual.status,
    autor: dados.autor ?? atual.autor,
  };

  const item = await requisicao<ApiEvento>(
    `/api/v1/admin/eventos/${encodeURIComponent(id)}`,
    { method: "PUT", body: JSON.stringify(eventoParaApi(completo)) },
    true,
  );
  return eventoDaApi(item);
}

export async function excluirEvento(id: string) {
  if (!(await buscarEvento(id))) return false;
  await requisicao<void>(
    `/api/v1/admin/eventos/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    true,
  );
  return true;
}

/* ----------------------------------------------------------- atos normativos */

type NovoAto = Omit<AtoNormativo, "id" | "ano" | "criadoEm" | "atualizadoEm">;

function atoParaApi(dados: NovoAto) {
  return {
    tipo: dados.tipo,
    numero: dados.numero,
    titulo: dados.titulo,
    ementa: dados.ementa,
    situacao: dados.situacao,
    ano: Number(dados.data.slice(0, 4)),
    data: dados.data,
    href: dados.href || null,
    anexoNome: dados.anexo?.nome ?? null,
    anexoUrl: dados.anexo?.url ?? null,
    anexoTamanho: dados.anexo?.tamanho ?? null,
    status: statusParaApi(dados.status),
    autor: dados.autor,
  };
}

export async function listarAtos() {
  const itens = await requisicao<ApiAto[]>("/api/v1/admin/atos-normativos", {}, true);
  return itens.map(atoDaApi).sort((a, b) => b.data.localeCompare(a.data));
}

export async function listarAtosPublicados() {
  const itens = await requisicao<ApiAto[]>("/api/v1/public/atos-normativos");
  return itens.map(atoDaApi).sort((a, b) => b.data.localeCompare(a.data));
}

export async function buscarAto(id: string) {
  return (await listarAtos()).find((item) => item.id === id) ?? null;
}

export async function criarAto(dados: NovoAto) {
  const item = await requisicao<ApiAto>(
    "/api/v1/admin/atos-normativos",
    { method: "POST", body: JSON.stringify(atoParaApi(dados)) },
    true,
  );
  return atoDaApi(item);
}

export async function atualizarAto(id: string, dados: Partial<NovoAto>) {
  const atual = await buscarAto(id);
  if (!atual) return null;

  const completo: NovoAto = {
    tipo: dados.tipo ?? atual.tipo,
    numero: dados.numero ?? atual.numero,
    titulo: dados.titulo ?? atual.titulo,
    ementa: dados.ementa ?? atual.ementa,
    situacao: dados.situacao ?? atual.situacao,
    data: dados.data ?? atual.data,
    href: dados.href ?? atual.href,
    anexo: dados.anexo === undefined ? atual.anexo : dados.anexo,
    status: dados.status ?? atual.status,
    autor: dados.autor ?? atual.autor,
  };

  const item = await requisicao<ApiAto>(
    `/api/v1/admin/atos-normativos/${encodeURIComponent(id)}`,
    { method: "PUT", body: JSON.stringify(atoParaApi(completo)) },
    true,
  );
  return atoDaApi(item);
}

export async function excluirAto(id: string) {
  if (!(await buscarAto(id))) return false;
  await requisicao<void>(
    `/api/v1/admin/atos-normativos/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    true,
  );
  return true;
}
