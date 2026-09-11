import type { Metadata } from "next";
import { EixosFormacao } from "@/components/eixos-formacao";
import { formacao } from "@/content/site";

export const metadata: Metadata = {
  title: formacao.titulo,
  description: formacao.texto,
};

export default function FormacaoPage() {
  return <EixosFormacao />;
}
