"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { MessageCircle, ArrowUp, ArrowUpRight } from "lucide-react";
import {
  siteConfig,
  getWhatsAppUrl,
  defaultWhatsAppMessage,
} from "@/config/site";
import { FINE_POINTER } from "@/lib/gsap-ui";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const headingClass =
  "f-fade reveal mb-6 font-body text-[11px] font-medium uppercase tracking-[0.25em] text-estora-text-muted";

/* Link with a text roll: the label slides up and an accent copy takes its place */
function RollLink({
  children,
  className = "",
  ...props
}: React.ComponentProps<"a"> & { children: string }) {
  return (
    <a
      {...props}
      className={`f-link relative inline-flex items-center gap-2 font-body text-base text-estora-text-primary ${className}`}
    >
      <span className="roll relative block overflow-hidden whitespace-nowrap">
        <span className="block">{children}</span>
        <span
          className="absolute left-0 top-full block text-estora-accent"
          aria-hidden
        >
          {children}
        </span>
      </span>
    </a>
  );
}

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  const letters = siteConfig.brand.name.split("");
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const $ = (s: string) => el.querySelector<HTMLElement>(s)!;
      const $$ = (s: string) =>
        gsap.utils.toArray<HTMLElement>(el.querySelectorAll(s));

      const mm = gsap.matchMedia();

      /* ---------------- Scroll animations ---------------- */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Top grid: rule draws, then columns rise in a stagger
        gsap
          .timeline({
            defaults: { ease: "hero" },
            scrollTrigger: {
              trigger: $(".f-top"),
              start: "top 85%",
              once: true,
            },
          })
          .fromTo(
            ".f-rule",
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.4,
              ease: "heroInOut",
              transformOrigin: "0% 50%",
            },
            0,
          )
          .fromTo(
            $$(".f-fade"),
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, stagger: 0.06 },
            0.2,
          );

        // Giant wordmark: letters rise out of the mask one by one
        gsap.fromTo(
          $$(".f-letter"),
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.5,
            ease: "hero",
            stagger: 0.07,
            scrollTrigger: {
              trigger: $(".f-mark"),
              start: "top 92%",
              once: true,
            },
          },
        );

        // Bottom bar
        gsap.fromTo(
          $$(".f-bottom-item"),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "hero",
            stagger: 0.08,
            scrollTrigger: {
              trigger: $(".f-bottom"),
              start: "top 98%",
              once: true,
            },
          },
        );

        // Everything is in its start state, so it's safe to reveal the footer
        el.setAttribute("data-ready", "");
        return () => el.removeAttribute("data-ready");
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        el.setAttribute("data-ready", "");
        return () => el.removeAttribute("data-ready");
      });

      /* ---------------- Hover effects (mouse devices only) ---------------- */
      const mmPointer = gsap.matchMedia();
      mmPointer.add(FINE_POINTER, () => {
        const cleanups: Array<() => void> = [];

        // Text-roll links
        $$(".f-link").forEach((link) => {
          const spans = link.querySelectorAll<HTMLElement>(".roll > span");
          const arrow = link.querySelector<HTMLElement>(".f-arrow");

          const enter = () => {
            gsap.to(spans, {
              yPercent: -100,
              duration: 0.6,
              ease: "hero",
              overwrite: true,
            });
            if (arrow)
              gsap.to(arrow, {
                x: 3,
                y: -3,
                duration: 0.5,
                ease: "hero",
                overwrite: true,
              });
          };
          const leave = () => {
            gsap.to(spans, {
              yPercent: 0,
              duration: 0.6,
              ease: "hero",
              overwrite: true,
            });
            if (arrow)
              gsap.to(arrow, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "hero",
                overwrite: true,
              });
          };

          link.addEventListener("pointerenter", enter);
          link.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            link.removeEventListener("pointerenter", enter);
            link.removeEventListener("pointerleave", leave);
            gsap.killTweensOf([...Array.from(spans), arrow]);
          });
        });

        // Back-to-top: lime fill rises, arrow shoots up and a fresh one enters
        const top = el.querySelector<HTMLElement>(".to-top");
        if (top) {
          const fill = top.querySelector<HTMLElement>(".top-fill")!;
          const a = top.querySelector<HTMLElement>(".top-a")!;
          const b = top.querySelector<HTMLElement>(".top-b")!;

          const enter = () => {
            gsap.set(fill, { transformOrigin: "50% 100%" });
            gsap.to(fill, {
              scaleY: 1,
              duration: 0.7,
              ease: "hero",
              overwrite: true,
            });
            gsap.to(a, {
              y: -36,
              duration: 0.5,
              ease: "hero",
              overwrite: true,
            });
            gsap.to(b, { y: 0, duration: 0.5, ease: "hero", overwrite: true });
          };
          const leave = () => {
            gsap.set(fill, { transformOrigin: "50% 0%" });
            gsap.to(fill, {
              scaleY: 0,
              duration: 0.6,
              ease: "heroInOut",
              overwrite: true,
            });
            gsap.to(a, { y: 0, duration: 0.5, ease: "hero", overwrite: true });
            gsap.to(b, { y: 36, duration: 0.5, ease: "hero", overwrite: true });
          };

          top.addEventListener("pointerenter", enter);
          top.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            top.removeEventListener("pointerenter", enter);
            top.removeEventListener("pointerleave", leave);
            gsap.killTweensOf([fill, a, b]);
          });
        }

        return () => cleanups.forEach((fn) => fn());
      });

      return () => {
        mm.revert();
        mmPointer.revert();
      };
    },
    { scope: root },
  );

  const scrollToTop = () => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (lenis) {
      lenis.scrollTo(0, { duration: reduce ? 0 : 1.8 });
    } else {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  };

  return (
    <footer
      ref={root}
      id="site-footer"
      className="relative overflow-hidden bg-estora-bg"
    >
      {/* Hide animated parts until GSAP has set their start state (prevents flash) */}
      <style>{`#site-footer:not([data-ready]) .reveal{opacity:0}`}</style>

      <div className="mx-auto max-w-[1600px] px-6 pt-20 lg:px-12 lg:pt-28">
        {/* ----------------------------- Top grid ----------------------------- */}
        <div className="f-top relative pt-12 lg:pt-16">
          <span className="f-rule reveal absolute left-0 top-0 h-px w-full bg-white/15" />

          <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
            {/* Brand */}
            <div className="max-w-sm sm:col-span-2 lg:col-span-1">
              <div className="f-fade reveal flex flex-col leading-none">
                <span className="font-display text-2xl font-bold tracking-tight text-estora-text-primary">
                  {siteConfig.brand.name}
                </span>
                <span className="mt-1 font-body text-[10px] uppercase tracking-[0.18em] text-estora-text-muted">
                  {siteConfig.brand.descriptor}
                </span>
              </div>
              <p className="f-fade reveal mt-6 font-display text-2xl font-normal leading-snug tracking-tight text-estora-text-primary/90 lg:text-[1.75rem]">
                Curated spaces.{" "}
                <span className="font-light italic text-estora-accent">
                  Considered living.
                </span>
              </p>
              <p className="f-fade reveal mt-4 font-body text-sm leading-relaxed text-estora-text-muted">
                A property experience built around your next move.
              </p>
            </div>

            {/* Explore */}
            <nav aria-label="Explore">
              <h4 className={headingClass}>Explore</h4>
              <ul className="flex flex-col gap-4">
                {siteConfig.nav.map((item) => (
                  <li key={item.href} className="f-fade reveal">
                    <RollLink href={item.href}>{item.label}</RollLink>
                  </li>
                ))}
                <li className="f-fade reveal">
                  <RollLink href="/properties">Properties</RollLink>
                </li>
              </ul>
            </nav>

            {/* Contact */}
            <div>
              <h4 className={headingClass}>Contact</h4>
              <ul className="flex flex-col gap-4">
                <li className="f-fade reveal">
                  <RollLink href={`mailto:${siteConfig.contact.email}`}>
                    {siteConfig.contact.email}
                  </RollLink>
                </li>
                <li className="f-fade reveal">
                  <a
                    href={getWhatsAppUrl(defaultWhatsAppMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="f-link relative inline-flex items-center gap-2 font-body text-base text-estora-text-primary"
                  >
                    <MessageCircle className="h-4 w-4 text-estora-accent" />
                    <span className="roll relative block overflow-hidden whitespace-nowrap">
                      <span className="block">WhatsApp</span>
                      <span
                        className="absolute left-0 top-full block text-estora-accent"
                        aria-hidden
                      >
                        WhatsApp
                      </span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow */}
            <div>
              <h4 className={headingClass}>Follow</h4>
              <ul className="flex flex-col gap-4">
                {siteConfig.social.map((item) => (
                  <li key={item.label} className="f-fade reveal">
                    <a
                      href={item.href}
                      className="f-link relative inline-flex items-center gap-2 font-body text-base text-estora-text-primary"
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
                      <ArrowUpRight className="f-arrow h-4 w-4 text-estora-accent" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ----------------------------- Wordmark ----------------------------- */}
        <div
          className="f-mark mt-16 select-none overflow-hidden lg:mt-24"
          aria-hidden
        >
          <div className="flex w-full justify-between font-display text-[clamp(3.5rem,21vw,22rem)] font-medium uppercase leading-[0.82] tracking-[-0.05em] text-estora-text-primary">
            {letters.map((letter, i) => (
              <span key={i} className="block overflow-hidden pt-[0.06em]">
                <span className="f-letter reveal block transition-colors duration-500 hover:text-estora-accent">
                  {letter}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* ----------------------------- Bottom bar --------------------------- */}
        <div className="f-bottom relative mt-8 flex flex-col gap-6 pb-8 pt-6 sm:flex-row sm:items-end sm:justify-between lg:pb-10">
          <span className="absolute left-0 top-0 h-px w-full bg-white/10" />

          <div className="flex flex-col gap-3">
            <p className="f-bottom-item reveal font-body text-xs text-estora-text-muted">
              &copy; {year} ESTORA Property Group. All rights reserved.
            </p>
            <p className="f-bottom-item reveal max-w-lg font-body text-xs leading-relaxed text-estora-text-muted/60">
              Portfolio concept by an independent developer. Brand and sample
              property listings are illustrative and not associated with a real
              business.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="to-top f-bottom-item reveal group relative flex h-14 w-14 shrink-0 items-center justify-center self-end overflow-hidden rounded-full border border-white/20 text-estora-text-primary transition-[scale,color,border-color] duration-300 hover:border-estora-accent hover:text-estora-bg active:scale-90 sm:self-auto"
          >
            <span
              className="top-fill pointer-events-none absolute inset-0 bg-estora-accent"
              style={{ transform: "scaleY(0)", transformOrigin: "50% 100%" }}
              aria-hidden
            />
            <span className="relative z-10 flex h-6 w-6 items-center justify-center overflow-hidden">
              <ArrowUp className="top-a h-5 w-5" />
              <ArrowUp
                className="top-b absolute h-5 w-5"
                style={{ transform: "translateY(36px)" }}
                aria-hidden
              />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
