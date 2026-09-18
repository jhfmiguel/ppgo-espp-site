import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { COOKIE_SESSAO, decriptar } from "@/lib/auth/session";

/**
 * Checagem otimista de sessão no /admin.
 *
 * Serve apenas para evitar renderizar o painel para quem claramente não está
 * logado. A autorização real fica em `lib/auth/dal.ts`, executada em cada
 * página e Server Action — ver a nota sobre Server Functions em
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessao = decriptar(request.cookies.get(COOKIE_SESSAO)?.value);

  // Já logado no /admin/login: manda direto para o painel.
  if (pathname === "/admin/login") {
    if (sessao) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!sessao) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("proximo", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
