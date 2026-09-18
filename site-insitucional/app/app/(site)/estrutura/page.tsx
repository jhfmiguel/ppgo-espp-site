import type { Metadata } from "next";
import { Estrutura } from "@/components/estrutura";
import { estrutura } from "@/content/site";

export const metadata: Metadata = {
  title: estrutura.titulo,
  description: estrutura.texto,
};

export default function EstruturaPage() {
  return <Estrutura />;
}
