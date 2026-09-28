import Link from "next/link";
import { AlertTriangle, CheckCircle2, Eye, EyeOff, Plus } from "lucide-react";

import type { Status } from "@/lib/data/types";

/** Peças compartilhadas do painel, alinhadas ao padrão NASPP. */
export function TituloPagina({ titulo, descricao, acao }: { titulo:string; descricao?:string; acao?:{href:string;rotulo:string} }) {
  return <header className="mb-7 border-b border-ink-200 pb-5">
    <div className="flex items-center justify-between gap-3">
      <h1 className="title-display min-w-0 text-3xl text-ink-900">{titulo}</h1>
      {acao?<Link href={acao.href} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-gold-500 bg-gold-500 px-3 py-2.5 text-xs font-bold tracking-wide text-ink-950 uppercase transition hover:bg-gold-400 hover:border-gold-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 sm:px-5"><Plus className="size-4" aria-hidden="true"/>{acao.rotulo}</Link>:null}
    </div>
    {descricao?<p className="mt-1.5 max-w-3xl text-sm text-ink-600">{descricao}</p>:null}
  </header>;
}

export function SeloStatus({status}:{status:Status}) { const publicado=status==="publicado"; const Icone=publicado?Eye:EyeOff; return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.65rem] font-bold tracking-wider uppercase ${publicado?"border-forest-500/30 bg-forest-500/12 text-forest-600":"border-ink-200 bg-ink-100 text-ink-600"}`}><Icone className="size-3" aria-hidden="true"/>{publicado?"Publicado":"Rascunho"}</span>; }

export function Aviso({ok,erro}:{ok?:string;erro?:string}) {
  const MENSAGENS:Record<string,string>={criada:"Notícia criada com sucesso.",criado:"Registro criado com sucesso.",atualizada:"Notícia atualizada com sucesso.",atualizado:"Registro atualizado com sucesso.",excluida:"Notícia excluída.",excluido:"Registro excluído.",publicada:"Notícia publicada — já aparece no site.",publicado:"Registro publicado — já aparece no site.",despublicada:"Notícia voltou para rascunho e saiu do site público.",despublicado:"Registro voltou para rascunho e saiu do site público."};
  const ERROS:Record<string,string>={"sem-permissao":"Seu perfil não tem permissão para acessar essa seção.","nao-encontrada":"Registro não encontrado.","nao-encontrado":"Registro não encontrado."};
  if(erro&&ERROS[erro]) return <div role="alert" className="admin-message mb-6 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"><AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true"/><span>{ERROS[erro]}</span></div>;
  if(ok&&MENSAGENS[ok]) return <div role="status" className="admin-message mb-6 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true"/><span>{MENSAGENS[ok]}</span></div>;
  return null;
}

export function ListaVazia({titulo,texto,acao}:{titulo:string;texto:string;acao?:{href:string;rotulo:string}}) {
  return <div data-empty-state className="admin-empty-state rounded-xl border border-dashed border-ink-300 bg-white px-6 py-14 text-center"><p className="title-display text-xl text-ink-900">{titulo}</p><p className="mx-auto mt-2 max-w-md text-sm text-ink-600">{texto}</p>{acao?<Link href={acao.href} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-md border border-gold-500 bg-gold-500 px-5 py-2.5 text-xs font-bold tracking-wide text-ink-950 uppercase transition hover:border-gold-400 hover:bg-gold-400"><Plus className="size-4" aria-hidden="true"/>{acao.rotulo}</Link>:null}</div>;
}

export function BotaoPublicar({acao,id,status}:{acao:(formData:FormData)=>void;id:string;status:Status}) { const publicado=status==="publicado"; return <form action={acao}><input type="hidden" name="id" value={id}/><button type="submit" className="inline-flex size-9 items-center justify-center rounded-md border border-ink-300 bg-transparent text-ink-600 transition hover:border-gold-500 hover:bg-gold-050 hover:text-ink-900" title={publicado?"Despublicar":"Publicar"} aria-label={publicado?"Despublicar":"Publicar"}>{publicado?<EyeOff className="size-4" aria-hidden="true"/>:<Eye className="size-4" aria-hidden="true"/>}</button></form>; }
