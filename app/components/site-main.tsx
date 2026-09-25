"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const TARGET_SELECTOR = [
  ":scope > *",
  ".container-espp > *",
  "section > *",
  "article > *",
  "form > *",
  "fieldset > *",
  "[class*='grid'] > *",
  "[data-animate-scroll]",
  "[data-animate-scroll-only]",
].join(", ");

type ScrollEffect = "fade-in" | "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-up" | "zoom-in";
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

function framesFor(effect: ScrollEffect): Keyframe[] {
  switch (effect) {
    case "fade-left":
      return [{ opacity: 0, transform: "translate3d(-48px,0,0) scale(.985)", filter: "blur(1px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }];
    case "fade-right":
      return [{ opacity: 0, transform: "translate3d(44px,0,0) scale(.985)", filter: "blur(1px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }];
    case "fade-down":
      return [{ opacity: 0, transform: "translate3d(0,-72px,0)", filter: "blur(2px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }];
    case "zoom-in":
      return [{ opacity: 0, transform: "scale(.5)", filter: "blur(2px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }];
    case "zoom-up":
      return [{ opacity: 0, transform: "translate3d(0,28px,0) scale(.94)", filter: "blur(1px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }];
    case "fade-in":
      return [{ opacity: 0, filter: "blur(1px)" }, { opacity: 1, filter: "blur(0)" }];
    default:
      return [{ opacity: 0, transform: "translate3d(0,28px,0) scale(.99)", filter: "blur(1px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }];
  }
}

function declaredEffect(element: HTMLElement): ScrollEffect | null {
  const effect = element.dataset.animateEffect;
  return effect === "fade-in" || effect === "fade-up" || effect === "fade-down" || effect === "fade-left" || effect === "fade-right" || effect === "zoom-up" || effect === "zoom-in" ? effect : null;
}

export function SiteMain({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const registered = new WeakSet<HTMLElement>();
    const animations = new Set<Animation>();
    const sequences = new WeakMap<HTMLElement, number>();
    let lastScrollY = window.scrollY;
    let scrollDirection: "up" | "down" = "down";
    const onScroll = () => {
      const current = window.scrollY;
      scrollDirection = current < lastScrollY ? "up" : "down";
      lastScrollY = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    function eligible(element: HTMLElement) {
      if (element === root || element.closest("header, footer, .admin-panel, .espp-hero, .localizacao-faixa-degrade, .estrutura-faixa-degrade, .formacao-faixa-degrade, .cursos-faixa-degrade, .matrizes-faixa-degrade, [role='dialog'], [aria-modal='true'], [data-no-scroll-animation]")) return false;
      if (element.classList.contains("fixed") || element.offsetParent === null) return false;
      return !["SCRIPT","STYLE","NOSCRIPT","TEMPLATE","BR","HR"].includes(element.tagName);
    }

    function play(element: HTMLElement, sequence: number, visibleAtLoad: boolean) {
      if (reduced) return;
      const explicit = declaredEffect(element);
      const isSectionBackground = element.tagName === "SECTION" || element.classList.contains("espp-hero-stage-bg");
      const effects: ScrollEffect[] = ["fade-in", "fade-left", "fade-right", "fade-in", "fade-right", "fade-left"];
      const directionalEffect: ScrollEffect = scrollDirection === "up" ? (sequence % 2 === 0 ? "fade-right" : "fade-left") : effects[sequence % effects.length];
      const effect = isSectionBackground ? "fade-in" : (explicit ?? (visibleAtLoad ? "fade-in" : directionalEffect));
      const animation = element.animate(framesFor(effect), {
        duration: effect === "fade-in" ? 1250 : 1150,
        delay: visibleAtLoad ? Math.min(sequence, 8) * 55 : 0,
        easing: EASING,
        fill: "both",
      });
      animations.add(animation);
      animation.finished.catch(() => undefined).finally(() => animations.delete(animation));
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          play(element, sequences.get(element) ?? 0, false);
        } else {
          element.getAnimations().forEach((animation) => animation.cancel());
          element.style.removeProperty("opacity");
          element.style.removeProperty("transform");
          element.style.removeProperty("filter");
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

    function register(element: HTMLElement, sequence: number) {
      if (!eligible(element) || registered.has(element)) return;
      registered.add(element);
      sequences.set(element, sequence);
      const rect = element.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      const scrollOnly = element.hasAttribute("data-animate-scroll-only") || Boolean(element.closest("[data-animate-scroll-only]"));
      if (visible && scrollOnly) { observer.observe(element); return; }
      observer.observe(element);
      if (visible) play(element, sequence, true);
    }

    function scan() {
      Array.from(root.querySelectorAll<HTMLElement>(TARGET_SELECTOR)).forEach(register);
    }

    const timer = window.setTimeout(scan, 0);
    const mutations = new MutationObserver(() => window.requestAnimationFrame(scan));
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      mutations.disconnect();
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);

  return <main ref={ref} id="conteudo" tabIndex={-1} className={`site-public-main ${pathname === "/" ? "site-public-home" : "site-public-inner"} flex-1 pt-header xl:pt-header-xl`}>{children}</main>;
}
