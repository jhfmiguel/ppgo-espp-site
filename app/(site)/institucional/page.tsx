import type { Metadata } from "next";
import { Institucional } from "@/components/institucional";
import { institucional } from "@/content/site";

export const metadata: Metadata = {
  title: institucional.titulo,
  description: institucional.paragrafos[0],
};

export default function InstitucionalPage() {
  return <Institucional />;
}
