import { nav } from "@/content/site";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SectionHeading } from "@/components/ui/section-heading";

type Trilha = { label: string; href?: string };

/**
 * Deriva a trilha de navegação a partir de `nav`, para que a hierarquia do
 * menu seja a única fonte da verdade. Grupos de menu (ex.: "A ESPP") não têm
 * página própria e entram na trilha sem link.
 */
export function trilhaDe(href: string): Trilha[] {
  for (const item of nav) {
    if ("submenu" in item) {
      for (const sub of item.submenu) {
        if ("href" in sub && sub.href === href) {
          return [{ label: item.label }, { label: sub.label }];
        }
      }
    } else if (item.href === href) {
      return [{ label: item.label }];
    }
  }
  return [];
}

type Props = {
  /** Rota da página, usada para derivar a trilha. */
  href: string;
  eyebrow: string;
  titulo: string;
  texto?: string;
  id?: string;
  /** Para páginas fora do menu principal (ex.: FORTIS, Acessibilidade). */
  trilha?: Trilha[];
};

export function PageHeader({ href, eyebrow, titulo, texto, id, trilha }: Props) {
  const itens = trilha ?? trilhaDe(href);

  return (
    <>
      {itens.length > 0 ? <Breadcrumb itens={itens} /> : null}
      <div className={itens.length > 0 ? "mt-8" : ""}>
        <SectionHeading
          id={id}
          eyebrow={eyebrow}
          titulo={titulo}
          texto={texto}
          tone="light"
          as="h1"
        />
      </div>
    </>
  );
}
