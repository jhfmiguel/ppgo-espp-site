type Props = {
  eyebrow: string;
  titulo: string;
  texto?: string;
  /** dark = seção com fundo escuro (exceção; o tema do site é claro) */
  tone?: "dark" | "light";
  align?: "left" | "center";
  id?: string;
};

export function SectionHeading({
  eyebrow,
  titulo,
  texto,
  tone = "light",
  align = "left",
  id,
}: Props) {
  const isDark = tone === "dark";
  return (
    <div
      className={[
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "",
      ].join(" ")}
    >
      <p
        className={[
          "flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase",
          align === "center" ? "justify-center" : "",
          isDark ? "text-gold-500" : "text-gold-600",
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className="h-px w-8 bg-current opacity-60"
        />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={[
          "title-display mt-4 text-4xl sm:text-5xl",
          isDark ? "text-white" : "text-ink-900",
        ].join(" ")}
      >
        {titulo}
      </h2>
      {texto ? (
        <p
          className={[
            "mt-5 text-base leading-relaxed sm:text-lg",
            isDark ? "text-ink-200" : "text-ink-700",
          ].join(" ")}
        >
          {texto}
        </p>
      ) : null}
    </div>
  );
}
