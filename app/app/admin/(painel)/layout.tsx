import Link from "next/link";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";

import { exigirUsuario } from "@/lib/auth/dal";
import { ROTULO_PERFIL } from "@/lib/auth/users";
import { sair } from "@/lib/actions/auth";
import { PainelNav } from "@/components/admin/painel-nav";
import { site } from "@/content/site";

/**
 * Casca do painel autenticado.
 *
 * A página de login fica fora deste grupo de rotas justamente para não passar
 * por `exigirUsuario`.
 */
export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const usuario = await exigirUsuario();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col bg-ink-900 lg:w-64">
        <div className="flex items-center gap-2.5 border-b border-ink-800 px-4 py-4">
          <ShieldCheck className="size-6 shrink-0 text-gold-500" aria-hidden="true" />
          <span>
            <span className="title-display block text-lg leading-none text-white">
              {site.sigla}
            </span>
            <span className="block text-[0.65rem] font-semibold tracking-[0.16em] text-ink-400 uppercase">
              Painel
            </span>
          </span>
        </div>

        <PainelNav perfil={usuario.perfil} />

        <div className="mt-auto border-t border-ink-800 p-3">
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
            className="mt-3 flex items-center gap-2 rounded-md px-2 py-2 text-xs font-semibold text-ink-300 transition-colors hover:bg-ink-800 hover:text-white"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            Ver site público
          </Link>

          <form action={sair}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-xs font-semibold text-ink-300 transition-colors hover:bg-ink-800 hover:text-white"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-ink-050 px-5 py-8 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
