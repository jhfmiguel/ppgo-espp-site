import { NextRequest, NextResponse } from "next/server";
import { encerrarSessao, lerSessao } from "@/lib/auth/session";
import { urlLogoutSsp } from "@/lib/auth/ssp";

export async function GET(request:NextRequest){
  const sessao=await lerSessao();
  await encerrarSessao();
  const retorno=new URL("/acessos",request.url).toString();
  if(sessao?.provedor==="ssp"){
    const logout=urlLogoutSsp(retorno);
    if(logout) return NextResponse.redirect(logout);
  }
  return NextResponse.redirect(retorno);
}
