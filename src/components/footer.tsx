"use client";

import { useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { FINE_POINTER, attachFillButton } from "@/lib/gsap-ui";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const headingClass =
  "f-fade reveal mb-6 font-body text-[11px] font-medium uppercase tracking-[0.25em] text-estora-text-muted";

const marqueeWords = [
  "Curated spaces",
  "Considered living",
  "Thoughtfully selected",
  "Clearly presented",
];

/* Live local time (Lagos). useSyncExternalStore keeps server and client in step. */
function subscribeClock(onChange: () => void) {
  const id = setInterval(onChange, 10_000);
  return () => clearInterval(id);
}
const getTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Lagos",
  }).format(new Date());
const getServerTime = () => "";

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
  const time = useSyncExternalStore(subscribeClock, getTime, getServerTime);

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
        // 1. Closing call to action
        gsap
          .timeline({
            defaults: { ease: "hero" },
            scrollTrigger: {
              trigger: $(".f-cta"),
              start: "top 80%",
              once: true,
            },
          })
          .fromTo(
            ".f-eyebrow-rule",
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "heroInOut",
              transformOrigin: "0% 50%",
            },
            0,
          )
          .fromTo(
            ".f-eyebrow-text",
            { yPercent: 120 },
            { yPercent: 0, duration: 1 },
            0.1,
          )
          .fromTo(
            ".f-cta-line",
            { yPercent: 115, rotate: 4 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 1.4,
              stagger: 0.12,
              transformOrigin: "0% 100%",
            },
            0.15,
          )
          .fromTo(
            ".f-cta-btn",
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.4, ease: "back.out(1.5)" },
            0.5,
          );

        // 2. Marquee: fades in, then loops forever
        gsap.fromTo(
          ".f-marquee",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.4,
            ease: "hero",
            scrollTrigger: {
              trigger: $(".f-marquee"),
              start: "top 95%",
              once: true,
            },
          },
        );
        gsap.to($(".f-track"), {
          xPercent: -50,
          duration: 45,
          ease: "none",
          repeat: -1,
        });

        // 3. Link grid: rule draws, then columns rise in a stagger
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

        // 4. Giant wordmark: letters rise out of the mask, and the whole word
        //    slowly lifts into place as the footer scrolls into view
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
        gsap.fromTo(
          $(".f-mark-inner"),
          { yPercent: 28 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );

        // 5. Bottom bar
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

        // Big CTA circle: magnetic pull, cursor-origin fill, label roll
        $$(".fill-btn").forEach((btn) =>
          cleanups.push(attachFillButton(btn, 0.25)),
        );

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

        // Soft lime spotlight that trails the cursor across the footer
        const spot = $(".f-spot");
        gsap.set(spot, { xPercent: -50, yPercent: -50, opacity: 0 });
        const sx = gsap.quickTo(spot, "x", {
          duration: 1.2,
          ease: "power3.out",
        });
        const sy = gsap.quickTo(spot, "y", {
          duration: 1.2,
          ease: "power3.out",
        });

        const local = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          return { x: e.clientX - r.left, y: e.clientY - r.top };
        };
        const spotEnter = (e: PointerEvent) => {
          const p = local(e);
          gsap.set(spot, { x: p.x, y: p.y });
          gsap.to(spot, {
            opacity: 1,
            duration: 1,
            ease: "hero",
            overwrite: "auto",
          });
        };
        const spotMove = (e: PointerEvent) => {
          const p = local(e);
          sx(p.x);
          sy(p.y);
        };
        const spotLeave = () =>
          gsap.to(spot, {
            opacity: 0,
            duration: 1,
            ease: "hero",
            overwrite: "auto",
          });

        el.addEventListener("pointerenter", spotEnter);
        el.addEventListener("pointermove", spotMove);
        el.addEventListener("pointerleave", spotLeave);
        cleanups.push(() => {
          el.removeEventListener("pointerenter", spotEnter);
          el.removeEventListener("pointermove", spotMove);
          el.removeEventListener("pointerleave", spotLeave);
          gsap.killTweensOf(spot);
        });

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

  const marqueeGroup = (hidden: boolean) => (
    <div
      className="flex shrink-0 items-center gap-8 pr-8 lg:gap-14 lg:pr-14"
      aria-hidden={hidden || undefined}
    >
      {marqueeWords.map((word, i) => (
        <div key={word} className="flex shrink-0 items-center gap-8 lg:gap-14">
          <span
            className={`whitespace-nowrap font-display text-[clamp(2rem,5vw,4.5rem)] leading-none tracking-tight ${
              i % 2 === 0
                ? "font-medium text-estora-text-primary"
                : "font-light italic text-estora-accent"
            }`}
          >
            {word}
          </span>
          <span className="h-2 w-2 shrink-0 rounded-full bg-estora-accent lg:h-2.5 lg:w-2.5" />
        </div>
      ))}
    </div>
  );

  return (
    <footer
      ref={root}
      id="site-footer"
      className="relative overflow-hidden bg-estora-bg"
    >
      {/* Hide animated parts until GSAP has set their start state (prevents flash) */}
      <style>{`#site-footer:not([data-ready]) .reveal{opacity:0}`}</style>

      {/* Cursor spotlight (mouse devices only, GSAP fades it in) */}
      <div className="f-spot pointer-events-none absolute left-0 top-0 z-0 h-[34rem] w-[34rem] rounded-full bg-estora-accent/10 opacity-0 blur-3xl" />

      <div className="relative z-10">
        {/* ----------------------------- Closing CTA ----------------------------- */}
        <div className="mx-auto max-w-[1600px] px-6 pt-24 lg:px-12 lg:pt-36">
          <div className="f-cta grid gap-12 pb-20 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-28">
            <div className="lg:col-span-9">
              <div className="flex items-center gap-4">
                <span className="f-eyebrow-rule reveal h-px w-14 bg-estora-accent" />
                <span className="block overflow-hidden">
                  <span className="f-eyebrow-text reveal block font-body text-xs font-medium uppercase tracking-[0.3em] text-estora-accent lg:text-[13px]">
                    Let&apos;s talk
                  </span>
                </span>
              </div>

              <h2 className="mt-6 font-display text-[clamp(2.5rem,8vw,8rem)] font-medium leading-[0.95] tracking-[-0.04em] text-estora-text-primary">
                <span className="-my-[0.12em] block overflow-hidden whitespace-nowrap py-[0.12em] pr-[0.1em]">
                  <span className="f-cta-line reveal inline-block will-change-transform">
                    Ready to make
                  </span>
                </span>
                <span className="-my-[0.12em] block overflow-hidden whitespace-nowrap py-[0.12em] pr-[0.1em]">
                  <span className="f-cta-line reveal inline-block will-change-transform">
                    your{" "}
                    <span className="font-light italic text-estora-accent">
                      move?
                    </span>
                  </span>
                </span>
              </h2>
            </div>

            <div className="flex lg:col-span-3 lg:justify-end">
              <Link
                href="/#contact"
                className="f-cta-btn fill-btn reveal group relative flex h-36 w-36 flex-col items-center justify-center gap-2 overflow-hidden rounded-full bg-estora-accent font-display text-base font-medium text-estora-bg transition-[scale] duration-200 active:scale-[0.96] lg:h-48 lg:w-48 lg:text-lg"
              >
                <span
                  data-fill
                  className="pointer-events-none absolute rounded-full bg-estora-text-primary"
                  style={{ transform: "scale(0)" }}
                  aria-hidden
                />
                <ArrowUpRight className="relative z-10 h-6 w-6 transition-transform duration-500 group-hover:rotate-45 lg:h-7 lg:w-7" />
                <span
                  data-label
                  className="relative z-10 block overflow-hidden whitespace-nowrap"
                >
                  <span className="block">Get in touch</span>
                  <span className="absolute left-0 top-full block" aria-hidden>
                    Get in touch
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ------------------------------- Marquee ------------------------------- */}
        <div className="f-marquee reveal overflow-hidden border-y border-white/10 py-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] lg:py-8">
          <div className="f-track flex w-max will-change-transform">
            {marqueeGroup(false)}
            {marqueeGroup(true)}
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          {/* ----------------------------- Link grid ----------------------------- */}
          <div className="f-top relative pt-16 lg:pt-24">
            <span className="f-rule reveal absolute left-0 top-0 h-px w-full bg-white/15" />

            <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
              {/* Brand */}
              <div className="max-w-sm sm:col-span-2 lg:col-span-1">
                <div className="f-fade reveal flex items-center gap-4">
                  <Image
                    src="https://res.cloudinary.com/dk5mfu099/image/upload/v1791883199/___1_-removebg-preview_emp4cg.png"
                    alt="footer logo"
                    width={48}
                    height={48}
                    className="h-11 w-11 shrink-0 object-contain bg-white border-2 ring border-estora-accent rounded-3xl shadow-md"
                  />
                  <div className="flex flex-col leading-none">
                    <span className="font-display text-2xl font-bold tracking-tight text-estora-text-primary">
                      {siteConfig.brand.name}
                    </span>
                    <span className="mt-1 font-body text-[10px] uppercase tracking-[0.18em] text-estora-text-muted">
                      {siteConfig.brand.descriptor}
                    </span>
                  </div>
                </div>

                <p className="f-fade reveal mt-8 font-display text-2xl font-normal leading-snug tracking-tight text-estora-text-primary/90 lg:text-[1.75rem]">
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
            <div className="f-mark-inner flex w-full justify-between font-display text-[clamp(3.5rem,21vw,22rem)] font-medium uppercase leading-[0.82] tracking-[-0.05em]">
              {letters.map((letter, i) => (
                <span key={i} className="block overflow-hidden pt-[0.06em]">
                  <span className="f-letter reveal block text-estora-text-primary/[0.04] transition-[color,-webkit-text-stroke-color] duration-500 [-webkit-text-stroke:1px_rgba(255,255,255,0.28)] hover:text-estora-accent hover:[-webkit-text-stroke-color:transparent]">
                    {letter}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* ----------------------------- Bottom bar --------------------------- */}
          <div className="f-bottom relative mt-8 flex flex-col gap-8 pb-8 pt-6 lg:flex-row lg:items-end lg:justify-between lg:pb-10">
            <span className="absolute left-0 top-0 h-px w-full bg-white/10" />

            <div className="flex flex-col gap-3">
              <p className="f-bottom-item reveal font-body text-xs text-estora-text-muted">
                &copy; {year} ESTORA Property Group. All rights reserved.
              </p>
              <p className="f-bottom-item reveal max-w-lg font-body text-xs leading-relaxed text-estora-text-muted/60">
                Portfolio concept by an independent developer. Brand and sample
                property listings are illustrative and not associated with a
                real business.
              </p>
            </div>

            <div className="flex items-end justify-between gap-6 lg:justify-end lg:gap-10">
              {/* Local time */}
              <div className="f-bottom-item reveal flex items-center gap-3 font-body text-xs uppercase tracking-[0.2em] text-estora-text-muted">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-estora-accent opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-estora-accent" />
                </span>
                <span>
                  Lagos, Nigeria
                  <span className="ml-2 tabular-nums text-estora-text-primary">
                    {time || "--:--"}
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                className="to-top f-bottom-item reveal group relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 text-estora-text-primary transition-[scale,color,border-color] duration-300 hover:border-estora-accent hover:text-estora-bg active:scale-90"
              >
                <span
                  className="top-fill pointer-events-none absolute inset-0 bg-estora-accent"
                  style={{
                    transform: "scaleY(0)",
                    transformOrigin: "50% 100%",
                  }}
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
        </div>
      </div>
    </footer>
  );
}
