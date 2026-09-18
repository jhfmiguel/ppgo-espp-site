import {
  Award,
  BarChart3,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Search,
  Users,
} from "lucide-react";

const menu = [
  { label: "Painel", icon: LayoutDashboard, ativo: true },
  { label: "Meus cursos", icon: GraduationCap },
  { label: "Turmas", icon: Users },
  { label: "Certificados", icon: Award },
  { label: "Biblioteca", icon: BookOpen },
  { label: "Relatórios", icon: BarChart3 },
];

const trilha = [
  { nome: "Execução de Polícia Penal — Pós lato sensu", pct: 72, meta: "360h de 500h" },
  { nome: "Uso Diferenciado da Força", pct: 100, meta: "Concluído" },
  { nome: "Direitos Humanos na Custódia", pct: 35, meta: "Em andamento" },
];

const barras = [42, 58, 51, 74, 66, 88, 79, 95, 71, 84, 62, 90];

/**
 * Representação da interface do FORTIS, construída em HTML/CSS.
 * Decorativa: escondida de leitores de tela, que recebem o texto da seção.
 */
export function FortisMockup() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-xl border border-ink-700 bg-ink-950 shadow-2xl shadow-black/40 select-none"
    >
      {/* barra da janela */}
      <div className="flex items-center gap-2 border-b border-ink-700 bg-ink-900 px-4 py-3">
        <span className="size-2.5 rounded-full bg-ink-600" />
        <span className="size-2.5 rounded-full bg-ink-600" />
        <span className="size-2.5 rounded-full bg-ink-600" />
        <div className="ml-3 flex-1 rounded bg-ink-850 px-3 py-1 text-[0.65rem] text-ink-400">
          fortis.espp.go.gov.br/painel
        </div>
      </div>

      <div className="flex">
        {/* menu lateral */}
        <aside className="hidden w-48 shrink-0 border-r border-ink-800 bg-ink-900 p-4 sm:block">
          <p className="title-display text-sm tracking-[0.2em] text-gold-500">
            FORTIS
          </p>
          <ul className="mt-5 space-y-1">
            {menu.map((item) => (
              <li
                key={item.label}
                className={[
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[0.7rem] font-medium",
                  item.ativo
                    ? "bg-gold-500/12 text-gold-400"
                    : "text-ink-400",
                ].join(" ")}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </li>
            ))}
          </ul>
        </aside>

        {/* conteúdo */}
        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.65rem] tracking-[0.18em] text-ink-400 uppercase">
                Portal do Aluno
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Bem-vindo, Policial Penal
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-md border border-ink-700 px-3 py-1.5 text-[0.65rem] text-ink-400 md:flex">
              <Search className="size-3" />
              Buscar cursos
            </div>
          </div>

          {/* indicadores */}
          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { valor: "12", label: "Cursos concluídos" },
              { valor: "486", label: "Horas registradas" },
              { valor: "3", label: "Certificados" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-lg border border-ink-800 bg-ink-900 p-3"
              >
                <p className="title-display text-xl text-gold-500 sm:text-2xl">
                  {kpi.valor}
                </p>
                <p className="mt-0.5 text-[0.6rem] leading-tight text-ink-400">
                  {kpi.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-5">
            {/* trilha de formação */}
            <div className="rounded-lg border border-ink-800 bg-ink-900 p-4 lg:col-span-3">
              <p className="text-[0.7rem] font-semibold text-white">
                Minha trilha de formação
              </p>
              <ul className="mt-4 space-y-3.5">
                {trilha.map((curso) => (
                  <li key={curso.nome}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate text-[0.65rem] text-ink-200">
                        {curso.nome}
                      </p>
                      <p className="shrink-0 text-[0.6rem] text-ink-400">
                        {curso.meta}
                      </p>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-800">
                      <div
                        className={[
                          "h-full rounded-full",
                          curso.pct === 100 ? "bg-forest-500" : "bg-gold-500",
                        ].join(" ")}
                        style={{ width: `${curso.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* gráfico de capacitações */}
            <div className="rounded-lg border border-ink-800 bg-ink-900 p-4 lg:col-span-2">
              <p className="text-[0.7rem] font-semibold text-white">
                Capacitações por mês
              </p>
              <div className="mt-4 flex h-24 items-end gap-1">
                {barras.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gold-500/70"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="mt-2 text-[0.6rem] text-ink-400">
                Exercício corrente · por unidade
              </p>
            </div>
          </div>

          {/* próximas turmas */}
          <div className="mt-3 rounded-lg border border-ink-800 bg-ink-900 p-4">
            <p className="text-[0.7rem] font-semibold text-white">
              Inscrições abertas
            </p>
            <ul className="mt-3 divide-y divide-ink-800">
              {[
                ["Curso Básico para Diretores de Unidades Prisionais", "Presencial", "Vagas: 40"],
                ["Inteligência Artificial na Prática", "Presencial", "Vagas: 10"],
                ["Enfrentamento à Violência Contra a Mulher", "Híbrido", "Vagas: 16"],
              ].map(([nome, modalidade, vagas]) => (
                <li
                  key={nome}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <p className="truncate text-[0.65rem] text-ink-200">{nome}</p>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden rounded border border-ink-700 px-1.5 py-0.5 text-[0.55rem] text-ink-400 sm:inline">
                      {modalidade}
                    </span>
                    <span className="text-[0.55rem] text-ink-400">{vagas}</span>
                    <span className="rounded bg-gold-500 px-2 py-0.5 text-[0.55rem] font-bold text-ink-950">
                      Inscrever
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
