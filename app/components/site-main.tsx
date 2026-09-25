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

type ScrollEffect = "fade-in" | "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-up" | "zoom-in" | "spin-left" | "spin-right";
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
    case "spin-left":
      return [{ opacity: 0, transform: "translate3d(0,-48px,0) rotate(-45deg) scale(.88)", filter: "blur(2px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }];
    case "spin-right":
      return [{ opacity: 0, transform: "translate3d(0,-48px,0) rotate(45deg) scale(.88)", filter: "blur(2px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }];
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
  return effect === "fade-in" || effect === "fade-up" || effect === "fade-down" || effect === "fade-left" || effect === "fade-right" || effect === "zoom-up" || effect === "zoom-in" || effect === "spin-left" || effect === "spin-right" ? effect : null;
}

export function SiteMain({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const registered = new WeakSet<HTMLElement>();
    const played = new WeakSet<HTMLElement>();
    const animations = new Set<Animation>();
    const sequences = new WeakMap<HTMLElement, number>();

    function eligible(element: HTMLElement) {
      if (element === root || element.closest("header, footer, .admin-panel, .espp-hero, [role='dialog'], [aria-modal='true'], [data-no-scroll-animation]")) return false;
      if (element.classList.contains("fixed") || element.offsetParent === null) return false;
      return !["SCRIPT","STYLE","NOSCRIPT","TEMPLATE","BR","HR"].includes(element.tagName);
    }

    function play(element: HTMLElement, sequence: number, visibleAtLoad: boolean) {
      if (played.has(element)) return;
      played.add(element);
      if (reduced) return;
      const explicit = declaredEffect(element);
      const effects: ScrollEffect[] = ["fade-left", "fade-in", "fade-right", "fade-down", "fade-up", "zoom-in", "spin-left", "zoom-up", "spin-right"];
      const effect = explicit ?? (visibleAtLoad ? "fade-in" : effects[sequence % effects.length]);
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
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        play(element, sequences.get(element) ?? 0, false);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

    function register(element: HTMLElement, sequence: number) {
      if (!eligible(element) || registered.has(element)) return;
      registered.add(element);
      sequences.set(element, sequence);
      const rect = element.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      const scrollOnly = element.hasAttribute("data-animate-scroll-only") || Boolean(element.closest("[data-animate-scroll-only]"));
      if (visible && scrollOnly) { played.add(element); return; }
      if (visible) { play(element, sequence, true); return; }
      observer.observe(element);
    }

    function scan() {
      Array.from(root.querySelectorAll<HTMLElement>(TARGET_SELECTOR)).forEach(register);
    }

    const timer = window.setTimeout(scan, 0);
    const mutations = new MutationObserver(() => window.requestAnimationFrame(scan));
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timer);
      mutations.disconnect();
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);

  return <main ref={ref} id="conteudo" tabIndex={-1} className="flex-1 pt-header xl:pt-header-xl">{children}</main>;
}
