/**
 * Formatação de datas, períodos e tamanhos de arquivo.
 *
 * Fica num módulo sem dependências de servidor porque é usado tanto pelas
 * páginas (servidor) quanto pelos formulários do painel (cliente).
 */

const data = (valor: string) => new Date(`${valor}T00:00:00`);

export function formatarData(valor: string, formato: "curta" | "longa" = "longa") {
  return data(valor).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: formato === "longa" ? "long" : "short",
    year: "numeric",
  });
}

/** Ex.: "20 a 21 de outubro de 2026" ou "12 de outubro de 2026". */
export function formatarPeriodo(inicio: string, fim?: string | null) {
  if (!fim || fim === inicio) return formatarData(inicio);

  const a = data(inicio);
  const b = data(fim);
  const mesmoMes = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  if (mesmoMes) {
    return `${a.getDate()} a ${formatarData(fim)}`;
  }
  return `${formatarData(inicio)} a ${formatarData(fim)}`;
}

/** Dia e mês abreviados, para o selo de data da agenda. */
export function diaEMes(valor: string) {
  const d = data(valor);
  return {
    dia: String(d.getDate()).padStart(2, "0"),
    mes: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase(),
    ano: String(d.getFullYear()),
  };
}

/** Data e hora do registro, para as listagens do painel. */
export function formatarDataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
