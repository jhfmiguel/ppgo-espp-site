import Link from "next/link";
import { ClipboardList, Filter } from "lucide-react";

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
  USUARIOS_AUTORIZADOS: "Usuários e permissões",
  CONFIGURACOES: "Configurações",
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
      <summary className="cursor-pointer text-xs font-semibold text-gold-700">{rotulo}</summary>
      <pre className="mt-2 max-h-64 max-w-xl overflow-auto whitespace-pre-wrap rounded-md bg-ink-050 p-3 text-[11px] leading-relaxed text-ink-700">
        {texto}
      </pre>
    </details>
  );
}

function aplicarFiltros(registros: Awaited<ReturnType<typeof listarAuditoria>>, filtros: Filtros) {
  const inicio = filtros.inicio ? new Date(`${filtros.inicio}T00:00:00-03:00`) : null;
  const fim = filtros.fim ? new Date(`${filtros.fim}T23:59:59.999-03:00`) : null;
  const termo = filtros.termo?.trim().toLocaleLowerCase("pt-BR");

  return registros.filter((registro) => {
    const data = new Date(registro.criadoEm);
    if (inicio && data < inicio) return false;
    if (fim && data > fim) return false;
    if (filtros.usuario && registro.usuario !== filtros.usuario) return false;
    if (filtros.modulo && registro.modulo !== filtros.modulo) return false;
    if (filtros.acao && registro.acao !== filtros.acao) return false;
    if (termo) {
      const texto = [registro.usuario, registro.modulo, registro.acao, registro.entidadeId, registro.titulo, registro.dadosAntes, registro.dadosDepois]
        .filter(Boolean).join(" ").toLocaleLowerCase("pt-BR");
      if (!texto.includes(termo)) return false;
    }
    return true;
  });
}

