import type { Metadata } from "next";
import { exigirUsuario } from "@/lib/auth/dal";
import { ROTULO_PERFIL } from "@/lib/auth/users";
import { PainelNav } from "@/components/admin/painel-nav";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSidebarBrand } from "@/components/admin/admin-sidebar-brand";
import { AdminRouteBreadcrumbs } from "@/components/admin/admin-route-breadcrumbs";
import "./admin-theme-regression.css";

export const metadata: Metadata = {
  title: { default: "Painel administrativo", template: "%s | Painel ESPP" },
  robots: { index: false, follow: false },
};

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const usuario = await exigirUsuario();
  const menuUsuario = { nome: usuario.nome, email: usuario.email, perfil: ROTULO_PERFIL[usuario.perfil] };
  const sidebar = <><AdminSidebarBrand mobileAvatar={<AdminUserMenu {...menuUsuario} compact />} /><div className="admin-sidebar-nav min-h-0 flex-1 overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><PainelNav perfil={usuario.perfil} /></div><div className="admin-sidebar-footer hidden shrink-0 border-t px-3 py-3 lg:block"><AdminUserMenu {...menuUsuario} /></div></>;
  return <AdminShell sidebar={sidebar}><AdminRouteBreadcrumbs />{children}</AdminShell>;
}
