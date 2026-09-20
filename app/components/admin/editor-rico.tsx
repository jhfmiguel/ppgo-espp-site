"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Bold,
  Eraser,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Loader2,
  Pilcrow,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react";

import { enviarImagemDoEditor } from "@/lib/actions/upload";
import { ACCEPT_IMAGEM, erroDeTamanho } from "@/lib/limites";

/**
 * Editor de texto rico do painel.
 *
 * Usa `contentEditable` com `document.execCommand`. O React não controla o
 * conteúdo da área editável: o HTML inicial é escrito uma única vez na montagem
 * e, a cada alteração, é copiado para um `<input type="hidden">` controlado —
 * assim o corpo acompanha o envio normal do formulário (e continua funcionando
 * com `useActionState`).
 *
 * O HTML gerado aqui é sanitizado no servidor, em `lib/sanitize.ts`, antes de
 * ser gravado.
 */

type Props = {
  /** `name` do input escondido enviado com o formulário. */
  name: string;
  /** HTML inicial, já sanitizado, vindo do registro em edição. */
  valorInicial?: string;
  erro?: string;
  rotulo: string;
  descricao?: string;
};

type Comando =
  | { tipo: "estilo"; comando: string }
  | { tipo: "bloco"; bloco: string };

const GRUPOS: { titulo: string; itens: { id: string; rotulo: string; Icone: typeof Bold; acao: Comando }[] }[] = [
  {
    titulo: "Estilo do texto",
    itens: [
      { id: "bold", rotulo: "Negrito", Icone: Bold, acao: { tipo: "estilo", comando: "bold" } },
      { id: "italic", rotulo: "Itálico", Icone: Italic, acao: { tipo: "estilo", comando: "italic" } },
      { id: "underline", rotulo: "Sublinhado", Icone: Underline, acao: { tipo: "estilo", comando: "underline" } },
      {
        id: "strikeThrough",
        rotulo: "Riscado",
        Icone: Strikethrough,
        acao: { tipo: "estilo", comando: "strikeThrough" },
      },
    ],
  },
  {
    titulo: "Blocos",
    itens: [
      { id: "p", rotulo: "Parágrafo", Icone: Pilcrow, acao: { tipo: "bloco", bloco: "p" } },
      { id: "h2", rotulo: "Título de seção", Icone: Heading2, acao: { tipo: "bloco", bloco: "h2" } },
      { id: "h3", rotulo: "Subtítulo", Icone: Heading3, acao: { tipo: "bloco", bloco: "h3" } },
      { id: "blockquote", rotulo: "Citação", Icone: Quote, acao: { tipo: "bloco", bloco: "blockquote" } },
    ],
  },
  {
    titulo: "Listas",
    itens: [
      {
        id: "insertUnorderedList",
        rotulo: "Lista com marcadores",
        Icone: List,
        acao: { tipo: "estilo", comando: "insertUnorderedList" },
      },
      {
        id: "insertOrderedList",
        rotulo: "Lista numerada",
        Icone: ListOrdered,
        acao: { tipo: "estilo", comando: "insertOrderedList" },
      },
    ],
  },
];

