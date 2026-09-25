"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  FileClock,
  FileText,
  LayoutDashboard,
  Mail,
  Megaphone,
  UsersRound,
  Settings,
} from "lucide-react";

import { podeGerenciar, type Perfil, type Recurso } from "@/lib/auth/users";

/**
 * Navegação lateral do painel.
 *
 * Os itens sem permissão para o perfil simplesmente não são renderizados — a
 * restrição que vale é a do servidor (`exigirPermissao`), esta é só a interface.
 */
const ITENS: {
  href: string;
  rotulo: string;
  Icone: typeof LayoutDashboard;
  recurso?: Recurso;
}[] = [
  { href: "/admin", rotulo: "Visão geral", Icone: LayoutDashboard },
  { href: "/admin/noticias", rotulo: "Notícias", Icone: Megaphone, recurso: "noticias" },
  { href: "/admin/eventos", rotulo: "Eventos", Icone: CalendarDays, recurso: "eventos" },
  { href: "/admin/mensagens", rotulo: "Mensagens", Icone: Mail, recurso: "mensagens" },
  { href: "/admin/newsletter", rotulo: "Newsletter", Icone: UsersRound, recurso: "newsletter" },
  { href: "/admin/configuracoes", rotulo: "Configurações", Icone: Settings, recurso: "configuracoes" },
  {
    href: "/admin/atos-normativos",
    rotulo: "Atos normativos",
    Icone: FileText,
    recurso: "atosNormativos",
  },
  {
    href: "/admin/controle-alteracoes",
    rotulo: "Auditoria",
    Icone: FileClock,
    recurso: "auditoria",
  },
];

export function PainelNav({ perfil }: { perfil: Perfil }) {
  const caminho = usePathname();
  const visiveis = ITENS.filter((item) => !item.recurso || podeGerenciar(perfil, item.recurso));

  return (
    <nav aria-label="Seções do painel" className="p-3">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {visiveis.map(({ href, rotulo, Icone }) => {
          const ativo = href === "/admin" ? caminho === "/admin" : caminho.startsWith(href);
          return (
            <li key={href} className="shrink-0 lg:shrink">
              <Link
                href={href}
                aria-current={ativo ? "page" : undefined}
                className={`admin-nav-link flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                  ativo
                    ? "bg-gold-500 text-ink-950"
                    : "text-ink-300 hover:bg-ink-800 hover:text-white"
                }`}
              >
                <Icone className="size-4 shrink-0" aria-hidden="true" />
                {rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
