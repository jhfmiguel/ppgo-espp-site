"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap, Scale } from "lucide-react";
import styles from "./espp-mobile-shell.module.css";

const items = [
  { label: "Ensino", href: "/formacao", icon: BookOpen },
  { label: "Portal do aluno", href: "https://ead.policiapenal.go.gov.br/login/index.php", icon: GraduationCap, external: true, primary: true },
  { label: "Normas e regulamentos", href: "/atos-normativos", icon: Scale },
] as const;

export function EsppMobileShell() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav} aria-label="Ações principais no celular" data-no-scroll-animation>
      {items.map(({ label, href, icon: Icon, ...item }) => {
        const active = !("external" in item) && (pathname === href || pathname.startsWith(`${href}/`));
        const className = `${styles.item} ${"primary" in item ? styles.primary : ""} ${active ? styles.active : ""}`;
        const content = <><Icon aria-hidden="true"/><span>{label}</span></>;
        return "external" in item
          ? <a key={label} href={href} target="_blank" rel="noreferrer" className={className}>{content}</a>
          : <Link key={label} href={href} className={className}>{content}</Link>;
      })}
    </nav>
  );
}
