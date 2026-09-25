"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  valor: string;
};

function parseValor(valor: string) {
  const suffix = valor.endsWith("+") ? "+" : "";
  const numeric = valor.replace(/\D/g, "");
  if (!numeric || valor.includes("ª")) return null;
  return { target: Number(numeric), suffix };
}

export function AnimatedCounter({ valor }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => (parseValor(valor) ? "0" : valor));

  useEffect(() => {
    const parsed = parseValor(valor);
    const element = ref.current;
    if (!parsed || !element) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(valor);
      return;
    }

    let frame = 0;
    let started = false;
    const duration = parsed.target >= 1000 ? 1800 : 1400;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = Math.round(parsed.target * eased);
          setDisplay(`${current.toLocaleString("pt-BR")}${parsed.suffix}`);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [valor]);

  return <span ref={ref}>{display}</span>;
}
