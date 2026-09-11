import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

type Variant = "solid" | "outline" | "ghost";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  showIcon?: boolean;
};

const base =
  "group inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold tracking-wide uppercase transition-colors";

const variants: Record<Variant, string> = {
  solid: "bg-gold-500 text-ink-950 hover:bg-gold-400",
  outline:
    "border border-ink-600 text-white hover:border-gold-500 hover:text-gold-500",
  ghost: "text-gold-600 hover:text-gold-500 px-0 py-1",
};

export function ActionLink({
  href,
  children,
  variant = "solid",
  external,
  className = "",
  showIcon = true,
}: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const icon = external ? (
    <ExternalLink className="size-4" aria-hidden="true" />
  ) : (
    <ArrowRight
      className="size-4 transition-transform group-hover:translate-x-0.5"
      aria-hidden="true"
    />
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        {showIcon ? icon : null}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
      {showIcon ? icon : null}
    </Link>
  );
}
