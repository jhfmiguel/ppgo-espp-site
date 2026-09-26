import { exigirUsuario } from "@/lib/auth/dal";
import { ROTULO_PERFIL } from "@/lib/auth/users";
import { PainelNav } from "@/components/admin/painel-nav";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const usuario = await exigirUsuario();
  const menuUsuario = {
    nome: usuario.nome,
    email: usuario.email,
    perfil: ROTULO_PERFIL[usuario.perfil],
  };

  return (
    <div className="admin-panel flex min-h-screen flex-col bg-ink-050 lg:flex-row">
      <aside className="admin-sidebar relative flex shrink-0 flex-col bg-ink-900 lg:sticky lg:top-0 lg:h-screen lg:w-64">
        <div className="admin-sidebar-header relative flex shrink-0 flex-col items-start border-b border-ink-800 px-4 py-4">
          <span className="admin-espp-logo block h-16 w-full max-w-[13rem] pr-12" role="img" aria-label="Escola Superior de Polícia Penal">
            <img src="/images/logo-espp.png" alt="" aria-hidden="true" className="admin-espp-logo-light h-full w-full object-contain object-left" />
            <img src="/images/logo-espp-white.png" alt="" aria-hidden="true" className="admin-espp-logo-dark hidden h-full w-full object-contain object-left" />
          </span>
          <span className="mt-6 block text-[0.65rem] font-semibold tracking-[0.16em] text-ink-400 uppercase">Painel administrativo</span>
          <div className="absolute right-3 top-3 z-[80] lg:hidden">
            <AdminUserMenu {...menuUsuario} compact />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-x-auto lg:overflow-y-auto">
          <PainelNav perfil={usuario.perfil} />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="admin-topbar sticky top-0 z-40 hidden h-16 items-center justify-end border-b border-ink-200 bg-white/95 px-7 backdrop-blur lg:flex">
          <AdminUserMenu {...menuUsuario} compact />
        </header>
        <main className="min-w-0 bg-ink-050 px-5 py-8 lg:px-6 lg:py-10 xl:px-7">
          <div className="mx-auto w-full max-w-none">{children}</div>
        </main>
      </div>
    </div>
  );
}
