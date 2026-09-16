import type { MetadataRoute } from "next";
import { documentos, site } from "@/content/site";
import { listarEventosPublicados, listarNoticiasPublicadas } from "@/lib/data/store";

/** Páginas de documentos institucionais, uma por arquivo publicado. */
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const fixas: MetadataRoute.Sitemap = [...paginas, ...rotasDocumentos].map(
    ({ path, priority }) => ({
      url: `${site.url}${path}`,
      lastModified,
      changeFrequency: "monthly",
      priority,
    }),
  );

  // Notícias e eventos publicados pelo painel entram no sitemap
  // individualmente, com a data da última edição.
  const [noticias, eventos] = await Promise.all([
    listarNoticiasPublicadas(),
    listarEventosPublicados(),
  ]);

  const noticiasUrls: MetadataRoute.Sitemap = noticias.map((item) => ({
    url: `${site.url}/noticias/${item.slug}`,
    lastModified: new Date(item.atualizadoEm),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const eventosUrls: MetadataRoute.Sitemap = eventos.map((item) => ({
    url: `${site.url}/eventos/${item.slug}`,
    lastModified: new Date(item.atualizadoEm),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...fixas, ...noticiasUrls, ...eventosUrls];
}
