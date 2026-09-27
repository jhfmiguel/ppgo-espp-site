import { NextRequest, NextResponse } from "next/server";
import { COOKIE_SSP_NEXT, COOKIE_SSP_STATE, criarStateSsp, destinoAdminSeguro, urlLoginSsp } from "@/lib/auth/ssp";

export async function GET(request: NextRequest) {
  const proximo=destinoAdminSeguro(request.nextUrl.searchParams.get("proximo"));
  const state=criarStateSsp();
  const destino=urlLoginSsp(state);
  if(!destino){
    const login=new URL("/admin/login",request.url); login.searchParams.set("ssp","indisponivel");
    if(proximo!=="/admin") login.searchParams.set("proximo",proximo);
    return NextResponse.redirect(login);
  }
  const response=NextResponse.redirect(destino);
  const options={httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax" as const,path:"/admin/auth/ssp",maxAge:600};
  response.cookies.set(COOKIE_SSP_STATE,state,options);
  response.cookies.set(COOKIE_SSP_NEXT,proximo,options);
  return response;
}
