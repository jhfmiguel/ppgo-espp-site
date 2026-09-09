"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { fortis, nav, site } from "@/content/site";

export function SiteHeader() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);

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

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        rolou || aberto
          ? "border-b border-ink-700/80 bg-ink-950/95 backdrop-blur"
          : "border-b border-transparent bg-gradient-to-b from-ink-950/80 to-transparent",
      ].join(" ")}
    >
      <div className="container-espp flex h-20 items-center justify-between gap-4">
        <a
          href="#top"
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
        </a>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[0.8rem] font-semibold tracking-wider text-ink-200 uppercase transition-colors hover:text-gold-500"
                >
                  {item.label}
                </a>
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
            className="inline-flex size-11 items-center justify-center rounded-md border border-ink-600 text-white lg:hidden"
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
        className="border-t border-ink-700 bg-ink-950 lg:hidden"
      >
        <nav aria-label="Navegação principal (mobile)" className="container-espp py-6">
          <ul className="flex flex-col divide-y divide-ink-800">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setAberto(false)}
                  className="block py-4 text-sm font-semibold tracking-wider text-ink-100 uppercase"
                >
                  {item.label}
                </a>
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
