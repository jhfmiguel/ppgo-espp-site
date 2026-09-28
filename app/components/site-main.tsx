"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const TARGET_SELECTOR = [":scope > *", ".container-espp > *", "section > *", "article > *", "form > *", "fieldset > *", "[class*='grid'] > *", "[data-animate-scroll]", "[data-animate-scroll-only]"].join(", ");
type ScrollEffect = "fade-in" | "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-up" | "zoom-in";
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
function framesFor(effect: ScrollEffect): Keyframe[] { switch (effect) { case "fade-left": return [{ opacity: 0, transform: "translate3d(-48px,0,0) scale(.985)", filter: "blur(1px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }]; case "fade-right": return [{ opacity: 0, transform: "translate3d(44px,0,0) scale(.985)", filter: "blur(1px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }]; case "fade-down": return [{ opacity: 0, transform: "translate3d(0,-72px,0)", filter: "blur(2px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }]; case "zoom-in": return [{ opacity: 0, transform: "scale(.5)", filter: "blur(2px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }]; case "zoom-up": return [{ opacity: 0, transform: "translate3d(0,28px,0) scale(.94)", filter: "blur(1px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }]; case "fade-in": return [{ opacity: 0, filter: "blur(1px)" }, { opacity: 1, filter: "blur(0)" }]; default: return [{ opacity: 0, transform: "translate3d(0,28px,0) scale(.99)", filter: "blur(1px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }]; } }
function declaredEffect(element: HTMLElement): ScrollEffect | null { const effect = element.dataset.animateEffect; return effect === "fade-in" || effect === "fade-up" || effect === "fade-down" || effect === "fade-left" || effect === "fade-right" || effect === "zoom-up" || effect === "zoom-in" ? effect : null; }
function classText(element: HTMLElement) { return typeof element.className === "string" ? element.className : ""; }
function isStaticBackground(element: HTMLElement) {
  if (element.hasAttribute("data-no-scroll-animation")) return true;
  const className = classText(element);
  if (className.includes("faixa-degrade") || className.includes("areas-escola") || className.includes("bg-[#071522]") || className.includes("bg-black") || className.includes("from-black") || className.includes("to-black") || className.includes("linear-gradient(135deg,#071522")) return true;
  const style = window.getComputedStyle(element);
  const image = style.backgroundImage.toLowerCase();
  const color = style.backgroundColor.toLowerCase();
  return image.includes("linear-gradient") && (image.includes("7, 21, 34") || image.includes("11, 49, 87") || image.includes("18, 63, 106") || color.includes("7, 21, 34") || color.includes("11, 49, 87"));
}
function containsStaticBackground(element: HTMLElement) {
  return Array.from(element.querySelectorAll<HTMLElement>("*")).some(isStaticBackground);
}
function clearStaticBackgroundMotion(root: HTMLElement) {
  const all = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];
  all.forEach((element) => {
    if (!isStaticBackground(element)) return;
    element.getAnimations().forEach((animation) => animation.cancel());
    element.style.setProperty("transform", "none", "important");
    element.style.setProperty("translate", "none", "important");
    element.style.setProperty("opacity", "1", "important");
    element.style.setProperty("filter", "none", "important");
    element.style.setProperty("animation", "none", "important");
    element.style.setProperty("transition-property", "none", "important");
    element.style.setProperty("transition-duration", "0s", "important");
    element.style.setProperty("background-position", "initial", "important");
  });
}

export function SiteMain({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null); const pathname = usePathname();
  useEffect(() => {
    const currentRoot = ref.current; if (!currentRoot) return;
    const root: HTMLElement = currentRoot;
    clearStaticBackgroundMotion(root);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; const registered = new WeakSet<HTMLElement>(); const animations = new Set<Animation>(); const sequences = new WeakMap<HTMLElement, number>(); let lastScrollY = window.scrollY; let scrollDirection: "up" | "down" = "down";
    const onScroll = () => { const current = window.scrollY; scrollDirection = current < lastScrollY ? "up" : "down"; lastScrollY = current; clearStaticBackgroundMotion(root); }; window.addEventListener("scroll", onScroll, { passive: true });
    function eligible(element: HTMLElement) { if (element.tagName === "SECTION") return false; if (isStaticBackground(element) || containsStaticBackground(element)) return false; if (element === root || element.closest("header, footer, nav[aria-label='Navegação principal mobile'], .admin-panel, #top-mobile, .espp-hero, [role='dialog'], [aria-modal='true'], [data-no-scroll-animation]")) return false; if (element.classList.contains("fixed") || element.offsetParent === null) return false; return !["SCRIPT","STYLE","NOSCRIPT","TEMPLATE","BR","HR"].includes(element.tagName); }
    function play(element: HTMLElement, sequence: number, visibleAtLoad: boolean) { if (reduced) return; const explicit = declaredEffect(element); const effects: ScrollEffect[] = ["fade-in", "fade-left", "fade-right", "fade-in", "fade-right", "fade-left"]; const directionalEffect: ScrollEffect = scrollDirection === "up" ? (sequence % 2 === 0 ? "fade-right" : "fade-left") : effects[sequence % effects.length]; const effect = explicit ?? (visibleAtLoad ? "fade-in" : directionalEffect); const animation = element.animate(framesFor(effect), { duration: effect === "fade-in" ? 900 : 820, delay: visibleAtLoad ? Math.min(sequence, 8) * 45 : Math.min(sequence % 5, 4) * 70, easing: EASING, fill: "both" }); animations.add(animation); animation.finished.catch(() => undefined).finally(() => animations.delete(animation)); }
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { const element = entry.target as HTMLElement; if (entry.isIntersecting) play(element, sequences.get(element) ?? 0, false); else { element.getAnimations().forEach((animation) => animation.cancel()); element.style.removeProperty("opacity"); element.style.removeProperty("transform"); element.style.removeProperty("filter"); } }); }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    function register(element: HTMLElement, sequence: number) { if (!eligible(element) || registered.has(element)) return; registered.add(element); sequences.set(element, sequence); const rect = element.getBoundingClientRect(); const visible = rect.bottom > 0 && rect.top < window.innerHeight; const scrollOnly = element.hasAttribute("data-animate-scroll-only") || Boolean(element.closest("[data-animate-scroll-only]")); observer.observe(element); if (visible && !scrollOnly) play(element, sequence, true); }
    function scan() { clearStaticBackgroundMotion(root); Array.from(root.querySelectorAll<HTMLElement>(TARGET_SELECTOR)).forEach(register); }
    const timer = window.setTimeout(scan, 0); const mutations = new MutationObserver(() => window.requestAnimationFrame(scan)); mutations.observe(root, { childList: true, subtree: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("scroll", onScroll); mutations.disconnect(); observer.disconnect(); animations.forEach((animation) => animation.cancel()); };
  }, [pathname]);

  return <main ref={ref} id="conteudo" tabIndex={-1} className={`site-public-main ${pathname === "/" ? "site-public-home" : "site-public-inner"} flex-1 pt-[calc(4rem+env(safe-area-inset-top))] md:pt-header xl:pt-header-xl`}>{children}</main>;
}
