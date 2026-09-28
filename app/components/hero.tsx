import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { hero } from "@/content/site";

export function Hero() {
  return (
    <section id="top" className="espp-hero bg-white">
      <div className="container-espp py-6 lg:py-8">
        <div className="espp-hero-frame">
          <div className="espp-hero-stage-bg" aria-hidden="true" style={{ animation: "none", opacity: 1, transform: "none", filter: "none" }}>
            <Image
              src="/images/espp-hero-background.png"
              alt=""
              priority
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="espp-hero-image"
              style={{ animation: "esppHeroImageFadeIn 900ms ease-out both", transform: "none" }}
            />
            <div className="espp-hero-blue-overlay" />
            <div className="espp-hero-diagonals" />
          </div>

          <style>{`
            @keyframes esppHeroImageFadeIn { from { opacity: 0; } to { opacity: 1; } }
            @media (max-width: 767px) {
              .espp-hero .espp-hero-blue-overlay { display: none !important; }
              .espp-hero .espp-hero-diagonals { display: none !important; }
              .espp-hero .espp-hero-image { object-position: 72% center !important; }
              .espp-hero .espp-hero-title { font-size: clamp(1.7rem, 8vw, 2.35rem) !important; line-height: .98 !important; }
              .espp-hero .espp-hero-subtitle { font-size: .78rem !important; line-height: 1.45 !important; max-width: 18rem !important; }
              .espp-hero .espp-hero-badge { font-size: .62rem !important; }
              .espp-hero .espp-hero-button { font-size: .66rem !important; }
            }
            @media (prefers-reduced-motion: reduce) { .espp-hero-image { animation: none !important; opacity: 1 !important; } }
          `}</style>

          <div className="espp-hero-copy">
            <p className="espp-hero-badge">
              <BadgeCheck aria-hidden="true" />
              <span>{hero.selo}</span>
            </p>

            <h1 className="espp-hero-title">
              <span>Escola Superior de</span>
              <span>Polícia Penal</span>
              <strong>Goiás</strong>
            </h1>

            <div className="espp-hero-rule" aria-hidden="true" />

            <p className="espp-hero-subtitle">{hero.texto}</p>
          </div>

          <div className="espp-hero-actions">
            <Link href={hero.ctaPrimario.href} className="espp-hero-button espp-hero-button-primary">
              <span>{hero.ctaPrimario.label}</span>
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link href={hero.ctaSecundario.href} className="espp-hero-button espp-hero-button-secondary">
              <span>{hero.ctaSecundario.label}</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
