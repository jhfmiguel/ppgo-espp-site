import { FileStack, FileText, ListChecks, ScrollText, type LucideIcon } from "lucide-react";

/** Ícone e estilo de badge por tipo/situação de ato normativo — usados na página de Atos Normativos e no widget da home. */
export const ICONE_TIPO_ATO: Record<string, LucideIcon> = {
  Portaria: FileText,
  Edital: ListChecks,
  Resolução: ScrollText,
  "Instrução Normativa": ListChecks,
  "Ato Normativo Conjunto": FileStack,
};

export const ESTILO_SITUACAO_ATO: Record<string, string> = {
  Vigente: "border-forest-500/30 bg-forest-500/10 text-forest-600",
  Revogado: "border-ink-200 bg-ink-100 text-ink-500",
  Encerrado: "border-gov-blue/30 bg-gov-blue/10 text-gov-blue",
};
