import type { Metadata } from "next";
import { CursosDestaque } from "@/components/cursos-destaque";
import { cursos } from "@/content/site";

export const metadata: Metadata = {
  title: cursos.titulo,
  description: cursos.texto,
};

export default function CursosPage() {
  return <CursosDestaque />;
}
