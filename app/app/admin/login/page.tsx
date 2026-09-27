import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Acesso administrativo",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ proximo?: string }>;
}) {
  const { proximo } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center justify-center">
          <img
            src="/images/logo-espp-white.png"
            alt="ESPP — Escola Superior de Polícia Penal"
            className="h-16 w-auto max-w-[15rem] object-contain"
          />
          <span className="mt-2 block text-[0.65rem] font-semibold tracking-[0.16em] text-ink-400 uppercase">
            Painel administrativo
          </span>
        </div>

        <div className="rounded-xl border border-ink-200 bg-white p-7 shadow-lg">
          <div className="mb-4 flex items-center gap-2 text-gov-teal">
            <ShieldCheck className="size-5" aria-hidden="true" />
            <span className="text-[0.65rem] font-black tracking-[0.14em] uppercase">Acesso institucional</span>
          </div>
          <h1 className="title-display text-2xl text-ink-900">Acesso administrativo</h1>
          <p className="mt-1.5 text-sm leading-6 text-ink-600">
            O acesso definitivo ao painel da ESPP será autenticado pela Secretaria de Segurança Pública de Goiás (SSP-GO), conforme o perfil e as permissões institucionais do usuário.
          </p>

          <div className="my-5 rounded-lg border border-gov-blue/15 bg-gov-blue/5 px-4 py-3 text-xs leading-5 text-ink-700">
            Enquanto a integração oficial com a SSP não estiver disponível neste ambiente, o formulário abaixo permanece exclusivamente para desenvolvimento e homologação.
          </div>

          <LoginForm proximo={proximo} />
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-ink-400">
          <Link href="/acessos" className="underline underline-offset-4 hover:text-white">
            Central de acessos
          </Link>
          <span aria-hidden="true">•</span>
          <Link href="/" className="underline underline-offset-4 hover:text-white">
            Voltar para o site da {site.sigla}
          </Link>
        </div>
      </div>
    </div>
  );
}
