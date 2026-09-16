import type { Metadata } from "next";
import { Institucional } from "@/components/institucional";
import { Recredenciamento } from "@/components/recredenciamento";
import { institucional } from "@/content/site";

export const metadata: Metadata = {
  title: institucional.titulo,
  description: institucional.paragrafos[0],
};

export default function InstitucionalPage() {
  return (
    <>
      <Institucional />
      <Recredenciamento />
    </>
  );
}
