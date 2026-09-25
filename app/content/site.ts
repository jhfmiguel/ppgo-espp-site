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

/** Barra utilitária e identidade do Governo de Goiás no topo do header. */
export const topbar = {
  href: "https://goias.gov.br",
  label: "GOIAS.GOV.BR",
};

export const goias = {
  nome: "Estado de",
  sigla: "GOIÁS",
  brasao: {
    src: "/images/Brasão_de_Goiás.svg",
    alt: "Brasão do Estado de Goiás",
  },
};

export const nav = [
  { label: "Início", href: "/" },
  {
    label: "A ESPP",
    submenu: [
      { label: "Institucional", href: "/institucional" },
      { label: "Localização", href: "/localizacao" },
      { label: "Estrutura", href: "/estrutura" },
      { label: "Acesso Restrito", href: "/admin", icone: "lock" },
    ],
  },
  {
    label: "Ensino",
    submenu: [
      { label: "Formação", href: "/formacao" },
      { label: "Cursos", href: "/cursos" },
      { label: "Matrizes Curriculares", href: "/matrizes-curriculares" },
    ],
  },
  {
    label: "Mídias",
    submenu: [
      { label: "Notícias", href: "/noticias" },
      { label: "Eventos", href: "/eventos" },
    ],
  },
  {
    label: "Normas e Regulamentos",
    submenu: [
      { label: "Regimento Interno", href: "/regimento-interno" },
      { label: "Atos Normativos", href: "/atos-normativos" },
      { label: "Documentos Institucionais", href: "/documentos" },
    ],
  },
  {
    label: "Serviços",
    submenu: [
      { group: "Fale Conosco" },
      { label: "Contato", href: "/contato" },
      { label: "Ouvidoria", href: "https://www.policiapenal.go.gov.br/ouvidoria", external: true },
    ],
  },
  { label: "LGPD", href: "https://goias.gov.br/casacivil/lei-geral-de-protecao-de-dados/", external: true },
  { label: "Portal do Aluno", href: "https://ead.policiapenal.go.gov.br/login/index.php", external: true },
] as const;

export const hero = {
  selo: "Credenciada como Escola de Governo pelo Conselho Estadual de Educação", // FONTE: goias.gov.br/seguranca
  titulo: "Escola Superior de Polícia Penal",
  subtitulo: "Goiás",
  texto:
    "A primeira escola de serviços penais do Brasil credenciada como Escola de Governo. Formar, aperfeiçoar e qualificar os servidores da Polícia Penal de Goiás com ensino, pesquisa e prática operacional.",
  ctaPrimario: { label: "Conheça a Escola", href: "/institucional" },
  ctaSecundario: { label: "Cursos e programas", href: "/formacao" },
  imagem: {
    src: "/images/hero-espp.png",
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
      href: "/matrizes-curriculares",
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
      cargaHoraria: "500 horas-aula",
      modalidade: "Presencial, com atividades assíncronas",
      nivel: "Lato sensu",
      texto:
        "Primeira especialização do país na área de execução penal, certificada pela ESPP. São 500 horas-aula, sendo 424 presenciais e 76 assíncronas mediadas por tecnologia.", // FONTE: PPC da Pós-Graduação lato sensu (ESPP, 2026)
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
      href: "/matrizes-curriculares",
      external: false,
    },
    {
      label: "Editais de cursos",
      href: "https://www.policiapenal.go.gov.br/",
      external: true,
    },
    {
      label: "Processos seletivos PPGO",
      href: "https://www.policiapenal.go.gov.br/",
      external: true,
    },
  ],
} as const;

/**
 * Cursos autorizados por portaria da DGPP, com link direto à portaria.
 * FONTE: policiapenal.go.gov.br/matrizes-curriculares-de-cursos-da-espp, capturado em 11/09/2026.
 * VALIDAR periodicamente contra o portal oficial, que é a fonte viva e mais atualizada
 * (disciplinas e carga horária por curso não são publicadas nessa listagem, só nas portarias).
 */
