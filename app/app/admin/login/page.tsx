import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/admin/login-form";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Entrar",
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
          <h1 className="title-display text-2xl text-ink-900">Entrar no painel</h1>
          <p className="mt-1.5 mb-6 text-sm text-ink-600">
            Acesso restrito à equipe de comunicação e à administração da Escola.
          </p>

          <LoginForm proximo={proximo} />
        </div>

        {/* Ambiente de testes com dados mockados — remover ao integrar a
            autenticação oficial. */}
        <div className="mt-5 rounded-xl border border-ink-700 bg-ink-850 p-5">
          <p className="text-[0.65rem] font-bold tracking-[0.16em] text-gold-500 uppercase">
            Logins de exemplo (ambiente de testes)
          </p>
          <ul className="mt-3 space-y-3">
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-ink-400">
          <Link href="/" className="underline underline-offset-4 hover:text-white">
            Voltar para o site da {site.sigla}
          </Link>
        </p>
      </div>
    </div>
  );
}
