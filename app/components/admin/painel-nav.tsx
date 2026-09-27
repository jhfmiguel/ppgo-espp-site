"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, FileClock, FileText, LayoutDashboard, Mail, Megaphone, UsersRound, Settings, ShieldCheck } from "lucide-react";
import { podeGerenciar, type Perfil, type Recurso } from "@/lib/auth/users";
import { useAdminSidebar } from "@/components/admin/admin-shell";

const ITENS: { href: string; rotulo: string; Icone: typeof LayoutDashboard; recurso?: Recurso }[] = [
  { href: "/admin", rotulo: "Visão geral", Icone: LayoutDashboard },
  { href: "/admin/noticias", rotulo: "Notícias", Icone: Megaphone, recurso: "noticias" },
  { href: "/admin/eventos", rotulo: "Eventos", Icone: CalendarDays, recurso: "eventos" },
  { href: "/admin/mensagens", rotulo: "Mensagens", Icone: Mail, recurso: "mensagens" },
  { href: "/admin/newsletter", rotulo: "Newsletter", Icone: UsersRound, recurso: "newsletter" },
  { href: "/admin/atos-normativos", rotulo: "Atos normativos", Icone: FileText, recurso: "atosNormativos" },
  { href: "/admin/relatorios", rotulo: "Relatórios", Icone: BarChart3 },
  { href: "/admin/acessos", rotulo: "Acessos", Icone: ShieldCheck, recurso: "acessos" },
  { href: "/admin/auditoria", rotulo: "Auditoria", Icone: FileClock, recurso: "auditoria" },
  { href: "/admin/configuracoes", rotulo: "Configurações", Icone: Settings, recurso: "configuracoes" },
];

export function PainelNav({ perfil }: { perfil: Perfil }) {
  const caminho = usePathname();
  const { recolhido } = useAdminSidebar();
  const visiveis = ITENS.filter((item) => !item.recurso || podeGerenciar(perfil, item.recurso));

  return (
    <nav aria-label="Seções do painel" className={recolhido ? "p-2 pt-5" : "p-3"}>
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {visiveis.map(({ href, rotulo, Icone }) => {
          const ativo = href === "/admin" ? caminho === "/admin" : caminho.startsWith(href);
          return (
            <li key={href} className="shrink-0 lg:shrink">
              <Link
                href={href}
                aria-current={ativo ? "page" : undefined}
                aria-label={recolhido ? rotulo : undefined}
                title={recolhido ? rotulo : undefined}
                className={`admin-nav-link group relative flex items-center rounded-md py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${recolhido ? "justify-center px-2" : "gap-2.5 px-3"} ${ativo ? "bg-gold-500 text-ink-950" : "text-ink-300 hover:bg-ink-800 hover:text-white"}`}
              >
                <Icone className="size-4 shrink-0" aria-hidden="true" />
                {!recolhido ? <span>{rotulo}</span> : null}
                {recolhido ? <span className="pointer-events-none absolute left-[calc(100%+0.65rem)] top-1/2 z-[1300] hidden -translate-y-1/2 rounded-md border border-ink-700 bg-ink-900 px-3 py-2 text-xs font-semibold text-white shadow-xl group-hover:block group-focus-visible:block">{rotulo}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
