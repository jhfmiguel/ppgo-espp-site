import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";
import { site } from "@/content/site";
const scriptAcessibilidade = `(function(){try{var escalas={sm:"93.75%",md:"100%",lg:"112.5%"};var fonte=localStorage.getItem("espp-font-size");if(fonte&&escalas[fonte])document.documentElement.style.fontSize=escalas[fonte];if(localStorage.getItem("espp-contraste")==="alto")document.documentElement.setAttribute("data-contrast","alto");if((window.location.pathname||"").indexOf("/admin")===0){var temaAdmin=localStorage.getItem("espp-admin-theme");if(temaAdmin!=="light"&&temaAdmin!=="dark"&&temaAdmin!=="mixed")temaAdmin="mixed";document.documentElement.setAttribute("data-admin-theme",temaAdmin)}}catch(e){}})();`;
const display=Barlow_Condensed({variable:"--font-display",subsets:["latin"],weight:["500","600","700"],display:"swap"});
const sans=Inter({variable:"--font-sans",subsets:["latin"],display:"swap"});
export const metadata:Metadata={metadataBase:new URL(site.url),title:{default:`${site.nome} | ${site.sigla} Goiás`,template:`%s | ${site.sigla}`},description:site.descricao,keywords:["Escola Superior de Polícia Penal","ESPP","Polícia Penal de Goiás","escola de governo","formação policial penal","execução penal","CAESP","CEGESP","FORTIS"],authors:[{name:site.orgao}],robots:{index:true,follow:true}};
export const viewport:Viewport={themeColor:"#ffffff"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR" className={`${display.variable} ${sans.variable} h-full`} data-scroll-behavior="smooth" suppressHydrationWarning><head><script id="acessibilidade-inicial" dangerouslySetInnerHTML={{__html:scriptAcessibilidade}}/></head><body className="flex min-h-full flex-col bg-white"><ToastProvider>{children}</ToastProvider></body></html>}
