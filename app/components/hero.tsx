import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { hero } from "@/content/site";

export function Hero() {
  return (
    <section id="top" className="espp-hero bg-white">
      <div className="container-espp pt-6 pb-8 lg:pt-8 lg:pb-8">
        <div className="espp-hero-frame">
          <div className="espp-hero-stage-bg" aria-hidden="true">
            <Image
              src={hero.imagem.src}
              alt=""
              priority
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="espp-hero-image"
            />
            <div className="espp-hero-blue-overlay" />
            <div className="espp-hero-diagonals" />
          </div>

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
