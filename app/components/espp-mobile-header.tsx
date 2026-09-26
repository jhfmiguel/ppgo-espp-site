"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Contrast, Search, UserRound, X } from "lucide-react";

export function EsppMobileHeader(){
 const router=useRouter();
 const[open,setOpen]=useState(false);
 const[q,setQ]=useState("");
 const inputRef=useRef<HTMLInputElement>(null);
 useEffect(()=>{if(open){requestAnimationFrame(()=>inputRef.current?.focus());document.body.style.overflow="hidden"}else document.body.style.overflow="";return()=>{document.body.style.overflow=""}},[open]);
 function submit(e:FormEvent){e.preventDefault();const termo=q.trim();if(!termo)return;setOpen(false);router.push(`/busca?q=${encodeURIComponent(termo)}`)}
 return <>
  <header className="fixed inset-x-0 top-0 z-[70] border-b border-white/10 bg-[#171d27]/96 pt-[env(safe-area-inset-top)] text-white shadow-sm backdrop-blur-xl md:hidden">
   <div className="flex h-14 min-w-0 items-center gap-2 px-3">
    <Link href="/" aria-label="ESPP — início" className="flex min-w-0 flex-1 items-center overflow-hidden"><span className="flex h-11 w-[5.4rem] shrink-0 items-center justify-start overflow-hidden rounded-xl bg-white/95 px-2 py-1"><Image src="/images/logo-espp.png" alt="ESPP" width={180} height={80} className="h-full w-full object-contain object-left" priority/></span></Link>
    <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/8 bg-white/[.04] p-1">
     <button type="button" onClick={()=>setOpen(true)} aria-label="Buscar" className="inline-flex size-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/8 hover:text-white"><Search className="size-3.5"/></button>
     <Link href="/acessibilidade" aria-label="Acessibilidade e contraste" className="inline-flex size-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/8 hover:text-white"><Contrast className="size-3.5"/></Link>
    </div>
    <Link href="/admin" aria-label="Acesso restrito" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[#f5c400]/35 bg-[#f5c400]/12 text-[#f5c400]"><UserRound className="size-4"/></Link>
   </div>
  </header>
  {open?<div className="fixed inset-0 z-[100] flex items-start justify-center bg-[#071522]/55 px-4 pt-[max(5rem,env(safe-area-inset-top))] backdrop-blur-md md:hidden" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
   <div role="dialog" aria-modal="true" aria-label="Buscar no site" className="w-full max-w-md rounded-[1.35rem] border border-white/55 bg-white/88 p-4 shadow-[0_24px_70px_rgba(7,21,34,.32)] backdrop-blur-2xl">
    <div className="mb-3 flex items-center justify-between"><div><p className="text-[.62rem] font-black tracking-[.14em] text-[#0b3157]/55 uppercase">ESPP</p><h2 className="text-lg font-extrabold text-[#071522]">Buscar</h2></div><button type="button" onClick={()=>setOpen(false)} aria-label="Fechar busca" className="inline-flex size-9 items-center justify-center rounded-xl bg-[#071522]/5 text-[#334155]"><X className="size-4"/></button></div>
    <form onSubmit={submit} className="flex items-center gap-2 rounded-2xl border border-[#0b3157]/10 bg-white/80 p-1.5 shadow-inner"><Search className="ml-2 size-4 shrink-0 text-[#0b3157]/50"/><input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="O que você procura?" className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm text-[#071522] outline-none placeholder:text-[#64748b]"/><button type="submit" disabled={!q.trim()} className="shrink-0 rounded-xl bg-[#0b3157] px-3.5 py-2.5 text-xs font-extrabold text-white disabled:opacity-40">Buscar</button></form>
   </div>
  </div>:null}
 </>;
}
