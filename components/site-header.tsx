"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Accessibility, ChevronDown, Contrast, Menu, X } from "lucide-react";
import { fortis, goias, nav, site, topbar } from "@/content/site";

type TamanhoFonte = "sm" | "md" | "lg";

const ESCALAS_FONTE: Record<TamanhoFonte, string> = {
  sm: "93.75%",
  md: "100%",
  lg: "112.5%",
};

const CHAVE_FONTE = "espp-font-size";
const CHAVE_CONTRASTE = "espp-contraste";

export function SiteHeader() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const [fonte, setFonte] = useState<TamanhoFonte>("md");
  const [contraste, setContraste] = useState(false);
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

  // restaura preferências de acessibilidade salvas (a aplicação inicial,
  // sem flash, é feita pelo script bloqueante em app/layout.tsx)
  useEffect(() => {
    const fonteSalva = window.localStorage.getItem(CHAVE_FONTE) as TamanhoFonte | null;
    if (fonteSalva && fonteSalva in ESCALAS_FONTE) setFonte(fonteSalva);
    setContraste(window.localStorage.getItem(CHAVE_CONTRASTE) === "alto");
  }, []);

  function aplicarFonte(valor: TamanhoFonte) {
    setFonte(valor);
    document.documentElement.style.fontSize = ESCALAS_FONTE[valor];
    window.localStorage.setItem(CHAVE_FONTE, valor);
  }

  function alternarContraste() {
    const novo = !contraste;
    setContraste(novo);
    if (novo) {
      document.documentElement.setAttribute("data-contrast", "alto");
      window.localStorage.setItem(CHAVE_CONTRASTE, "alto");
    } else {
      document.documentElement.removeAttribute("data-contrast");
      window.localStorage.removeItem(CHAVE_CONTRASTE);
    }
  }

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-shadow duration-300",
        rolou || aberto ? "shadow-md" : "",
      ].join(" ")}
    >
      {/* barra utilitária do Governo de Goiás — recursos de acessibilidade (eMAG 3.1 / WCAG 2.1) */}
      <div className="bg-gov-blue">
        <div className="container-espp flex h-9 items-center justify-between gap-4 overflow-x-auto text-[0.7rem]">
          <a
            href={topbar.href}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-bold tracking-wide text-gold-500 hover:text-gold-400"
          >
            {topbar.label}
          </a>

          <div className="flex shrink-0 items-center gap-3 text-white/90">
            <div className="flex items-center gap-1" role="group" aria-label="Tamanho da fonte">
              <button
                type="button"
                onClick={() => aplicarFonte("sm")}
                aria-pressed={fonte === "sm"}
                aria-label="Diminuir tamanho da fonte"
                className={`px-1 text-[0.65rem] font-bold hover:text-gold-500 ${fonte === "sm" ? "text-gold-500 underline" : ""}`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => aplicarFonte("md")}
                aria-pressed={fonte === "md"}
                aria-label="Tamanho de fonte padrão"
                className={`px-1 text-[0.75rem] font-bold hover:text-gold-500 ${fonte === "md" ? "text-gold-500 underline" : ""}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => aplicarFonte("lg")}
                aria-pressed={fonte === "lg"}
                aria-label="Aumentar tamanho da fonte"
                className={`px-1 text-[0.85rem] font-bold hover:text-gold-500 ${fonte === "lg" ? "text-gold-500 underline" : ""}`}
              >
                A+
              </button>
            </div>

            <button
              type="button"
              onClick={alternarContraste}
              aria-pressed={contraste}
              aria-label="Alternar alto contraste"
              className={`flex items-center gap-1.5 font-medium hover:text-gold-500 ${contraste ? "text-gold-500" : ""}`}
            >
              <Contrast className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline" aria-hidden="true">Alto contraste</span>
            </button>

            <Link
              href="/acessibilidade"
              aria-label="Acessibilidade"
              className="flex items-center gap-1.5 font-medium hover:text-gold-500"
            >
              <Accessibility className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline" aria-hidden="true">Acessibilidade</span>
            </Link>

            <Link href="/mapa-do-site" className="hidden font-medium sm:inline hover:text-gold-500">
              Mapa do site
            </Link>
          </div>
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
              <span className="title-display -mt-0.5 block text-lg text-gov-teal">{goias.sigla}</span>
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
            const temSubmenu = "submenu" in item;
            const ativo = temSubmenu
              ? item.submenu.some((sub) => pathname === sub.href)
              : pathname === item.href;
            const classeItem = [
              "flex items-center gap-1 py-2 text-[0.72rem] font-semibold tracking-wider whitespace-nowrap uppercase transition-colors hover:text-gold-500",
              ativo ? "text-gold-500" : "text-white",
            ].join(" ");

            return (
              <li key={item.label} className="group relative shrink-0">
                {temSubmenu ? (
                  <button type="button" className={classeItem}>
                    {item.label}
                    <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden="true" />
                  </button>
                ) : (
                  <Link href={item.href} className={classeItem}>
                    {item.label}
                  </Link>
                )}

                {temSubmenu ? (
                  <div className="invisible absolute top-full left-0 z-10 min-w-52 -translate-y-1 rounded-md border border-ink-200 bg-white py-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {item.submenu.map((sub) =>
                      "external" in sub && sub.external ? (
                        <a
                          key={sub.href}
                          href={sub.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap uppercase text-ink-700 transition-colors hover:bg-ink-100 hover:text-gold-600"
                        >
                          {sub.label}
                        </a>
                      ) : (
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
                      ),
                    )}
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
              const temSubmenu = "submenu" in item;

              return (
                <li key={item.label} className="py-1">
                  {temSubmenu ? (
                    <p className="pt-3 text-sm font-semibold tracking-wider text-ink-900 uppercase">
                      {item.label}
                    </p>
                  ) : (
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
                  )}
                  {temSubmenu ? (
                    <ul className="mb-2 flex flex-col gap-1 border-l border-ink-200 pl-4">
                      {item.submenu.map((sub) =>
                        "external" in sub && sub.external ? (
                          <li key={sub.href}>
                            <a
                              href={sub.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setAberto(false)}
                              className="block py-2 text-xs font-semibold tracking-wider text-ink-600 uppercase"
                            >
                              {sub.label}
                            </a>
                          </li>
                        ) : (
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
                        ),
                      )}
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
            <li className="py-1">
              <Link
                href="/acessibilidade"
                onClick={() => setAberto(false)}
                className="block py-3 text-sm font-semibold tracking-wider text-ink-900 uppercase"
              >
                Acessibilidade
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
