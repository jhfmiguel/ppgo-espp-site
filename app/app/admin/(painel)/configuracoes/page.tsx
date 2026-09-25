import { exigirPermissao } from "@/lib/auth/dal";
import { buscarConfiguracaoEmail } from "@/lib/data/store";
import { ConfiguracaoEmailClient } from "@/components/admin/configuracao-email-client";
export const metadata={title:"Configurações"};
export const dynamic="force-dynamic";
export default async function Page(){await exigirPermissao("configuracoes");const email=await buscarConfiguracaoEmail();return <><header className="mb-8 border-b border-ink-200 pb-5"><p className="text-[0.7rem] font-bold tracking-[0.16em] text-gold-600 uppercase">ESPP</p><h1 className="title-display mt-1 text-3xl text-ink-900">Configurações</h1><p className="mt-1.5 max-w-3xl text-sm text-ink-600">Parâmetros operacionais persistidos no backend da ESPP.</p></header><ConfiguracaoEmailClient email={email}/></>;}
