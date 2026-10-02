import Link from "next/link";
import { Filter, SquareArrowOutUpRight } from "lucide-react";

import { exigirPermissao } from "@/lib/auth/dal";
import { listarMensagensContato } from "@/lib/data/store";
import { TituloPagina, ListaVazia, Aviso } from "@/components/admin/ui";
import { RelatorioExport } from "@/components/admin/relatorio-export";
import { Paginacao, paginar } from "@/components/admin/paginacao";
import { formatarDataHora } from "@/lib/formato";
import type { StatusMensagem } from "@/lib/data/types";

const ROTULO: Record<StatusMensagem, string> = {
  NOVA: "Nova",
  LIDA: "Lida",
  EM_ATENDIMENTO: "Em atendimento",
  RESPONDIDA: "Respondida",
  ARQUIVADA: "Arquivada",
};

export const metadata = { title: "Mensagens" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await exigirPermissao("mensagens");

  const [p, todas] = await Promise.all([searchParams, listarMensagensContato()]);
  const q = (p.q || "").toLowerCase();
  const status = p.status || "";
  const responsavel = p.responsavel || "";
  const de = p.de || "";
  const ate = p.ate || "";

  const mensagens = todas.filter((m) => {
    const texto = [
      m.protocolo,
      m.nome,
      m.email,
      m.telefone || "",
      m.assunto,
      m.responsavel || "",
      m.mensagem,
    ]
      .join(" ")
      .toLowerCase();
    const dia = m.criadoEm.slice(0, 10);

    return (
      (!q || texto.includes(q)) &&
      (!status || m.status === status) &&
      (!responsavel || m.responsavel === responsavel) &&
      (!de || dia >= de) &&
      (!ate || dia <= ate)
    );
  });

  const pg = paginar(mensagens, p.pagina);
  const responsaveis = [
    ...new Set(todas.map((m) => m.responsavel).filter(Boolean) as string[]),
  ].sort();
  const filtros = {
    Busca: p.q || "",
    Status: status,
    Responsável: responsavel,
    "Recebida de": de,
    "Recebida até": ate,
  };

  return (
    <>
      <TituloPagina
        titulo="Mensagens"
        descricao="Central de Atendimento da ESPP: recebimento, triagem, responsável, histórico e resposta."
      />
      <Aviso ok={p.ok} erro={p.erro} />

      <div className="mb-4 flex justify-end">
        <RelatorioExport
          titulo="Relatório de Mensagens"
          filtros={filtros}
          colunas={[
            { chave: "protocolo", rotulo: "Protocolo" },
            { chave: "nome", rotulo: "Nome" },
            { chave: "email", rotulo: "E-mail" },
            { chave: "telefone", rotulo: "Telefone" },
            { chave: "assunto", rotulo: "Assunto" },
            { chave: "status", rotulo: "Status" },
            { chave: "responsavel", rotulo: "Responsável" },
            { chave: "recebida", rotulo: "Recebida em" },
            { chave: "respondida", rotulo: "Respondida em" },
          ]}
          linhas={mensagens.map((m) => ({
            protocolo: m.protocolo,
            nome: m.nome,
            email: m.email,
            telefone: m.telefone || "—",
            assunto: m.assunto,
            status: ROTULO[m.status],
            responsavel: m.responsavel || "—",
            recebida: formatarDataHora(m.criadoEm),
            respondida: m.respondidoEm ? formatarDataHora(m.respondidoEm) : "—",
          }))}
        />
      </div>

      <form className="admin-filter-panel mb-5 grid gap-3 rounded-xl border border-ink-200 bg-white p-4 md:grid-cols-3 xl:grid-cols-6">
        <input
          name="q"
          defaultValue={p.q}
          placeholder="Protocolo, nome, e-mail, telefone, assunto..."
          className="rounded-md border border-ink-200 px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-md border border-ink-200 px-3 py-2 text-sm"
        >
          <option value="">Todos os status</option>
          {Object.entries(ROTULO).map(([v, r]) => (
            <option key={v} value={v}>
              {r}
            </option>
          ))}
        </select>
        <select
          name="responsavel"
          defaultValue={responsavel}
          className="rounded-md border border-ink-200 px-3 py-2 text-sm"
        >
          <option value="">Todos responsáveis</option>
          {responsaveis.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <input
          type="date"
          name="de"
          defaultValue={de}
          title="Recebida de"
          className="rounded-md border border-ink-200 px-3 py-2 text-sm"
        />
        <input
          type="date"
          name="ate"
          defaultValue={ate}
          title="Recebida até"
          className="rounded-md border border-ink-200 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-ink-900 px-3 text-xs font-bold uppercase text-gold-500"
          title="Filtrar"
          aria-label="Filtrar"
        >
          <Filter className="size-4" aria-hidden="true" />
          <span>Filtrar</span>
        </button>
      </form>

      {mensagens.length === 0 ? (
        <ListaVazia
          titulo="Nenhuma mensagem"
          texto="Nenhuma mensagem corresponde aos filtros informados."
        />
      ) : (
        <>
          <ul className="space-y-3">
            {pg.itens.map((m) => (
              <li
                key={m.id}
                className="admin-message-card rounded-xl border border-ink-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2 text-[0.65rem] font-bold uppercase tracking-wider">
                      <span className="text-gold-700">{ROTULO[m.status]}</span>
                      <span className="text-ink-500">{m.protocolo}</span>
                    </div>
                    <h2 className="mt-1 font-semibold text-ink-900">{m.assunto}</h2>
                    <p className="mt-1 text-sm text-ink-600">
                      {m.nome} · {m.email}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-600">{m.mensagem}</p>
                    {m.responsavel ? (
                      <p className="mt-2 text-xs text-ink-500">
                        Responsável: {m.responsavel}
                      </p>
                    ) : null}
                  </div>

                  <div className="admin-message-actions flex shrink-0 items-center gap-2">
                    <Link
                      href={`/admin/mensagens/${m.id}`}
                      className="admin-message-action inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-ink-200 bg-white px-3 text-xs font-bold uppercase text-ink-700"
                      title="Abrir atendimento"
                      aria-label={`Abrir atendimento ${m.protocolo}`}
                    >
                      <SquareArrowOutUpRight className="size-3.5" aria-hidden="true" />
                      <span>Abrir</span>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Paginacao {...pg} params={p} />
        </>
      )}
    </>
  );
}
