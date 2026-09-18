import type { Metadata } from "next";
import { FortisSection } from "@/components/fortis-section";
import { fortis } from "@/content/site";

export const metadata: Metadata = {
  title: fortis.nome,
  description: fortis.titulo,
};

export default function FortisPage() {
  return <FortisSection />;
}
