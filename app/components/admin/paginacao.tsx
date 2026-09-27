import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ITENS_POR_PAGINA = 20;

export function paginar<T>(itens: T[], paginaInformada: string | undefined, porPagina = ITENS_POR_PAGINA) {
  const total = itens.length;
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  const pagina = Math.min(totalPaginas, Math.max(1, Number.parseInt(paginaInformada || "1", 10) || 1));
  const inicio = (pagina - 1) * porPagina;
  return { itens: itens.slice(inicio, inicio + porPagina), pagina, totalPaginas, total, inicio };
}

function hrefPagina(params: Record<string, string | undefined>, pagina: number) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([chave, valor]) => {
    if (chave !== "pagina" && valor) query.set(chave, valor);
  });
  if (pagina > 1) query.set("pagina", String(pagina));
  const texto = query.toString();
  return texto ? `?${texto}` : "?";
}

function paginasVisiveis(atual: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const paginas = new Set([1, total, atual - 1, atual, atual + 1]);
  return [...paginas].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export function Paginacao({ pagina, totalPaginas, total, inicio, params, porPagina = ITENS_POR_PAGINA }: { pagina: number; totalPaginas: number; total: number; inicio: number; params: Record<string, string | undefined>; porPagina?: number }) {
  if (!total) return null;
  const fim = Math.min(inicio + porPagina, total);
  const paginas = paginasVisiveis(pagina, totalPaginas);
  return <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-4 sm:flex-row">
    <p className="text-xs font-medium text-ink-500">{inicio + 1}–{fim} de {total}</p>
    <nav aria-label="Paginação" className="flex items-center justify-center gap-1">
      {pagina > 1 ? <Link href={hrefPagina(params, pagina - 1)} aria-label="Página anterior" className="inline-flex size-8 items-center justify-center rounded-md border border-ink-200 bg-white text-ink-600 transition hover:border-gold-500 hover:text-ink-900"><ChevronLeft className="size-4"/></Link> : <span aria-hidden="true" className="inline-flex size-8 items-center justify-center rounded-md border border-ink-100 text-ink-300"><ChevronLeft className="size-4"/></span>}
      {paginas.map((numero, indice) => <span key={numero} className="contents">{indice > 0 && numero - paginas[indice - 1] > 1 ? <span className="inline-flex size-8 items-center justify-center text-xs text-ink-400">…</span> : null}{numero === pagina ? <span aria-current="page" className="inline-flex size-8 items-center justify-center rounded-md border border-gold-500 bg-gold-050 text-xs font-bold text-gold-700">{numero}</span> : <Link href={hrefPagina(params, numero)} className="inline-flex size-8 items-center justify-center rounded-md border border-transparent text-xs font-semibold text-ink-600 transition hover:border-ink-200 hover:bg-white hover:text-ink-900">{numero}</Link>}</span>)}
      {pagina < totalPaginas ? <Link href={hrefPagina(params, pagina + 1)} aria-label="Próxima página" className="inline-flex size-8 items-center justify-center rounded-md border border-ink-200 bg-white text-ink-600 transition hover:border-gold-500 hover:text-ink-900"><ChevronRight className="size-4"/></Link> : <span aria-hidden="true" className="inline-flex size-8 items-center justify-center rounded-md border border-ink-100 text-ink-300"><ChevronRight className="size-4"/></span>}
    </nav>
  </div>;
}