export const matrizes = {
  eyebrow: "Matrizes curriculares",
  titulo: "Cursos autorizados e matrizes curriculares",
  texto:
    "Todo curso ofertado pela ESPP é autorizado por portaria da Diretoria-Geral de Polícia Penal, que traz a matriz curricular, a carga horária e os requisitos de participação. Esta lista reúne os cursos autorizados entre 2022 e 2026, com link direto para a portaria de cada um.",
  fonteHref: "https://www.policiapenal.go.gov.br/matrizes-curriculares-de-cursos-da-espp",
  cursos: [
    { nome: "Curso Capacitação para Servidores da DGPP no Enfrentamento à Violência Contra a Mulher", ano: 2026, modalidade: "Presencial ou Online – Síncrono", vagas: 16, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-dgpp-no-239-de-18-de-julho-de-2026.html" },
    { nome: "Curso de Formação de Policiais Penais do Estado de Goiás – CFPPGO", ano: 2026, modalidade: "Presencial", vagas: 1058, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-dgpp-no-202-de-16-de-junho-de-2026.html" },
    { nome: "Curso Inteligência Artificial na Prática: Ferramentas, Agentes e Prompt Engineering para Otimização de Processos", ano: 2026, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-096-de-03-de-marco-de-2026.html" },
    { nome: "Curso Treinamento Aplicativo SAC24 Monitorado", ano: 2026, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-98-2026-de-04-de-marco-de-2026.html" },
    { nome: "Ação Formativa Institucional – Prova Oral no Processo Seletivo do Mestrado em Engenharia de Produção (UFG)", ano: 2026, modalidade: "A Distância – Síncrono", vagas: 3, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-31-de-28-de-janeiro-de-2026.html" },
    { nome: "Oficina de Capacitação no Armamento Carabina IMBEL IA2, Calibre 5,56 x 45 mm", ano: 2026, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-178-de-12-de-maio-de-2026.html" },
    { nome: "Curso Humanização do Atendimento ao Custodiado, Familiares dos Apenados e ao Público em Geral", ano: 2026, modalidade: "A Distância – Síncrono", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-dgpp-no-185-de-20-de-maio-de-2026.html" },
    { nome: "Curso Inteligência Emocional Aplicada ao Sistema Prisional", ano: 2026, modalidade: "Presencial", vagas: 20, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-dgpp-no-182-de-16-de-maio-de-2026.html" },
    { nome: "Curso de Noções Básicas de Corregedoria", ano: 2026, modalidade: "Presencial ou A Distância – Síncrono", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-14-de-14-de-janeiro-de-2026.html" },
    { nome: "Curso de Procedimentos Operacionais no Manejo e Custódia de Pessoas Privadas de Liberdade em Unidade Policial", ano: 2026, modalidade: "Presencial", vagas: 8, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-169-de-05-de-maio-de-2026.html" },
    { nome: "Curso de Retenção e Contrarretenção de Arma de Fogo", ano: 2026, modalidade: "Presencial", vagas: 8, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-dgpp-no-183-de-19-de-maio-de-2026.html" },

    { nome: "Curso Ética e Direitos Humanos", ano: 2025, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-144-de-19-de-marco-de-2025-2.html" },
    { nome: "Curso Avançado de Rotinas Administrativas", ano: 2025, modalidade: "Presencial", vagas: 15, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-424-de-06-de-outubro-de-2025.html" },
    { nome: "Curso Básico de Diretor de Unidade Prisional", ano: 2025, modalidade: "Presencial", vagas: 102, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-74-de-07-de-fevereiro-de-2025-2.html" },
    { nome: "Curso de Análise Avançada do Sistema de Monitoração Eletrônica", ano: 2025, modalidade: "Presencial", vagas: 50, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-145-de-19-de-marco-de-2025-2.html" },
    { nome: "Curso de Cumprimento de Alvará de Soltura", ano: 2025, modalidade: "Presencial ou A Distância – Síncrono", vagas: 5, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-406-de-01-de-outubro-de-2025.html" },
    { nome: "Curso de Educação Financeira", ano: 2025, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/sem-categoria/portaria-no-146-de-20-de-marco-de-2025-2.html" },
    { nome: "Curso de Execução do Plano de Ação – OCISPE/2025 e Plano nº 2/2025 DGPP/GEIO", ano: 2025, modalidade: "Presencial", vagas: 6, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-511-2025-de-19-de-dezembro-de-2025.html" },
    { nome: "Curso de Rotinas Administrativas II", ano: 2025, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/sem-categoria/portaria-no-149-de-20-de-marco-de-2025.html" },
    { nome: "Curso Educação Financeira e Investimentos para Aposentadoria", ano: 2025, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/atos-internos/portaria-no-300-de-15-de-julho-de-2025-2.html" },
    { nome: "Curso Procedimento Administrativo Disciplinar de Custodiado", ano: 2025, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/sem-categoria/portaria-no-148-de-20-de-marco-de-2025-2.html" },
    { nome: "Curso Procedimento Operacional Padrão – POPPEN – Nível Operacional", ano: 2025, modalidade: "A Distância – Assíncrono", vagas: 80, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-438-de-15-de-outubro-de-2025.html" },
    { nome: "Curso Técnicas Operacionais de Algemamento e Condução de Pessoas Privadas de Liberdade", ano: 2025, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/atos-internos/portaria-no-355-de-15-de-agosto-de-2025-2.html" },
    { nome: "Curso Procedimentos Operacionais em Guaritas e Muralhas", ano: 2025, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-494-2025-de-03-de-dezembro-de-2025.html" },
    { nome: "Curso de Habilitação no Armamento Pistola Taurus PT 100, Calibre .40 S&W", ano: 2025, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-140-de-18-de-marco-de-2025-2.html" },
    { nome: "Curso de Habilitação no Armamento Carabina IWI Arad, Calibre 5,56 x 45 mm", ano: 2025, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/atos-internos/portaria-no-220-de-12-de-maio-de-2025.html" },
    { nome: "Curso de Habilitação no Armamento Espingarda CBC Modelo 586.2, Gauge 12", ano: 2025, modalidade: "Presencial", vagas: 20, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-365-de-25-de-agosto-de-2025-2.html" },
    { nome: "Curso de Instrutor de Atendimento Pré-Hospitalar Tático – Protocolo MARCH", ano: 2025, modalidade: "Híbrido: Presencial e A Distância – Assíncrono", vagas: 60, portariaHref: "https://www.policiapenal.go.gov.br/sem-categoria/portaria-no-373-de-01-de-setembro-de-2025.html" },
    { nome: "Curso de Nível Básico do Sistema de Gestão e Governança da Polícia Penal de Goiás – SIGGO/PPGO", ano: 2025, modalidade: "Presencial", vagas: 5, portariaHref: "https://www.policiapenal.go.gov.br/sem-categoria/portaria-no-153-de-24-de-marco-de-2025-4.html" },
    { nome: "Curso de Nível Operador do Sistema de Gestão e Governança da Polícia Penal de Goiás – SIGGO/PPGO", ano: 2025, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-78-de-11-de-fevereiro-de-2025-2.html" },
    { nome: "Curso de Noções de Balística: Desmistificando Mitos da Realidade Operacional", ano: 2025, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-469-de-14-de-novembro-de-2025.html" },

    { nome: "Curso de Formação de Agentes de Segurança Prisional (2014)", ano: 2024, modalidade: "Presencial", vagas: 80, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-153-de-30-de-abril-de-2024-dispoe-sobre-o-curso-de-formacao-de-agente-de-seguranca-prisional-edital-001-2014-de-28-de-novembro-de-2014.html" },
    { nome: "Curso Registro de Atendimento Integrado para Servidores da Polícia Penal", ano: 2024, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-88-de-15-de-marco-de-2024-dispoe-sobre-a-convocacao-de-servidores-para-o-curso-registro-de-atendimento-integrado-para-servidores-da-policia-penal.html" },
    { nome: "Curso de Direção Defensiva – CDD", ano: 2024, modalidade: "Híbrido: Presencial e EAD", vagas: 90, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/atos-internos/portaria-no-397-de-08-de-outubro-de-2024.html" },
    { nome: "Curso Ética e Responsabilidade Profissional no Serviço Público", ano: 2024, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-301-de-07-de-agosto-de-2024-dispoe-sobre-convocacao-de-servidores-para-o-curso-etica-e-responsabilidade-profissional-no-servico-publico.html" },
    { nome: "Curso Básico de Capacitação para Gestão de Alternativas Penais no Contexto da Monitoração Eletrônica", ano: 2024, modalidade: "Presencial", vagas: 5, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-454-de-03-de-dezembro-de-2024-2.html" },
    { nome: "Curso Básico de Capacitação para Gestão de Alternativas Penais", ano: 2024, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/atos-internos/portaria-no-408-de-14-de-outubro-de-2024.html" },
    { nome: "Curso de Excel Básico – 1ª Edição", ano: 2024, modalidade: "Presencial", vagas: 20, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-64-de-27-de-fevereiro-de-2024-dispoe-sobre-o-curso-excel-basico-1a-edicao-para-servidores-da-policia-penal-da-1a-regional.html" },
    { nome: "Curso Manual de Redação Oficial do Estado de Goiás – 1ª Edição/2024", ano: 2024, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-69-de-04-de-marco-de-2024-autoriza-e-homologa-o-curso-manual-de-redacao-oficial-do-estado-de-goias-1a-edicao-2024-para-a-7a-e-6a-coordenacao-regional-prisional.html" },
    { nome: "Curso de Armamento e Tiro para Magistrados da 3ª Coordenação Regional Prisional", ano: 2024, modalidade: "Presencial", vagas: 6, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-325-de-23-de-agosto-de-2024-autoriza-e-homologa-o-i-curso-de-armamento-e-tiro-para-magistrados-da-3a-coordenacao-regional-prisional.html" },
    { nome: "Curso de Defesa Pessoal Feminina", ano: 2024, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-139-de-18-de-abril-de-2024-dispoe-sobre-autorizacao-do-curso-de-defesa-pessoal-feminina-as-servidoras-da-controladoria-geral-do-estado-de-goias.html" },
    { nome: "Curso de Instrumento de Menor Potencial Ofensivo – IMPO", ano: 2024, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-151-de-29-de-abril-de-2024-dispoe-sobre-a-criacao-do-curso-de-instrumento-de-menor-potencial-ofensivo-impo.html" },
    { nome: "Curso de Inteligência Prisional – CIP", ano: 2024, modalidade: "Presencial", vagas: 220, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-348-de-09-de-setembro-de-2024-2.html" },
    { nome: "Curso de Intervenção Básica – CIB", ano: 2024, modalidade: "Presencial", vagas: 100, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/atos-internos/portaria-no-345-de-06-de-setembro-de-2024.html" },
    { nome: "Curso de Operador de Rádio Comunicador (HT) Hytera P580H", ano: 2024, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-199-de-06-de-junho-de-2024-dispoe-sobre-autorizacao-do-curso-de-operador-de-radio-comunicador-ht-hytera-modelo-p580h-aos-servidores-da-policia-tecnico-cientifica-do-estado-de-goias-pt.html" },
    { nome: "Curso de Políticas Penais e Direitos Humanos", ano: 2024, modalidade: "Presencial", vagas: 10, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portarias/portaria-no-409-de-15-de-outubro-de-2024-dispoe-sobre-a-homologacao-do-curso-de-politicas-penais-e-direitos-humanos.html" },
    { nome: "Curso para a Formação de Instrutor de Direção Policial", ano: 2024, modalidade: "Presencial", vagas: 260, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/atos-internos/portaria-no-431-2024-de-07-de-novembro-de-2024-2.html" },

    { nome: "Curso Procedimento Administrativo Disciplinar de Custodiado", ano: 2023, modalidade: "Presencial", vagas: 20, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-300-de-29-de-setembro-de-2023-dispoe-sobre-a-convocacao-de-servidores-para-o-curso-procedimento-administrativo-disciplinar-de-custodiado.html" },
    { nome: "Oficina de Defesa Pessoal, Uso do Bastão PR24 e Manuseio da Espingarda Gauge 12 CBC Military 3.0", ano: 2023, modalidade: "Presencial", vagas: 14, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-197-de-20-de-junho-de-2023-cria-e-homologa-a-oficina-de-defesa-pessoal-uso-do-bastao-pr24-e-manuseio-da-espingarda-gauge-12-cbc-military-3-0.html" },
    { nome: "Curso Formação de Agentes Socioeducativos (Acordo de Cooperação)", ano: 2023, modalidade: "Presencial", vagas: 50, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-250-de-15-de-agosto-de-2023-dispoe-sobre-curso-formacao-de-agentes-socioeducativos-para-os-servidores-do-centro-de-atendimento-socioeducativo-case-do-municipio-de-ita.html" },
    { nome: "Curso de Habilitação no Armamento IMBEL MD6TC", ano: 2023, modalidade: "Presencial", vagas: 8, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-49-de-13-de-fevereiro-de-2023-dispoe-sobre-curso-de-habilitacao-no-armamento-imbel-md6tc.html" },

    { nome: "Curso Manual de Redação Oficial do Estado de Goiás", ano: 2022, modalidade: "Presencial", vagas: 8, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-70-de-24-de-fevereiro-de-2022-dispoe-sobre-o-curso-manual-de-redacao-oficial-do-estado-de-goias-para-os-servidores-da-policia-penal.html" },
    { nome: "Curso Procedimento Operacional Padrão Penitenciário – POPPEN – Nível Operacional", ano: 2022, modalidade: "A Distância – Síncrono", vagas: 80, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-451-de-07-de-outubro-de-2022-dispoe-sobre-o-curso-procedimento-operacional-padrao-poppen-nivel-operacional-para-os-servidores-da-policia-penal.html" },
    { nome: "Curso de Intervenção e Controle de Crises em Ambiente Socioeducativo", ano: 2022, modalidade: "Presencial", vagas: 40, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-451-de-07-de-outubro-de-2022-dispoe-sobre-curso-de-intervencao-e-controle-de-crises-em-ambiente-socioeducativo-para-os-servidores-da-secretaria-de-estado-de-desenvolvimento-social.html" },
    { nome: "Curso de Pistola Beretta APX Calibre 9 mm", ano: 2022, modalidade: "Presencial", vagas: 8, portariaHref: "https://www.policiapenal.go.gov.br/atos-normativos/portaria-no-451-de-07-de-outubro-de-2022-dispoe-sobre-o-curso-procedimento-operacional-padrao-poppen-nivel-operacional-para-os-servidores-da-policia-penal.html" },
  ],
} as const;

/** Notícias de exemplo — conteúdo de rascunho a ser substituído pela ESPP. VALIDAR. */
/**
 * Cabeçalho da seção de notícias.
 *
 * As notícias em si não ficam mais aqui: são gerenciadas pelo painel
 * administrativo (/admin) e obtidas da API Spring Boot através de
 * `lib/data/store.ts`.
 */
export const noticias = {
  eyebrow: "Notícias",
  titulo: "O que está acontecendo na Escola",
  texto:
    "Últimas novidades sobre cursos, turmas e parcerias da ESPP.",
} as const;

/** Cabeçalho da agenda de eventos — itens gerenciados pelo painel (/admin). */
export const eventos = {
  eyebrow: "Agenda",
  titulo: "Eventos da Escola",
  texto:
    "Aulas inaugurais, seminários, capacitações e solenidades da Escola Superior de Polícia Penal.",
} as const;

/** Cards de navegação da home para as demais áreas do site. */
export const areas = {
  eyebrow: "Explore o site",
  titulo: "Conheça cada área da Escola",
  texto: "Navegue pelas páginas do site para saber mais sobre a ESPP, seus cursos e seus canais de atendimento.",
  itens: [
    { icone: "info", titulo: "Institucional", texto: "Missão, história e marcos da Escola.", href: "/institucional" },
    { icone: "graduation", titulo: "Formação", texto: "Eixos de formação, do ingresso à pós-graduação.", href: "/formacao" },
    { icone: "book", titulo: "Cursos", texto: "Oferta em destaque de cursos e programas.", href: "/cursos" },
    { icone: "library", titulo: "Matrizes Curriculares", texto: "Cursos autorizados por portaria, com matriz curricular.", href: "/matrizes-curriculares" },
    { icone: "file", titulo: "Documentos", texto: "PDI, PED, projetos pedagógicos e regulamentos em PDF.", href: "/documentos" },
    { icone: "megaphone", titulo: "Notícias", texto: "Últimas novidades da Escola.", href: "/noticias" },
    { icone: "monitor", titulo: "FORTIS", texto: "A futura plataforma única de ensino e gestão escolar.", href: "/fortis" },
    { icone: "school", titulo: "Estrutura", texto: "Conheça a sede da ESPP em Goiânia.", href: "/estrutura" },
    { icone: "mail", titulo: "Contato", texto: "Fale com a Escola pelos canais oficiais.", href: "/contato" },
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
    label: "Portal do Aluno",
    href: "https://ead.policiapenal.go.gov.br/login/index.php",
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
    logradouro: "Av. Goiás, nº 1500, Quadra 124, Lote 156E",
    bairro: "Setor Central",
    cidade: "Goiânia",
    uf: "GO",
    completo: "Av. Goiás, nº 1500, Quadra 124, Lote 156E — Setor Central, Goiânia/GO",
  }, // FONTE: endereço oficial no quadro "Dados institucionais" do PDI ESPP 2026–2030
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

/**
 * Página de Acessibilidade. VALIDAR: nível de conformidade declarado deve
 * ser confirmado pela ESPP após auditoria (hoje reflete o que foi
 * efetivamente implementado no site, não uma certificação formal).
 */
export const acessibilidade = {
  eyebrow: "Acessibilidade",
  titulo: "Compromisso com a acessibilidade digital",
  texto:
    "Este site segue o Modelo de Acessibilidade em Governo Eletrônico (eMAG 3.1) e busca atender às Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1, nível AA, para garantir o acesso à informação a todas as pessoas, incluindo aquelas com deficiências visuais, auditivas, motoras, cognitivas e de aprendizagem.",
  recursos: [
    {
      titulo: "Aumento e redução de fonte",
      texto: "Os botões A-, A e A+ na barra superior alteram o tamanho do texto em todo o site, sem quebrar o layout.",
    },
    {
      titulo: "Alto contraste",
      texto: "O botão \"Alto contraste\" na barra superior alterna para uma paleta preto, branco e amarelo, com maior contraste entre texto e fundo.",
    },
    {
      titulo: "Navegação por teclado",
      texto: "Todo o site pode ser percorrido com o teclado (Tab/Shift+Tab), com indicação visual clara do elemento em foco.",
    },
    {
      titulo: "Atalho para o conteúdo",
      texto: "Um link \"Ir para o conteúdo principal\", visível ao navegar por teclado, permite pular o cabeçalho e o menu.",
    },
    {
      titulo: "Estrutura semântica",
      texto: "Cabeçalho, menu, conteúdo principal e rodapé são marcados com landmarks HTML5 (header, nav, main, footer), facilitando a navegação por leitores de tela.",
    },
    {
      titulo: "Texto alternativo em imagens",
      texto: "Fotos e ilustrações informativas têm descrição textual (alt); imagens puramente decorativas são ocultadas de leitores de tela.",
    },
  ],
  limitacoes:
    "Este site está em desenvolvimento contínuo e pode conter trechos que ainda não atendem plenamente às diretrizes do eMAG e da WCAG 2.1. Encontrou uma barreira de acesso? Avise a Escola pelos canais abaixo.", // VALIDAR
  contato: {
    label: "E-mail do Ensino",
    valor: "ensino.dgpp@goias.gov.br",
    href: "mailto:ensino.dgpp@goias.gov.br",
  },
} as const;

/** FONTE: legisla.casacivil.go.gov.br (portal de atos normativos do Estado de Goiás) */
export const regimentoInterno = {
  eyebrow: "Normas e Regulamentos",
  titulo: "Regimento Interno da ESPP",
  texto:
    "O Regimento Interno da Escola Superior de Polícia Penal foi aprovado pela Portaria DGPP nº 285, de 01 de setembro de 2026, que revogou a norma anterior sobre o tema.",
  portaria: {
    numero: "Portaria DGPP nº 285, de 01 de setembro de 2026",
    ementa:
      "Aprova o Regimento Interno da Escola Superior de Polícia Penal - ESPP e revoga a Portaria DGPP nº 103, de 29 de março de 2024.",
    href: "https://legisla.casacivil.go.gov.br/pesquisa_ato_infralegal/dgpp/25823/portaria-285",
  },
  revogada: {
    numero: "Portaria DGPP nº 103, de 29 de março de 2024",
    texto: "Norma revogada pela Portaria DGPP nº 285/2026.",
    href: "https://legisla.casacivil.go.gov.br/pesquisa_ato_infralegal/dgpp/25807/portaria-103",
  },
} as const;

/**
 * Linha do tempo de atos normativos da ESPP/DGPP. Conteúdo de EXEMPLO,
 * a ser substituído pela relação oficial e completa dos atos publicados
 * (portal da Polícia Penal e legisla.casacivil.go.gov.br). VALIDAR.
 */
/**
 * Cabeçalho da página de Atos Normativos.
 *
 * Os atos em si são gerenciados pelo painel administrativo (/admin) pelo perfil
 * administrador e obtidos da API Spring Boot através de `lib/data/store.ts`.
 */
export const atosNormativos = {
  eyebrow: "Normas e Regulamentos",
  titulo: "Atos Normativos",
  texto:
    "Linha do tempo com os principais atos normativos da Escola — portarias, editais, resoluções e instruções normativas. A relação completa e atualizada está disponível no Diário Oficial e no portal da Polícia Penal.",
  fonteHref: "https://legisla.casacivil.go.gov.br/",
} as const;

/**
 * Biblioteca de documentos institucionais publicados em PDF.
 *
 * Os arquivos vivem em `public/docs/` e o `slug` de cada item é, ao mesmo
 * tempo, o nome do arquivo e a rota do leitor interno (`/documentos/<slug>`),
 * de modo que o PDF é aberto dentro do próprio site.
 *
 * FONTE: peças do Processo SEI nº 202616448087829 (recredenciamento da ESPP)
 * e instrumentos institucionais da Escola, capturados em 15/09/2026.
 */
export const documentos = {
  eyebrow: "Normas e Regulamentos",
  titulo: "Documentos Institucionais",
  texto:
    "Instrumentos de planejamento, projetos pedagógicos, regulamentos e peças do processo de recredenciamento da Escola Superior de Polícia Penal. Todos os documentos podem ser lidos aqui mesmo, no site, ou baixados em PDF.",
  aviso:
    "Os documentos reproduzidos nesta página são as versões apresentadas ao Conselho Estadual de Educação de Goiás no processo de recredenciamento da Escola. Em caso de divergência, prevalece a versão oficial constante do Processo SEI nº 202616448087829.",
  categorias: [
    {
      id: "planejamento",
      icone: "clipboard",
      titulo: "Planejamento institucional",
      texto:
        "Instrumentos que definem a identidade, as metas e a trajetória da Escola no ciclo 2026–2030.",
      itens: [
        {
          slug: "pdi-espp-2026-2030",
          titulo: "Plano de Desenvolvimento Institucional — PDI 2026–2030",
          tituloCurto: "PDI 2026–2030",
          tipo: "Plano institucional",
          ano: 2026,
          paginas: 24,
          resumo:
            "Documento central do planejamento da ESPP. Reúne perfil e histórico institucional, identidade e inserção regional, síntese do Projeto Pedagógico Institucional (PPI), Plano Estratégico de Gestão 2026–2030, organização acadêmico-administrativa, corpo docente, políticas de atendimento aos discentes, avaliação institucional, infraestrutura física, bibliográfica e tecnológica, sustentabilidade financeira e a matriz de conformidade normativa do próprio PDI.",
          referencia: "Elaborado para o ciclo 2026–2030 e para instrução do recredenciamento da ESPP como Escola de Governo perante o CEE/GO.",
        },
        {
          slug: "ped-espp-2026-2030",
          titulo: "Plano Estratégico de Desenvolvimento — PED 2026–2030",
          tituloCurto: "PED 2026–2030",
          tipo: "Plano estratégico",
          ano: 2026,
          paginas: 15,
          resumo:
            "Instrumento de execução e acompanhamento das diretrizes do PDI. Estabelece o direcionamento estratégico da Escola, seus eixos estratégicos para 2026–2030 e a articulação com o Planejamento Estratégico da Polícia Penal de Goiás 2024–2027, da Diretoria-Geral de Polícia Penal, mantenedora da ESPP.",
          referencia: "Articulado ao PDI 2026–2030 e ao Planejamento Estratégico da DGPP 2024–2027.",
        },
      ],
    },
    {
      id: "pos-graduacao",
      icone: "graduation",
      titulo: "Pós-graduação lato sensu",
      texto:
        "Projeto pedagógico, operacionalização da matriz curricular e regulamento do trabalho de conclusão do curso de especialização da Escola.",
      itens: [
        {
          slug: "ppc-pos-graduacao-espp",
          titulo: "Projeto Pedagógico do Curso — PPC da Pós-Graduação lato sensu",
          tituloCurto: "PPC da Pós-Graduação",
          tipo: "Projeto pedagógico",
          ano: 2026,
          paginas: 29,
          resumo:
            "Versão revisada do Projeto Pedagógico do Curso de Pós-Graduação lato sensu em Execução de Atividade de Polícia Penal: objetivos, perfil do egresso e competências, público-alvo e ingresso, concepção pedagógica, organização curricular, avaliação da aprendizagem, pesquisa e metodologia científica, TCC, estágio supervisionado, corpo docente, infraestrutura e mecanismos de gestão acadêmica.",
          referencia:
            "Curso de 500 horas-aula (424 presenciais e 76 assíncronas). A denominação “Execução de Atividade de Polícia Penal” é proposta de atualização do nome autorizado pela Resolução CEE/CES nº 19/2024 e depende de manifestação do CEE/GO.",
        },
        {
          slug: "plano-matriz-pos-graduacao-espp",
          titulo:
            "Plano de Desenvolvimento e Operacionalização Didático-Pedagógica da Matriz Curricular",
          tituloCurto: "Operacionalização da Matriz Curricular",
          tipo: "Plano didático-pedagógico",
          ano: 2026,
          paginas: 102,
          resumo:
            "Detalhamento disciplina por disciplina da matriz curricular da pós-graduação, organizado em eixos e módulos temáticos — de Administração Penitenciária a Relações Humanas e Reinserção Social e Servidor Penitenciário —, com planos sintéticos, conteúdos, bibliografias e diretrizes de atuação docente.",
          referencia: "Correspondente ao PPC da Pós-Graduação lato sensu em Execução de Atividade de Polícia Penal.",
        },
        {
          slug: "regulamento-tcc-pos-graduacao-espp",
          titulo: "Regulamento do Trabalho de Conclusão de Curso — TCC",
          tituloCurto: "Regulamento do TCC",
          tipo: "Regulamento",
          ano: 2026,
          paginas: 14,
          resumo:
            "Disciplina a elaboração, a orientação, o depósito e a avaliação do TCC da pós-graduação: finalidades e princípios acadêmicos, requisitos do trabalho, ética, proteção de dados e integridade acadêmica, modalidades de avaliação com e sem apresentação oral, critérios de nota, versão final, gestão documental e direitos autorais. Inclui as fichas de avaliação em anexo.",
        },
      ],
    },
    {
      id: "biblioteca",
      icone: "library",
      titulo: "Biblioteca",
      texto: "Norma que organiza o acervo, o atendimento e o uso dos espaços da biblioteca da Escola.",
      itens: [
        {
          slug: "regulamento-biblioteca-espp",
          titulo: "Regulamento da Biblioteca da ESPP",
          tituloCurto: "Regulamento da Biblioteca",
          tipo: "Regulamento",
          ano: 2026,
          paginas: 11,
          resumo:
            "Estabelece a organização, a gestão e o funcionamento da biblioteca: acervo e sistema informatizado, cadastro de usuários, consulta, empréstimo, renovação, reserva e devolução, tratamento de perdas e danos, conservação e inventário, desenvolvimento e atualização do acervo, acervo digital e produção acadêmica, uso dos espaços e recursos de informática, acessibilidade, direitos e deveres dos usuários e competências da administração.",
        },
      ],
    },
    {
      id: "recredenciamento",
      icone: "award",
      titulo: "Dossiê de recredenciamento",
      texto:
        "Peças técnicas que instruem o pedido de recredenciamento da ESPP como Escola de Governo perante o Conselho Estadual de Educação de Goiás.",
      itens: [
        {
          slug: "nota-tecnica-complementacao-documental",
          titulo: "Complementação e Consolidação Documental do Recredenciamento",
          tituloCurto: "Nota Técnica nº 1/2026",
          tipo: "Nota Técnica",
          ano: 2026,
          paginas: 7,
          resumo:
            "Peça que inaugura o bloco de complementação documental do pedido de recredenciamento. Formaliza a lógica jurídica, documental e probatória da instrução, explicita a correlação entre as exigências normativas e os documentos que as demonstram e orienta a juntada das versões atualizadas dos instrumentos institucionais.",
          referencia: "Nota Técnica nº 1/2026/DGPP/GAB-DGPP-16450 — SEI nº 95095763.",
        },
        {
          slug: "indice-geral-matriz-conformidade",
          titulo: "Índice Geral e Matriz de Conformidade do Recredenciamento",
          tituloCurto: "Índice Geral e Matriz de Conformidade",
          tipo: "Índice",
          ano: 2026,
          paginas: 4,
          resumo:
            "Instrumento de rastreabilidade regulatória do dossiê. Organiza os documentos por eixos substanciais — PDI, PPI, Regimento, PPC, biblioteca, corpo docente, avaliação institucional, infraestrutura e regularidade cadastral —, identificando, para cada eixo, o documento principal, sua função regulatória e as evidências vinculadas.",
          referencia: "SEI nº 95126355. Fundamentado na Resolução CEE/CP nº 04/2023, na Resolução CEE/Pleno nº 06/2015 e na Portaria DGPP nº 248/2026.",
        },
        {
          slug: "relatorio-atendimento-determinacoes",
          titulo: "Atendimento às Determinações e à Recomendação do Ato de Credenciamento",
          tituloCurto: "Relatório nº 5/2026",
          tipo: "Relatório",
          ano: 2026,
          paginas: 6,
          resumo:
            "Demonstra o cumprimento das três providências fixadas nos arts. 3º, 4º e 5º da Resolução CEE/CES nº 19/2024: a apresentação do Regimento Interno da unidade acadêmica, a ampliação do acervo bibliográfico e das obras correlatas aos cursos e a recomendação de adequação cadastral. Para cada dispositivo, apresenta o objeto, a cadeia documental, a evidência disponível e a conclusão probatória.",
          referencia: "Relatório nº 5/2026 DGPP/GAB-DGPP-16450 — SEI nº 95128508.",
        },
        {
          slug: "relatorio-analitico-institucional",
          titulo: "Relatório Analítico Institucional — Ciclo 2024–2026",
          tituloCurto: "Relatório Analítico Institucional",
          tipo: "Relatório",
          ano: 2026,
          paginas: 8,
          resumo:
            "Análise das condições acadêmicas, pedagógicas, docentes, administrativas, estruturais e tecnológicas da Escola no ciclo de credenciamento 2024–2026. Cobre as atividades de ensino, as avaliações interna e externa e a autoavaliação institucional, a composição do corpo docente por titulação, as instalações, os acervos físico e virtual, as tecnologias de informação e comunicação e a experiência acumulada em pós-graduação e educação continuada.",
          referencia:
            "Relatório nº 6/2026 DGPP/GAB-DGPP-16450 — SEI nº 95145727. Período de análise: 15 de março de 2024 a 31 de agosto de 2026. Atende ao art. 39, § 1º, III, da Resolução CEE/CP nº 04/2023.",
        },
      ],
    },
  ],
} as const;

/** Seção de recredenciamento exibida na página Institucional. */
export const recredenciamento = {
  eyebrow: "Recredenciamento",
  titulo: "Um novo ciclo como Escola de Governo",
  paragrafos: [
    "A ESPP foi credenciada como Escola de Governo pela Resolução CEE/CES nº 19, de 15 de março de 2024, que também autorizou o curso de Pós-Graduação lato sensu em Execução da Polícia Penal, com 500 horas. O credenciamento vigora até 31 de dezembro de 2026.",
    "Para o novo ciclo institucional, a Diretoria-Geral de Polícia Penal protocolou o pedido de recredenciamento da Escola perante o Conselho Estadual de Educação de Goiás. A instrução do processo é conduzida pela Comissão Interna instituída pela Portaria DGPP nº 248, de 15 de julho de 2026, encarregada de revisar e consolidar os instrumentos institucionais da Escola — PDI, PED, Projeto Pedagógico do Curso, regulamentos da biblioteca e do TCC — e de comprovar a evolução do corpo docente, da infraestrutura e do acervo bibliográfico.",
    "Todo o conjunto documental que instrui o pedido está publicado neste site e pode ser lido integralmente, sem download.",
  ],
  ficha: [
    { label: "Mantenedora", valor: "Diretoria-Geral de Polícia Penal — DGPP" },
    {
      label: "Natureza",
      valor: "Escola de Governo integrante do Sistema Estadual de Educação Superior de Goiás",
    },
    { label: "Ato de instituição", valor: "Portaria DGPP nº 363, de 14 de novembro de 2023" },
    { label: "Credenciamento vigente", valor: "Resolução CEE/CES nº 19, de 15 de março de 2024 — até 31/12/2026" },
    { label: "Processo de recredenciamento", valor: "Processo SEI nº 202616448087829" },
    { label: "Curso autorizado", valor: "Pós-Graduação lato sensu em Execução da Polícia Penal — 500 horas" },
    { label: "Ciclo de planejamento", valor: "2026–2030 (PDI e PED)" },
    { label: "Vinculação administrativa", valor: "Diretoria-Geral Adjunta da DGPP — Decreto nº 10.785/2025" },
    { label: "CNPJ (estabelecimento filial)", valor: "29.394.729/0002-52" },
  ], // FONTE: PDI_ESPP 2026–2030 e PED_ESPP 2026–2030, quadro "Dados institucionais"
  cta: { label: "Ver todos os documentos", href: "/documentos" },
  /** Faixa de destaque exibida na home, logo após o hero. */
  destaque: {
    selo: "Processo em andamento",
    titulo: "Recredenciamento como Escola de Governo",
    texto:
      "A ESPP está em processo de recredenciamento perante o Conselho Estadual de Educação de Goiás para o ciclo 2026–2030. O Plano de Desenvolvimento Institucional e todas as peças que instruem o pedido estão abertos à consulta pública, aqui no site.",
    ctaPdi: {
      label: "Ler o PDI 2026–2030",
      href: "/documentos/pdi-espp-2026-2030",
      detalhe: "PDF · 24 páginas · leitura no site",
    },
    ctaDossie: { label: "Ver o dossiê completo", href: "/documentos" },
    ctaProcesso: { label: "Entenda o processo", href: "/institucional#recredenciamento" },
    fatos: [
      { label: "Credenciamento vigente", valor: "até 31/12/2026" },
      { label: "Ciclo de planejamento", valor: "2026–2030" },
      { label: "Processo SEI", valor: "202616448087829" },
    ],
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
    { label: "Mapa do site", href: "/mapa-do-site", interno: true },
    { label: "Portal da Polícia Penal", href: "https://www.policiapenal.go.gov.br/" },
    { label: "Acesso à Informação", href: "https://www.policiapenal.go.gov.br/acesso-a-informacao" },
    { label: "Atos Normativos", href: "/atos-normativos", interno: true },
    { label: "Documentos Institucionais", href: "/documentos", interno: true },
    { label: "LGPD", href: "https://goias.gov.br/casacivil/lei-geral-de-protecao-de-dados/" },
    { label: "Ouvidoria", href: "https://www.policiapenal.go.gov.br/" },
    { label: "Secretaria de Segurança Pública", href: "https://goias.gov.br/seguranca/" },
  ],
} as const;

