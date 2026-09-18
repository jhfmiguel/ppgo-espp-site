import type { Metadata } from "next";
import { MatrizesCurriculares } from "@/components/matrizes-curriculares";
import { matrizes } from "@/content/site";

export const metadata: Metadata = {
  title: matrizes.titulo,
  description: matrizes.texto,
};

export default function MatrizesCurricularesPage() {
  return <MatrizesCurriculares />;
}
