import Link from "next/link";
import Image from "next/image";
import { ImageOff, SquarePen } from "lucide-react";

import { exigirPermissao } from "@/lib/auth/dal";
import { listarNoticias } from "@/lib/data/store";
import { alternarStatusNoticia, removerNoticia } from "@/lib/actions/noticias";
import { formatarData, formatarDataHora } from "@/lib/formato";
import { Aviso, BotaoPublicar, ListaVazia, SeloStatus, TituloPagina } from "@/components/admin/ui";
import { BotaoExcluir } from "@/components/admin/botao-excluir";

export const metadata = { title: "Notícias" };

export default async function AdminNoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await exigirPermissao("noticias");
  const [{ ok, erro }, noticias] = await Promise.all([searchParams, listarNoticias()]);

  return (
    <>
      <TituloPagina
        titulo="Notícias"
        descricao="Textos publicados na página de notícias e nos destaques da home."
        acao={{ href: "/admin/noticias/nova", rotulo: "Nova notícia" }}
      />

      <Aviso ok={ok} erro={erro} />

      {noticias.length === 0 ? (
        <ListaVazia
          titulo="Nenhuma notícia ainda"
          texto="Crie a primeira notícia para que ela apareça na página pública e nos destaques da home."
          acao={{ href: "/admin/noticias/nova", rotulo: "Nova notícia" }}
        />
      ) : (
        <ul className="space-y-3">
          {noticias.map((noticia) => (
            <li
              key={noticia.id}
              className="flex flex-col gap-4 rounded-xl border border-ink-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-md border border-ink-100 bg-ink-050 sm:w-32">
                {noticia.imagem ? (
                  <Image
                    src={noticia.imagem.src}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center">
                    <ImageOff className="size-5 text-ink-300" aria-hidden="true" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <SeloStatus status={noticia.status} />
                  <span className="rounded-full bg-gold-050 px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wider text-gold-700 uppercase">
                    {noticia.categoria}
                  </span>
                </div>
                <Link
                  href={`/admin/noticias/${noticia.id}`}
                  className="mt-1.5 block text-base font-semibold text-ink-900 hover:text-gold-700"
                >
                  {noticia.titulo}
                </Link>
                <p className="mt-0.5 line-clamp-1 text-sm text-ink-600">{noticia.resumo}</p>
                <p className="mt-1 text-xs text-ink-500">
                  {formatarData(noticia.data)} · por {noticia.autor} · atualizada em{" "}
                  {formatarDataHora(noticia.atualizadoEm)}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Link
                  href={`/admin/noticias/${noticia.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-ink-200 px-2.5 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:border-gold-400 hover:bg-gold-050"
                >
                  <SquarePen className="size-3.5" aria-hidden="true" />
                  Editar
                </Link>
                <BotaoPublicar
                  acao={alternarStatusNoticia}
                  id={noticia.id}
                  status={noticia.status}
                />
                <BotaoExcluir
                  acao={removerNoticia}
                  id={noticia.id}
                  descricao={`a notícia ${noticia.titulo}`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