export function EditorRico({ name, valorInicial = "", erro, rotulo, descricao }: Props) {
  const areaRef = useRef<HTMLDivElement>(null);
  const seletorArquivoRef = useRef<HTMLInputElement>(null);
  /** Última seleção feita dentro da área editável, restaurada antes de cada comando. */
  const selecaoRef = useRef<Range | null>(null);

  /**
   * O HTML fica em estado do React e alimenta um input escondido controlado.
   * Escrever direto no DOM (`input.value = …`) não sobrevive: a cada
   * re-renderização o React restaura o valor que ele conhece e o corpo do texto
   * seria enviado em branco.
   */
  const [html, setHtml] = useState(valorInicial);
  const [ativos, setAtivos] = useState<Record<string, boolean>>({});
  const [vazio, setVazio] = useState(!valorInicial);
  const [painelLink, setPainelLink] = useState(false);
  const [urlLink, setUrlLink] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const idArea = useId();
  const idDescricao = useId();

  /** Copia o HTML da área editável para o valor enviado com o formulário. */
  const sincronizar = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const atual = area.innerHTML;
    // O navegador deixa um <br> residual quando o usuário apaga tudo.
    const vazioAgora = area.textContent?.trim() === "" && !area.querySelector("img");
    setHtml(vazioAgora ? "" : atual);
    setVazio(vazioAgora);
  }, []);

  // Conteúdo inicial: escrito uma única vez, fora do controle do React.
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    area.innerHTML = valorInicial || "<p><br></p>";
    sincronizar();
    try {
      // Faz o Enter criar <p> em vez de <div>.
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {
      /* navegador sem suporte: o padrão do próprio navegador é usado */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Guarda a seleção atual, se ela estiver dentro da área editável. */
  const guardarSelecao = useCallback(() => {
    const selecao = document.getSelection();
    if (selecao && selecao.rangeCount > 0 && areaRef.current?.contains(selecao.anchorNode)) {
      selecaoRef.current = selecao.getRangeAt(0).cloneRange();
    }
  }, []);

  /**
   * Devolve o cursor para onde o usuário estava.
   *
   * Só age quando a seleção atual saiu da área editável — comandos como
   * `formatBlock` trocam o elemento de bloco, e a faixa memorizada pode apontar
   * para um nó já descartado. Sobrescrever uma seleção boa com uma dessas
   * faria o comando seguinte não ter efeito nenhum.
   */
  const restaurarSelecao = useCallback(() => {
    const area = areaRef.current;
    const selecao = document.getSelection();
    if (!area || !selecao) return;

    if (selecao.rangeCount > 0 && area.contains(selecao.anchorNode)) return;

    const guardada = selecaoRef.current;
    if (!guardada || !area.contains(guardada.startContainer)) return;

    selecao.removeAllRanges();
    selecao.addRange(guardada);
  }, []);

  /**
   * Restaura obrigatoriamente a última seleção memorizada.
   * Usado quando um controle externo ao contentEditable recebe foco,
   * como o campo de URL do painel de links.
   */
  const restaurarSelecaoForcada = useCallback(() => {
    const area = areaRef.current;
    const selecao = document.getSelection();
    const guardada = selecaoRef.current;

    if (!area || !selecao || !guardada) return false;
    if (!area.contains(guardada.startContainer)) return false;

    try {
      selecao.removeAllRanges();
      selecao.addRange(guardada.cloneRange());
      return true;
    } catch {
      return false;
    }
  }, []);
  /** Marca na barra os comandos ativos na posição do cursor. */
  const atualizarEstado = useCallback(() => {
    const area = areaRef.current;
    if (!area || !area.contains(document.getSelection()?.anchorNode ?? null)) return;

    // Toda seleção feita dentro da área é memorizada: os botões da barra
    // devolvem o foco à área antes de executar o comando.
    guardarSelecao();

    const estado: Record<string, boolean> = {};
    for (const comando of ["bold", "italic", "underline", "strikeThrough", "insertUnorderedList", "insertOrderedList"]) {
      try {
        estado[comando] = document.queryCommandState(comando);
      } catch {
        estado[comando] = false;
      }
    }
    try {
      const bloco = document.queryCommandValue("formatBlock").toLowerCase();
      estado[bloco] = true;
    } catch {
      /* ignora */
    }
    setAtivos(estado);
  }, [guardarSelecao]);

  useEffect(() => {
    document.addEventListener("selectionchange", atualizarEstado);
    return () => document.removeEventListener("selectionchange", atualizarEstado);
  }, [atualizarEstado]);

  function executar(acao: Comando) {
    areaRef.current?.focus();
    restaurarSelecao();
    if (acao.tipo === "estilo") {
      document.execCommand(acao.comando, false);
    } else {
      document.execCommand("formatBlock", false, `<${acao.bloco}>`);
    }
    sincronizar();
    atualizarEstado();
  }

  function abrirPainelLink() {
    guardarSelecao();
    setUrlLink("");
    setPainelLink(true);
  }

  function aplicarLink() {
    const url = urlLink.trim();
    if (!url) return;

    // Sem esquema, assume https — evita virar link relativo quebrado.
    const destino = /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : `https://${url}`;

    const area = areaRef.current;
    if (!area) return;

    // O campo de URL recebeu o foco. Primeiro devolvemos o foco ao editor
    // e depois restauramos FORCADAMENTE a Range que existia quando o
    // usuário clicou em "Inserir link".
    area.focus();

    if (!restaurarSelecaoForcada()) {
      setAviso("Selecione o texto ou posicione o cursor onde deseja inserir o link.");
      return;
    }

    document.execCommand("createLink", false, destino);

    // Guarda a nova posição resultante do comando.
    guardarSelecao();

    setPainelLink(false);
    setUrlLink("");
    setAviso(null);
    sincronizar();
    atualizarEstado();
  }

  function removerLink() {
    areaRef.current?.focus();
    restaurarSelecao();
    document.execCommand("unlink", false);
    sincronizar();
  }

  function limparFormatacao() {
    areaRef.current?.focus();
    restaurarSelecao();
    document.execCommand("removeFormat", false);
    sincronizar();
  }

  /** Cola sempre como texto puro, para não trazer estilos do Word/Docs. */
  function aoColar(evento: React.ClipboardEvent<HTMLDivElement>) {
    evento.preventDefault();
    const texto = evento.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, texto);
    sincronizar();
  }

  async function aoEscolherImagem(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;

    // Barra o arquivo grande aqui: acima do `bodySizeLimit` o Next recusa o
    // corpo antes de a Server Action rodar, e o erro não é capturável.
    const excedeu = erroDeTamanho(arquivo.size);
    if (excedeu) {
      setAviso(excedeu);
      return;
    }

    setAviso(null);
    setEnviando(true);
    guardarSelecao();

    const formData = new FormData();
    formData.append("arquivo", arquivo);
    const resultado = await enviarImagemDoEditor(formData);

    setEnviando(false);
    if (!resultado.ok) {
      setAviso(resultado.erro);
      return;
    }

    const alt = arquivo.name.replace(/\.[^.]+$/, "");
    areaRef.current?.focus();
    restaurarSelecao();
    document.execCommand(
      "insertHTML",
      false,
      `<figure><img src="${resultado.url}" alt="${alt.replace(/"/g, "&quot;")}" /><figcaption>Legenda da imagem</figcaption></figure><p><br></p>`,
    );
    sincronizar();
    setAviso("Imagem inserida. Clique na legenda para editá-la — ou apague-a se não quiser legenda.");
  }

  const classeBotao = (ativo: boolean) =>
    `inline-flex size-8 items-center justify-center rounded-md border transition-colors ${
      ativo
        ? "border-gold-500 bg-gold-050 text-gold-700"
        : "border-transparent text-ink-600 hover:border-ink-200 hover:bg-ink-050 hover:text-ink-900"
    }`;

  return (
    <div>
      <label htmlFor={idArea} className="block text-sm font-semibold text-ink-900">
        {rotulo}
      </label>
      {descricao ? (
        <p id={idDescricao} className="mt-1 text-xs text-ink-500">
          {descricao}
        </p>
      ) : null}

      <div
        className={`mt-2 overflow-hidden rounded-lg border bg-white ${
          erro ? "border-red-400" : "border-ink-200"
        }`}
      >
        <div
          role="toolbar"
          aria-label="Formatação do texto"
          aria-controls={idArea}
          className="flex flex-wrap items-center gap-1 border-b border-ink-100 bg-ink-050/70 px-2 py-1.5"
        >
          {GRUPOS.map((grupo, indice) => (
            <div key={grupo.titulo} className="flex items-center gap-1">
              {indice > 0 ? <span className="mx-1 h-5 w-px bg-ink-200" aria-hidden="true" /> : null}
              {grupo.itens.map(({ id, rotulo: titulo, Icone, acao }) => (
                <button
                  key={id}
                  type="button"
                  title={titulo}
                  aria-label={titulo}
                  aria-pressed={Boolean(ativos[id])}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => executar(acao)}
                  className={classeBotao(Boolean(ativos[id]))}
                >
                  <Icone className="size-4" aria-hidden="true" />
                </button>
              ))}
            </div>
          ))}

          <span className="mx-1 h-5 w-px bg-ink-200" aria-hidden="true" />

          <button
            type="button"
            title="Inserir link"
            aria-label="Inserir link"
            onMouseDown={(e) => e.preventDefault()}
            onClick={abrirPainelLink}
            className={classeBotao(false)}
          >
            <Link2 className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            title="Remover link"
            aria-label="Remover link"
            onMouseDown={(e) => e.preventDefault()}
            onClick={removerLink}
            className={classeBotao(false)}
          >
            <Link2Off className="size-4" aria-hidden="true" />
          </button>

          <span className="mx-1 h-5 w-px bg-ink-200" aria-hidden="true" />

          <button
            type="button"
            title="Inserir imagem no corpo do texto"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => seletorArquivoRef.current?.click()}
            disabled={enviando}
            className="inline-flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-ink-200 hover:bg-ink-050 hover:text-ink-900 disabled:opacity-60"
          >
            {enviando ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="size-4" aria-hidden="true" />
            )}
            {enviando ? "Enviando…" : "Imagem"}
          </button>

          <button
            type="button"
            title="Limpar formatação"
            aria-label="Limpar formatação"
            onMouseDown={(e) => e.preventDefault()}
            onClick={limparFormatacao}
            className={`${classeBotao(false)} ml-auto`}
          >
            <Eraser className="size-4" aria-hidden="true" />
          </button>
        </div>

        {painelLink ? (
          <div className="flex flex-wrap items-center gap-2 border-b border-ink-100 bg-white px-3 py-2">
            <label htmlFor={`${idArea}-link`} className="text-xs font-semibold text-ink-700">
              Endereço do link
            </label>
            <input
              id={`${idArea}-link`}
              type="text"
              value={urlLink}
              autoFocus
              placeholder="https://… ou /atos-normativos"
              onChange={(e) => setUrlLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  aplicarLink();
                }
                if (e.key === "Escape") setPainelLink(false);
              }}
              className="min-w-0 flex-1 rounded-md border border-ink-200 px-2.5 py-1.5 text-sm outline-none focus:border-gold-500"
            />
            <button
              type="button"
              onClick={aplicarLink}
              className="rounded-md bg-ink-900 px-3 py-1.5 text-xs font-bold text-white uppercase hover:bg-ink-800"
            >
              Aplicar
            </button>
            <button
              type="button"
              onClick={() => setPainelLink(false)}
              className="rounded-md px-2 py-1.5 text-xs font-semibold text-ink-600 hover:text-ink-900"
            >
              Cancelar
            </button>
          </div>
        ) : null}

        <div className="relative">
          {vazio ? (
            <p className="pointer-events-none absolute top-4 left-4 text-sm text-ink-400">
              Escreva o corpo do texto…
            </p>
          ) : null}
          <div
            id={idArea}
            ref={areaRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label={rotulo}
            aria-describedby={descricao ? idDescricao : undefined}
            onInput={sincronizar}
            onBlur={sincronizar}
            onPaste={aoColar}
            onKeyUp={atualizarEstado}
            onMouseUp={atualizarEstado}
            className="editor-conteudo min-h-72 px-4 py-3 text-[0.95rem] leading-relaxed text-ink-800 outline-none"
          />
        </div>
      </div>

      <input type="hidden" name={name} value={html} readOnly />
      <input
        ref={seletorArquivoRef}
        type="file"
        accept={ACCEPT_IMAGEM}
        className="hidden"
        onChange={aoEscolherImagem}
        tabIndex={-1}
      />

      {aviso ? (
        <p className="mt-2 text-xs text-ink-600" role="status">
          {aviso}
        </p>
      ) : null}
      {erro ? (
        <p className="mt-2 text-xs font-semibold text-red-600">{erro}</p>
      ) : null}
    </div>
  );
}
