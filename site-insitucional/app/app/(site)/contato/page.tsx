import type { Metadata } from "next";
import { Contato } from "@/components/contato";
import { contato } from "@/content/site";

export const metadata: Metadata = {
  title: contato.titulo,
  description: contato.texto,
};

export default function ContatoPage() {
  return <Contato />;
}
