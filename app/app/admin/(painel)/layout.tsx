import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";

import { exigirUsuario } from "@/lib/auth/dal";
import { ROTULO_PERFIL } from "@/lib/auth/users";
import { sair } from "@/lib/actions/auth";
import { PainelNav } from "@/components/admin/painel-nav";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const usuario = await exigirUsuario();

  return (
    <div className="admin-panel flex min-h-screen flex-col bg-ink-050 lg:flex-row">
      <aside className="admin-sidebar flex shrink-0 flex-col bg-ink-900 lg:sticky lg:top-0 lg:h-screen lg:w-64">
        <div className="admin-sidebar-header flex shrink-0 flex-col items-start border-b border-ink-800 px-4 py-4">
          <span className="flex w-full items-center">
            <img
              src="/images/logo-espp.png"
              alt="Escola Superior de Polícia Penal"
              className="h-16 w-auto max-w-[13rem] object-contain"
            />
          </span>
          <span className="mt-6 block text-[0.65rem] font-semibold tracking-[0.16em] text-ink-400 uppercase">
            Painel administrativo
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <PainelNav perfil={usuario.perfil} />
        </div>

        <div className="admin-sidebar-footer shrink-0 border-t border-ink-800 px-3 py-3">
          <p className="px-2 text-sm font-semibold text-white">{usuario.nome}</p>
          <p className="px-2 text-xs text-ink-400">{usuario.email}</p>
          <p className="mt-1.5 px-2">
            <span className="inline-flex items-center rounded-full bg-gold-500/15 px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wider text-gold-400 uppercase">
              {ROTULO_PERFIL[usuario.perfil]}
            </span>
          </p>

          <Link
            href="/"
            target="_blank"
            className="admin-sidebar-public-link mt-3 flex items-center gap-2 rounded-md px-2 py-2 text-xs font-semibold text-ink-300 transition-colors hover:bg-ink-800 hover:text-white"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            Ver site público
          </Link>

          <form action={sair}>
            <button
              type="submit"
              className="admin-sidebar-exit-link flex w-full items-center gap-2 rounded-md px-2 py-2 text-xs font-semibold text-ink-300 transition-colors hover:bg-ink-800 hover:text-white"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-ink-050 px-5 py-8 lg:px-6 lg:py-10 xl:px-7">
        <div className="mx-auto w-full max-w-none">{children}</div>
      </main>
    </div>
  );
}
