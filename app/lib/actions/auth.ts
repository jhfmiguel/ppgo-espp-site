"use server";
import { timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { criarSessao } from "@/lib/auth/session";
import type { EstadoForm } from "@/lib/actions/estado";
import { destinoAdminSeguro } from "@/lib/auth/ssp";
function compararSeguro(a:string,b:string){const aa=Buffer.from(a);const bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb)}
export async function entrar(_estado:EstadoForm,formData:FormData):Promise<EstadoForm>{
 const usuario=String(formData.get("email")??"").trim();const senha=String(formData.get("senha")??"");const proximo=destinoAdminSeguro(formData.get("proximo") as string|null);const campos:Record<string,string>={};
 if(!usuario)campos.email="Informe o usuário.";if(!senha)campos.senha="Informe a senha.";if(Object.keys(campos).length>0)return{campos,valores:{email:usuario}};
 const local=process.env.NODE_ENV!=="production"&&process.env.ESPP_AUTH_MODE?.trim().toLowerCase()==="local";
 if(!local)return{erro:"Use a autenticação institucional da SSP para acessar o painel.",valores:{email:usuario}};
 const esperadoUsuario=process.env.ESPP_TEST_ADMIN_USER?.trim()??"";const esperadaSenha=process.env.ESPP_TEST_ADMIN_PASSWORD??"";
 const validas=esperadoUsuario.length>0&&esperadaSenha.length>0&&compararSeguro(usuario,esperadoUsuario)&&compararSeguro(senha,esperadaSenha);
 if(!validas)return{erro:"Usuário ou senha inválidos.",valores:{email:usuario}};
 await criarSessao("local-admin-test",{provedor:"local"});redirect(proximo);
}
