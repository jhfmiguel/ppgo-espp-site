import type {
  AtoNormativo,
  Evento,
  Imagem,
  Noticia,
  SituacaoAto,
  Status,
  MensagemContato,
  AssinanteNewsletter,
  StatusMensagem,
  MensagemDetalhe,
  StatusNewsletter,
  ResumoComunicacao,
  CampanhaNewsletter,
  CampanhaDetalhe,
} from "@/lib/data/types";

const API_URL = (process.env.ESPP_API_URL ?? "http://localhost:8081").replace(/\/$/, "");
const ADMIN_USER = process.env.ESPP_API_ADMIN_USER?.trim();
const ADMIN_PASSWORD = process.env.ESPP_API_ADMIN_PASSWORD;

if (!ADMIN_USER || !ADMIN_PASSWORD) {
  throw new Error(
    "ESPP_API_ADMIN_USER e ESPP_API_ADMIN_PASSWORD sao obrigatorios no servidor Next.",
  );
}

type ApiStatus = "PUBLICADO" | "RASCUNHO";

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
  status: ApiStatus;
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
  horario: string;
  local: string;
  modalidade: Evento["modalidade"];
  categoria: string;
  resumo: string;
  conteudo: string;
  imagemUrl: string | null;
  imagemAlt: string | null;
  inscricaoHref: string | null;
  status: ApiStatus;
  autor: string;
  criadoEm: string;
  atualizadoEm: string;
};

type ApiAtoNormativo = {
  id: string;
  tipo: string;
  numero: string;
  titulo: string;
  ementa: string;
  situacao: SituacaoAto;
  ano: number;
  data: string;
  href: string | null;
  anexoNome: string | null;
  anexoUrl: string | null;
  anexoTamanho: number | null;
  status: ApiStatus;
  autor: string;
  criadoEm: string;
  atualizadoEm: string;
};

type NovaNoticia = Omit<
  Noticia,
  "id" | "slug" | "criadoEm" | "atualizadoEm"
>;

type NovoEvento = Omit<
  Evento,
  "id" | "slug" | "criadoEm" | "atualizadoEm"
>;

type NovoAto = Omit<
  AtoNormativo,
  "id" | "ano" | "criadoEm" | "atualizadoEm"
>;

function statusDaApi(status: Status): ApiStatus {
  return status === "publicado" ? "PUBLICADO" : "RASCUNHO";
}

function statusDoFrontend(status: ApiStatus): Status {
  return status === "PUBLICADO" ? "publicado" : "rascunho";
}

function imagemDaApi(
  src: string | null,
  alt: string | null,
): Imagem | null {
  if (!src) return null;

  return {
    src,
    alt: alt ?? "",
  };
}

function autorizacaoAdmin() {
  return `Basic ${Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString("base64")}`;
}

async function api<T>(
  caminho: string,
  init: RequestInit = {},
): Promise<T> {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text().catch(() => "");
    throw new Error(
      `API ESPP retornou HTTP ${resposta.status} em ${caminho}${
        detalhe ? `: ${detalhe}` : ""
      }`,
    );
  }

  if (resposta.status === 204) {
    return undefined as T;
  }

  return (await resposta.json()) as T;
}

