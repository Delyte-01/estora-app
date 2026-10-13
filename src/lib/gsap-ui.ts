import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

if (typeof window !== "undefined") {
  CustomEase.create("hero", "0.16, 1, 0.3, 1");
  CustomEase.create("heroInOut", "0.76, 0, 0.24, 1");
}

/** Mouse devices only, and only when the user hasn't asked for reduced motion */
export const FINE_POINTER =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Magnetic button with a cursor-origin fill and label/arrow swap.
 * Expected markup inside the button:
 *   [data-fill]            the absolutely positioned fill circle (style scale(0))
 *   [data-label] > span*2  label + duplicate label (duplicate is absolute, top-full)
 *   [data-arrow-a/b]       optional: arrow that leaves / arrow that enters
 */
export function attachFillButton(btn: HTMLElement, magnetic = 0.3): () => void {
  const fill = btn.querySelector<HTMLElement>("[data-fill]");
  const labels = Array.from(
    btn.querySelectorAll<HTMLElement>("[data-label] > span"),
  );
  const a = btn.querySelector<HTMLElement>("[data-arrow-a]");
  const b = btn.querySelector<HTMLElement>("[data-arrow-b]");
  const parts = [btn, fill, a, b, ...labels].filter(Boolean) as HTMLElement[];

  let centerX = 0;
  let centerY = 0;

  const enter = (e: PointerEvent) => {
    const rect = btn.getBoundingClientRect();
    centerX =
      rect.left - (gsap.getProperty(btn, "x") as number) + rect.width / 2;
    centerY =
      rect.top - (gsap.getProperty(btn, "y") as number) + rect.height / 2;

    if (fill) {
      const size = rect.width * 2.4;
      gsap.set(fill, {
        width: size,
        height: size,
        left: e.clientX - rect.left,
        top: e.clientY - rect.top,
        xPercent: -50,
        yPercent: -50,
      });
      gsap.to(fill, { scale: 1, duration: 0.8, ease: "hero", overwrite: true });
    }
    gsap.to(labels, {
      yPercent: -100,
      duration: 0.6,
      ease: "hero",
      overwrite: true,
    });
    if (a) gsap.to(a, { x: 40, duration: 0.6, ease: "hero", overwrite: true });
    if (b) gsap.to(b, { x: 0, duration: 0.6, ease: "hero", overwrite: true });
  };

  const move = (e: PointerEvent) => {
    gsap.to(btn, {
      x: (e.clientX - centerX) * magnetic,
      y: (e.clientY - centerY) * magnetic * 1.2,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const leave = () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.35)",
      overwrite: "auto",
    });
    if (fill)
      gsap.to(fill, {
        scale: 0,
        duration: 0.6,
        ease: "heroInOut",
        overwrite: true,
      });
    gsap.to(labels, {
      yPercent: 0,
      duration: 0.6,
      ease: "hero",
      overwrite: true,
    });
    if (a) gsap.to(a, { x: 0, duration: 0.6, ease: "hero", overwrite: true });
    if (b) gsap.to(b, { x: -40, duration: 0.6, ease: "hero", overwrite: true });
  };

  btn.addEventListener("pointerenter", enter);
  btn.addEventListener("pointermove", move);
  btn.addEventListener("pointerleave", leave);

  return () => {
    btn.removeEventListener("pointerenter", enter);
    btn.removeEventListener("pointermove", move);
    btn.removeEventListener("pointerleave", leave);
    gsap.killTweensOf(parts);
  };
}
