import Link from "next/link";
import { exigirPermissao } from "@/lib/auth/dal";
import { listarCampanhasNewsletter } from "@/lib/data/store";
import { TituloPagina, ListaVazia } from "@/components/admin/ui";
export const metadata={title:"Campanhas"};
export default async function Page(){
 await exigirPermissao("newsletter"); const itens=await listarCampanhasNewsletter();
 return <><TituloPagina titulo="Campanhas" descricao="Criação, envio e histórico das comunicações da newsletter."/>
 <div className="mb-5 flex gap-3"><Link href="/admin/newsletter" className="rounded-md border px-4 py-2 text-sm">Assinantes</Link>
 <Link href="/admin/newsletter/campanhas/nova" className="rounded-md bg-gold-500 px-4 py-2 text-sm font-bold">Nova campanha</Link></div>
 {itens.length===0?<ListaVazia titulo="Nenhuma campanha" texto="Crie a primeira campanha da newsletter."/>:
 <div className="space-y-3">{itens.map(c=><Link key={c.id} href={`/admin/newsletter/campanhas/${c.id}`} className="block rounded-xl border border-ink-200 bg-white p-5">
 <strong>{c.assunto}</strong><p className="mt-1 text-xs">{c.status} · {new Date(c.criadoEm).toLocaleString("pt-BR")} · {c.totalEnviados}/{c.totalDestinatarios} enviados</p></Link>)}</div>}</>;
}