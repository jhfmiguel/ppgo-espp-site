import { exigirPermissao } from "@/lib/auth/dal";
import { buscarCampanhaNewsletter } from "@/lib/data/store";
import { atualizarCampanha, enviarCampanha } from "@/lib/actions/comunicacao";
import { TituloPagina } from "@/components/admin/ui";
export default async function Page({params}:{params:Promise<{id:string}>}){
 await exigirPermissao("newsletter");const {id}=await params;const d=await buscarCampanhaNewsletter(id);const c=d.campanha;
 return <><TituloPagina titulo={c.assunto} descricao={`Status: ${c.status}`}/>
 <section className="rounded-xl border bg-white p-6">
  {c.status==="RASCUNHO"?<form action={atualizarCampanha} className="space-y-4">
    <input type="hidden" name="id" value={id}/>
    <label className="block text-sm font-bold">Assunto<input name="assunto" required maxLength={250} defaultValue={c.assunto} className="mt-2 w-full rounded-md border px-3 py-2"/></label>
    <label className="block text-sm font-bold">Conteúdo<textarea name="conteudo" required rows={14} maxLength={20000} defaultValue={c.conteudo} className="mt-2 w-full rounded-md border px-3 py-2"/></label>
    <button className="rounded-md border border-ink-300 px-5 py-2.5 font-bold">Salvar alterações</button>
  </form>:<div className="whitespace-pre-wrap text-sm">{c.conteudo}</div>}
 <p className="mt-5 text-sm">Destinatários: {c.totalDestinatarios} · Enviados: {c.totalEnviados} · Falhas: {c.totalFalhas}</p>
 {c.status==="RASCUNHO"?<form action={enviarCampanha} className="mt-5"><input type="hidden" name="id" value={id}/>
 <button disabled={!d.emailHabilitado} className="rounded-md bg-gold-500 px-5 py-2.5 font-bold disabled:opacity-50">Enviar aos assinantes ativos</button>
 {!d.emailHabilitado?<p className="mt-2 text-xs">Microsoft Graph ainda não configurado neste ambiente.</p>:null}</form>:null}</section>
 {d.envios.length>0?<section className="mt-6 rounded-xl border bg-white p-6"><h2 className="font-bold">Histórico de envios</h2>
 <ul className="mt-4 space-y-2 text-sm">{d.envios.map(e=><li key={e.id}>{e.email} — {e.status}{e.erro?` — ${e.erro}`:""}</li>)}</ul></section>:null}</>;
}