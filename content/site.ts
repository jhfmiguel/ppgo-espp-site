/**
 * Fonte única de conteúdo do site institucional da ESPP.
 *
 * Todo texto exibido na página vive aqui — editar este arquivo é suficiente
 * para atualizar o site, sem tocar em componentes.
 *
 * Marcações usadas ao longo do arquivo:
 *   // VALIDAR  -> conteúdo redigido como rascunho, precisa de aprovação da ESPP
 *   // FONTE    -> dado extraído de fonte pública oficial (origem indicada)
 */

export const site = {
  nome: "Escola Superior de Polícia Penal",
  sigla: "ESPP",
  orgao: "Diretoria-Geral de Polícia Penal de Goiás",
  siglaOrgao: "DGPP",
  secretaria: "Secretaria de Segurança Pública do Estado de Goiás",
  url: "https://espp.go.gov.br", // VALIDAR: domínio definitivo (usado em metadata/sitemap)
  descricao:
    "Formação, aperfeiçoamento e qualificação dos servidores da Polícia Penal de Goiás. Primeira escola de serviços penais do Brasil credenciada como Escola de Governo.",
} as const;

export const nav = [
  { label: "Institucional", href: "#institucional" },
  { label: "Formação", href: "#formacao" },
  { label: "Cursos", href: "#cursos" },
  { label: "FORTIS", href: "#fortis" },
  { label: "Estrutura", href: "#estrutura" },
  { label: "Localização", href: "#localizacao" },
  { label: "Contato", href: "#contato" },
] as const;

export const hero = {
  selo: "Credenciada como Escola de Governo pelo Conselho Estadual de Educação", // FONTE: goias.gov.br/seguranca
  titulo: "Escola Superior de Polícia Penal",
  subtitulo: "Goiás",
  texto:
    "A primeira escola de serviços penais do Brasil credenciada como Escola de Governo. Formamos, aperfeiçoamos e qualificamos os servidores da Polícia Penal de Goiás com ensino, pesquisa e prática operacional.",
  ctaPrimario: { label: "Conheça a Escola", href: "#institucional" },
  ctaSecundario: { label: "Cursos e programas", href: "#formacao" },
  imagem: {
    src: "/images/formacao-policial-01.jpg",
    alt: "Turma de policiais penais de Goiás em formatura, uniformizados e em formação",
  },
} as const;

/** FONTE: portal da Polícia Penal de Goiás e SSP-GO (notícias 2024–2026) */
export const indicadores = [
  {
    valor: "66+",
    unidade: "cursos",
    label: "Cursos programados em 2025",
    detalhe: "Crescimento de 46,6% sobre os 45 cursos do ano anterior",
  },
  {
    valor: "5.000+",
    unidade: "servidores",
    label: "Servidores capacitados",
    detalhe: "93 cursos cognitivos e operacionais ofertados em 2024",
  },
  {
    valor: "500",
    unidade: "horas",
    label: "Pós-graduação lato sensu",
    detalhe: "Execução de Polícia Penal, a primeira do país na área",
  },
  {
    valor: "1ª",
    unidade: "do Brasil",
    label: "Escola de Governo em serviços penais",
    detalhe: "Aprovada por unanimidade pelo Conselho Estadual de Educação",
  },
] as const;

export const institucional = {
  eyebrow: "Institucional",
  titulo: "Uma escola de governo dentro da segurança pública",
  paragrafos: [
    "A Escola Superior de Polícia Penal (ESPP) é a unidade de ensino da Diretoria-Geral de Polícia Penal de Goiás, responsável pela formação, pelo aperfeiçoamento e pela qualificação profissional dos servidores que atuam no sistema penitenciário do Estado.",
    "Inaugurada em 14 de maio de 2024, em Goiânia, a Escola foi a primeira instituição de serviços penais do país a ser credenciada como Escola de Governo, com aprovação unânime do Conselho Estadual de Educação (CEE). O credenciamento permite que a própria ESPP oferte e certifique cursos de pós-graduação e de extensão, como fazem as instituições de ensino superior.",
    "Da formação inicial do policial penal aos altos estudos em segurança pública, a ESPP articula ensino, pesquisa aplicada e treinamento operacional para qualificar a gestão prisional goiana com foco em custódia, segurança, direitos humanos e reintegração social.",
  ], // VALIDAR: redação institucional
  pilares: [
    {
      titulo: "Missão",
      texto:
        "Formar, aperfeiçoar e qualificar os servidores da Polícia Penal de Goiás, produzindo e difundindo conhecimento aplicado à execução penal.",
    }, // VALIDAR
    {
      titulo: "Visão",
      texto:
        "Ser referência nacional em ensino, pesquisa e extensão na área de serviços penais e gestão prisional.",
    }, // VALIDAR
    {
      titulo: "Valores",
      texto:
        "Legalidade, disciplina, respeito aos direitos humanos, excelência técnica, ética profissional e valorização do servidor.",
    }, // VALIDAR
  ],
  imagem: {
    src: "/images/espp-viaturas.jpg",
    alt: "Viaturas da Polícia Penal do Estado de Goiás estacionadas em frente à fachada com o brasão da instituição",
  },
  marcos: [
    { ano: "2024", texto: "Inauguração da sede da ESPP, em Goiânia, com investimento de R$ 302 mil em reforma e estrutura física." },
    { ano: "2024", texto: "Credenciamento como Escola de Governo pelo Conselho Estadual de Educação de Goiás." },
    { ano: "2025", texto: "Recorde de capacitações: mais de 66 cursos programados e primeira turma do Curso Básico para Diretores de Unidades Prisionais, com 90 concluintes." },
    { ano: "2026", texto: "Cooperação com a UFG leva 15 policiais penais ao Mestrado Profissional em Engenharia de Produção (PPGEP)." },
  ], // FONTE: portais goias.gov.br, policiapenal.go.gov.br e fct.ufg.br
} as const;

