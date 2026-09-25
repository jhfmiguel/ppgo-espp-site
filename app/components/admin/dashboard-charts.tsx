"use client";

type Item = { nome: string; total: number };
type Serie = { mes: string; total: number; publicados: number };
type Props = {
  mensal: Serie[];
  porModulo: Item[];
  porSituacao: Item[];
  porMensagem: Item[];
  newsletter: Item[];
};

function Cabecalho({ titulo, descricao }: { titulo: string; descricao: string }) {
  return <div className="mb-5"><h3 className="title-display text-lg text-ink-900">{titulo}</h3><p className="mt-1 text-xs text-ink-500">{descricao}</p></div>;
}

function Barras({ dados, percentual = false }: { dados: Item[]; percentual?: boolean }) {
  const max = Math.max(1, ...dados.map((x) => x.total));
  return <div className="space-y-4">{dados.map((x) => <div key={x.nome}>
    <div className="mb-1.5 flex justify-between gap-3 text-xs"><span className="font-semibold text-ink-700">{x.nome}</span><span className="font-bold text-ink-900">{x.total}{percentual ? "%" : ""}</span></div>
    <div className="h-3 overflow-hidden rounded-full bg-ink-100"><div className="h-full rounded-full bg-gold-500" style={{width:`${Math.max(x.total ? 3 : 0, percentual ? x.total : x.total / max * 100)}%`}} /></div>
  </div>)}</div>;
}

function Linha({ dados }: { dados: Serie[] }) {
  const max = Math.max(1, ...dados.map((x) => x.publicados));
  const pontos = dados.map((x,i) => `${dados.length === 1 ? 50 : (i/(dados.length-1))*100},${94-(x.publicados/max)*84}`).join(" ");
  return <div><svg viewBox="0 0 100 100" className="h-56 w-full" preserveAspectRatio="none" aria-label="Evolução mensal de publicações"><line x1="0" y1="94" x2="100" y2="94" stroke="var(--color-ink-200)" strokeWidth="0.8"/><polyline points={pontos} fill="none" stroke="var(--color-gov-blue)" strokeWidth="2.2" vectorEffect="non-scaling-stroke"/></svg><div className="mt-2 flex justify-between gap-1 text-[10px] text-ink-500">{dados.map(x=><span key={x.mes}>{x.mes}</span>)}</div></div>;
}

function Colunas({ dados, chave = "total" }: { dados: Serie[]; chave?: "total"|"publicados" }) {
  const max=Math.max(1,...dados.map(x=>x[chave]));
  return <div className="flex h-64 items-end gap-3 border-b border-ink-200 px-2 pt-4">{dados.map(x=><div key={x.mes} className="flex h-full min-w-0 flex-1 flex-col justify-end text-center"><span className="mb-1 text-[10px] font-bold text-ink-600">{x[chave]}</span><div className="mx-auto w-full max-w-12 rounded-t-md bg-forest-500" style={{height:`${Math.max(x[chave] ? 4 : 0,x[chave]/max*82)}%`}}/><span className="mt-2 truncate text-[10px] text-ink-500">{x.mes}</span></div>)}</div>;
}

export function DashboardCharts({ mensal, porModulo, porSituacao, porMensagem, newsletter }: Props) {
  const total=porModulo.reduce((a,b)=>a+b.total,0);
  const ativos=newsletter.find(x=>x.nome==="Ativos")?.total ?? 0;
  const totalNews=newsletter.reduce((a,b)=>a+b.total,0);
  const percentual=totalNews ? Math.round(ativos/totalNews*100) : 0;
  return <div className="grid gap-6 xl:grid-cols-2">
    <section className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5"><Cabecalho titulo="Registros por mês" descricao="Volume de conteúdos cadastrados no período"/><Colunas dados={mensal}/></section>
    <section className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5"><Cabecalho titulo="Publicações por mês" descricao="Evolução mensal dos conteúdos publicados"/><Linha dados={mensal}/></section>
    <section className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5"><Cabecalho titulo="Conteúdo por módulo" descricao="Distribuição entre notícias, eventos, atos, mensagens e newsletter"/><Barras dados={porModulo}/></section>
    <section className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5"><Cabecalho titulo="Situação dos conteúdos" descricao="Distribuição entre publicados e rascunhos"/><Barras dados={porSituacao}/></section>
    <section className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5"><Cabecalho titulo="Cobertura de publicação" descricao="Percentual publicado por módulo"/><Barras percentual dados={porModulo.map(x=>({nome:x.nome,total: total ? Math.round(x.total/total*100):0}))}/></section>
    <section className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5"><Cabecalho titulo="Situação das mensagens" descricao="Mensagens novas e já tratadas"/><Barras dados={porMensagem}/></section>
    <section className="admin-form-surface rounded-xl border border-ink-200 bg-white p-5 xl:col-span-2"><Cabecalho titulo="Assinantes da newsletter" descricao="Situação atual da base de assinantes"/><div className="grid gap-6 md:grid-cols-[180px_1fr] md:items-center"><div className="mx-auto flex size-40 items-center justify-center rounded-full border-[18px] border-gold-500 bg-ink-050"><div className="text-center"><p className="text-3xl font-black text-ink-900">{percentual}%</p><p className="text-[10px] font-bold uppercase text-ink-500">ativos</p></div></div><Barras dados={newsletter}/></div></section>
  </div>;
}
