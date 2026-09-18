import type { Metadata } from "next";
import { Eventos } from "@/components/eventos";
import { eventos } from "@/content/site";

export const metadata: Metadata = {
  title: eventos.titulo,
  description: eventos.texto,
};

export default function EventosPage() {
  return <Eventos />;
}