export const formacao = {
  eyebrow: "Eixos de formação",
  titulo: "Do ingresso na carreira aos altos estudos",
  texto:
    "A ESPP organiza sua oferta em eixos complementares, que acompanham o servidor da formação inicial à especialização e à pós-graduação.",
  imagem: {
    src: "/images/formacao-policial-02.jpg",
    alt: "Policiais penais de Goiás perfilados durante atividade de formação",
  },
  eixos: [
    {
      icone: "shield",
      titulo: "Curso de Formação da Polícia Penal",
      texto:
        "Formação inicial dos aprovados em concurso público, com fundamentos jurídicos, técnicos e operacionais da atividade policial penal.",
      tag: "Formação inicial",
    },
    {
      icone: "graduation",
      titulo: "Pós-graduação em Execução de Polícia Penal",
      texto:
        "Especialização lato sensu de 500 horas certificada pela própria Escola — a primeira do país voltada à execução penal.",
      tag: "Lato sensu · 500h",
    },
    {
      icone: "star",
      titulo: "CAESP",
      texto:
        "Curso de Altos Estudos em Segurança Pública, destinado a policiais penais de 1ª classe, com foco em gestão estratégica e liderança institucional.",
      tag: "Altos estudos",
    },
    {
      icone: "users",
      titulo: "CEGESP",
      texto:
        "Curso de Gestão em Segurança Pública, com processos seletivos próprios e ênfase na qualificação de gestores de unidades prisionais.",
      tag: "Gestão",
    },
    {
      icone: "target",
      titulo: "Cursos operacionais",
      texto:
        "Treinamentos práticos em armamento e tiro, uso diferenciado da força, intervenção tática, escolta e atendimento emergencial.",
      tag: "Prática",
    },
    {
      icone: "book",
      titulo: "Cursos cognitivos e extensão",
      texto:
        "Direitos humanos, procedimentos administrativos, enfrentamento à violência contra a mulher, tecnologia e inteligência aplicada.",
      tag: "Extensão",
    },
    {
      icone: "microscope",
      titulo: "Pesquisa e pós-graduação stricto sensu",
      texto:
        "Cooperação com a UFG (PPGEP) que conduz 15 policiais penais ao Mestrado Profissional em Engenharia de Produção, com 544 horas em dois anos.",
      tag: "Mestrado · UFG",
    },
    {
      icone: "library",
      titulo: "Matrizes curriculares",
      texto:
        "Todos os cursos são autorizados por portaria da DGPP e têm matrizes curriculares públicas, disponíveis no portal oficial da Polícia Penal.",
      tag: "Transparência",
    },
  ],
} as const;

