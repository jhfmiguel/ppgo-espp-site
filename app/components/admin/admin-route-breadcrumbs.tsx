"use client";

import Link from "next/link";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  noticias: "Notícias",
  eventos: "Eventos",
  mensagens: "Mensagens",
  newsletter: "Newsletter",
  "atos-normativos": "Atos normativos",
  relatorios: "Relatórios",
  acessos: "Acessos",
  auditoria: "Auditoria",
  configuracoes: "Configurações",
  novo: "Cadastrar",
  editar: "Editar",
  detalhes: "Detalhes",
};

function labelFor(segment: string) {
  if (/^\d+$/.test(segment)) return "Registro";
  return LABELS[segment] ?? segment.replaceAll("-", " ");
}

export function AdminRouteBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).slice(1);
  if (segments.length < 1) return null;
  let href = "/admin";
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-ink-500">
        <li><Link href="/admin" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-ink-100 hover:text-ink-900"><LayoutDashboard className="size-3.5" aria-hidden="true" />Painel</Link></li>
        {segments.map((segment, index) => {
          href += `/${segment}`;
          const atual = index === segments.length - 1;
          return <li key={href} className="flex items-center gap-1.5"><ChevronRight className="size-3.5 text-ink-300" aria-hidden="true" />{atual ? <span className="rounded-md px-2 py-1.5 font-bold text-ink-800" aria-current="page">{labelFor(segment)}</span> : <Link href={href} className="rounded-md px-2 py-1.5 transition-colors hover:bg-ink-100 hover:text-ink-900">{labelFor(segment)}</Link>}</li>;
        })}
      </ol>
    </nav>
  );
}
