/**
 * Estado compartilhado dos formulários do painel, usado com `useActionState`.
 *
 * Fica num módulo separado porque arquivos marcados com `"use server"` só podem
 * exportar funções assíncronas.
 */
export type EstadoForm = {
  erro?: string;
  /** Mensagens por campo, indexadas pelo `name` do input. */
  campos?: Record<string, string>;
  /** Valores reenviados ao formulário para não perder o que foi digitado. */
  valores?: Record<string, string>;
};

export const ESTADO_INICIAL: EstadoForm = {};
