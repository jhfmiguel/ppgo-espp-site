"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

export function NewsletterHome() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const valor = email.trim();
    if (!valor) return;
    setEnviando(true);
    setMensagem("");
    setSucesso(false);
    try {
      const resposta = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: valor }),
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(dados?.message || dados?.mensagem || "Não foi possível realizar a inscrição.");
      setSucesso(true);
      setMensagem(dados?.message || dados?.mensagem || "Inscrição realizada com sucesso.");
      setEmail("");
    } catch (erro) {
      setMensagem(erro instanceof Error ? erro.message : "Não foi possível realizar a inscrição.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="newsletter-home bg-white px-4 py-7 md:px-6 md:py-12" data-no-scroll-animation>
      <div className="container-espp mx-auto max-w-6xl">
        <div className="rounded-[1.5rem] border border-[#0b3157]/10 bg-white px-5 py-6 shadow-[0_14px_42px_rgba(7,21,34,.07)] md:flex md:items-center md:justify-between md:gap-10 md:px-9 md:py-8">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center justify-center text-[#f5c400]">
              <Mail className="size-7 fill-none stroke-current" strokeWidth={1.8} />
            </div>
            <p className="mb-1 text-[.65rem] font-black tracking-[.16em] text-[#0b3157]/55 uppercase">Newsletter ESPP</p>
            <h2 className="text-xl font-black tracking-tight text-[#071522] md:text-2xl">Fique por dentro das novidades da Escola</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Receba notícias, eventos, cursos e comunicados da Escola Superior de Polícia Penal diretamente no seu e-mail.</p>
          </div>

          <form onSubmit={enviar} className="mt-5 w-full md:mt-0 md:max-w-[27rem]">
            <label htmlFor="newsletter-home-email" className="mb-1.5 block text-xs font-bold text-[#334155]">Seu e-mail</label>
            <div className="flex gap-2 rounded-2xl border border-[#0b3157]/12 bg-[#f8fafc] p-1.5 focus-within:border-[#0b3157]/30">
              <input id="newsletter-home-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@exemplo.com" className="min-w-0 flex-1 bg-transparent px-2.5 py-2.5 text-sm text-[#071522] outline-none placeholder:text-slate-400" />
              <button type="submit" disabled={enviando} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#f5c400] px-4 py-2.5 text-xs font-black text-[#071522] transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60">
                {enviando ? "Enviando..." : "Inscrever-se"}
                {!enviando && <ArrowRight className="size-3.5" />}
              </button>
            </div>
            {mensagem && <p role="status" className={`mt-2 flex items-center gap-1.5 text-xs font-semibold ${sucesso ? "text-emerald-700" : "text-red-700"}`}>{sucesso && <CheckCircle2 className="size-3.5" />}{mensagem}</p>}
            <p className="mt-2 text-[.68rem] leading-4 text-slate-500">Ao se inscrever, você concorda em receber comunicações da ESPP. O cancelamento pode ser feito a qualquer momento.</p>
          </form>
        </div>
      </div>
      <style jsx global>{`:root[data-mobile-theme="dark"] .newsletter-home{background:#1c2430!important}:root[data-mobile-theme="dark"] .newsletter-home>div>div{background:#171d27!important;border-color:rgba(255,255,255,.1)!important;box-shadow:0 14px 42px rgba(0,0,0,.22)!important}:root[data-mobile-theme="dark"] .newsletter-home h2{color:#fff!important}:root[data-mobile-theme="dark"] .newsletter-home p,:root[data-mobile-theme="dark"] .newsletter-home label{color:#cbd5e1!important}:root[data-mobile-theme="dark"] .newsletter-home form>div{background:rgba(255,255,255,.06)!important;border-color:rgba(255,255,255,.1)!important}:root[data-mobile-theme="dark"] .newsletter-home input{color:#fff!important}:root[data-mobile-theme="dark"] .newsletter-home input::placeholder{color:#94a3b8!important}`}</style>
    </section>
  );
}
