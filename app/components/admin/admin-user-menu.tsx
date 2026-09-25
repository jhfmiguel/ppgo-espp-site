"use client";

import Link from "next/link";
import { ChevronDown, ExternalLink, LogOut, Moon, PanelLeft, Sun, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { sair } from "@/lib/actions/auth";

type Tema = "light" | "dark" | "mixed";

const temas = [
  { valor: "light" as const, rotulo: "Claro", Icone: Sun },
  { valor: "dark" as const, rotulo: "Escuro", Icone: Moon },
  { valor: "mixed" as const, rotulo: "Misto", Icone: PanelLeft },
];

export function AdminUserMenu({ nome, email, perfil }: { nome: string; email: string; perfil: string }) {
  const [aberto, setAberto] = useState(false);
  const [tema, setTema] = useState<Tema>("mixed");
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const salvo = localStorage.getItem("espp-admin-theme");
    const inicial: Tema = salvo === "light" || salvo === "dark" || salvo === "mixed" ? salvo : "mixed";
    setTema(inicial);
    document.documentElement.setAttribute("data-admin-theme", inicial);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => { if (raiz.current && !raiz.current.contains(e.target as Node)) setAberto(false); };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setAberto(false); };
    document.addEventListener("pointerdown", fora);
    window.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", fora); window.removeEventListener("keydown", escape); };
  }, [aberto]);

  function selecionarTema(proximo: Tema) {
    setTema(proximo);
    localStorage.setItem("espp-admin-theme", proximo);
    document.documentElement.setAttribute("data-admin-theme", proximo);
  }

  return (
    <div ref={raiz} className="admin-user-menu relative">
      {aberto && (
        <div role="menu" className="admin-user-menu-popover absolute bottom-[calc(100%+0.5rem)] left-0 z-[150] w-full min-w-64 overflow-hidden rounded-xl border shadow-2xl lg:bottom-0 lg:left-[calc(100%+0.75rem)] lg:w-64">
          <div className="admin-user-menu-heading flex items-start justify-between gap-3 border-b px-4 py-3.5">
            <div className="min-w-0">
              <p className="admin-user-menu-kicker text-[0.65rem] font-black tracking-[0.14em] uppercase">Conta</p>
              <p className="admin-user-menu-name mt-1 truncate text-sm font-bold">{nome}</p>
              <p className="admin-user-menu-meta mt-0.5 truncate text-xs">{email}</p>
              <p className="admin-user-menu-meta mt-0.5 text-xs">{perfil}</p>
            </div>
            <button type="button" onClick={() => setAberto(false)} className="admin-user-menu-icon inline-flex size-8 items-center justify-center rounded-md" aria-label="Fechar menu"><X className="size-4" /></button>
          </div>
          <div className="p-2">
            <p className="admin-user-menu-section px-2 pb-1.5 pt-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase">Modo de aparência</p>
            <div className="grid grid-cols-3 gap-1.5 px-1 pb-2">
              {temas.map(({ valor, rotulo, Icone }) => (
                <button key={valor} type="button" onClick={() => selecionarTema(valor)} aria-pressed={tema === valor} className="admin-user-menu-theme flex flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-[0.68rem] font-bold">
                  <Icone className="size-4" aria-hidden="true" /><span>{rotulo}</span>
                </button>
              ))}
            </div>
            <div className="admin-user-menu-divider my-1 border-t" />
            <Link href="/" target="_blank" className="admin-user-menu-item flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold"><ExternalLink className="size-4" />Ver site público</Link>
            <form action={sair}>
              <button type="submit" className="admin-user-menu-logout flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-bold"><LogOut className="size-4" />Logout</button>
            </form>
          </div>
        </div>
      )}
      <button type="button" onClick={() => setAberto(v => !v)} aria-expanded={aberto} aria-haspopup="menu" className="admin-user-trigger flex w-full items-center gap-3 rounded-lg border px-2.5 py-2 text-left transition-colors">
        <span className="admin-user-avatar inline-flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-black">{nome.trim()[0]?.toUpperCase() || <UserRound className="size-4" />}</span>
        <span className="min-w-0 flex-1"><span className="admin-sidebar-user block truncate text-sm font-bold">{nome}</span><span className="admin-sidebar-email mt-0.5 block truncate text-[0.68rem]">{perfil}</span></span>
        <ChevronDown className={`admin-user-chevron size-4 shrink-0 transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
