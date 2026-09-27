import type { Metadata } from "next";
import Link from "next/link";
import { nav,site } from "@/content/site";
import { PageHeader } from "@/components/ui/page-header";
export const metadata:Metadata={title:"Mapa do site",description:`Todas as páginas do site institucional da ${site.sigla}.`};
type PaginaLink={label:string;href:string};
const ehPublica=(href:string)=>!href.startsWith("/admin")&&href!=="/acessos";
const paginasBase:PaginaLink[]=[...nav.flatMap((item):PaginaLink[]=>"submenu" in item?item.submenu.flatMap((sub):PaginaLink[]=>"href" in sub&&!("external" in sub&&sub.external)?[{label:sub.label,href:sub.href}]:[]):"external" in item&&item.external?[]:[{label:item.label,href:item.href}]),{label:"FORTIS",href:"/fortis"},{label:"Acessibilidade",href:"/acessibilidade"},{label:"Mapa do site",href:"/mapa-do-site"}].filter(p=>ehPublica(p.href));
const paginas=paginasBase.filter((p,i,t)=>t.findIndex(x=>x.href===p.href)===i);
export default function MapaDoSitePage(){return <section aria-labelledby="mapa-titulo" className="bg-white pt-10 pb-24 lg:pt-14 lg:pb-32"><div className="container-espp"><PageHeader href="/mapa-do-site" trilha={[{label:"Mapa do site"}]} id="mapa-titulo" eyebrow="Mapa do site" titulo="Todas as páginas do site" texto="Navegue diretamente para qualquer área do site institucional da Escola."/><ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{paginas.map(p=><li key={p.href}><Link href={p.href} className="block rounded-lg border border-ink-200 bg-white px-5 py-4 text-sm font-semibold text-ink-900 shadow-sm transition-colors hover:border-gold-500 hover:text-gold-600">{p.label}</Link></li>)}</ul></div></section>}
