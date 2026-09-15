import type { Metadata } from "next";
import { Documentos } from "@/components/documentos";
import { documentos } from "@/content/site";

export const metadata: Metadata = {
  title: documentos.titulo,
  description: documentos.texto,
};

export default function DocumentosPage() {
  return <Documentos />;
}
