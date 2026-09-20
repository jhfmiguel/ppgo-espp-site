import { exigirPermissao } from "@/lib/auth/dal";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { buscarCampanhaNewsletter } from "@/lib/data/store";
import { atualizarCampanha, enviarCampanha } from "@/lib/actions/comunicacao";
import { Aviso, TituloPagina } from "@/components/admin/ui";
export default async function Page({
 params,
 searchParams,
}:{
 params:Promise<{id:string}>;
 searchParams:Promise<{ok?:string;erro?:string}>;
}){
 await exigirPermissao("newsletter");
 const [{id}, query] = await Promise.all([params, searchParams]);
 const d=await buscarCampanhaNewsletter(id);
 const c=d.campanha;


 return <><TituloPagina titulo={c.assunto} descricao={`Status: ${c.status}`}/>
 <Aviso ok={query.ok} erro={query.erro} />


 <section className="rounded-xl border bg-white p-6">
  {c.status==="RASCUNHO"?<form action={atualizarCampanha} className="space-y-4">
    <input type="hidden" name="id" value={id}/>
    <label className="block text-sm font-bold">Assunto<input name="assunto" required maxLength={250} defaultValue={c.assunto} className="mt-2 w-full rounded-md border px-3 py-2"/></label>
    <label className="block text-sm font-bold">Conteúdo<textarea name="conteudo" required rows={14} maxLength={20000} defaultValue={c.conteudo} className="mt-2 w-full rounded-md border px-3 py-2"/></label>
    <div className="flex flex-wrap items-center gap-3">
  <button
  className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-4 py-2.5 text-xs font-bold uppercase text-ink-950"
  title="Salvar"
  aria-label="Salvar"
>
  <Save className="size-4" aria-hidden="true" />
  <span>Salvar</span>
</button>

  <Link
    href="/admin/newsletter/campanhas"
    className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-xs font-bold uppercase text-white transition-colors hover:bg-blue-700"
    title="Voltar"
    aria-label="Voltar"
  >
    <ArrowLeft className="size-4" aria-hidden="true" />
    <span>Voltar</span>
  </Link>
</div>
  </form>:<div className="whitespace-pre-wrap text-sm">{c.conteudo}</div>}
 <p className="mt-5 text-sm">Destinatários: {c.totalDestinatarios} · Enviados: {c.totalEnviados} · Falhas: {c.totalFalhas}</p>
 {c.status==="RASCUNHO"?<form action={enviarCampanha} className="mt-5"><input type="hidden" name="id" value={id}/>
 <button disabled={!d.emailHabilitado} className="rounded-md bg-gold-500 px-5 py-2.5 font-bold disabled:opacity-50">Enviar aos assinantes ativos</button>
 {!d.emailHabilitado?<p className="mt-2 text-xs">Microsoft Graph ainda não configurado neste ambiente.</p>:null}</form>:null}</section>
 {d.envios.length>0?<section className="mt-6 rounded-xl border bg-white p-6"><h2 className="font-bold">Histórico de envios</h2>
 <ul className="mt-4 space-y-2 text-sm">{d.envios.map(e=><li key={e.id}>{e.email} — {e.status}{e.erro?` — ${e.erro}`:""}</li>)}</ul></section>:null}</>;
}