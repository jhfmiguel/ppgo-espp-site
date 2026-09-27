import { NextRequest, NextResponse } from "next/server";
import { criarSessao } from "@/lib/auth/session";
import { COOKIE_SSP_NEXT, COOKIE_SSP_STATE, destinoAdminSeguro, trocarCodigoSsp } from "@/lib/auth/ssp";

function limparTemporarios(response:NextResponse){ response.cookies.delete(COOKIE_SSP_STATE); response.cookies.delete(COOKIE_SSP_NEXT); return response; }

export async function GET(request:NextRequest){
  const codigo=request.nextUrl.searchParams.get("code")?.trim();
  const state=request.nextUrl.searchParams.get("state")?.trim();
  const esperado=request.cookies.get(COOKIE_SSP_STATE)?.value;
  const proximo=destinoAdminSeguro(request.cookies.get(COOKIE_SSP_NEXT)?.value);
  if(!codigo||!state||!esperado||state!==esperado) return limparTemporarios(NextResponse.redirect(new URL("/admin/login?ssp=retorno-invalido",request.url)));
  const identidade=await trocarCodigoSsp(codigo);
  if(!identidade) return limparTemporarios(NextResponse.redirect(new URL("/admin/login?ssp=nao-integrado",request.url)));
  await criarSessao(`ssp:${identidade.id}`,{provedor:"ssp",nome:identidade.nome,email:identidade.email,cargo:identidade.cargo,perfil:identidade.perfil});
  return limparTemporarios(NextResponse.redirect(new URL(proximo,request.url)));
}
