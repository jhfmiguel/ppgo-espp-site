import { notFound } from "next/navigation";
import { exigirPermissao } from "@/lib/auth/dal";
import { buscarMensagemContato, urlAnexoMensagem } from "@/lib/data/store";
import { atualizarMensagem, removerMensagem } from "@/lib/actions/comunicacao";
import { Aviso, TituloPagina } from "@/components/admin/ui";
import { Save, Trash2 } from "lucide-react";

const TIPO = {
  RECEBIMENTO: "Recebimento",
  ALTERACAO_STATUS: "Alteração de status",
  ATRIBUICAO: "Atribuição",
  NOTA_INTERNA: "Nota interna",
  RESPOSTA: "Resposta",
} as const;

export const metadata = { title: "Atendimento" };

function corrigirMojibakeHistorico(valor: string) {
  return valor
    .replaceAll("formulÃƒÂ¡rio pÃƒÂºblico", "formulário público")
    .replaceAll("formulÃ¡rio pÃºblico", "formulário público")
    .replaceAll("atribuÃƒÂ­do", "atribuído")
    .replaceAll("atribuÃ­do", "atribuído");
}

export default async function MensagemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await exigirPermissao("mensagens");
  const { id } = await params;
  const [{ ok, erro }, detalhe] = await Promise.all([
    searchParams,
    buscarMensagemContato(id),
  ]);

  if (!detalhe) notFound();
  const { mensagem, historico, anexos, emailHabilitado } = detalhe;

  return (
    <>
      <TituloPagina
        titulo={mensagem.assunto}
        descricao={`${mensagem.protocolo} · ${mensagem.nome} · ${mensagem.email}`}
      />
      <Aviso ok={ok} erro={erro} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-ink-200 bg-white p-6">
            <h2 className="title-display text-lg text-ink-900">Mensagem recebida</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
              {mensagem.mensagem}
            </p>
            <dl className="mt-6 grid gap-3 border-t border-ink-100 pt-5 text-sm sm:grid-cols-2">
              <div><dt className="font-semibold">Protocolo</dt><dd>{mensagem.protocolo}</dd></div>
              <div><dt className="font-semibold">Status</dt><dd>{mensagem.status}</dd></div>
              <div><dt className="font-semibold">Nome</dt><dd>{mensagem.nome}</dd></div>
              <div><dt className="font-semibold">E-mail</dt><dd>{mensagem.email}</dd></div>
              <div><dt className="font-semibold">Telefone</dt><dd>{mensagem.telefone || "Não informado"}</dd></div>
              <div><dt className="font-semibold">Responsável</dt><dd>{mensagem.responsavel || "Não atribuído"}</dd></div>
            </dl>
          </section>

          <section className="rounded-xl border border-ink-200 bg-white p-6">
            <h2 className="title-display text-lg text-ink-900">Anexos</h2>
            {anexos.length === 0 ? (
              <p className="mt-4 text-sm text-ink-500">Nenhum anexo neste atendimento.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {anexos.map((anexo) => (
                  <li key={anexo.id} className="flex items-center justify-between gap-3 rounded-md border border-ink-100 p-3 text-sm">
                    <span className="min-w-0 truncate">{anexo.nomeOriginal}</span>
                    <a
                      href={urlAnexoMensagem(mensagem.id, anexo.id)}
                      className="shrink-0 font-semibold text-ink-800 underline"
                    >
                      Baixar
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-ink-200 bg-white p-6">
            <h2 className="title-display text-lg text-ink-900">Histórico do atendimento</h2>
            {historico.length === 0 ? (
              <p className="mt-4 text-sm text-ink-500">Ainda não há registros no histórico.</p>
            ) : (
              <ol className="mt-5 space-y-4">
                {historico.map((item) => (
                  <li key={item.id} className="border-l-2 border-gold-400 pl-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-xs uppercase text-ink-900">{TIPO[item.tipo]}</strong>
                      <span className="text-xs text-ink-500">
                        {new Date(item.criadoEm).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-ink-700">{corrigirMojibakeHistorico(item.descricao)}</p>
                    {item.usuario ? <p className="mt-1 text-xs text-ink-500">Por: {item.usuario}</p> : null}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <section className="h-fit rounded-xl border border-ink-200 bg-white p-6">
          <h2 className="title-display text-lg text-ink-900">Atendimento</h2>
          <form id="form-atendimento" action={atualizarMensagem} className="mt-4 space-y-4">
            <input type="hidden" name="id" value={mensagem.id} />

            <label className="block text-xs font-bold uppercase">
              Status
              <select
                name="status"
                defaultValue={mensagem.status}
                className="mt-2 w-full rounded-md border border-ink-200 px-3 py-2 text-sm"
              >
                <option value="NOVA">Nova</option>
                <option value="LIDA">Lida</option>
                <option value="EM_ATENDIMENTO">Em atendimento</option>
                <option value="RESPONDIDA">Respondida</option>
                <option value="ARQUIVADA">Arquivada</option>
              </select>
            </label>

            <label className="block text-xs font-bold uppercase">
              Responsável
              <input
                name="responsavel"
                defaultValue={mensagem.responsavel ?? ""}
                className="mt-2 w-full rounded-md border border-ink-200 px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-xs font-bold uppercase">
              Nota interna
              <textarea
                name="notaInterna"
                rows={4}
                placeholder="Registro interno que ficará no histórico."
                className="mt-2 w-full rounded-md border border-ink-200 px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-xs font-bold uppercase">
              Resposta ao solicitante
              <textarea
                name="resposta"
                rows={7}
                placeholder="A resposta fica registrada no atendimento. O envio externo por e-mail será conectado quando o serviço institucional estiver configurado."
                className="mt-2 w-full rounded-md border border-ink-200 px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-xs font-bold uppercase">
              Anexos da resposta
              <input
                type="file"
                name="anexos"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="mt-2 block w-full rounded-md border border-ink-200 px-3 py-2 text-sm"
              />
              <span className="mt-1 block font-normal normal-case text-ink-500">
                Até 5 anexos, com no máximo 8 MB por arquivo. Para envio por e-mail, até 2,5 MB no total.
              </span>
            </label>

            <label className="flex items-center gap-2 text-sm font-semibold text-ink-800">
              <input type="checkbox" name="enviarEmail" disabled={!emailHabilitado} />
              Enviar resposta
            </label>
            {!emailHabilitado ? (
              <p className="text-xs text-ink-500">
                Microsoft Graph ainda não configurado neste ambiente. A resposta pode ser salva no histórico.
              </p>
            ) : null}
            </form>
          <div className="mt-4 flex items-center gap-3">
            <button type="submit" form="form-atendimento" className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-4 py-2.5 text-xs font-bold uppercase text-ink-950" title="Salvar" aria-label="Salvar">
              <Save className="size-4" aria-hidden="true" />
              <span>Salvar</span>
            </button>
            <form action={removerMensagem} className="contents">
              <input type="hidden" name="id" value={mensagem.id} />
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-xs font-bold uppercase text-white transition-colors hover:bg-red-700" title="Excluir" aria-label="Excluir">
                <Trash2 className="size-4" aria-hidden="true" />
                <span>Excluir</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}