import type { MetadataRoute } from "next";
import { documentos, site } from "@/content/site";

const rotasDocumentos: { path: string; priority: number }[] = [];
for (const categoria of documentos.categorias) {
  for (const doc of categoria.itens) {
    rotasDocumentos.push({ path: `/documentos/${doc.slug}`, priority: 0.5 });
  }
}

const paginas: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/institucional", priority: 0.8 },
  { path: "/formacao", priority: 0.8 },
  { path: "/cursos", priority: 0.8 },
  { path: "/matrizes-curriculares", priority: 0.8 },
  { path: "/regimento-interno", priority: 0.6 },
  { path: "/atos-normativos", priority: 0.6 },
  { path: "/documentos", priority: 0.7 },
  { path: "/noticias", priority: 0.7 },
  { path: "/eventos", priority: 0.7 },
  { path: "/fortis", priority: 0.7 },
  { path: "/estrutura", priority: 0.6 },
  { path: "/localizacao", priority: 0.6 },
  { path: "/contato", priority: 0.6 },
  { path: "/acessibilidade", priority: 0.5 },
  { path: "/mapa-do-site", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [...paginas, ...rotasDocumentos].map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
