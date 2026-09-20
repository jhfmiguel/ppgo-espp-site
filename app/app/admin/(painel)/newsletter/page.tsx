import Link from "next/link";
import { Filter, Save } from "lucide-react";
import { exigirPermissao } from "@/lib/auth/dal";
import { listarAssinantesNewsletter } from "@/lib/data/store";
import { alterarStatusAssinante, removerAssinante } from "@/lib/actions/comunicacao";
import { Aviso, ListaVazia, TituloPagina } from "@/components/admin/ui";
import { BotaoExcluir } from "@/components/admin/botao-excluir";
import type { StatusNewsletter } from "@/lib/data/types";

const ROTULO: Record<StatusNewsletter, string> = {
  ATIVO: "Ativo",
  DESCADASTRADO: "Descadastrado",
  BLOQUEADO: "Bloqueado",
};

export const metadata = { title: "Newsletter" };

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{
    ok?: string;
    erro?: string;
    q?: string;
    status?: string;
  }>;
}) {
  await exigirPermissao("newsletter");
  const [params, todos] = await Promise.all([
    searchParams,
    listarAssinantesNewsletter(),
  ]);

  const q = (params.q ?? "").trim().toLowerCase();
  const status = params.status ?? "";
  const assinantes = todos.filter((a) => {
    const texto = [a.email, a.nome ?? "", a.origem].join(" ").toLowerCase();
    return (!q || texto.includes(q)) && (!status || a.status === status);
  });

  const ativos = todos.filter((a) => a.status === "ATIVO").length;
  const descadastrados = todos.filter((a) => a.status === "DESCADASTRADO").length;
  const bloqueados = todos.filter((a) => a.status === "BLOQUEADO").length;

  return (
    <>
      <TituloPagina
        titulo="Newsletter"
        descricao="Gestão de assinantes, consentimento e situação cadastral."
      />
      <Aviso ok={params.ok} erro={params.erro} />
      <div className="mb-5"><Link href="/admin/newsletter/campanhas" className="inline-flex rounded-md bg-gold-500 px-4 py-2 text-sm font-bold text-ink-950">Campanhas</Link></div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card rotulo="Total" valor={todos.length} />
        <Card rotulo="Ativos" valor={ativos} />
        <Card rotulo="Descadastrados" valor={descadastrados} />
        <Card rotulo="Bloqueados" valor={bloqueados} />
      </div>

      <form className="mb-5 grid gap-3 rounded-xl border border-ink-200 bg-white p-4 md:grid-cols-[1fr_220px_auto]">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Nome, e-mail ou origem"
          className="rounded-md border border-ink-200 px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-md border border-ink-200 px-3 py-2 text-sm"
        >
          <option value="">Todas as situações</option>
          {Object.entries(ROTULO).map(([valor, rotulo]) => (
            <option key={valor} value={valor}>{rotulo}</option>
          ))}
        </select>
        <button className="inline-flex size-9 items-center justify-center rounded-md bg-ink-900 text-gold-500" title="Filtrar" aria-label="Filtrar">
          <Filter className="size-4" aria-hidden="true" />
        </button>
      </form>

      {assinantes.length === 0 ? (
        <ListaVazia
          titulo="Nenhum assinante"
          texto="Nenhum cadastro corresponde aos filtros informados."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-200 bg-ink-050 text-xs uppercase text-ink-600">
              <tr>
                <th className="p-4">Assinante</th>
                <th className="p-4">Origem</th>
                <th className="p-4">Situação</th>
                <th className="p-4">Consentimento</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {assinantes.map((a) => (
                <tr key={a.id} className="border-b border-ink-100">
                  <td className="p-4">
                    <strong className="block text-ink-900">{a.email}</strong>
                    {a.nome ? <span className="text-xs text-ink-500">{a.nome}</span> : null}
                  </td>
                  <td className="p-4">{a.origem}</td>
                  <td className="p-4">{ROTULO[a.status]}</td>
                  <td className="p-4 text-xs">
                    {new Date(a.consentidoEm).toLocaleString("pt-BR")}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <form action={alterarStatusAssinante} className="flex gap-2">
                        <input type="hidden" name="id" value={a.id} />
                        <select
                          name="status"
                          defaultValue={a.status}
                          className="rounded-md border border-ink-200 px-2 py-1.5 text-xs"
                        >
                          <option value="ATIVO">Ativo</option>
                          <option value="DESCADASTRADO">Descadastrado</option>
                          <option value="BLOQUEADO">Bloqueado</option>
                        </select>
                        <button
                          className="inline-flex size-8 items-center justify-center rounded-md border border-ink-200 text-ink-600 transition-colors hover:border-green-300 hover:bg-green-50 hover:text-green-600"
                          title="Salvar"
                          aria-label="Salvar"
                        >
                          <Save className="size-3.5" aria-hidden="true" />
                        </button>
                      </form>
                      <BotaoExcluir
                        acao={removerAssinante}
                        id={a.id}
                        descricao={`o assinante ${a.email}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Card({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-500">{rotulo}</p>
      <p className="mt-2 text-2xl font-bold text-ink-900">{valor}</p>
    </div>
  );
}