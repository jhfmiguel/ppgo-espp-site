/**
 * Sanitização do HTML produzido pelo editor de texto rico.
 *
 * O corpo das notícias e dos eventos é renderizado com `dangerouslySetInnerHTML`
 * no site público. Mesmo sendo conteúdo de autores autenticados, ele passa por
 * uma lista de permissão antes de ser gravado: uma conta comprometida do perfil
 * de comunicação não deve conseguir injetar script nas páginas públicas.
 *
 * A sanitização roda no servidor, dentro das Server Actions — nunca só no
 * cliente, que pode ser contornado por um POST direto à Server Action.
 */

const TAGS_PERMITIDAS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "figure",
  "figcaption",
  "hr",
]);

/** Tags cujo conteúdo interno também é descartado. */
const TAGS_PERIGOSAS = "script|style|iframe|object|embed|form|input|button|svg|math|link|meta";

const ATRIBUTOS_PERMITIDOS: Record<string, string[]> = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt"],
};

const VAZIAS = new Set(["br", "img", "hr"]);

/** Aceita apenas URLs http(s), caminhos internos e mailto — barra `javascript:`. */
function urlSegura(valor: string) {
  const v = valor.trim();
  if (v.startsWith("/") || v.startsWith("#")) return true;
  return /^(https?:|mailto:|tel:)/i.test(v);
}

function escaparAspas(valor: string) {
  return valor.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function filtrarAtributos(tag: string, bruto: string) {
  const permitidos = ATRIBUTOS_PERMITIDOS[tag];
  if (!permitidos) return "";

  const saida: string[] = [];
  const padrao = /([a-zA-Z-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;

  for (const par of bruto.matchAll(padrao)) {
    const nome = par[1].toLowerCase();
    const valor = par[3] ?? par[4] ?? "";
    if (!permitidos.includes(nome)) continue;
    if ((nome === "href" || nome === "src") && !urlSegura(valor)) continue;
    saida.push(`${nome}="${escaparAspas(valor)}"`);
  }

  // Links que abrem em nova aba precisam de rel para não vazar o opener.
  if (tag === "a" && saida.some((a) => a.startsWith('target="_blank"'))) {
    if (!saida.some((a) => a.startsWith("rel="))) {
      saida.push('rel="noopener noreferrer"');
    }
  }

  return saida.length ? ` ${saida.join(" ")}` : "";
}

/** Blocos que não podem viver dentro de um `<p>`. */
const BLOCOS = "ul|ol|blockquote|figure|h2|h3|h4|hr";

/**
 * Desfaz o aninhamento inválido que o `execCommand` às vezes produz, como
 * `<p><ul>…</ul></p>`. O navegador corrige isso ao interpretar a página, mas o
 * HTML gravado fica inválido — e o `<p>` vazio resultante abre um buraco no
 * texto.
 */
function desaninharBlocos(html: string) {
  const padrao = new RegExp(`<p>\\s*(<(?:${BLOCOS})\\b[\\s\\S]*?<\\/(?:${BLOCOS})>)\\s*<\\/p>`, "gi");
  let anterior: string;
  let atual = html;
  do {
    anterior = atual;
    atual = atual.replace(padrao, "$1");
  } while (atual !== anterior);
  return atual.replace(/<p>\s*<\/p>/gi, "");
}

export function sanitizarHtml(html: string) {
  const semPerigosas = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(new RegExp(`<(${TAGS_PERIGOSAS})\\b[\\s\\S]*?<\\/\\1\\s*>`, "gi"), "")
    .replace(new RegExp(`<\\/?(${TAGS_PERIGOSAS})\\b[^>]*>`, "gi"), "");

  const limpo = semPerigosas
    .replace(
      /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g,
      (_todo, barra: string, nome: string, atributos: string) => {
        const tag = nome.toLowerCase();
        if (!TAGS_PERMITIDAS.has(tag)) return "";
        if (barra) return VAZIAS.has(tag) ? "" : `</${tag}>`;
        if (VAZIAS.has(tag)) return `<${tag}${filtrarAtributos(tag, atributos)} />`;
        return `<${tag}${filtrarAtributos(tag, atributos)}>`;
      },
    )
    .trim();

  return desaninharBlocos(limpo);
}

/** Texto puro do HTML, para resumos automáticos e contagem de caracteres. */
export function textoDeHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
