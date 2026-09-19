import Link from "next/link";
import { Filter, SquareArrowOutUpRight } from "lucide-react";
import { exigirPermissao } from "@/lib/auth/dal";
import { listarMensagensContato } from "@/lib/data/store";
import { TituloPagina, ListaVazia, Aviso } from "@/components/admin/ui";
import type { StatusMensagem } from "@/lib/data/types";

const ROTULO: Record<StatusMensagem, string> = {
  NOVA: "Nova",
  LIDA: "Lida",
  EM_ATENDIMENTO: "Em atendimento",
  RESPONDIDA: "Respondida",
  ARQUIVADA: "Arquivada",
};

export const metadata = { title: "Mensagens" };

export default async function MensagensPage({
  searchParams,
}: {
  searchParams: Promise<{
    ok?: string;
    erro?: string;
    q?: string;
    status?: string;
  }>;
}) {
  await exigirPermissao("mensagens");
  const [params, todas] = await Promise.all([
    searchParams,
    listarMensagensContato(),
  ]);

  const q = (params.q ?? "").trim().toLowerCase();
  const status = params.status ?? "";
  const mensagens = todas.filter((m) => {
    const texto = [
      m.protocolo,
      m.nome,
      m.email,
      m.assunto,
      m.responsavel ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return (!q || texto.includes(q)) && (!status || m.status === status);
  });

  const contadores = {
    total: todas.length,
    novas: todas.filter((m) => m.status === "NOVA").length,
    atendimento: todas.filter((m) => m.status === "EM_ATENDIMENTO").length,
    respondidas: todas.filter((m) => m.status === "RESPONDIDA").length,
  };

  return (
    <>
      <TituloPagina
        titulo="Mensagens"
        descricao="Central de Atendimento da ESPP: recebimento, triagem, responsável, histórico e resposta."
      />
      <Aviso ok={params.ok} erro={params.erro} />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card rotulo="Total" valor={contadores.total} />
        <Card rotulo="Novas" valor={contadores.novas} />
        <Card rotulo="Em atendimento" valor={contadores.atendimento} />
        <Card rotulo="Respondidas" valor={contadores.respondidas} />
      </div>

      <form className="mb-5 grid gap-3 rounded-xl border border-ink-200 bg-white p-4 md:grid-cols-[1fr_220px_auto]">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Protocolo, nome, e-mail, assunto ou responsável"
          className="rounded-md border border-ink-200 px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-md border border-ink-200 px-3 py-2 text-sm"
        >
          <option value="">Todos os status</option>
          {Object.entries(ROTULO).map(([valor, rotulo]) => (
            <option key={valor} value={valor}>{rotulo}</option>
          ))}
        </select>
        <button className="inline-flex size-9 items-center justify-center rounded-md bg-ink-900 text-gold-500" title="Filtrar" aria-label="Filtrar">
          <Filter className="size-4" aria-hidden="true" />
        </button>
      </form>

      {mensagens.length === 0 ? (
        <ListaVazia
          titulo="Nenhuma mensagem"
          texto="Nenhuma mensagem corresponde aos filtros informados."
        />
      ) : (
        <ul className="space-y-3">
          {mensagens.map((m) => (
            <li key={m.id} className="rounded-xl border border-ink-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2 text-[0.65rem] font-bold uppercase tracking-wider">
                    <span className="text-gold-700">{ROTULO[m.status]}</span>
                    <span className="text-ink-500">{m.protocolo}</span>
                  </div>
                  <h2 className="mt-1 text-base font-semibold text-ink-900">{m.assunto}</h2>
                  <p className="mt-1 text-sm text-ink-600">{m.nome} · {m.email}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-600">{m.mensagem}</p>
                  {m.responsavel ? (
                    <p className="mt-2 text-xs text-ink-500">Responsável: {m.responsavel}</p>
                  ) : null}
                </div>
                <Link
                  href={`/admin/mensagens/${m.id}`}
                  className="inline-flex size-8 items-center justify-center rounded-md border border-ink-200 text-ink-700 hover:border-gold-400"
                  title="Abrir"
                  aria-label="Abrir"
                >
                  <SquareArrowOutUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
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