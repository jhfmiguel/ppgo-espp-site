import { exigirUsuario } from "@/lib/auth/dal";
import { ROTULO_PERFIL } from "@/lib/auth/users";
import { PainelNav } from "@/components/admin/painel-nav";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSidebarBrand } from "@/components/admin/admin-sidebar-brand";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const usuario = await exigirUsuario();
  const menuUsuario = {
    nome: usuario.nome,
    email: usuario.email,
    perfil: ROTULO_PERFIL[usuario.perfil],
  };

  const sidebar = (
    <>
      <AdminSidebarBrand mobileAvatar={<AdminUserMenu {...menuUsuario} compact />} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible">
        <PainelNav perfil={usuario.perfil} />
      </div>
      <div className="admin-sidebar-footer hidden shrink-0 border-t border-ink-800 px-3 py-3 lg:block">
        <AdminUserMenu {...menuUsuario} />
      </div>
    </>
  );

  return <AdminShell sidebar={sidebar}>{children}</AdminShell>;
}
