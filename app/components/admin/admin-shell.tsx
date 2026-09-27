"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

type SidebarContextValue = {
  recolhido: boolean;
  setRecolhido: (valor: boolean) => void;
  hidratado: boolean;
};

const SidebarContext = createContext<SidebarContextValue>({
  recolhido: false,
  setRecolhido: () => undefined,
  hidratado: false,
});

export function useAdminSidebar() {
  return useContext(SidebarContext);
}

export function AdminShell({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  const [recolhido, setRecolhido] = useState(false);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setRecolhido(localStorage.getItem("espp-admin-sidebar") === "compact");
      setHidratado(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function alternar() {
    setRecolhido((atual) => {
      const proximo = !atual;
      localStorage.setItem("espp-admin-sidebar", proximo ? "compact" : "full");
      return proximo;
    });
  }

  const compacto = hidratado && recolhido;

  return (
    <SidebarContext.Provider value={{ recolhido: compacto, setRecolhido, hidratado }}>
      <div className="admin-panel isolate flex min-h-screen flex-col bg-ink-050 lg:flex-row" data-sidebar-collapsed={compacto ? "true" : "false"}>
        <aside className={`admin-sidebar relative z-[1000] flex shrink-0 flex-col overflow-visible transition-[width] duration-200 lg:sticky lg:top-0 lg:h-screen ${compacto ? "lg:w-[4.75rem]" : "lg:w-64"}`}>
          <button type="button" onClick={alternar} className="absolute right-1 top-[4.15rem] z-[1100] hidden items-center justify-center bg-transparent p-0 text-ink-400 transition hover:text-white lg:flex" aria-label={compacto ? "Expandir menu lateral" : "Recolher menu lateral"} title={compacto ? "Expandir menu" : "Recolher menu"}>
            {compacto ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
          </button>
          {sidebar}
        </aside>
        <main className="relative z-0 min-w-0 flex-1 bg-ink-050 px-5 py-8 lg:px-6 lg:py-10 xl:px-7">
          <div className="mx-auto w-full max-w-none">{children}</div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
