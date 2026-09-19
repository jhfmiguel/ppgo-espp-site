/**
 * Modelo de dados do conteúdo editável pelo painel administrativo.
 *
 * Os registros persistentes são fornecidos pela API Spring Boot e armazenados no Oracle.
 * Os tipos aqui definem a fronteira de dados utilizada pelo painel administrativo e
 * pelo site público.
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


export type StatusMensagem =
  | "NOVA"
  | "LIDA"
  | "EM_ATENDIMENTO"
  | "RESPONDIDA"
  | "ARQUIVADA";

export type TipoInteracaoMensagem =
  | "RECEBIMENTO"
  | "ALTERACAO_STATUS"
  | "ATRIBUICAO"
  | "NOTA_INTERNA"
  | "RESPOSTA";

export type HistoricoMensagem = {
  id: string;
  mensagemId: string;
  tipo: TipoInteracaoMensagem;
  descricao: string;
  usuario: string | null;
  criadoEm: string;
};

export type MensagemContato = {
  id: string;
  protocolo: string;
  nome: string;
  email: string;
  telefone: string | null;
  assunto: string;
  mensagem: string;
  status: StatusMensagem;
  responsavel: string | null;
  resposta: string | null;
  respondidoEm: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type AnexoMensagem = {
  id: string;
  mensagemId: string;
  historicoId: string | null;
  nomeOriginal: string;
  nomeArquivo: string;
  contentType: string;
  tamanho: number;
  direcao: "RECEBIDO" | "ENVIADO";
  criadoEm: string;
};

export type MensagemDetalhe = {
  mensagem: MensagemContato;
  historico: HistoricoMensagem[];
  anexos: AnexoMensagem[];
  emailHabilitado: boolean;
};

export type StatusNewsletter = "ATIVO" | "DESCADASTRADO" | "BLOQUEADO";

export type AssinanteNewsletter = {
  id: string;
  email: string;
  nome: string | null;
  status: StatusNewsletter;
  origem: string;
  consentidoEm: string;
  canceladoEm: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type ResumoComunicacao = {
  mensagensTotal: number;
  mensagensNovas: number;
  mensagensEmAtendimento: number;
  mensagensRespondidas: number;
  assinantesTotal: number;
  assinantesAtivos: number;
  assinantesDescadastrados: number;
  assinantesBloqueados: number;
};
export type StatusCampanhaNewsletter = "RASCUNHO" | "ENVIANDO" | "ENVIADA" | "FALHA";
export type CampanhaNewsletter = {
  id:string; assunto:string; conteudo:string; status:StatusCampanhaNewsletter;
  totalDestinatarios:number; totalEnviados:number; totalFalhas:number;
  criadoPor:string|null; criadoEm:string; enviadoEm:string|null;
};
export type EnvioNewsletter = {
  id:string; campanhaId:string; assinanteId:string|null; email:string; status:"ENVIADO"|"FALHA";
  erro:string|null; enviadoEm:string|null;
};
export type CampanhaDetalhe = { campanha:CampanhaNewsletter; envios:EnvioNewsletter[]; emailHabilitado:boolean };
