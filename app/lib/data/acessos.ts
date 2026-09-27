const API_URL=(process.env.ESPP_API_URL??"http://localhost:8081").replace(/\/$/,"");
const ADMIN_USER=process.env.ESPP_API_ADMIN_USER?.trim();
const ADMIN_PASSWORD=process.env.ESPP_API_ADMIN_PASSWORD;
export type PerfilAcesso="ADMIN"|"COMUNICACAO";
export type UsuarioAutorizado={id:string;identificadorInstitucional:string;nome:string|null;perfil:PerfilAcesso;ativo:boolean};
function headers(){if(!ADMIN_USER||!ADMIN_PASSWORD)throw new Error("Credenciais administrativas da API ESPP não configuradas.");return{Authorization:`Basic ${Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString("base64")}`,"Content-Type":"application/json"}}
export async function listarAcessos():Promise<UsuarioAutorizado[]>{const resposta=await fetch(`${API_URL}/api/v1/admin/usuarios-autorizados`,{cache:"no-store",headers:headers()});if(!resposta.ok)throw new Error("Não foi possível carregar os acessos autorizados.");return resposta.json() as Promise<UsuarioAutorizado[]>}
