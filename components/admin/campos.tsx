"use client";

import { useId, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

import type { Imagem } from "@/lib/data/types";
import { ACCEPT_IMAGEM, erroDeTamanho, formatarTamanho, TAMANHO_MAXIMO_ARQUIVO } from "@/lib/limites";

/** Campos de formulário do painel, com rótulo, ajuda e mensagem de erro. */

const BASE =
  "mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-gold-500";

const borda = (erro?: string) => (erro ? "border-red-400" : "border-ink-200");

function Rotulo({
  htmlFor,
  children,
  obrigatorio,
}: {
  htmlFor: string;
  children: React.ReactNode;
  obrigatorio?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink-900">
      {children}
      {obrigatorio ? (
        <span className="ml-1 text-gold-600" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}

function Mensagens({ erro, ajuda, idAjuda }: { erro?: string; ajuda?: string; idAjuda: string }) {
  if (erro) return <p className="mt-1.5 text-xs font-semibold text-red-600">{erro}</p>;
  if (ajuda)
    return (
      <p id={idAjuda} className="mt-1.5 text-xs text-ink-500">
        {ajuda}
      </p>
    );
  return null;
}

type CampoBase = {
  name: string;
  rotulo: string;
  erro?: string;
  ajuda?: string;
  obrigatorio?: boolean;
  defaultValue?: string;
};

export function Campo({
  name,
  rotulo,
  erro,
  ajuda,
  obrigatorio,
  defaultValue,
  type = "text",
  placeholder,
}: CampoBase & { type?: string; placeholder?: string }) {
  const id = useId();
  const idAjuda = `${id}-ajuda`;
  return (
    <div>
      <Rotulo htmlFor={id} obrigatorio={obrigatorio}>
        {rotulo}
      </Rotulo>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={erro ? true : undefined}
        aria-describedby={ajuda && !erro ? idAjuda : undefined}
        className={`${BASE} ${borda(erro)}`}
      />
      <Mensagens erro={erro} ajuda={ajuda} idAjuda={idAjuda} />
    </div>
  );
}

export function Area({
  name,
  rotulo,
  erro,
  ajuda,
  obrigatorio,
  defaultValue,
  linhas = 3,
  placeholder,
}: CampoBase & { linhas?: number; placeholder?: string }) {
  const id = useId();
  const idAjuda = `${id}-ajuda`;
  return (
    <div>
      <Rotulo htmlFor={id} obrigatorio={obrigatorio}>
        {rotulo}
      </Rotulo>
      <textarea
        id={id}
        name={name}
        rows={linhas}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={erro ? true : undefined}
        aria-describedby={ajuda && !erro ? idAjuda : undefined}
        className={`${BASE} ${borda(erro)} resize-y leading-relaxed`}
      />
      <Mensagens erro={erro} ajuda={ajuda} idAjuda={idAjuda} />
    </div>
  );
}

export function Selecao({
  name,
  rotulo,
  erro,
  ajuda,
  obrigatorio,
  defaultValue,
  opcoes,
}: CampoBase & { opcoes: readonly string[] }) {
  const id = useId();
  const idAjuda = `${id}-ajuda`;
  return (
    <div>
      <Rotulo htmlFor={id} obrigatorio={obrigatorio}>
        {rotulo}
      </Rotulo>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={erro ? true : undefined}
        aria-describedby={ajuda && !erro ? idAjuda : undefined}
        className={`${BASE} ${borda(erro)}`}
      >
        {opcoes.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      <Mensagens erro={erro} ajuda={ajuda} idAjuda={idAjuda} />
    </div>
  );
}

/** Campo de texto com sugestões livres (datalist) — editorias, categorias. */
export function CampoSugerido({
  name,
  rotulo,
  erro,
  ajuda,
  obrigatorio,
  defaultValue,
  sugestoes,
  placeholder,
}: CampoBase & { sugestoes: readonly string[]; placeholder?: string }) {
  const id = useId();
  const idLista = `${id}-lista`;
  const idAjuda = `${id}-ajuda`;
  return (
    <div>
      <Rotulo htmlFor={id} obrigatorio={obrigatorio}>
        {rotulo}
      </Rotulo>
      <input
        id={id}
        name={name}
        list={idLista}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={erro ? true : undefined}
        aria-describedby={ajuda && !erro ? idAjuda : undefined}
        className={`${BASE} ${borda(erro)}`}
      />
      <datalist id={idLista}>
        {sugestoes.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <Mensagens erro={erro} ajuda={ajuda} idAjuda={idAjuda} />
    </div>
  );
}

/** Escolha entre rascunho e publicado. */
export function EscolhaStatus({ defaultValue = "rascunho" }: { defaultValue?: string }) {
  const [status, setStatus] = useState(defaultValue);
  const opcoes = [
    {
      valor: "rascunho",
      titulo: "Rascunho",
      texto: "Fica só no painel, invisível no site público.",
    },
    {
      valor: "publicado",
      titulo: "Publicado",
      texto: "Aparece imediatamente no site público.",
    },
  ];

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink-900">Situação</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {opcoes.map((opcao) => (
          <label
            key={opcao.valor}
            className={`flex cursor-pointer gap-2.5 rounded-lg border p-3 transition-colors ${
              status === opcao.valor
                ? "border-gold-500 bg-gold-050"
                : "border-ink-200 bg-white hover:border-ink-300"
            }`}
          >
            <input
              type="radio"
              name="status"
              value={opcao.valor}
              checked={status === opcao.valor}
              onChange={() => setStatus(opcao.valor)}
              className="mt-0.5 size-4 accent-gold-600"
            />
            <span>
              <span className="block text-sm font-semibold text-ink-900">{opcao.titulo}</span>
              <span className="block text-xs text-ink-500">{opcao.texto}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Capa do registro: envio de arquivo ou URL de uma imagem já existente,
 * com pré-visualização e texto alternativo obrigatório.
 */
export function CampoImagem({
  imagemAtual,
  erroArquivo,
  erroAlt,
}: {
  imagemAtual: Imagem | null;
  erroArquivo?: string;
  erroAlt?: string;
}) {
  const id = useId();
  const [previa, setPrevia] = useState<string | null>(imagemAtual?.src ?? null);
  const [removida, setRemovida] = useState(false);
  const [erroLocal, setErroLocal] = useState<string | null>(null);

  /**
   * Checa o tamanho antes do envio. Um arquivo acima do limite estoura o
   * `bodySizeLimit` da Server Action, e esse erro acontece antes de a action
   * rodar — vira tela de erro em vez de mensagem no formulário.
   */
  function aoEscolher(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    const excedeu = erroDeTamanho(arquivo.size);
    if (excedeu) {
      evento.target.value = "";
      setErroLocal(excedeu);
      return;
    }

    setErroLocal(null);
    setPrevia(URL.createObjectURL(arquivo));
    setRemovida(false);
  }

  return (
    <fieldset className="rounded-lg border border-ink-200 bg-ink-050/40 p-4">
      <legend className="px-1 text-sm font-semibold text-ink-900">Imagem de capa</legend>
      <p className="text-xs text-ink-500">
        Usada nos cards de listagem e no topo da página. Envie um arquivo ou informe o caminho de uma
        imagem já existente, como <code className="text-ink-700">/images/espp-viaturas.jpg</code>.
      </p>

      {previa && !removida ? (
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-md border border-ink-200 bg-white">
            {/* Pode ser blob: da pré-visualização local, por isso <img> e não next/image */}
            {previa.startsWith("blob:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previa} alt="" className="size-full object-cover" />
            ) : (
              <Image src={previa} alt="" fill sizes="160px" className="object-cover" />
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setRemovida(true);
              setPrevia(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-ink-200 bg-white px-3 py-2 text-xs font-semibold text-ink-700 transition-colors hover:border-red-300 hover:text-red-600"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Remover capa
          </button>
        </div>
      ) : null}

      {removida ? <input type="hidden" name="removerImagem" value="1" /> : null}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor={`${id}-arquivo`}
            className="block text-xs font-semibold tracking-wide text-ink-700 uppercase"
          >
            Enviar arquivo
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-dashed border-ink-300 bg-white px-3 py-2.5">
            <ImagePlus className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
            <input
              id={`${id}-arquivo`}
              name="imagemArquivo"
              type="file"
              accept={ACCEPT_IMAGEM}
              onChange={aoEscolher}
              className="min-w-0 flex-1 text-xs text-ink-600 file:mr-3 file:rounded file:border-0 file:bg-ink-100 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-ink-800"
            />
          </div>
          {erroLocal || erroArquivo ? (
            <p className="mt-1.5 text-xs font-semibold text-red-600" role="alert">
              {erroLocal ?? erroArquivo}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-ink-500">
              JPG, PNG, WEBP, GIF ou AVIF, até {formatarTamanho(TAMANHO_MAXIMO_ARQUIVO)}.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${id}-url`}
            className="block text-xs font-semibold tracking-wide text-ink-700 uppercase"
          >
            ou caminho da imagem
          </label>
          <input
            id={`${id}-url`}
            name="imagemUrl"
            type="text"
            placeholder="/images/formacao-policial-01.jpg"
            onChange={(e) => {
              const valor = e.target.value.trim();
              setPrevia(valor || null);
              setRemovida(false);
            }}
            className={`${BASE} ${borda(undefined)}`}
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor={`${id}-alt`}
          className="block text-xs font-semibold tracking-wide text-ink-700 uppercase"
        >
          Texto alternativo
        </label>
        <input
          id={`${id}-alt`}
          name="imagemAlt"
          type="text"
          defaultValue={imagemAtual?.alt ?? ""}
          placeholder="Descreva a cena para quem usa leitor de tela"
          aria-invalid={erroAlt ? true : undefined}
          className={`${BASE} ${borda(erroAlt)}`}
        />
        {erroAlt ? (
          <p className="mt-1.5 text-xs font-semibold text-red-600">{erroAlt}</p>
        ) : (
          <p className="mt-1.5 text-xs text-ink-500">
            Exigido pelo eMAG: descreva o conteúdo da imagem, não repita o título.
          </p>
        )}
      </div>
    </fieldset>
  );
}

/** Botão de envio que mostra o estado pendente da Server Action. */
export function BotaoSalvar({ children = "Salvar" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-6 py-2.5 text-xs font-bold tracking-wide text-ink-950 uppercase transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
      {pending ? "Salvando…" : children}
    </button>
  );
}

/** Faixa de erro geral do formulário. */
export function AvisoErro({ mensagem }: { mensagem?: string }) {
  if (!mensagem) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
    >
      {mensagem}
    </p>
  );
}
