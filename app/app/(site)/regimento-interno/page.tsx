import type { Metadata } from "next";
import { RegimentoInterno } from "@/components/regimento-interno";
import { regimentoInterno } from "@/content/site";

export const metadata: Metadata = {
  title: regimentoInterno.titulo,
  description: regimentoInterno.texto,
};

export default function RegimentoInternoPage() {
  return <RegimentoInterno />;
}
