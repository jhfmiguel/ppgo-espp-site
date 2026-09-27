"use client";

import Link from "next/link";
import { ExternalLink, LogOut, Moon, PanelLeft, Sun, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./admin-floating-menu.module.css";

type Tema = "light" | "dark" | "mixed";
const STORAGE_KEY = "espp-admin-theme";
const temas = [{ valor: "light" as const, rotulo: "Claro", Icone: Sun }, { valor: "dark" as const, rotulo: "Escuro", Icone: Moon }, { valor: "mixed" as const, rotulo: "Misto", Icone: PanelLeft }];
function temaValido(valor: string | null): valor is Tema { return valor === "light" || valor === "dark" || valor === "mixed"; }
function aplicarTema(tema: Tema) { document.documentElement.setAttribute("data-admin-theme", tema); }
function inicial(nome: string) { return nome.trim().match(/[A-Za-zÀ-ÿ0-9]/)?.[0]?.toUpperCase() ?? "E"; }

export function AdminUserMenu({ nome, email, perfil, compact = false }: { nome: string; email: string; perfil: string; compact?: boolean }) {
  const [tema, setTema] = useState<Tema>("mixed");
  const [aberto, setAberto] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { const salvo = localStorage.getItem(STORAGE_KEY); const valor: Tema = temaValido(salvo) ? salvo : "mixed"; setTema(valor); aplicarTema(valor); const sync = (event: StorageEvent) => { if (event.key === STORAGE_KEY && temaValido(event.newValue)) { setTema(event.newValue); aplicarTema(event.newValue); } }; addEventListener("storage", sync); return () => removeEventListener("storage", sync); }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function abrir() { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setAberto(true), 70); }
  function manter() { if (timer.current) clearTimeout(timer.current); setAberto(true); }
  function fechar() { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setAberto(false), 220); }
  function selecionarTema(valor: Tema) { setTema(valor); localStorage.setItem(STORAGE_KEY, valor); aplicarTema(valor); }
  const popupPosicao = compact ? "right-0 top-[calc(100%+0.25rem)] origin-top-right" : "bottom-0 left-[calc(100%+0.25rem)] origin-bottom-left";
  return <div className="relative" onFocusCapture={manter} onBlurCapture={fechar}>
    <div className={compact ? "flex items-center justify-center" : "flex w-full items-center gap-3 px-2.5 py-2 text-left"}><span onMouseEnter={abrir} onMouseLeave={fechar} className="inline-flex size-9 shrink-0 cursor-default items-center justify-center rounded-full bg-ink-800 text-sm font-black text-ink-100 ring-1 ring-white/10 transition duration-150 hover:bg-ink-700 hover:ring-gold-400/40">{nome ? inicial(nome) : <UserRound className="size-4" />}</span>{!compact ? <span className="min-w-0 flex-1"><span className="admin-sidebar-user block truncate text-sm font-bold">{nome}</span><span className="admin-sidebar-email mt-0.5 block truncate text-[.68rem]">{perfil}</span></span> : null}</div>
    <div role="menu" aria-label="Menu do usuário" onMouseEnter={manter} onMouseLeave={fechar} className={`${styles.menu} absolute z-[1500] w-64 overflow-hidden rounded-xl border shadow-2xl transition-[opacity,transform,visibility] duration-150 ${popupPosicao} ${aberto ? "visible scale-100 opacity-100" : "invisible scale-[.98] opacity-0"}`}>
      <div className={`${styles.header} border-b px-4 py-3`}><p className="text-[.65rem] font-black uppercase tracking-[.14em] text-gold-400">Conta institucional</p><p className="mt-1 truncate text-sm font-bold">{nome}</p><p className={`${styles.muted} mt-0.5 truncate text-xs`}>{email}</p><p className={`${styles.muted} mt-0.5 text-xs`}>{perfil}</p></div>
      <div className="p-2"><p className="px-2 pb-1.5 pt-1 text-[.65rem] font-black uppercase tracking-[.14em] text-gold-400">Modo de aparência</p><div className="grid grid-cols-3 gap-1.5 px-1 pb-2">{temas.map(({ valor, rotulo, Icone }) => <button key={valor} type="button" onClick={() => selecionarTema(valor)} aria-pressed={tema === valor} className={`${styles.themeButton} ${tema === valor ? styles.themeButtonActive : ""} flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-[.68rem] font-bold transition-colors`}><Icone className="size-4" /><span>{rotulo}</span></button>)}</div><div className={`${styles.header} my-1 border-t`} /><Link role="menuitem" href="/" target="_blank" className={`${styles.item} flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold`}><ExternalLink className="size-4" />Ver site público</Link><a role="menuitem" href="/admin/auth/logout" className={`${styles.item} flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-bold`}><LogOut className="size-4" />Sair</a></div>
    </div>
  </div>;
}
