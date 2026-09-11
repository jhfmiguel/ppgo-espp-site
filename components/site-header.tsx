"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { fortis, nav, site } from "@/content/site";

export function SiteHeader() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // trava o scroll do corpo enquanto o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  // Fora da home não há hero escuro por trás do header: mantém o fundo sólido
  // desde o topo para não perder contraste sobre seções claras (ex.: Formação).
  const solido = rolou || aberto || pathname !== "/";

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solido
          ? "border-b border-ink-700/80 bg-ink-950/95 backdrop-blur"
          : "border-b border-transparent bg-gradient-to-b from-ink-950/80 to-transparent",
      ].join(" ")}
    >
      <div className="container-espp flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${site.nome} — início`}
        >
          <Image
            src="/images/logo-espp.png"
            alt=""
            width={44}
            height={56}
            className="h-11 w-auto"
            priority
          />
          <span className="hidden leading-tight sm:block">
            <span className="title-display block text-base text-white">
              Escola Superior
            </span>
            <span className="block text-[0.7rem] font-medium tracking-[0.18em] text-gold-500 uppercase">
              Polícia Penal · Goiás
            </span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden min-w-0 xl:block">
          <ul className="flex items-center gap-4">
            {nav.map((item) => (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className={[
                    "text-[0.7rem] font-semibold tracking-wider whitespace-nowrap uppercase transition-colors hover:text-gold-500",
                    pathname === item.href ? "text-gold-500" : "text-ink-200",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={fortis.portalAtual.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md bg-gold-500 px-4 py-2.5 text-[0.75rem] font-bold tracking-wider text-ink-950 uppercase transition-colors hover:bg-gold-400 md:inline-block"
          >
            Portal do Aluno
          </a>
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-ink-600 text-white xl:hidden"
          >
            <span className="sr-only">
              {aberto ? "Fechar menu" : "Abrir menu"}
            </span>
            {aberto ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        hidden={!aberto}
        className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-ink-700 bg-ink-950 xl:hidden"
      >
        <nav aria-label="Navegação principal (mobile)" className="container-espp py-6">
          <ul className="flex flex-col divide-y divide-ink-800">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setAberto(false)}
                  className={[
                    "block py-4 text-sm font-semibold tracking-wider uppercase",
                    pathname === item.href ? "text-gold-500" : "text-ink-100",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={fortis.portalAtual.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block rounded-md bg-gold-500 px-4 py-3 text-center text-sm font-bold tracking-wider text-ink-950 uppercase"
          >
            Portal do Aluno
          </a>
        </nav>
      </div>
    </header>
  );
}