function requisicaoAdmin(
  method: "POST" | "PUT" | "DELETE",
  body?: unknown,
  usuario?: string,
): RequestInit {
  return {
    method,
    headers: {
      Authorization: autorizacaoAdmin(),
      ...(usuario ? { "X-ESPP-Usuario": usuario } : {}),
      ...(body === undefined
        ? {}
        : { "Content-Type": "application/json; charset=utf-8" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  };
}

function mapearNoticia(item: ApiNoticia): Noticia {
  return {
    id: item.id,
    slug: item.slug,
    titulo: item.titulo,
    data: item.data,
    categoria: item.categoria,
    resumo: item.resumo,
    conteudo: item.conteudo,
    imagem: imagemDaApi(item.imagemUrl, item.imagemAlt),
    status: statusDoFrontend(item.status),
    autor: item.autor,
    criadoEm: item.criadoEm,
    atualizadoEm: item.atualizadoEm,
  };
}

function mapearEvento(item: ApiEvento): Evento {
  return {
    id: item.id,
    slug: item.slug,
    titulo: item.titulo,
    dataInicio: item.dataInicio,
    dataFim: item.dataFim,
    horario: item.horario,
    local: item.local,
    modalidade: item.modalidade,
    categoria: item.categoria,
    resumo: item.resumo,
    conteudo: item.conteudo,
    imagem: imagemDaApi(item.imagemUrl, item.imagemAlt),
    inscricaoHref: item.inscricaoHref ?? "",
    status: statusDoFrontend(item.status),
    autor: item.autor,
    criadoEm: item.criadoEm,
    atualizadoEm: item.atualizadoEm,
  };
}

function mapearAto(item: ApiAtoNormativo): AtoNormativo {
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
    anexo:
      item.anexoUrl && item.anexoNome
        ? {
            nome: item.anexoNome,
            url: item.anexoUrl,
            tamanho: item.anexoTamanho ?? 0,
          }
        : null,
    status: statusDoFrontend(item.status),
    autor: item.autor,
    criadoEm: item.criadoEm,
    atualizadoEm: item.atualizadoEm,
  };
}

function payloadNoticia(dados: NovaNoticia) {
  return {
    titulo: dados.titulo,
    data: dados.data,
    categoria: dados.categoria,
    resumo: dados.resumo,
    conteudo: dados.conteudo,
    imagemUrl: dados.imagem?.src ?? null,
    imagemAlt: dados.imagem?.alt ?? null,
    status: statusDaApi(dados.status),
    autor: dados.autor,
  };
}

function payloadEvento(dados: NovoEvento) {
  return {
    titulo: dados.titulo,
    dataInicio: dados.dataInicio,
    dataFim: dados.dataFim || null,
    horario: dados.horario,
    local: dados.local,
    modalidade: dados.modalidade,
    categoria: dados.categoria,
    resumo: dados.resumo,
    conteudo: dados.conteudo,
    imagemUrl: dados.imagem?.src ?? null,
    imagemAlt: dados.imagem?.alt ?? null,
    inscricaoHref: dados.inscricaoHref || null,
    status: statusDaApi(dados.status),
    autor: dados.autor,
  };
}

function payloadAto(dados: NovoAto) {
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
    status: statusDaApi(dados.status),
    autor: dados.autor,
  };
}

/**
 * Mantida por compatibilidade com o restante do frontend.
 * A geração definitiva do slug é responsabilidade da API Spring.
 */
export function gerarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* ------------------------------------------------------------------ notícias */

export async function listarNoticias() {
  const itens = await api<ApiNoticia[]>("/api/v1/admin/noticias", {
    headers: { Authorization: autorizacaoAdmin() },
  });

  return itens
    .map(mapearNoticia)
    .sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}

export async function listarNoticiasPublicadas() {
  const itens = await api<ApiNoticia[]>("/api/v1/public/noticias");

  return itens
    .map(mapearNoticia)
    .sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}

export async function buscarNoticia(id: string) {
  return (await listarNoticias()).find((item) => item.id === id) ?? null;
}

export async function buscarNoticiaPorSlug(slug: string) {
  return (
    (await listarNoticiasPublicadas()).find((item) => item.slug === slug) ??
    null
  );
}

export async function criarNoticia(dados: NovaNoticia, usuario?: string) {
  const item = await api<ApiNoticia>(
    "/api/v1/admin/noticias",
    requisicaoAdmin("POST", payloadNoticia(dados), usuario),
  );

  return mapearNoticia(item);
}

export async function atualizarNoticia(
  id: string,
  dados: Partial<NovaNoticia>,
  usuario?: string,
) {
  const atual = await buscarNoticia(id);
  if (!atual) return null;

  const completo: NovaNoticia = {
    titulo: dados.titulo ?? atual.titulo,
    data: dados.data ?? atual.data,
    categoria: dados.categoria ?? atual.categoria,
    resumo: dados.resumo ?? atual.resumo,
    conteudo: dados.conteudo ?? atual.conteudo,
    imagem: dados.imagem !== undefined ? dados.imagem : atual.imagem,
    status: dados.status ?? atual.status,
    autor: dados.autor ?? atual.autor,
  };

  const item = await api<ApiNoticia>(
    `/api/v1/admin/noticias/${id}`,
    requisicaoAdmin("PUT", payloadNoticia(completo), usuario),
  );

  return mapearNoticia(item);
}

export async function excluirNoticia(id: string, usuario?: string) {
  const atual = await buscarNoticia(id);
  if (!atual) return false;

  await api<void>(
    `/api/v1/admin/noticias/${id}`,
    requisicaoAdmin("DELETE", undefined, usuario),
  );

  return true;
}

/* ------------------------------------------------------------------- eventos */

export async function listarEventos() {
  const itens = await api<ApiEvento[]>("/api/v1/admin/eventos", {
    headers: { Authorization: autorizacaoAdmin() },
  });

  return itens
    .map(mapearEvento)
    .sort((a, b) =>
      a.dataInicio < b.dataInicio
        ? 1
        : a.dataInicio > b.dataInicio
          ? -1
          : 0,
    );
}

export async function listarEventosPublicados() {
  const itens = await api<ApiEvento[]>("/api/v1/public/eventos");

  return itens
    .map(mapearEvento)
    .sort((a, b) =>
      a.dataInicio < b.dataInicio
        ? 1
        : a.dataInicio > b.dataInicio
          ? -1
          : 0,
    );
}

export async function listarProximosEventos(hoje = new Date()) {
  const referencia = hoje.toISOString().slice(0, 10);

  return (await listarEventosPublicados())
    .filter((item) => (item.dataFim || item.dataInicio) >= referencia)
    .sort((a, b) =>
      a.dataInicio < b.dataInicio
        ? -1
        : a.dataInicio > b.dataInicio
          ? 1
          : 0,
    );
}

export async function buscarEvento(id: string) {
  return (await listarEventos()).find((item) => item.id === id) ?? null;
}

export async function buscarEventoPorSlug(slug: string) {
  return (
    (await listarEventosPublicados()).find((item) => item.slug === slug) ??
    null
  );
}

export async function criarEvento(dados: NovoEvento, usuario?: string) {
  const item = await api<ApiEvento>(
    "/api/v1/admin/eventos",
    requisicaoAdmin("POST", payloadEvento(dados), usuario),
  );

  return mapearEvento(item);
}

export async function atualizarEvento(
  id: string,
  dados: Partial<NovoEvento>,
  usuario?: string,
) {
  const atual = await buscarEvento(id);
  if (!atual) return null;

  const completo: NovoEvento = {
    titulo: dados.titulo ?? atual.titulo,
    dataInicio: dados.dataInicio ?? atual.dataInicio,
    dataFim: dados.dataFim !== undefined ? dados.dataFim : atual.dataFim,
    horario: dados.horario ?? atual.horario,
    local: dados.local ?? atual.local,
    modalidade: dados.modalidade ?? atual.modalidade,
    categoria: dados.categoria ?? atual.categoria,
    resumo: dados.resumo ?? atual.resumo,
    conteudo: dados.conteudo ?? atual.conteudo,
    imagem: dados.imagem !== undefined ? dados.imagem : atual.imagem,
    inscricaoHref:
      dados.inscricaoHref !== undefined
        ? dados.inscricaoHref
        : atual.inscricaoHref,
    status: dados.status ?? atual.status,
    autor: dados.autor ?? atual.autor,
  };

  const item = await api<ApiEvento>(
    `/api/v1/admin/eventos/${id}`,
    requisicaoAdmin("PUT", payloadEvento(completo), usuario),
  );

  return mapearEvento(item);
}

export async function excluirEvento(id: string, usuario?: string) {
  const atual = await buscarEvento(id);
  if (!atual) return false;

  await api<void>(
    `/api/v1/admin/eventos/${id}`,
    requisicaoAdmin("DELETE", undefined, usuario),
  );

  return true;
}

/* ----------------------------------------------------------- atos normativos */

export async function listarAtos() {
  const itens = await api<ApiAtoNormativo[]>("/api/v1/admin/atos-normativos", {
    headers: { Authorization: autorizacaoAdmin() },
  });

  return itens
    .map(mapearAto)
    .sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}

export async function listarAtosPublicados() {
  const itens = await api<ApiAtoNormativo[]>(
    "/api/v1/public/atos-normativos",
  );

  return itens
    .map(mapearAto)
    .sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}

export async function buscarAto(id: string) {
  return (await listarAtos()).find((item) => item.id === id) ?? null;
}

export async function criarAto(dados: NovoAto, usuario?: string) {
  const item = await api<ApiAtoNormativo>(
    "/api/v1/admin/atos-normativos",
    requisicaoAdmin("POST", payloadAto(dados), usuario),
  );

  return mapearAto(item);
}

export async function atualizarAto(
  id: string,
  dados: Partial<NovoAto>,
  usuario?: string,
) {
  const atual = await buscarAto(id);
  if (!atual) return null;

  const completo: NovoAto = {
    tipo: dados.tipo ?? atual.tipo,
    numero: dados.numero ?? atual.numero,
    titulo: dados.titulo ?? atual.titulo,
    ementa: dados.ementa ?? atual.ementa,
    situacao: dados.situacao ?? atual.situacao,
    data: dados.data ?? atual.data,
    href: dados.href !== undefined ? dados.href : atual.href,
    anexo: dados.anexo !== undefined ? dados.anexo : atual.anexo,
    status: dados.status ?? atual.status,
    autor: dados.autor ?? atual.autor,
  };

  const item = await api<ApiAtoNormativo>(
    `/api/v1/admin/atos-normativos/${id}`,
    requisicaoAdmin("PUT", payloadAto(completo), usuario),
  );

  return mapearAto(item);
}

export async function excluirAto(id: string, usuario?: string) {
  const atual = await buscarAto(id);
  if (!atual) return false;

  await api<void>(
    `/api/v1/admin/atos-normativos/${id}`,
    requisicaoAdmin("DELETE", undefined, usuario),
  );

  return true;
}
/* -------------------------------------------------------------- comunicação */

export async function listarMensagensContato(): Promise<MensagemContato[]> {
  return api<MensagemContato[]>("/api/v1/admin/mensagens", {
    headers: { Authorization: autorizacaoAdmin() },
  });
}

export async function buscarMensagemContato(id: string): Promise<MensagemDetalhe | null> {
  try {
    return await api<MensagemDetalhe>(`/api/v1/admin/mensagens/${id}`, {
      headers: { Authorization: autorizacaoAdmin() },
    });
  } catch {
    return null;
  }
}

export async function atualizarMensagemContato(
  id: string,
  dados: {
    status?: StatusMensagem;
    responsavel?: string;
    resposta?: string;
    notaInterna?: string;
  },
  usuario?: string,
): Promise<MensagemDetalhe> {
  return api<MensagemDetalhe>(
    `/api/v1/admin/mensagens/${id}`,
    requisicaoAdmin("PUT", dados, usuario),
  );
}

export async function atualizarMensagemContatoMultipart(
  id: string,
  formData: FormData,
  usuario?: string,
): Promise<MensagemDetalhe> {
  return api<MensagemDetalhe>(
    `/api/v1/admin/mensagens/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: autorizacaoAdmin(),
        ...(usuario ? { "X-ESPP-Usuario": usuario } : {}),
      },
      body: formData,
    },
  );
}

export function urlAnexoMensagem(mensagemId: string, anexoId: string) {
  return `/api/admin/mensagens/${encodeURIComponent(mensagemId)}/anexos/${encodeURIComponent(anexoId)}`;
}
export async function excluirMensagemContato(id: string, usuario?: string) {
  await api<void>(`/api/v1/admin/mensagens/${id}`, requisicaoAdmin("DELETE", undefined, usuario));
}

export async function listarAssinantesNewsletter(): Promise<AssinanteNewsletter[]> {
  return api<AssinanteNewsletter[]>("/api/v1/admin/newsletter", {
    headers: { Authorization: autorizacaoAdmin() },
  });
}

export async function atualizarAssinanteNewsletter(
  id: string,
  status: StatusNewsletter,
  usuario?: string,
): Promise<AssinanteNewsletter> {
  return api<AssinanteNewsletter>(
    `/api/v1/admin/newsletter/${id}`,
    requisicaoAdmin("PUT", { status }, usuario),
  );
}

export async function excluirAssinanteNewsletter(id: string, usuario?: string) {
  await api<void>(`/api/v1/admin/newsletter/${id}`, requisicaoAdmin("DELETE", undefined, usuario));
}

export async function buscarResumoComunicacao(): Promise<ResumoComunicacao> {
  return api<ResumoComunicacao>("/api/v1/admin/comunicacao/resumo", {
    headers: { Authorization: autorizacaoAdmin() },
  });
}
export async function listarCampanhasNewsletter(): Promise<CampanhaNewsletter[]> {
  return api<CampanhaNewsletter[]>("/api/v1/admin/newsletter/campanhas",{headers:{Authorization:autorizacaoAdmin()}});
}
export async function criarCampanhaNewsletter(assunto:string,conteudo:string,usuario?:string): Promise<CampanhaNewsletter> {
  return api<CampanhaNewsletter>("/api/v1/admin/newsletter/campanhas",requisicaoAdmin("POST",{assunto,conteudo},usuario));
}
export async function atualizarCampanhaNewsletter(id:string,assunto:string,conteudo:string,usuario?:string): Promise<CampanhaNewsletter> {
  return api<CampanhaNewsletter>(`/api/v1/admin/newsletter/campanhas/${id}`,requisicaoAdmin("PUT",{assunto,conteudo},usuario));
}
export async function buscarCampanhaNewsletter(id:string): Promise<CampanhaDetalhe> {
  return api<CampanhaDetalhe>(`/api/v1/admin/newsletter/campanhas/${id}`,{headers:{Authorization:autorizacaoAdmin()}});
}
export async function enviarCampanhaNewsletter(id:string,usuario?:string): Promise<CampanhaDetalhe> {
  return api<CampanhaDetalhe>(`/api/v1/admin/newsletter/campanhas/${id}/enviar`,requisicaoAdmin("POST",undefined,usuario));
}
