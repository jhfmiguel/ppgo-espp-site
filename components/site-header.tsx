"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
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
            {nav.map((item) => {
              const temSubmenu = "submenu" in item && item.submenu.length > 0;
              const ativo =
                pathname === item.href ||
                (temSubmenu && item.submenu.some((sub) => pathname === sub.href));

              return (
                <li key={item.href} className="group relative shrink-0">
                  <Link
                    href={item.href}
                    className={[
                      "flex items-center gap-1 py-2 text-[0.7rem] font-semibold tracking-wider whitespace-nowrap uppercase transition-colors hover:text-gold-500",
                      ativo ? "text-gold-500" : "text-ink-200",
                    ].join(" ")}
                  >
                    {item.label}
                    {temSubmenu ? (
                      <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden="true" />
                    ) : null}
                  </Link>

                  {temSubmenu ? (
                    <div className="invisible absolute top-full left-0 z-10 min-w-48 -translate-y-1 rounded-md border border-ink-700 bg-ink-950 py-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={[
                            "block px-4 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-colors hover:bg-ink-850 hover:text-gold-500",
                            pathname === sub.href ? "text-gold-500" : "text-ink-200",
                          ].join(" ")}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </li>
              );
            })}
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
            {nav.map((item) => {
              const temSubmenu = "submenu" in item && item.submenu.length > 0;

              return (
                <li key={item.href} className="py-1">
                  <Link
                    href={item.href}
                    onClick={() => setAberto(false)}
                    className={[
                      "block py-3 text-sm font-semibold tracking-wider uppercase",
                      pathname === item.href ? "text-gold-500" : "text-ink-100",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                  {temSubmenu ? (
                    <ul className="mb-2 flex flex-col gap-1 border-l border-ink-700 pl-4">
                      {item.submenu.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            onClick={() => setAberto(false)}
                            className={[
                              "block py-2 text-xs font-semibold tracking-wider uppercase",
                              pathname === sub.href ? "text-gold-500" : "text-ink-300",
                            ].join(" ")}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
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
