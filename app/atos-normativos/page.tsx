import type { Metadata } from "next";
import { AtosNormativos } from "@/components/atos-normativos";
import { atosNormativos } from "@/content/site";

export const metadata: Metadata = {
  title: atosNormativos.titulo,
  description: atosNormativos.texto,
};

export default function AtosNormativosPage() {
  return <AtosNormativos />;
}
