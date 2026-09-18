import type { Metadata } from "next";
import { Localizacao } from "@/components/localizacao";
import { localizacao } from "@/content/site";

export const metadata: Metadata = {
  title: localizacao.titulo,
  description: localizacao.texto,
};

export default function LocalizacaoPage() {
  return <Localizacao />;
}
