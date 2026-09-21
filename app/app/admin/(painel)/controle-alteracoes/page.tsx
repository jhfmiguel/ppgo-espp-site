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
