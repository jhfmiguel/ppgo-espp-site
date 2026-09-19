import { exigirPermissao } from "@/lib/auth/dal";
import { criarCampanha } from "@/lib/actions/comunicacao";
import Link from "next/link";
import { Save, X } from "lucide-react";
import { TituloPagina } from "@/components/admin/ui";
export default async function Page(){await exigirPermissao("newsletter");return <><TituloPagina titulo="Nova campanha" descricao="Prepare a comunicação antes do envio aos assinantes ativos."/>
<form action={criarCampanha} className="max-w-3xl space-y-4 rounded-xl border bg-white p-6">
<label className="block text-sm font-bold">Assunto<input name="assunto" required maxLength={250} className="mt-2 w-full rounded-md border px-3 py-2"/></label>
<label className="block text-sm font-bold">Conteúdo<textarea name="conteudo" required rows={14} maxLength={20000} className="mt-2 w-full rounded-md border px-3 py-2"/></label>
<div className="flex flex-wrap items-center gap-3">
<button className="inline-flex items-center justify-center gap-2 rounded-md bg-gold-500 px-4 py-2.5 text-xs font-bold uppercase text-ink-950" title="Salvar" aria-label="Salvar"><Save className="size-4" aria-hidden="true" /><span>Salvar</span></button>
<Link href="/admin/newsletter" className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-xs font-bold uppercase text-white transition-colors hover:bg-blue-700" title="Cancelar" aria-label="Cancelar"><X className="size-4" aria-hidden="true" /><span>Cancelar</span></Link>
</div></form></>;}