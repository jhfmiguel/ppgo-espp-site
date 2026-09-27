"use client";

import { CSSProperties, useEffect, useState } from "react";

type Area = "site" | "admin" | "brasao";
type Ajuste = { escala: number; x: number; y: number };
const PADRAO: Ajuste = { escala: 100, x: 0, y: 0 };

function temaEscuro(area: Area) {
  const root = document.documentElement;
  if (area === "site") {
    return root.classList.contains("dark") || root.dataset.theme === "dark" || root.dataset.mobileTheme === "dark";
  }
  return root.classList.contains("dark") || root.dataset.adminTheme === "dark" || root.dataset.adminTheme === "mixed";
}

function lerAjuste(chave: string): Ajuste {
  try {
    const valor = localStorage.getItem(`espp-identidade-${chave}`);
    if (!valor) return PADRAO;
    const parsed = JSON.parse(valor) as Partial<Ajuste>;
    return {
      escala: Number.isFinite(parsed.escala) ? Number(parsed.escala) : 100,
      x: Number.isFinite(parsed.x) ? Number(parsed.x) : 0,
      y: Number.isFinite(parsed.y) ? Number(parsed.y) : 0,
    };
  } catch {
    return PADRAO;
  }
}

export function ConfigurableBrandImage({ area, fallbackLight, fallbackDark, alt, className, forceTheme }: { area: Area; fallbackLight: string; fallbackDark?: string; alt: string; className?: string; forceTheme?: "light" | "dark" }) {
  const [dark, setDark] = useState(forceTheme === "dark");
  const [fallback, setFallback] = useState(false);
  const [ajuste, setAjuste] = useState<Ajuste>(PADRAO);
  const chave = `${area}-${dark ? "dark" : "light"}`;

  useEffect(() => {
    if (forceTheme) {
      setDark(forceTheme === "dark");
      return;
    }
    const root = document.documentElement;
    const read = () => setDark(temaEscuro(area));
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme", "data-admin-theme", "data-mobile-theme"] });
    return () => observer.disconnect();
  }, [area, forceTheme]);

  useEffect(() => {
    setFallback(false);
    const read = () => setAjuste(lerAjuste(chave));
    read();
    const evento = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail?.chave === chave) setAjuste({ escala: detail.escala, x: detail.x, y: detail.y });
    };
    const storage = (event: StorageEvent) => {
      if (event.key === `espp-identidade-${chave}`) read();
    };
    addEventListener("espp-identidade-ajuste", evento);
    addEventListener("storage", storage);
    return () => {
      removeEventListener("espp-identidade-ajuste", evento);
      removeEventListener("storage", storage);
    };
  }, [chave]);

  const padrao = dark ? (fallbackDark ?? fallbackLight) : fallbackLight;
  const style: CSSProperties = {
    transform: `translate3d(${ajuste.x}px, ${ajuste.y}px, 0) scale(${ajuste.escala / 100})`,
    transformOrigin: area === "site" || area === "admin" ? "left center" : "center",
    transition: "transform 150ms ease",
  };
  return <img src={fallback ? padrao : `/api/identidade-visual/${chave}`} onError={() => setFallback(true)} alt={alt} className={className} style={style} data-brand-area={area} data-brand-theme={dark ? "dark" : "light"} />;
}
