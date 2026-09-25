import { exigirPermissao } from "@/lib/auth/dal";
import { criarCampanha } from "@/lib/actions/comunicacao";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { TituloPagina } from "@/components/admin/ui";
import { EditorRico } from "@/components/admin/editor-rico";

export default async function Page() {
  await exigirPermissao("newsletter");

  return (
    <>
      <TituloPagina
        titulo="Nova campanha"
        descricao="Prepare a comunicação antes do envio aos assinantes ativos."
      />
      <form action={criarCampanha} className="max-w-5xl space-y-6 rounded-xl border border-ink-200 bg-white p-6">
        <label className="block text-sm font-bold text-ink-900">
          Assunto
          <input
            name="assunto"
            required
            maxLength={250}
            className="mt-2 w-full rounded-md border border-ink-200 px-3 py-2"
          />
        </label>

        <EditorRico
          name="conteudo"
          rotulo="Conteúdo da campanha"
          descricao="Use a barra para formatar o texto, criar títulos, listas, links e inserir imagens, como no editor de notícias."
        />

        <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-4 py-2.5 text-xs font-bold uppercase text-ink-950"
            title="Salvar"
            aria-label="Salvar"
          >
            <Save className="size-4" aria-hidden="true" />
            <span>Salvar</span>
          </button>
          <Link
            href="/admin/newsletter/campanhas"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-xs font-bold uppercase text-white transition-colors hover:bg-blue-700"
            title="Voltar"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Voltar</span>
          </Link>
        </div>
      </form>
    </>
  );
}
