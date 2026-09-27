import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Falha no acesso institucional",
  robots: { index: false, follow: false },
};

export default function SspErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-900 px-5 py-12">
      <section className="w-full max-w-lg rounded-xl border border-ink-200 bg-white p-8 shadow-xl">
        <div className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-amber-50 text-amber-700">
          <AlertTriangle className="size-5" />
        </div>
        <h1 className="title-display text-2xl text-ink-900">
          Não foi possível concluir o acesso
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-600">
          A autenticação institucional não foi concluída. Nenhuma sessão
          administrativa foi criada. Tente novamente ou retorne ao site da ESPP.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/auth/ssp"
            className="inline-flex items-center gap-2 rounded-md bg-gov-teal px-4 py-2.5 text-xs font-bold text-white"
          >
            <RefreshCw className="size-4" />
            Tentar novamente
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-ink-200 px-4 py-2.5 text-xs font-bold text-ink-700"
          >
            <ArrowLeft className="size-4" />
            Voltar ao site
          </Link>
        </div>
      </section>
    </main>
  );
}
