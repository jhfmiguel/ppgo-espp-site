"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

/**
 * Mapa do Google em modo embed público (`output=embed`), que não exige chave
 * de API — nenhuma variável de ambiente é necessária na Vercel.
 *
 * O iframe só é montado quando a seção entra na viewport, para não pesar no
 * carregamento inicial da página.
 */
export function MapEmbed({ query, title }: { query: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisivel(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=pt-BR&z=17&output=embed`;

  return (
    <div
      ref={ref}
      className="relative aspect-4/3 overflow-hidden rounded-lg border border-ink-200 bg-ink-050 lg:aspect-16/10"
    >
      {visivel ? (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink-400">
          <MapPin className="size-7" aria-hidden="true" />
          <p className="text-sm">Carregando mapa…</p>
        </div>
      )}
    </div>
  );
}