export default async function ControleAlteracoesPage({
  searchParams,
}: {
  searchParams: Promise<Filtros>;
}) {
  await exigirPermissao("auditoria");
  const filtros = await searchParams;
  const todos = await listarAuditoria(500);
  const registros = aplicarFiltros(todos, filtros);
  const usuarios = [...new Set(todos.map((item) => item.usuario))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const totalPorModulo = Object.entries(registros.reduce<Record<string, number>>((acc, item) => {
    acc[item.modulo] = (acc[item.modulo] ?? 0) + 1; return acc;
  }, {})).sort((a, b) => b[1] - a[1]);
  const totalPorAcao = Object.entries(registros.reduce<Record<string, number>>((acc, item) => {
    acc[item.acao] = (acc[item.acao] ?? 0) + 1; return acc;
  }, {})).sort((a, b) => b[1] - a[1]);
  const totalPorUsuario = Object.entries(registros.reduce<Record<string, number>>((acc, item) => {
    acc[item.usuario] = (acc[item.usuario] ?? 0) + 1; return acc;
  }, {})).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <header className="mb-8 border-b border-ink-200 pb-5">
        <p className="text-[0.7rem] font-bold tracking-[0.16em] text-gold-600 uppercase">ESPP</p>
        <h1 className="title-display mt-1 text-3xl text-ink-900">Auditoria</h1>
        <p className="mt-1.5 max-w-3xl text-sm text-ink-600">
          Trilha de operações administrativas e alterações realizadas pelos usuários do sistema.
        </p>
      </header>

      <section className="mb-6 grid gap-4 xl:grid-cols-4">
        <article className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Eventos</p>
          <p className="mt-2 text-3xl font-black text-ink-900">{registros.length}</p>
          <p className="mt-1 text-xs text-ink-500">Total para os filtros atuais.</p>
        </article>
        <article className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Módulos</p>
          <div className="mt-3 space-y-2">
            {totalPorModulo.slice(0, 3).map(([modulo, total]) => (
              <div key={modulo} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-semibold text-ink-800">{ROTULO_MODULO[modulo] ?? modulo}</span>
                <span className="font-bold text-gold-700">{total}</span>
              </div>
            ))}
            {totalPorModulo.length === 0 ? <p className="text-xs text-ink-500">Sem eventos.</p> : null}
          </div>
        </article>
        <article className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Ações</p>
          <div className="mt-3 space-y-2">
            {totalPorAcao.slice(0, 3).map(([acao, total]) => (
              <div key={acao} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-semibold text-ink-800">{ROTULO_ACAO[acao] ?? acao}</span>
                <span className="font-bold text-gold-700">{total}</span>
              </div>
            ))}
            {totalPorAcao.length === 0 ? <p className="text-xs text-ink-500">Sem eventos.</p> : null}
          </div>
        </article>
        <article className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Usuários</p>
          <div className="mt-3 space-y-2">
            {totalPorUsuario.slice(0, 3).map(([usuario, total]) => (
              <div key={usuario} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-semibold text-ink-800">{usuario}</span>
                <span className="font-bold text-gold-700">{total}</span>
              </div>
            ))}
            {totalPorUsuario.length === 0 ? <p className="text-xs text-ink-500">Sem eventos.</p> : null}
          </div>
        </article>
      </section>

      <form className="admin-form-surface mb-6 rounded-xl border border-ink-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <label className="text-xs font-semibold text-ink-700">Data inicial
            <input type="date" name="inicio" defaultValue={filtros.inicio ?? ""} max={filtros.fim || undefined} className="mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm" />
          </label>
          <label className="text-xs font-semibold text-ink-700">Data final
            <input type="date" name="fim" defaultValue={filtros.fim ?? ""} min={filtros.inicio || undefined} className="mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm" />
          </label>
          <label className="text-xs font-semibold text-ink-700">Usuário
            <select name="usuario" defaultValue={filtros.usuario ?? ""} className="mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm">
              <option value="">Todos os usuários</option>
              {usuarios.map((usuario) => <option key={usuario} value={usuario}>{usuario}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-ink-700">Módulo
            <select name="modulo" defaultValue={filtros.modulo ?? ""} className="mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm">
              <option value="">Todos os módulos</option>
              {Object.entries(ROTULO_MODULO).map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-ink-700">Ação
            <select name="acao" defaultValue={filtros.acao ?? ""} className="mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm">
              <option value="">Todas as ações</option>
              {Object.entries(ROTULO_ACAO).map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-ink-700">Buscar
            <input type="search" name="termo" defaultValue={filtros.termo ?? ""} placeholder="Título, ID ou conteúdo" className="mt-1.5 w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm" />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-4 py-2.5 text-xs font-bold text-ink-950">
            <Filter className="size-4" /> Filtrar registros
          </button>
          <Link href="/admin/controle-alteracoes" className="rounded-md border border-ink-200 px-4 py-2.5 text-xs font-bold tracking-wide text-ink-700 uppercase">Limpar filtros</Link>
          <span className="ml-auto self-center text-xs font-semibold text-ink-500">{registros.length} de {todos.length} registro(s)</span>
        </div>
      </form>

      <section className="admin-form-surface rounded-xl border border-ink-200 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-ink-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-5 text-gold-600" />
            <h2 className="title-display text-lg text-ink-900">Eventos registrados</h2>
          </div>
          <span className="text-xs font-semibold text-ink-500">{registros.length} registro(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] table-auto text-left text-sm">
            <thead className="bg-ink-050 text-xs uppercase text-ink-500">
              <tr>
                <th className="px-5 py-3">Data/hora</th>
                <th className="px-5 py-3">Usuário</th>
                <th className="px-5 py-3">Ação</th>
                <th className="px-5 py-3">Módulo</th>
                <th className="px-5 py-3">Registro</th>
                <th className="px-5 py-3">Antes</th>
                <th className="px-5 py-3">Depois</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {registros.map((registro) => (
                <tr key={registro.id} className="align-top">
                  <td className="whitespace-nowrap px-5 py-4 text-ink-700">{formatarData(registro.criadoEm)}</td>
                  <td className="px-5 py-4 font-semibold text-ink-700">{registro.usuario}</td>
                  <td className="px-5 py-4 font-semibold text-ink-700">{ROTULO_ACAO[registro.acao] ?? registro.acao}</td>
                  <td className="px-5 py-4 text-ink-700">{ROTULO_MODULO[registro.modulo] ?? registro.modulo}</td>
                  <td className="min-w-56 px-5 py-4">
                    <p className="font-semibold text-ink-900">{registro.titulo || "Sem título"}</p>
                    {registro.entidadeId ? <p className="mt-1 font-mono text-[11px] text-ink-500">{registro.entidadeId}</p> : null}
                  </td>
                  <td className="min-w-52 px-5 py-4 text-ink-600">{detalheJson(registro.dadosAntes, "Ver estado anterior")}</td>
                  <td className="min-w-52 px-5 py-4 text-ink-600">{detalheJson(registro.dadosDepois, "Ver estado posterior")}</td>
                </tr>
              ))}
              {registros.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-ink-500">Nenhum registro encontrado para os filtros informados.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        São consultados os 500 registros mais recentes. A trilha de auditoria é somente para consulta e não pode ser alterada pelo painel.
      </p>
    </>
  );
}
