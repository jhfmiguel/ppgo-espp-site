"use client";

import Image from "next/image";
import Link from "next/link";
import { Contrast, Search, UserRound } from "lucide-react";

export function EsppMobileHeader(){
 return <header className="fixed inset-x-0 top-0 z-[70] border-b border-white/10 bg-[#171d27]/96 pt-[env(safe-area-inset-top)] text-white shadow-sm backdrop-blur-xl md:hidden">
  <div className="flex h-14 min-w-0 items-center gap-2 px-3">
   <Link href="/" aria-label="ESPP — início" className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/95 p-1"><Image src="/images/logo-espp.png" alt="" width={48} height={48} className="h-full w-full object-contain" priority/></span>
    <span className="min-w-0"><span className="block truncate text-sm font-extrabold leading-none tracking-[-.02em]">ESPP</span><span className="mt-1 block truncate text-[.61rem] font-semibold leading-none text-white/55">Escola Superior de Polícia Penal</span></span>
   </Link>
   <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/8 bg-white/[.04] p-1">
    <Link href="/busca" aria-label="Buscar" className="inline-flex size-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/8 hover:text-white"><Search className="size-3.5"/></Link>
    <Link href="/acessibilidade" aria-label="Acessibilidade e contraste" className="inline-flex size-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/8 hover:text-white"><Contrast className="size-3.5"/></Link>
   </div>
   <Link href="/admin" aria-label="Acesso restrito" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[#f5c400]/35 bg-[#f5c400]/12 text-[#f5c400]"><UserRound className="size-4"/></Link>
  </div>
 </header>
}
