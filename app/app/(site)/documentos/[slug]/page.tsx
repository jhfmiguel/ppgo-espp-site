import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentoViewer, type Documento } from "@/components/documento-viewer";
import { documentos } from "@/content/site";

type Entrada = {
  doc: Documento;
  categoria: { id: string; titulo: string };
};

/** Achata as categorias em uma lista única, usada na rota e nos metadados. */
const entradas: Entrada[] = [];
for (const categoria of documentos.categorias) {
  for (const doc of categoria.itens) {
    entradas.push({ doc, categoria: { id: categoria.id, titulo: categoria.titulo } });
  }
}

function localizar(slug: string) {
  const entrada = entradas.find((e) => e.doc.slug === slug);
  if (!entrada) return null;
  return {
    ...entrada,
    irmaos: entradas
      .filter((e) => e.categoria.id === entrada.categoria.id && e.doc.slug !== slug)
      .map((e) => ({ slug: e.doc.slug, tituloCurto: e.doc.tituloCurto })),
  };
}

export function generateStaticParams() {
  return entradas.map((e) => ({ slug: e.doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const encontrado = localizar(slug);
  if (!encontrado) return { title: "Documento não encontrado" };
  return {
    title: encontrado.doc.titulo,
    description: encontrado.doc.resumo,
  };
}

export default async function DocumentoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const encontrado = localizar(slug);
  if (!encontrado) notFound();

  return (
    <DocumentoViewer
      doc={encontrado.doc}
      categoria={encontrado.categoria}
      irmaos={encontrado.irmaos}
    />
  );
}
