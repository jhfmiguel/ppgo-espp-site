"use server";
import { revalidatePath } from "next/cache";
import { exigirPermissao } from "@/lib/auth/dal";
import { salvarConfiguracaoEmail, testarConfiguracaoEmail } from "@/lib/data/store";

export async function salvarEmailAction(dados:{host:string;porta:number;remetente:string;destinatario:string;senha:string;autenticacao:boolean;starttls:boolean}){
 const usuario=await exigirPermissao("configuracoes");
 const r=await salvarConfiguracaoEmail(dados,usuario.nome); revalidatePath("/admin/configuracoes"); return r;
}
export async function testarEmailAction(){await exigirPermissao("configuracoes");return testarConfiguracaoEmail();}
