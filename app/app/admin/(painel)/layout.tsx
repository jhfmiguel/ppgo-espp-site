import { exigirUsuario } from "@/lib/auth/dal";
import { ROTULO_PERFIL } from "@/lib/auth/users";
import { PainelNav } from "@/components/admin/painel-nav";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const usuario = await exigirUsuario();

  return (
    <div className="admin-panel flex min-h-screen flex-col bg-ink-050 lg:flex-row">
      <aside className="admin-sidebar flex shrink-0 flex-col bg-ink-900 lg:sticky lg:top-0 lg:h-screen lg:w-64">
        <div className="admin-sidebar-header flex shrink-0 flex-col items-start border-b border-ink-800 px-4 py-4">
          <span className="admin-espp-logo block h-16 w-full max-w-[13rem]" role="img" aria-label="Escola Superior de Polícia Penal">
            <img
              src="/images/logo-espp.png"
              alt=""
              aria-hidden="true"
              className="admin-espp-logo-light h-full w-full object-contain object-left"
            />
            <img
              src="/images/logo-espp-white.png"
              alt=""
              aria-hidden="true"
              className="admin-espp-logo-dark hidden h-full w-full object-contain object-left"
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
          <AdminUserMenu
            nome={usuario.nome}
            email={usuario.email}
            perfil={ROTULO_PERFIL[usuario.perfil]}
          />
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-ink-050 px-5 py-8 lg:px-6 lg:py-10 xl:px-7">
        <div className="mx-auto w-full max-w-none">{children}</div>
      </main>
    </div>
  );
}
