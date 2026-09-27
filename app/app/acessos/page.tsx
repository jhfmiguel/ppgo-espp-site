import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, GraduationCap, LockKeyhole, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Acessos",
  description: "Central de acessos aos serviços digitais da Escola Superior de Polícia Penal.",
};

const acessos = [
  {
    titulo: "Portal do Aluno",
    descricao: "Acesse o ambiente de ensino, cursos e atividades acadêmicas da ESPP.",
    href: "https://ead.policiapenal.go.gov.br/login/index.php",
    externo: true,
    Icone: GraduationCap,
    acao: "Acessar Portal do Aluno",
  },
  {
    titulo: "Painel Administrativo",
    descricao: "Área restrita para gestão do portal institucional. A autenticação definitiva será realizada pela SSP.",
    href: "/admin",
    externo: false,
    Icone: LockKeyhole,
    acao: "Acessar área administrativa",
  },
] as const;

export default function AcessosPage() {
  return (
    <main className="min-h-[65vh] bg-ink-050 py-12 lg:py-16">
      <div className="container-espp">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-gov-teal">
              <ShieldCheck className="size-5" aria-hidden="true" />
              <span className="text-xs font-black tracking-[0.14em] uppercase">Acesso institucional</span>
            </div>
            <h1 className="title-display text-3xl text-ink-950 sm:text-4xl">Acessos</h1>
            <p className="mt-3 text-base leading-7 text-ink-600">
              Utilize esta área para acessar os ambientes digitais da Escola Superior de Polícia Penal.
              O acesso às áreas restritas da ESPP será integrado à autenticação institucional da Secretaria de Segurança Pública de Goiás (SSP-GO).
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {acessos.map(({ titulo, descricao, href, externo, Icone, acao }) => {
              const conteudo = (
                <>
                  <span className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-gov-teal/10 text-gov-teal">
                    <Icone className="size-6" aria-hidden="true" />
                  </span>
                  <h2 className="text-xl font-black text-ink-950">{titulo}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ink-600">{descricao}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gov-teal">
                    {acao}
                    {externo && <ExternalLink className="size-4" aria-hidden="true" />}
                  </span>
                </>
              );

              const classes = "group flex min-h-64 flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-gov-teal/40 hover:shadow-md";

              return externo ? (
                <a key={titulo} href={href} target="_blank" rel="noopener noreferrer" className={classes}>
                  {conteudo}
                </a>
              ) : (
                <Link key={titulo} href={href} className={classes}>
                  {conteudo}
                </Link>
              );
            })}
          </div>

          <div className="mt-7 rounded-xl border border-gov-blue/15 bg-gov-blue/5 px-5 py-4 text-sm leading-6 text-ink-700">
            A ESPP não manterá uma credencial institucional paralela para o acesso administrativo. A integração com a SSP será o mecanismo oficial de autenticação quando disponibilizada para o sistema.
          </div>
        </div>
      </div>
    </main>
  );
}
