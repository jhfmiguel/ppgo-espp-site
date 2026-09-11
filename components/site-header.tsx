"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { fortis, goias, nav, site, topbar } from "@/content/site";

export function SiteHeader() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 8);
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

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-shadow duration-300",
        rolou || aberto ? "shadow-md" : "",
      ].join(" ")}
    >
      {/* barra utilitária do Governo de Goiás */}
      <div className="hidden bg-gov-blue sm:block">
        <div className="container-espp flex h-9 items-center justify-between text-[0.7rem]">
          <a
            href={topbar.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold tracking-wide text-gold-500 hover:text-gold-400"
          >
            {topbar.label}
          </a>
          <Link href="/mapa-do-site" className="font-medium text-white/90 hover:text-gold-500">
            Mapa do site
          </Link>
        </div>
      </div>

      {/* faixa com os brasões */}
      <div className="border-b border-ink-200 bg-white">
        <div className="container-espp flex h-24 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-4" aria-label={`${site.nome} — início`}>
            <img
              src={goias.brasao.src}
              alt={goias.brasao.alt}
              className="h-11 w-auto shrink-0"
            />
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm text-gov-teal">{goias.nome}</span>
              <span className="title-display -mt-0.5 block text-lg text-ink-900">{goias.sigla}</span>
            </span>

            <span aria-hidden="true" className="mx-1 hidden h-10 w-px shrink-0 bg-ink-200 sm:block" />

            <Image
              src="/images/logo-espp.png"
              alt=""
              width={44}
              height={56}
              className="h-11 w-auto shrink-0"
              priority
            />
            <span className="hidden min-w-0 leading-tight md:block">
              <span className="title-display block text-lg text-ink-900">{site.sigla}</span>
              <span className="block truncate text-[0.65rem] font-medium tracking-[0.14em] text-ink-500 uppercase">
                {site.nome}
              </span>
            </span>
          </Link>

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
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-ink-300 text-ink-900 xl:hidden"
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
      </div>

      {/* menu principal */}
      <nav aria-label="Navegação principal" className="hidden bg-gov-teal xl:block">
        <ul className="container-espp flex h-12 items-center gap-6">
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
                    "flex items-center gap-1 py-2 text-[0.72rem] font-semibold tracking-wider whitespace-nowrap uppercase transition-colors hover:text-gold-500",
                    ativo ? "text-gold-500" : "text-white",
                  ].join(" ")}
                >
                  {item.label}
                  {temSubmenu ? (
                    <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden="true" />
                  ) : null}
                </Link>

                {temSubmenu ? (
                  <div className="invisible absolute top-full left-0 z-10 min-w-48 -translate-y-1 rounded-md border border-ink-200 bg-white py-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={[
                          "block px-4 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-colors hover:bg-ink-100 hover:text-gold-600",
                          pathname === sub.href ? "text-gold-600" : "text-ink-700",
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

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        hidden={!aberto}
        className="max-h-[calc(100svh-8.25rem)] overflow-y-auto border-t border-ink-200 bg-white xl:hidden"
      >
        <nav aria-label="Navegação principal (mobile)" className="container-espp py-6">
          <ul className="flex flex-col divide-y divide-ink-100">
            {nav.map((item) => {
              const temSubmenu = "submenu" in item && item.submenu.length > 0;

              return (
                <li key={item.href} className="py-1">
                  <Link
                    href={item.href}
                    onClick={() => setAberto(false)}
                    className={[
                      "block py-3 text-sm font-semibold tracking-wider uppercase",
                      pathname === item.href ? "text-gold-600" : "text-ink-900",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                  {temSubmenu ? (
                    <ul className="mb-2 flex flex-col gap-1 border-l border-ink-200 pl-4">
                      {item.submenu.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            onClick={() => setAberto(false)}
                            className={[
                              "block py-2 text-xs font-semibold tracking-wider uppercase",
                              pathname === sub.href ? "text-gold-600" : "text-ink-600",
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
            <li className="py-1">
              <Link
                href="/mapa-do-site"
                onClick={() => setAberto(false)}
                className="block py-3 text-sm font-semibold tracking-wider text-ink-900 uppercase"
              >
                Mapa do site
              </Link>
            </li>
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
