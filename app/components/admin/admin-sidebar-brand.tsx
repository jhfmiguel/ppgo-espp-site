"use client";

import { Suspense } from "react";
import { useAdminSidebar } from "@/components/admin/admin-shell";
import { ConfigurableBrandImage } from "@/components/configurable-brand-image";

export function AdminSidebarBrand({ mobileAvatar }: { mobileAvatar: React.ReactNode }) {
  const { recolhido } = useAdminSidebar();

  return (
    <div className={`admin-sidebar-header relative flex shrink-0 flex-col border-b ${recolhido ? "h-[6.5rem] items-center px-2 py-2" : "items-start px-4 py-4"}`}>
      {recolhido ? (
        <span className="flex w-full items-center justify-center overflow-hidden">
          <ConfigurableBrandImage area="brasao" fallbackLight="/images/logo-espp.png" fallbackDark="/images/logo-espp-white.png" alt="Brasão ESPP" className="size-12 object-contain" />
        </span>
      ) : (
        <>
          <span className="flex w-full items-center overflow-hidden pr-12">
            <ConfigurableBrandImage area="admin" fallbackLight="/images/logo-espp.png" fallbackDark="/images/logo-espp-white.png" alt="ESPP" className="h-16 w-auto max-w-[13rem] object-contain object-left" />
          </span>
          <span className="admin-sidebar-subtitle mt-6 block text-[0.65rem] font-semibold tracking-[0.16em] uppercase">Painel administrativo</span>
        </>
      )}
      <div className="absolute right-3 top-3 z-[220] lg:hidden">
        <Suspense fallback={null}>{mobileAvatar}</Suspense>
      </div>
    </div>
  );
}
