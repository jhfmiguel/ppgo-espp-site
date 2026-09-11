import type { Metadata } from "next";
import { Acessibilidade } from "@/components/acessibilidade";
import { acessibilidade } from "@/content/site";

export const metadata: Metadata = {
  title: acessibilidade.titulo,
  description: acessibilidade.texto,
};

export default function AcessibilidadePage() {
  return <Acessibilidade />;
}
