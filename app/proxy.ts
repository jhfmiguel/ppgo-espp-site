import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_SESSAO, decriptar } from "@/lib/auth/session";

function criarUrlInterna(request:NextRequest,pathname:string){const url=request.nextUrl.clone();url.pathname=pathname;url.search="";url.hash="";if(process.env.NODE_ENV==="development"){url.protocol="http:";url.hostname="localhost";url.port="3001"}return url}

export function proxy(request:NextRequest){
 const{pathname,search}=request.nextUrl;
 const publica=pathname==="/admin/login"||pathname==="/admin/auth/ssp"||pathname==="/admin/auth/ssp/callback"||pathname==="/admin/auth/logout";
 const sessao=decriptar(request.cookies.get(COOKIE_SESSAO)?.value);
 if(pathname==="/admin/login"){if(sessao)return NextResponse.redirect(criarUrlInterna(request,"/admin"));return NextResponse.next()}
 if(publica)return NextResponse.next();
 if(!sessao){const login=criarUrlInterna(request,"/admin/login");login.searchParams.set("proximo",`${pathname}${search}`);return NextResponse.redirect(login)}
 return NextResponse.next();
}
export const config={matcher:["/admin/:path*"]};
