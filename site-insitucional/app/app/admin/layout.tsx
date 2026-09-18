import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Painel administrativo",
    template: "%s | Painel ESPP",
  },
  // O painel nunca deve ser indexado por buscadores.
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-ink-050">{children}</div>;
}
