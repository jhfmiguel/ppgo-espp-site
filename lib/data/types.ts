/**
 * Modelo de dados do conteúdo editável pelo painel administrativo.
 *
 * Nesta fase de testes os registros vivem em arquivos JSON sob `content/data/`
 * (ver `lib/data/store.ts`). Os tipos aqui são a fronteira entre o painel e o
 * site público — trocar o armazenamento por um banco não deve alterá-los.
 */

export type Status = "rascunho" | "publicado";

export type Imagem = {
  src: string;
  alt: string;
};

export type Noticia = {
  id: string;
  slug: string;
  titulo: string;
  /** Data de publicação, no formato YYYY-MM-DD. */
  data: string;
  categoria: string;
  resumo: string;
  /** Corpo da notícia em HTML, produzido pelo editor de texto rico. */
  conteudo: string;
  imagem: Imagem | null;
  status: Status;
  /** Nome do usuário que criou o registro. */
  autor: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type ModalidadeEvento = "Presencial" | "Online" | "Híbrido";

export type Evento = {
  id: string;
  slug: string;
  titulo: string;
  /** Data de início, no formato YYYY-MM-DD. */
  dataInicio: string;
  /** Data de término, quando o evento dura mais de um dia. */
  dataFim: string | null;
  /** Horário em texto livre, ex.: "8h às 12h". */
  horario: string;
  local: string;
  modalidade: ModalidadeEvento;
  categoria: string;
  resumo: string;
  /** Programação e detalhes em HTML, produzido pelo editor de texto rico. */
  conteudo: string;
  imagem: Imagem | null;
  /** Link externo de inscrição, quando houver. */
  inscricaoHref: string;
  status: Status;
  autor: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type SituacaoAto = "Vigente" | "Revogado" | "Encerrado";

export type Anexo = {
  nome: string;
  url: string;
  /** Tamanho em bytes, para exibição na listagem. */
  tamanho: number;
};

export type AtoNormativo = {
  id: string;
  tipo: string;
  numero: string;
  titulo: string;
  ementa: string;
  situacao: SituacaoAto;
  ano: number;
  /** Data do ato, no formato YYYY-MM-DD. */
  data: string;
  /** Link para a fonte oficial (Casa Civil, portal da Polícia Penal). */
  href: string;
  /** Arquivo anexado pelo painel, quando o ato foi enviado em PDF. */
  anexo: Anexo | null;
  status: Status;
  autor: string;
  criadoEm: string;
  atualizadoEm: string;
};
