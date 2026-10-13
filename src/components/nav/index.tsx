"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase);

/* -------------------------------------------------------------------------- */
/*  Desktop hover effects (fine pointers only, never runs on touch devices)    */
/* -------------------------------------------------------------------------- */
function setupHover(root: HTMLElement) {
  const cleanups: Array<() => void> = [];
  const targets: Element[] = [];

  const on = (t: HTMLElement, type: string, fn: (e: PointerEvent) => void) => {
    t.addEventListener(type, fn as EventListener);
    cleanups.push(() => t.removeEventListener(type, fn as EventListener));
  };

  /* ---- Nav links: text roll + dot ---- */
  root.querySelectorAll<HTMLElement>(".nav-link").forEach((link) => {
    const spans = link.querySelectorAll<HTMLElement>(".roll > span");
    const dot = link.querySelector<HTMLElement>(".nav-dot")!;
    targets.push(dot, ...Array.from(spans));

    on(link, "pointerenter", () => {
      gsap.to(spans, {
        yPercent: -100,
        duration: 0.6,
        ease: "hero",
        overwrite: true,
      });
      gsap.to(dot, { scale: 1, duration: 0.5, ease: "hero", overwrite: true });
    });
    on(link, "pointerleave", () => {
      gsap.to(spans, {
        yPercent: 0,
        duration: 0.6,
        ease: "hero",
        overwrite: true,
      });
      gsap.to(dot, { scale: 0, duration: 0.4, ease: "hero", overwrite: true });
    });
  });

  /* ---- CTA: magnetic + cursor-origin fill + label/arrow swap ---- */
  const cta = root.querySelector<HTMLElement>(".nav-cta");
  if (cta) {
    const fill = cta.querySelector<HTMLElement>(".cta-fill")!;
    const labels = cta.querySelectorAll<HTMLElement>(".cta-label > span");
    const arrowA = cta.querySelector<HTMLElement>(".cta-arrow-a")!;
    const arrowB = cta.querySelector<HTMLElement>(".cta-arrow-b")!;
    targets.push(cta, fill, arrowA, arrowB, ...Array.from(labels));

    let rect = cta.getBoundingClientRect();

    on(cta, "pointerenter", (e) => {
      rect = cta.getBoundingClientRect();
      const size = rect.width * 2.6;
      gsap.set(fill, {
        width: size,
        height: size,
        left: e.clientX - rect.left,
        top: e.clientY - rect.top,
        xPercent: -50,
        yPercent: -50,
      });
      gsap.to(fill, { scale: 1, duration: 0.8, ease: "hero", overwrite: true });
      gsap.to(labels, {
        yPercent: -100,
        duration: 0.6,
        ease: "hero",
        overwrite: true,
      });
      gsap.to(arrowA, { x: 30, duration: 0.6, ease: "hero", overwrite: true });
      gsap.to(arrowB, { x: 0, duration: 0.6, ease: "hero", overwrite: true });
    });

    on(cta, "pointermove", (e) => {
      const curX = gsap.getProperty(cta, "x") as number;
      const curY = gsap.getProperty(cta, "y") as number;
      const cx = rect.left - curX + rect.width / 2;
      const cy = rect.top - curY + rect.height / 2;
      gsap.to(cta, {
        x: (e.clientX - cx) * 0.25,
        y: (e.clientY - cy) * 0.35,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    });

    on(cta, "pointerleave", () => {
      gsap.to(cta, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.35)",
        overwrite: "auto",
      });
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
      gsap.to(arrowA, { x: 0, duration: 0.6, ease: "hero", overwrite: true });
      gsap.to(arrowB, { x: -30, duration: 0.6, ease: "hero", overwrite: true });
    });
  }

  return () => {
    cleanups.forEach((fn) => fn());
    gsap.killTweensOf(targets);
  };
}