export const cursos = {
  eyebrow: "Cursos",
  titulo: "Oferta em destaque",
  texto:
    "Seleção de cursos e programas da Escola. A oferta completa, os editais e os processos seletivos são publicados no portal oficial da Polícia Penal de Goiás.",
  itens: [
    {
      nome: "Pós-graduação em Execução de Polícia Penal",
      cargaHoraria: "500 horas",
      modalidade: "Presencial",
      nivel: "Lato sensu",
      texto: "Primeira especialização do país na área de execução penal, certificada pela ESPP.",
    },
    {
      nome: "Curso de Formação da Polícia Penal",
      cargaHoraria: "Conforme edital",
      modalidade: "Presencial",
      nivel: "Formação inicial",
      texto: "Formação dos novos policiais penais do Estado de Goiás, com mais de mil concluintes na última turma.",
    },
    {
      nome: "Curso Básico para Diretores de Unidades Prisionais",
      cargaHoraria: "Conforme edital",
      modalidade: "Presencial",
      nivel: "Gestão",
      texto: "Primeira turma concluída em 2025, com 90 policiais penais qualificados para a direção de unidades.",
    },
    {
      nome: "Capacitação em Violência Contra a Mulher",
      cargaHoraria: "Conforme edital",
      modalidade: "Presencial e online",
      nivel: "Extensão",
      texto: "Atualização em legislação, acolhimento e procedimentos no enfrentamento à violência de gênero.",
    },
    {
      nome: "Inteligência Artificial na Prática",
      cargaHoraria: "Conforme edital",
      modalidade: "Presencial",
      nivel: "Tecnologia",
      texto: "Aplicação de ferramentas de IA às rotinas administrativas e de análise da Polícia Penal.",
    },
    {
      nome: "CAESP e CEGESP",
      cargaHoraria: "Conforme edital",
      modalidade: "Presencial",
      nivel: "Altos estudos e gestão",
      texto: "Programas com processo seletivo próprio, voltados à liderança e à gestão estratégica institucional.",
    },
  ],
  links: [
    {
      label: "Matrizes curriculares dos cursos",
      href: "https://www.policiapenal.go.gov.br/matrizes-curriculares-de-cursos-da-espp",
    },
    {
      label: "Editais de cursos",
      href: "https://www.policiapenal.go.gov.br/",
    },
    {
      label: "Processos seletivos PPGO",
      href: "https://www.policiapenal.go.gov.br/",
    },
  ],
} as const;

export const fortis = {
  eyebrow: "Em desenvolvimento",
  nome: "FORTIS",
  titulo: "A plataforma única de ensino e gestão escolar da ESPP",
  texto:
    "O FORTIS está sendo desenvolvido para reunir em um só ambiente tudo o que hoje se divide entre portais, planilhas e processos: o portal do aluno, o catálogo de cursos, as inscrições, as turmas, o ensino a distância, a emissão de certificados e a gestão acadêmica completa da Escola.",
  texto2:
    "Servidores acompanharão sua trilha de formação e seu histórico em um único lugar. A Escola passará a gerir matrículas, frequência, avaliações, instrutores e indicadores de capacitação de ponta a ponta, com dados confiáveis para a tomada de decisão.",
  status: "Sistema em desenvolvimento · lançamento por etapas",
  modulos: [
    {
      icone: "user",
      titulo: "Portal do Aluno",
      texto: "Trilha de formação, inscrições, notas, frequência e histórico acadêmico do servidor em um único acesso.",
    },
    {
      icone: "list",
      titulo: "Catálogo e inscrições",
      texto: "Oferta de cursos publicada com edital, vagas, pré-requisitos e inscrição online integrada.",
    },
    {
      icone: "monitor",
      titulo: "Ensino a distância",
      texto: "Aulas, materiais, avaliações e trilhas autoinstrucionais para capacitação contínua em todo o Estado.",
    },
    {
      icone: "award",
      titulo: "Certificados",
      texto: "Emissão automática com validação pública, carga horária e registro conforme portaria autorizadora.",
    },
    {
      icone: "clipboard",
      titulo: "Secretaria acadêmica",
      texto: "Turmas, diários de classe, instrutores, matrizes curriculares e documentos oficiais da Escola.",
    },
    {
      icone: "chart",
      titulo: "Gestão e indicadores",
      texto: "Painéis de capacitação por unidade, região e eixo, com relatórios para o planejamento anual de cursos.",
    },
  ],
  aviso:
    "O FORTIS está em construção. As telas apresentadas nesta página são representações do produto em desenvolvimento e podem mudar até o lançamento.",
  cta: {
    titulo: "Quero ser avisado no lançamento",
    texto:
      "Deixe seu e-mail institucional para receber as novidades sobre a liberação do FORTIS e das áreas do Portal do Aluno.",
    botao: "Avise-me",
  },
  portalAtual: {
    label: "Portal do Aluno (versão atual)",
    href: "https://esppgo.com.br/",
  },
} as const;

export const estrutura = {
  eyebrow: "Estrutura",
  titulo: "Um espaço construído para ensinar",
  texto:
    "A sede da ESPP, no Setor Central de Goiânia, recebeu R$ 302 mil em investimento do Governo de Goiás para reforma e melhoria da estrutura física, entregue em maio de 2024.",
  itens: [
    { icone: "school", valor: "10", label: "Salas de aula", texto: "Ambientes para turmas teóricas e atividades de formação." },
    { icone: "monitor", valor: "1", label: "Sala de informática", texto: "Laboratório para cursos de tecnologia, sistemas e provas." },
    { icone: "library", valor: "—", label: "Biblioteca", texto: "Acervo de apoio ao ensino, à pesquisa e à pós-graduação." },
    { icone: "mic", valor: "100", label: "Lugares no auditório", texto: "Aulas inaugurais, seminários, formaturas e eventos institucionais." },
  ],
  imagem: {
    src: "/images/formacao-policial-02.jpg",
    alt: "Policiais penais reunidos em atividade de formação da Escola Superior de Polícia Penal",
  },
} as const;

