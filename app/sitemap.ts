import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const paginas: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/institucional", priority: 0.8 },
  { path: "/formacao", priority: 0.8 },
  { path: "/cursos", priority: 0.8 },
  { path: "/matrizes-curriculares", priority: 0.8 },
  { path: "/noticias", priority: 0.7 },
  { path: "/fortis", priority: 0.7 },
  { path: "/estrutura", priority: 0.6 },
  { path: "/localizacao", priority: 0.6 },
  { path: "/contato", priority: 0.6 },
  { path: "/mapa-do-site", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paginas.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
