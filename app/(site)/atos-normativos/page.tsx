import type { Metadata } from "next";
import { AtosNormativos } from "@/components/atos-normativos";
import { atosNormativos } from "@/content/site";
import { listarAtosPublicados } from "@/lib/data/store";

export const metadata: Metadata = {
  title: atosNormativos.titulo,
  description: atosNormativos.texto,
};

export default async function AtosNormativosPage() {
  const atos = await listarAtosPublicados();
  return <AtosNormativos atos={atos} />;
}