/* -------------------------------------------------------------------------- */
/*                                   Component                                */
/* -------------------------------------------------------------------------- */
export default function Navbar() {
  const root = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const ui = useRef({ scrolled: false, hidden: false, open: false });
  const lenisRef = useRef<{ stop: () => void; start: () => void } | null>(null);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  // Keep the latest Lenis instance in a ref so setMenu can stay stable
  useEffect(() => {
    lenisRef.current = lenis ?? null;
  }, [lenis]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      // Same custom eases as the hero so the whole site feels heaconsistent
      CustomEase.create("hero", "0.16, 1, 0.3, 1");
      CustomEase.create("heroInOut", "0.76, 0, 0.24, 1");

      const $ = (s: string) => el.querySelector<HTMLElement>(s)!;
      const $$ = (s: string) =>
        gsap.utils.toArray<HTMLElement>(el.querySelectorAll(s));

      // const header = $(".nav-header");
      const bg = $(".nav-bg");
      const inner = $(".nav-inner");
      const bar1 = $(".bar-1");
      const bar2 = $(".bar-2");

      // Burger starts as two parallel lines
      gsap.set(bar1, { y: -4 });
      gsap.set(bar2, { y: 4 });

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /* ---------------- Mobile menu timeline (built once, played/reversed) ---------------- */
      const tl = gsap.timeline({ paused: true, defaults: { ease: "hero" } });
      tl.fromTo(
        $(".menu"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.01 },
        0,
      )
        .fromTo(
          $(".menu-bg"),
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "heroInOut" },
          0,
        )
        .fromTo(
          $$(".m-line"),
          { yPercent: 115, rotate: 4 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.1,
            stagger: 0.07,
            transformOrigin: "0% 100%",
          },
          0.25,
        )
        .fromTo(
          $$(".m-rule"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            stagger: 0.07,
            ease: "heroInOut",
            transformOrigin: "0% 50%",
          },
          0.3,
        )
        .fromTo(
          $$(".m-fade"),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
          0.6,
        );
      if (reduce) tl.timeScale(30);
      menuTl.current = tl;

      /* ---------------- Intro + scroll behaviour ---------------- */
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "hero" }, delay: 0.4 });

        intro
          .fromTo(
            $(".nav-brand-inner"),
            { yPercent: 110 },
            { yPercent: 0, duration: 1.1 },
            0,
          )
          .fromTo(
            $$(".nav-item"),
            { y: -18, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.08 },
            0.15,
          )
          .fromTo(
            $(".nav-cta-wrap"),
            { y: -18, opacity: 0, scale: 0.92 },
            { y: 0, opacity: 1, scale: 1, duration: 1 },
            0.4,
          )
          .fromTo(
            $(".nav-burger"),
            { opacity: 0, scale: 0.7 },
            { opacity: 1, scale: 1, duration: 0.9 },
            0.3,
          );

        el.setAttribute("data-ready", "");
        return () => el.removeAttribute("data-ready");
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        el.setAttribute("data-ready", "");
        return () => el.removeAttribute("data-ready");
      });

      /* Scroll: glass background + compact height, hide on scroll down, show on scroll up */
      const heights = () =>
        window.matchMedia("(min-width: 1024px)").matches
          ? { full: 80, compact: 68 }
          : { full: 64, compact: 56 };

           const st = ScrollTrigger.create({
             start: 0,
             end: "max",
             onUpdate: (self) => {
               const y = self.scroll();
               const state = ui.current;

               // Glass background + compact height once you've scrolled a little
               const scrolled = y > 40;
               if (scrolled !== state.scrolled) {
                 state.scrolled = scrolled;
                 const h = heights();
                 gsap.to(bg, {
                   opacity: scrolled && !state.open ? 1 : 0,
                   duration: 0.5,
                   ease: "power2.out",
                   overwrite: true,
                 });
                 gsap.to(inner, {
                   height: scrolled ? h.compact : h.full,
                   duration: 0.6,
                   ease: "hero",
                   overwrite: true,
                 });
               }
             },
           });

      /* Hover effects: mouse devices only */
      const mmPointer = gsap.matchMedia();
      mmPointer.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => setupHover(el),
      );

      return () => {
        st.kill();
        tl.kill();
        mm.revert();
        mmPointer.revert();
      };
    },
    { scope: root },
  );

  /* ---------------- Open / close the mobile menu ---------------- */
  const setMenu = useCallback((next: boolean) => {
    const el = root.current;
    const state = ui.current;
    if (!el || state.open === next) return;

    state.open = next;
    setOpen(next);

    const q = (s: string) => el.querySelector<HTMLElement>(s);
    const header = q(".nav-header");
    const bg = q(".nav-bg");
    const bar1 = q(".bar-1");
    const bar2 = q(".bar-2");
    const tl = menuTl.current;

    if (next) {
      lenisRef.current?.stop();
      document.body.style.overflow = "hidden";

      // Make sure the bar is visible and seamless with the overlay
      state.hidden = false;
      gsap.to(header, {
        yPercent: 0,
        duration: 0.4,
        ease: "hero",
        overwrite: true,
      });
      gsap.to(bg, { opacity: 0, duration: 0.3, overwrite: true });

      tl?.play();
      gsap.to(bar1, { y: 0, rotate: 45, duration: 0.7, ease: "hero" });
      gsap.to(bar2, { y: 0, rotate: -45, duration: 0.7, ease: "hero" });
    } else {
      lenisRef.current?.start();
      document.body.style.overflow = "";

      tl?.reverse();
      gsap.to(bar1, { y: -4, rotate: 0, duration: 0.7, ease: "hero" });
      gsap.to(bar2, { y: 4, rotate: 0, duration: 0.7, ease: "hero" });
      gsap.to(bg, {
        opacity: state.scrolled ? 1 : 0,
        duration: 0.5,
        delay: 0.3,
        overwrite: true,
      });
    }
  }, []);

  // Escape closes the menu; widening to desktop closes it too
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mql.matches) setMenu(false);
    };

    window.addEventListener("keydown", onKey);
    mql.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onChange);
    };
  }, [setMenu]);

  // Only unlock scrolling when the navbar unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div ref={root} id="site-nav">
      {/* Hide animated parts until GSAP has set their start state (prevents flash) */}
      <style>{`#site-nav:not([data-ready]) .nav-reveal{opacity:0}`}</style>

      <header className="nav-header fixed left-0 right-0 top-0 z-50 will-change-transform">
        {/* Glass background: fades in after you scroll */}
        <div className="nav-bg pointer-events-none absolute inset-0 border-b border-white/10 bg-estora-bg/70 opacity-0 backdrop-blur-xl" />

        <nav className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="nav-inner flex h-16 items-center justify-between lg:h-20">
            {/* Brand */}
            <Link
              href="/"
              onClick={() => setMenu(false)}
              className="block overflow-hidden py-1"
              aria-label="ESTORA home"
            >
              <span className="nav-brand-inner nav-reveal flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-tight text-estora-text-primary lg:text-xl">
                  {siteConfig.brand.name}
                </span>
                <span className="mt-0.5 font-body text-[10px] uppercase tracking-[0.18em] text-estora-text-muted">
                  {siteConfig.brand.descriptor}
                </span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-10 lg:flex">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link nav-item nav-reveal relative py-2 font-body text-sm font-medium text-estora-text-primary"
                >
                  <span className="roll relative block overflow-hidden whitespace-nowrap">
                    <span className="block">{item.label}</span>
                    <span
                      className="absolute left-0 top-full block text-estora-accent"
                      aria-hidden
                    >
                      {item.label}
                    </span>
                  </span>
                  <span
                    className="nav-dot absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-estora-accent"
                    style={{ transform: "translateX(-50%) scale(0)" }}
                    aria-hidden
                  />
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="nav-cta-wrap nav-reveal hidden lg:block">
              <Link
                href="/properties"
                className="nav-cta group relative inline-flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-full bg-estora-accent py-1.5 pl-6 pr-1.5 font-display text-sm font-medium text-estora-bg transition-[scale] duration-200 active:scale-[0.97]"
              >
                <span
                  className="cta-fill pointer-events-none absolute rounded-full bg-estora-text-primary"
                  style={{ transform: "scale(0)" }}
                  aria-hidden
                />
                <span className="cta-label relative z-10 block overflow-hidden">
                  <span className="block">Find a Property</span>
                  <span className="absolute left-0 top-full block" aria-hidden>
                    Find a Property
                  </span>
                </span>
                <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-estora-bg text-estora-accent">
                  <ArrowRight className="cta-arrow-a h-4 w-4" />
                  <ArrowRight
                    className="cta-arrow-b absolute h-4 w-4"
                    style={{ transform: "translateX(-30px)" }}
                    aria-hidden
                  />
                </span>
              </Link>
            </div>

            {/* Mobile burger: two lines that morph into an X */}
            <button
              className="nav-burger nav-reveal relative -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
              onClick={() => setMenu(!ui.current.open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-6 w-6">
                <span className="bar-1 absolute left-0 top-1/2 -mt-px block h-0.5 w-6 rounded-full bg-estora-text-primary" />
                <span className="bar-2 absolute left-0 top-1/2 -mt-px block h-0.5 w-6 rounded-full bg-estora-text-primary" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu (outside the header so the header's transform can't affect it) */}
      <div
        id="mobile-menu"
        className="menu invisible fixed inset-0 z-40 flex flex-col lg:hidden"
        aria-hidden={!open}
      >
        <div className="menu-bg absolute inset-0 bg-estora-bg" />

        <div className="relative flex flex-1 flex-col justify-between overflow-y-auto px-6 pb-8 pt-28">
          {/* Links */}
          <div className="flex flex-col">
            {siteConfig.nav.map((item, i) => (
              <div key={item.href} className="relative">
                <Link
                  href={item.href}
                  onClick={() => setMenu(false)}
                  className="group flex items-baseline gap-4 py-4"
                >
                  <span className="m-fade font-body text-xs tabular-nums tracking-widest text-estora-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="m-line block font-display text-[clamp(2.25rem,10vw,3.5rem)] font-medium leading-none tracking-tight text-estora-text-primary transition-colors duration-300 group-active:text-estora-accent">
                      {item.label}
                    </span>
                  </span>
                </Link>
                <span className="m-rule absolute bottom-0 left-0 h-px w-full bg-white/10" />
              </div>
            ))}
          </div>

          {/* Footer of the menu */}
          <div className="mt-10 flex flex-col gap-6">
            <Link
              href="/properties"
              onClick={() => setMenu(false)}
              className="m-fade inline-flex w-full items-center justify-between rounded-full bg-estora-accent py-2 pl-7 pr-2 font-display text-base font-medium text-estora-bg active:scale-[0.98]"
            >
              Find a Property
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-estora-bg text-estora-accent">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </Link>
            <p className="m-fade font-body text-xs uppercase tracking-[0.25em] text-estora-text-muted">
              {siteConfig.brand.name} · {siteConfig.brand.descriptor}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