export const localizacao = {
  eyebrow: "Localização",
  titulo: "Onde estamos",
  texto:
    "A Escola Superior de Polícia Penal funciona no Setor Central de Goiânia. A Diretoria-Geral de Polícia Penal tem sede em endereço próprio, no Setor Leste Vila Nova.",
  endereco: {
    logradouro: "Av. Goiás, 1500",
    bairro: "Setor Central",
    cidade: "Goiânia",
    uf: "GO",
    completo: "Av. Goiás, 1500 — Setor Central, Goiânia/GO",
  }, // FONTE: policiapenal.go.gov.br/acesso-a-informacao/cargos-e-seus-ocupantes
  /** Consulta usada no embed e nos links do Google Maps (não exige chave de API) */
  mapaQuery: "Av. Goiás, 1500 - Setor Central, Goiânia - GO",
  geo: { lat: -16.6723, lng: -49.2588 }, // aproximado, para JSON-LD
  contatos: [
    { label: "Gestão", valor: "(62) 99649-5808", href: "tel:+5562996495808" },
    { label: "Secretaria", valor: "(62) 3270-8791", href: "tel:+556232708791" },
    { label: "Secretaria", valor: "(62) 3270-8792", href: "tel:+556232708792" },
    { label: "Biblioteca", valor: "(62) 3270-8795", href: "tel:+556232708795" },
    { label: "E-mail", valor: "ensino.dgpp@goias.gov.br", href: "mailto:ensino.dgpp@goias.gov.br" },
  ], // FONTE: policiapenal.go.gov.br/acesso-a-informacao/cargos-e-seus-ocupantes
  horario: "Atendimento em dias úteis, das 8h às 18h", // VALIDAR: horário oficial de atendimento
  sedeDgpp: {
    titulo: "Diretoria-Geral de Polícia Penal (DGPP)",
    endereco: "Rua 201, nº 430 — Setor Leste Vila Nova, Goiânia/GO — CEP 74643-050",
    telefone: "(62) 3270-8711",
    email: "protocolo-setorial.dgpp@goias.gov.br",
  },
} as const;

export const contato = {
  eyebrow: "Contato",
  titulo: "Fale com a Escola",
  texto:
    "Dúvidas sobre cursos, matrículas, certificados e processos seletivos podem ser encaminhadas aos canais da Escola ou aos canais oficiais da Polícia Penal de Goiás.",
  canais: [
    {
      icone: "mail",
      titulo: "E-mail do Ensino",
      valor: "ensino.dgpp@goias.gov.br",
      href: "mailto:ensino.dgpp@goias.gov.br",
    },
    {
      icone: "phone",
      titulo: "Secretaria da ESPP",
      valor: "(62) 3270-8791 / 3270-8792",
      href: "tel:+556232708791",
    },
    {
      icone: "megaphone",
      titulo: "Ouvidoria Geral",
      valor: "Registre manifestações e denúncias",
      href: "https://www.policiapenal.go.gov.br/",
    },
    {
      icone: "info",
      titulo: "Fale Conosco / Acesso à Informação",
      valor: "Portal oficial da Polícia Penal",
      href: "https://www.policiapenal.go.gov.br/acesso-a-informacao",
    },
  ],
  formulario: {
    titulo: "Envie uma mensagem",
    aviso:
      "O envio de mensagens por este formulário ainda não está ativo. Utilize, por enquanto, o e-mail ou os telefones da Escola.",
  },
  redes: [
    { label: "Instagram", href: "https://www.instagram.com/esppgoias/", handle: "@esppgoias" },
    { label: "Facebook", href: "https://www.facebook.com/esppgoias/", handle: "/esppgoias" },
  ],
} as const;

export const rodape = {
  texto:
    "Site institucional da Escola Superior de Polícia Penal, unidade de ensino da Diretoria-Geral de Polícia Penal do Estado de Goiás.",
  links: [
    { label: "Portal da Polícia Penal", href: "https://www.policiapenal.go.gov.br/" },
    { label: "Acesso à Informação", href: "https://www.policiapenal.go.gov.br/acesso-a-informacao" },
    { label: "Atos Normativos", href: "https://www.policiapenal.go.gov.br/" },
    { label: "LGPD", href: "https://www.policiapenal.go.gov.br/" },
    { label: "Ouvidoria", href: "https://www.policiapenal.go.gov.br/" },
    { label: "Secretaria de Segurança Pública", href: "https://goias.gov.br/seguranca/" },
  ],
} as const;
