import type { Metadata } from "next";
import { Noticias } from "@/components/noticias";
import { noticias } from "@/content/site";

export const metadata: Metadata = {
  title: noticias.titulo,
  description: noticias.texto,
};

export default function NoticiasPage() {
  return <Noticias />;
}
