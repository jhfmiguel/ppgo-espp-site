import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Trilha = { label: string; href?: string };

/** O último item representa a página atual e não recebe link. */
export function Breadcrumb({ itens }: { itens: Trilha[] }) {
  return (
    <nav aria-label="Trilha de navegação">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-semibold tracking-wider uppercase">
        <li className="flex items-center gap-x-1.5">
          <Link href="/" className="text-ink-500 transition-colors hover:text-gold-600">
            Início
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-ink-300" aria-hidden="true" />
        </li>
        {itens.map((item, i) => {
          const ultimo = i === itens.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-x-1.5">
              {item.href && !ultimo ? (
                <Link href={item.href} className="text-ink-500 transition-colors hover:text-gold-600">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={ultimo ? "page" : undefined}
                  className={ultimo ? "text-ink-900" : "text-ink-500"}
                >
                  {item.label}
                </span>
              )}
              {ultimo ? null : (
                <ChevronRight className="size-3.5 shrink-0 text-ink-300" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
