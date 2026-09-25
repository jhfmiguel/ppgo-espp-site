"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Accessibility, ChevronDown, Contrast, Menu, Search, X } from "lucide-react";
import { fortis, goias, nav, site, topbar } from "@/content/site";
import { Icon } from "@/components/ui/icon";

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
  /** Rótulo do submenu aberto no menu de desktop, ou null. */
  const [submenu, setSubmenu] = useState<string | null>(null);
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

  // fecha o submenu ao trocar de página
  useEffect(() => {
    setSubmenu(null);
  }, [pathname]);

  // fecha o submenu com Esc ou ao clicar fora dele
  useEffect(() => {
    if (!submenu) return;

    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") setSubmenu(null);
    }
    function aoClicarFora(e: MouseEvent) {
      const alvo = e.target as Element | null;
      if (!alvo?.closest("[data-submenu]")) setSubmenu(null);
    }

    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("mousedown", aoClicarFora);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.removeEventListener("mousedown", aoClicarFora);
    };
  }, [submenu]);

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
        <div className="container-espp flex h-7 items-center justify-between gap-4 overflow-x-auto text-[0.65rem]">
          <a
            href={topbar.href}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-bold tracking-wide text-gold-500"
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
                className={`px-1 py-0.5 text-[0.65rem] font-bold text-white ${fonte === "sm" ? "underline" : ""}`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => aplicarFonte("md")}
                aria-pressed={fonte === "md"}
                aria-label="Tamanho de fonte padrão"
                className={`px-1 py-0.5 text-[0.75rem] font-bold text-white ${fonte === "md" ? "underline" : ""}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => aplicarFonte("lg")}
                aria-pressed={fonte === "lg"}
                aria-label="Aumentar tamanho da fonte"
                className={`px-1 py-0.5 text-[0.85rem] font-bold text-white ${fonte === "lg" ? "underline" : ""}`}
              >
                A+
              </button>
            </div>

            <button
              type="button"
              onClick={alternarContraste}
              aria-pressed={contraste}
              aria-label="Alternar alto contraste"
              className="flex items-center gap-1.5 px-1.5 py-0.5 font-medium text-white"
            >
              <Contrast className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline" aria-hidden="true">Alto contraste</span>
            </button>

            <Link
              href="/acessibilidade"
              aria-label="Acessibilidade"
              className="flex items-center gap-1.5 px-1.5 py-0.5 font-medium text-white"
            >
              <Accessibility className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline" aria-hidden="true">Acessibilidade</span>
            </Link>

            <Link href="/mapa-do-site" className="hidden px-1.5 py-0.5 font-medium text-white sm:inline">
              Mapa do site
            </Link>
          </div>
        </div>
      </div>

      {/* faixa com os brasões */}
      <div className="border-b border-ink-200 bg-white">
        <div className="container-espp flex h-[7.1rem] items-center justify-between gap-8">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            aria-label={`${site.nome} — início`}
          >
            <span className="flex min-w-0 items-center">
              <Image
                src="/images/logo-go-espp.png"
                alt="Estado de Goiás e Escola Superior de Polícia Penal"
                width={2000}
                height={688}
                className="h-[5.35rem] w-auto max-w-[min(58vw,47rem)] object-contain object-left"
                priority
              />
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <form
              id="busca"
              action="/busca"
              method="get"
              role="search"
              className="hidden w-[22.5rem] items-center lg:flex"
            >
              <label htmlFor="busca-site" className="sr-only">Buscar no site</label>
              <input
                id="busca-site"
                name="q"
                type="search"
                placeholder="O que você procura?"
                className="min-w-0 flex-1 rounded-l-sm border border-ink-300 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-400 focus:border-gov-blue"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="ml-1 flex items-center justify-center rounded-sm bg-gov-blue px-5 py-2.5 text-sm font-bold text-white transition-colors hover:brightness-95"
              >
                <Search className="mr-2 size-4" aria-hidden="true" />
                Buscar
              </button>
            </form>
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
      <nav id="menu-principal" aria-label="Navegação principal" className="hidden bg-gov-teal xl:block">
        <ul className="container-espp flex h-14 items-stretch gap-1">
          {nav.map((item, indice) => {
            const temSubmenu = "submenu" in item;
            const externo = "external" in item && item.external;
            const expandido = temSubmenu && submenu === item.label;
            const idSubmenu = `submenu-${indice}`;
            const ativo = temSubmenu
              ? item.submenu.some((sub) => "href" in sub && pathname === sub.href)
              : pathname === item.href;
            const classeItem = [
              "flex h-full items-center gap-1 px-3 py-3 text-[0.75rem] font-semibold tracking-normal whitespace-nowrap uppercase text-white transition-colors hover:bg-white/8 hover:text-gold-500",
              ativo ? "bg-white/10 text-gold-500" : "text-white",
            ].join(" ");

            return (
              <li
                key={item.label}
                data-submenu={temSubmenu ? "" : undefined}
                className="relative shrink-0"
                onMouseEnter={temSubmenu ? () => setSubmenu(item.label) : undefined}
                onMouseLeave={temSubmenu ? () => setSubmenu(null) : undefined}
                // fecha quando o foco sai do item inteiro (navegação por Tab)
                onBlur={
                  temSubmenu
                    ? (e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                          setSubmenu(null);
                        }
                      }
                    : undefined
                }
              >
                {temSubmenu ? (
                  <button
                    type="button"
                    aria-expanded={expandido}
                    aria-controls={idSubmenu}
                    // e.detail === 0 indica ativação por teclado (Enter/Espaço),
                    // que alterna. Com mouse ou toque o hover já abriu o
                    // submenu, então o clique apenas o mantém aberto — alternar
                    // aqui faria o menu fechar no instante em que é clicado.
                    onClick={(e) =>
                      setSubmenu(e.detail === 0 && expandido ? null : item.label)
                    }
                    className={classeItem}
                  >
                    {item.label}
                    <ChevronDown
                      className={`size-3.5 transition-transform ${expandido ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                ) : externo ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={classeItem}>
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className={classeItem}>
                    {item.label}
                  </Link>
                )}

                {temSubmenu ? (
                  <div
                    id={idSubmenu}
                    className={[
                      "absolute top-full left-0 z-10 min-w-52 rounded-md border border-ink-200 bg-white py-2 shadow-lg transition-all duration-150",
                      expandido
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0",
                    ].join(" ")}
                  >
                    {item.submenu.map((sub, i) =>
                      "group" in sub ? (
                        <p
                          key={`grupo-${sub.group}-${i}`}
                          className="px-4 pt-2.5 pb-1 text-[0.65rem] font-bold tracking-[0.16em] text-ink-400 uppercase first:pt-1"
                        >
                          {sub.group}
                        </p>
                      ) : "external" in sub && sub.external ? (
                        <a
                          key={sub.href}
                          href={sub.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setSubmenu(null)}
                          className="block px-4 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap uppercase text-ink-700 transition-colors hover:bg-ink-100 hover:text-gold-600"
                        >
                          {sub.label}
                        </a>
                      ) : (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setSubmenu(null)}
                          className={[
                            "block px-4 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-colors hover:bg-ink-100 hover:text-gold-600",
                            pathname === sub.href ? "text-gold-600" : "text-ink-700",
                          ].join(" ")}
                        >
                          {"icone" in sub ? (
                            <Icon name={sub.icone} className="mr-2 -mt-0.5 inline size-3.5" />
                          ) : null}
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
        className="max-h-[calc(100svh-var(--spacing-header))] overflow-y-auto border-t border-ink-200 bg-white xl:hidden"
      >
        <nav aria-label="Navegação principal (mobile)" className="container-espp py-6">
          <ul className="flex flex-col divide-y divide-ink-100">
            {nav.map((item) => {
              const temSubmenu = "submenu" in item;
              const externo = "external" in item && item.external;

              return (
                <li key={item.label} className="py-1">
                  {temSubmenu ? (
                    <p className="pt-3 text-sm font-semibold tracking-wider text-ink-900 uppercase">
                      {item.label}
                    </p>
                  ) : externo ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setAberto(false)}
                      className="block py-3 text-sm font-semibold tracking-wider text-ink-900 uppercase"
                    >
                      {item.label}
                    </a>
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
                      {item.submenu.map((sub, i) =>
                        "group" in sub ? (
                          <li
                            key={`grupo-${sub.group}-${i}`}
                            className="pt-2 text-[0.65rem] font-bold tracking-[0.16em] text-ink-400 uppercase first:pt-0"
                          >
                            {sub.group}
                          </li>
                        ) : "external" in sub && sub.external ? (
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
                              {"icone" in sub ? (
                                <Icon name={sub.icone} className="mr-2 -mt-0.5 inline size-3.5" />
                              ) : null}
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
