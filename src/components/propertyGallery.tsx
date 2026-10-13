"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "@/lib/gsap-ui"; // registers the custom eases

gsap.registerPlugin(useGSAP);

interface PropertyGalleryProps {
  images: string[];
  alt: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function PropertyGallery({ images, alt }: PropertyGalleryProps) {
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = useRef(0);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const firstCount = useRef(true);

  const [active, setActive] = useState(0);
  const count = images.length;

  /* ---------------- Go to a slide: clip-path wipe + image parallax ---------------- */
  const goTo = useCallback(
    (next: number, dir: 1 | -1) => {
      const from = current.current;
      if (next === from || next < 0 || next >= count) return;

      const fromEl = slides.current[from];
      const toEl = slides.current[next];
      if (!fromEl || !toEl) return;

      // Finish any running transition instantly so rapid clicks stay clean
      tl.current?.progress(1, false);

      current.current = next;
      setActive(next);

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) {
        gsap.set(fromEl, { autoAlpha: 0 });
        gsap.set(toEl, { autoAlpha: 1 });
        return;
      }

      const fromImg = fromEl.querySelector<HTMLElement>(".g-img");
      const toImg = toEl.querySelector<HTMLElement>(".g-img");

      gsap.set(toEl, {
        autoAlpha: 1,
        zIndex: 2,
        clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
      });
      gsap.set(fromEl, { zIndex: 1 });
      gsap.set(toImg, { scale: 1.35, xPercent: dir > 0 ? 8 : -8 });

      tl.current = gsap
        .timeline({
          defaults: { duration: 1.2 },
          onComplete: () => {
            gsap.set(fromEl, { autoAlpha: 0, zIndex: 0 });
            gsap.set(fromImg, { xPercent: 0, scale: 1 });
            gsap.set(toEl, { zIndex: 1, clearProps: "clipPath" });
          },
        })
        .to(toEl, { clipPath: "inset(0% 0% 0% 0%)", ease: "heroInOut" }, 0)
        .to(toImg, { scale: 1, xPercent: 0, duration: 1.6, ease: "hero" }, 0)
        .to(
          fromImg,
          { xPercent: dir > 0 ? -5 : 5, scale: 1.1, ease: "heroInOut" },
          0,
        );
    },
    [count],
  );

  const step = (d: 1 | -1) => goTo((current.current + d + count) % count, d);

  /* ---------------- Intro: curtain wipe, zoom settle, controls rise ---------------- */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "hero" }, delay: 0.5 })
          .fromTo(
            ".g-frame",
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.6,
              ease: "heroInOut",
              clearProps: "clipPath",
            },
            0,
          )
          .fromTo(
            ".g-first-img",
            { scale: 1.45 },
            { scale: 1, duration: 2.2 },
            0,
          )
          .fromTo(
            ".g-ui",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.08 },
            1.1,
          )
          .fromTo(
            ".g-thumb",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.07 },
            1.2,
          );

        // Start states are set, so it's safe to reveal
        el.setAttribute("data-ready", "");
        return () => el.removeAttribute("data-ready");
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        el.setAttribute("data-ready", "");
        return () => el.removeAttribute("data-ready");
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  /* ---------------- Counter number rolls up on every change ---------------- */
  useGSAP(
    () => {
      if (firstCount.current) {
        firstCount.current = false;
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ".g-cur",
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, ease: "hero" },
      );
    },
    { scope: root, dependencies: [active] },
  );

  /* Keep the active thumbnail centred (scrolls the strip only, never the page) */
  useEffect(() => {
    const s = strip.current;
    const t = thumbs.current[active];
    if (!s || !t) return;
    s.scrollTo({
      left: t.offsetLeft - (s.clientWidth - t.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  useEffect(() => {
    return () => {
      tl.current?.kill();
    };
  }, []);

  if (count === 0) return null;

  return (
    <div ref={root} data-gal className="flex flex-col gap-4">
      {/* Hide animated parts until GSAP has set their start state (prevents flash) */}
      <style>{`[data-gal]:not([data-ready]) .reveal{opacity:0}`}</style>

      {/* Main frame */}
      <div
        className="g-frame reveal relative aspect-[4/3] touch-pan-y overflow-hidden rounded-3xl bg-estora-bg-elevated outline-none focus-visible:ring-2 focus-visible:ring-estora-accent sm:aspect-[16/11] lg:aspect-[16/10]"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Property photos"
        onKeyDown={(e) => {
          if (count < 2) return;
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") return;
          swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const start = swipe.current;
          swipe.current = null;
          if (!start || count < 2) return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            step(dx < 0 ? 1 : -1);
          }
        }}
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            ref={(node) => {
              slides.current[i] = node;
            }}
            className={`absolute inset-0 overflow-hidden ${
              i === 0 ? "z-[1]" : "invisible opacity-0"
            }`}
            aria-hidden={i !== active}
          >
            <div
              className={`g-img ${i === 0 ? "g-first-img" : ""} absolute inset-0 will-change-transform`}
            >
              <Image
                src={src}
                alt={i === 0 ? alt : `${alt}, image ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover"
                draggable={false}
              />
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        {count > 1 && (
          <>
            {/* Counter */}
            <div
              className="g-ui reveal absolute bottom-4 left-4 z-[4] flex items-center gap-2 rounded-full border border-white/15 bg-estora-bg/50 px-4 py-2 font-body text-xs tracking-[0.15em] text-estora-text-primary backdrop-blur-md sm:bottom-6 sm:left-6"
              aria-live="polite"
            >
              <span className="block overflow-hidden">
                <span className="g-cur block tabular-nums">
                  {pad(active + 1)}
                </span>
              </span>
              <span className="text-estora-text-muted">/ {pad(count)}</span>
            </div>

            {/* Prev / next */}
            <div className="g-ui reveal absolute bottom-4 right-4 z-[4] flex gap-2 sm:bottom-6 sm:right-6">
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => step(-1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-estora-bg/50 text-estora-text-primary backdrop-blur-md transition-colors duration-300 hover:border-estora-accent hover:bg-estora-accent hover:text-estora-bg active:scale-90"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => step(1)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-estora-bg/50 text-estora-text-primary backdrop-blur-md transition-colors duration-300 hover:border-estora-accent hover:bg-estora-accent hover:text-estora-bg active:scale-90"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div
          ref={strip}
          className="relative -mx-6 flex snap-x gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <button
              key={`${src}-thumb-${i}`}
              ref={(node) => {
                thumbs.current[i] = node;
              }}
              type="button"
              onClick={() => goTo(i, i > current.current ? 1 : -1)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`g-thumb reveal relative aspect-[4/3] w-24 shrink-0 snap-center overflow-hidden rounded-xl transition-[opacity,box-shadow] duration-500 sm:w-28 lg:w-32 ${
                i === active
                  ? "opacity-100 ring-2 ring-estora-accent ring-offset-2 ring-offset-estora-bg"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
