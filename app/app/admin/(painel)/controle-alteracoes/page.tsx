import { exigirPermissao } from "@/lib/auth/dal";
import { listarAuditoria } from "@/lib/data/auditoria";
import { TituloPagina } from "@/components/admin/ui";

const ROTULO_MODULO: Record<string, string> = {
  NOTICIAS: "Notícias",
  EVENTOS: "Eventos",
  ATOS_NORMATIVOS: "Atos normativos",
};

const ROTULO_ACAO: Record<string, string> = {
  CRIACAO: "Criação",
  EDICAO: "Edição",
  EXCLUSAO: "Exclusão",
};

function formatarData(valor: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(valor));
}

function resumoJson(valor: string | null) {
  if (!valor) return "—";
  try {
    const objeto = JSON.parse(valor) as Record<string, unknown>;
    const titulo = objeto.titulo ?? objeto.numero ?? objeto.slug;
    const status = objeto.status;
    return [titulo, status].filter(Boolean).join(" · ") || "Dados registrados";
  } catch {
    return "Dados registrados";
  }
}

export default async function ControleAlteracoesPage() {
  await exigirPermissao("auditoria");
  const registros = await listarAuditoria();

  return (
    <>
      <TituloPagina
        titulo="Controle de alterações"
        descricao="Histórico administrativo de criação, edição e exclusão dos conteúdos gerenciados pelo painel."
      />

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
                  <td className="min-w-52 px-4 py-3 text-ink-600">{resumoJson(registro.dadosAntes)}</td>
                  <td className="min-w-52 px-4 py-3 text-ink-600">{resumoJson(registro.dadosDepois)}</td>
                </tr>
              ))}
              {registros.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-ink-500">
                    Nenhuma alteração auditada até o momento.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        São exibidos os 500 registros mais recentes. A trilha de auditoria é somente para consulta
        e não pode ser alterada pelo painel.
      </p>
    </>
  );
}
