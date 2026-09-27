import type { Metadata } from "next";
import Link from "next/link";
import { LogIn, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import { site } from "@/content/site";
import { autenticacaoSspConfigurada } from "@/lib/auth/ssp";

export const metadata: Metadata = {
  title: "Acesso administrativo",
  robots: { index: false, follow: false },
};

const mensagensSsp: Record<string, string> = {
  indisponivel: "A integração SSP ainda não está configurada neste ambiente.",
  "retorno-invalido": "O retorno da autenticação SSP não contém um código válido.",
  "nao-integrado": "A SSP retornou ao sistema, mas a troca do código pela identidade ainda depende do contrato oficial de integração.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ proximo?: string; ssp?: string }>;
}) {
  const { proximo, ssp } = await searchParams;
  const sspConfigurada = autenticacaoSspConfigurada();
  const modoLocal = process.env.NODE_ENV !== "production" && process.env.ESPP_AUTH_MODE?.trim().toLowerCase() === "local";
  const queryProximo = proximo?.startsWith("/admin") ? `?proximo=${encodeURIComponent(proximo)}` : "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center justify-center">
          <img src="/images/logo-espp-white.png" alt="ESPP — Escola Superior de Polícia Penal" className="h-16 w-auto max-w-[15rem] object-contain" />
          <span className="mt-2 block text-[0.65rem] font-semibold tracking-[0.16em] text-ink-400 uppercase">Painel administrativo</span>
        </div>

        <div className="rounded-xl border border-ink-200 bg-white p-7 shadow-lg">
          <div className="mb-4 flex items-center gap-2 text-gov-teal">
            <ShieldCheck className="size-5" aria-hidden="true" />
            <span className="text-[0.65rem] font-black tracking-[0.14em] uppercase">Acesso institucional</span>
          </div>
          <h1 className="title-display text-2xl text-ink-900">Acesso administrativo</h1>
          <p className="mt-1.5 text-sm leading-6 text-ink-600">O mecanismo oficial do painel da ESPP é a autenticação institucional da Secretaria de Segurança Pública de Goiás (SSP-GO), respeitando perfil e permissões do usuário.</p>

          {ssp && mensagensSsp[ssp] ? <p role="alert" className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-900">{mensagensSsp[ssp]}</p> : null}

          <Link href={`/admin/auth/ssp${queryProximo}`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-gov-teal px-6 py-3 text-xs font-bold tracking-wide text-white uppercase transition hover:brightness-95">
            <LogIn className="size-4" aria-hidden="true" />
            Entrar com SSP
          </Link>

          {!sspConfigurada ? <p className="mt-3 text-center text-xs leading-5 text-ink-500">A configuração técnica da SSP será ativada por variáveis de ambiente quando os dados oficiais da integração forem disponibilizados.</p> : null}

          {modoLocal ? (
            <div className="mt-6 border-t border-ink-200 pt-5">
              <p className="mb-4 rounded-lg border border-gov-blue/15 bg-gov-blue/5 px-4 py-3 text-xs leading-5 text-ink-700">Acesso local disponível somente neste ambiente de desenvolvimento/homologação.</p>
              <LoginForm proximo={proximo} />
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-ink-400">
          <Link href="/acessos" className="underline underline-offset-4 hover:text-white">Central de acessos</Link>
          <span aria-hidden="true">•</span>
          <Link href="/" className="underline underline-offset-4 hover:text-white">Voltar para o site da {site.sigla}</Link>
        </div>
      </div>
    </div>
  );
}
