import Link from "next/link";

import { TituloPagina } from "@/components/admin/ui";
import { exigirPermissao } from "@/lib/auth/dal";
import { listarAuditoria } from "@/lib/data/auditoria";

const ROTULO_MODULO: Record<string, string> = {
  NOTICIAS: "Notícias",
  EVENTOS: "Eventos",
  ATOS_NORMATIVOS: "Atos normativos",
  MENSAGENS: "Mensagens",
  NEWSLETTER_ASSINANTES: "Assinantes da newsletter",
  NEWSLETTER_CAMPANHAS: "Campanhas da newsletter",
  USUARIOS_AUTORIZADOS: "Usuários e permissões",\n  CONFIGURACOES: "Configurações",
};

const ROTULO_ACAO: Record<string, string> = {
  CRIACAO: "Criação",
  EDICAO: "Edição",
  EXCLUSAO: "Exclusão",
};

type Filtros = {
  usuario?: string;
  modulo?: string;
  acao?: string;
  inicio?: string;
  fim?: string;
  termo?: string;
};

function formatarData(valor: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(valor));
}

function detalheJson(valor: string | null, rotulo: string) {
  if (!valor) return <span className="text-ink-400">—</span>;

  let texto = valor;
  try {
    texto = JSON.stringify(JSON.parse(valor), null, 2);
  } catch {
    // Mantém o conteúdo original se não for JSON válido.
  }

  return (
    <details>
      <summary className="cursor-pointer font-semibold text-ink-700 hover:text-ink-900">
        {rotulo}
      </summary>
      <pre className="mt-2 max-h-72 max-w-xl overflow-auto whitespace-pre-wrap rounded-md bg-ink-950 p-3 text-[11px] leading-relaxed text-ink-100">
        {texto}
      </pre>
    </details>
  );
}

function aplicarFiltros(
  registros: Awaited<ReturnType<typeof listarAuditoria>>,
  filtros: Filtros,
) {
  const usuario = filtros.usuario?.trim().toLocaleLowerCase("pt-BR");
  const termo = filtros.termo?.trim().toLocaleLowerCase("pt-BR");
  const inicio = filtros.inicio ? new Date(`${filtros.inicio}T00:00:00-03:00`) : null;
  const fim = filtros.fim ? new Date(`${filtros.fim}T23:59:59.999-03:00`) : null;

  return registros.filter((registro) => {
    const data = new Date(registro.criadoEm);

    if (usuario && !registro.usuario.toLocaleLowerCase("pt-BR").includes(usuario)) return false;
    if (filtros.modulo && registro.modulo !== filtros.modulo) return false;
    if (filtros.acao && registro.acao !== filtros.acao) return false;
    if (inicio && data < inicio) return false;
    if (fim && data > fim) return false;

    if (termo) {
      const alvo = [
        registro.titulo,
        registro.entidadeId,
        registro.dadosAntes,
        registro.dadosDepois,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pt-BR");

      if (!alvo.includes(termo)) return false;
    }

    return true;
  });
}

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<Filtros>;
}) {
  await exigirPermissao("auditoria");

  const filtros = await searchParams;
  const todos = await listarAuditoria();
  const registros = aplicarFiltros(todos, filtros);
  const usuarios = [...new Set(todos.map((item) => item.usuario))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );

  return (
    <>
      <TituloPagina
        titulo="Auditoria"
        descricao="Auditoria central das alterações realizadas por usuários nos módulos administrativos do sistema."
      />

      <form className="mb-6 grid gap-3 rounded-xl border border-ink-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-6">
        <label className="text-xs font-semibold text-ink-700">
          Usuário
          <select
            name="usuario"
            defaultValue={filtros.usuario ?? ""}
            className="mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            {usuarios.map((usuario) => (
              <option key={usuario} value={usuario}>{usuario}</option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold text-ink-700">
          Módulo
          <select
            name="modulo"
            defaultValue={filtros.modulo ?? ""}
            className="mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            {Object.entries(ROTULO_MODULO).map(([valor, rotulo]) => (
              <option key={valor} value={valor}>{rotulo}</option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold text-ink-700">
          Ação
          <select
            name="acao"
            defaultValue={filtros.acao ?? ""}
            className="mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            {Object.entries(ROTULO_ACAO).map(([valor, rotulo]) => (
              <option key={valor} value={valor}>{rotulo}</option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold text-ink-700">
          De
          <input
            type="date"
            name="inicio"
            defaultValue={filtros.inicio ?? ""}
            className="mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm"
          />
        </label>

        <label className="text-xs font-semibold text-ink-700">
          Até
          <input
            type="date"
            name="fim"
            defaultValue={filtros.fim ?? ""}
            className="mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm"
          />
        </label>

        <label className="text-xs font-semibold text-ink-700">
          Buscar
          <input
            type="search"
            name="termo"
            defaultValue={filtros.termo ?? ""}
            placeholder="Título, ID ou conteúdo"
            className="mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm"
          />
        </label>

        <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-6">
          <button
            type="submit"
            className="rounded-md bg-ink-900 px-4 py-2 text-xs font-bold tracking-wide text-gold-500 uppercase"
          >
            Filtrar
          </button>
          <Link
            href="/admin/controle-alteracoes"
            className="rounded-md border border-ink-200 px-4 py-2 text-xs font-bold tracking-wide text-ink-700 uppercase"
          >
            Limpar filtros
          </Link>
          <span className="ml-auto self-center text-xs text-ink-500">
            {registros.length} de {todos.length} registros exibidos
          </span>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-ink-050 text-xs font-bold tracking-wide text-ink-600 uppercase">
              <tr>
                <th className="px-4 py-3">Data e hora</th>
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Módulo</th>
                <th className="px-4 py-3">Ação</th>
                <th className="px-4 py-3">Registro</th>
                <th className="px-4 py-3">Antes</th>
                <th className="px-4 py-3">Depois</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {registros.map((registro) => (
                <tr key={registro.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-ink-600">
                    {formatarData(registro.criadoEm)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink-900">{registro.usuario}</td>
                  <td className="px-4 py-3 text-ink-700">
                    {ROTULO_MODULO[registro.modulo] ?? registro.modulo}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-ink-100 px-2.5 py-1 text-xs font-bold text-ink-700">
                      {ROTULO_ACAO[registro.acao] ?? registro.acao}
                    </span>
                  </td>
                  <td className="min-w-56 px-4 py-3">
                    <p className="font-semibold text-ink-900">{registro.titulo || "Sem título"}</p>
                    {registro.entidadeId ? (
                      <p className="mt-1 font-mono text-[11px] text-ink-500">{registro.entidadeId}</p>
                    ) : null}
                  </td>
                  <td className="min-w-52 px-4 py-3 text-ink-600">
                    {detalheJson(registro.dadosAntes, "Ver estado anterior")}
                  </td>
                  <td className="min-w-52 px-4 py-3 text-ink-600">
                    {detalheJson(registro.dadosDepois, "Ver estado posterior")}
                  </td>
                </tr>
              ))}
              {registros.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-ink-500">
                    Nenhuma alteração encontrada para os filtros informados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        São consultados os 500 registros mais recentes. A trilha de auditoria é somente para
        consulta e não pode ser alterada pelo painel.
      </p>
    </>
  );
}
