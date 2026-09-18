import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // O painel administrativo e os arquivos enviados por ele ficam fora da
    // indexação; as páginas de /admin também enviam `noindex` no metadata.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/uploads/"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
