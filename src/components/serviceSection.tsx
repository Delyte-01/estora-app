"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Home, KeyRound, TrendingUp, ArrowRight } from "lucide-react";
import { FINE_POINTER } from "@/lib/gsap-ui";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const services = [
  {
    icon: Home,
    title: "Residential Sales",
    description:
      "Discover homes selected for different lifestyles and budgets, from city apartments to architectural family residences.",
    href: "/properties",
  },
  {
    icon: KeyRound,
    title: "Property Rentals",
    description:
      "Find apartments and homes for short- or long-term living, with clear terms and straightforward enquiries.",
    href: "/properties",
  },
  {
    icon: TrendingUp,
    title: "Investment Properties",
    description:
      "Explore opportunities for property investors, including land and commercial spaces in growing locations.",
    href: "/properties",
  },
];

export default function ServicesSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const $$ = (s: string) =>
        gsap.utils.toArray<HTMLElement>(el.querySelectorAll(s));

      const mm = gsap.matchMedia();

      /* ---------------- Scroll animations ---------------- */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Header
        gsap
          .timeline({
            defaults: { ease: "hero" },
            scrollTrigger: {
              trigger: el.querySelector(".svc-head"),
              start: "top 80%",
              once: true,
            },
          })
          .fromTo(
            ".svc-eyebrow-rule",
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
            ".svc-eyebrow-text",
            { yPercent: 120 },
            { yPercent: 0, duration: 1 },
            0.1,
          )
          .fromTo(
            ".svc-line",
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
            ".svc-copy",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            0.5,
          );

        // Rows: each rule draws across, then its content rises
        $$(".svc-item").forEach((item) => {
          gsap
            .timeline({
              defaults: { ease: "hero" },
              scrollTrigger: { trigger: item, start: "top 88%", once: true },
            })
            .fromTo(
              item.querySelector(".svc-rule"),
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 1.3,
                ease: "heroInOut",
                transformOrigin: "0% 50%",
              },
              0,
            )
            .fromTo(
              item.querySelectorAll(".svc-fade"),
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 1.1, stagger: 0.08 },
              0.2,
            );
        });

        // Closing rule under the last row
        gsap.fromTo(
          ".svc-end",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.3,
            ease: "heroInOut",
            transformOrigin: "0% 50%",
            scrollTrigger: {
              trigger: ".svc-end",
              start: "top 95%",
              once: true,
            },
          },
        );

        // Everything is in its start state, so it's safe to reveal the section
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

        $$(".svc-link").forEach((link) => {
          const fill = link.querySelector<HTMLElement>(".svc-fill")!;
          const title = link.querySelector<HTMLElement>(".svc-title")!;
          const arrowA = link.querySelector<HTMLElement>(".svc-arrow-a")!;
          const arrowB = link.querySelector<HTMLElement>(".svc-arrow-b")!;
          const parts = [fill, title, arrowA, arrowB];

          // The lime fill rises from the bottom and leaves through the top
          const enter = () => {
            gsap.set(fill, { transformOrigin: "50% 100%" });
            gsap.to(fill, {
              scaleY: 1,
              duration: 0.8,
              ease: "hero",
              overwrite: true,
            });
            gsap.to(title, {
              x: 18,
              duration: 0.8,
              ease: "hero",
              overwrite: true,
            });
            gsap.to(arrowA, {
              x: 44,
              duration: 0.6,
              ease: "hero",
              overwrite: true,
            });
            gsap.to(arrowB, {
              x: 0,
              duration: 0.6,
              ease: "hero",
              overwrite: true,
            });
          };
          const leave = () => {
            gsap.set(fill, { transformOrigin: "50% 0%" });
            gsap.to(fill, {
              scaleY: 0,
              duration: 0.7,
              ease: "heroInOut",
              overwrite: true,
            });
            gsap.to(title, {
              x: 0,
              duration: 0.8,
              ease: "hero",
              overwrite: true,
            });
            gsap.to(arrowA, {
              x: 0,
              duration: 0.6,
              ease: "hero",
              overwrite: true,
            });
            gsap.to(arrowB, {
              x: -44,
              duration: 0.6,
              ease: "hero",
              overwrite: true,
            });
          };

          link.addEventListener("pointerenter", enter);
          link.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            link.removeEventListener("pointerenter", enter);
            link.removeEventListener("pointerleave", leave);
            gsap.killTweensOf(parts);
          });
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

  return (
    <section
      ref={root}
      id="approach"
      className="relative scroll-mt-20 overflow-hidden bg-estora-bg"
    >
      {/* Hide animated parts until GSAP has set their start state (prevents flash) */}
      <style>{`#approach:not([data-ready]) .reveal{opacity:0}`}</style>

      <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-36">
        {/* ------------------------------ Header ------------------------------ */}
        <div className="svc-head mb-14 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4">
              <span className="svc-eyebrow-rule reveal h-px w-14 bg-estora-accent" />
              <span className="block overflow-hidden">
                <span className="svc-eyebrow-text reveal block font-body text-xs font-medium uppercase tracking-[0.3em] text-estora-accent lg:text-[13px]">
                  What we do
                </span>
              </span>
            </div>

            <h2 className="mt-6 font-display text-[clamp(2.5rem,8vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-estora-text-primary">
              <span className="-my-[0.12em] block overflow-hidden whitespace-nowrap py-[0.12em] pr-[0.1em]">
                <span className="svc-line reveal inline-block will-change-transform">
                  Property,
                </span>
              </span>
              <span className="-my-[0.12em] block overflow-hidden whitespace-nowrap py-[0.12em] pr-[0.1em]">
                <span className="svc-line reveal inline-block will-change-transform">
                  with{" "}
                  <span className="font-light italic text-estora-accent">
                    clarity.
                  </span>
                </span>
              </span>
            </h2>
          </div>

          <p className="svc-copy reveal max-w-md font-body text-base leading-relaxed text-estora-text-muted lg:col-span-4 lg:justify-self-end lg:text-lg">
            Three ways we help you move forward, whether you are buying your
            first home, renting, or building a portfolio.
          </p>
        </div>

        {/* ------------------------------- Rows ------------------------------- */}
        <div>
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="svc-item relative">
                {/* Top rule draws in on scroll */}
                <span className="svc-rule reveal absolute left-0 top-0 h-px w-full bg-white/15" />

                <Link
                  href={service.href}
                  className="svc-link group relative -mx-4 block overflow-hidden rounded-2xl px-4 py-9 transition-colors duration-300 active:bg-estora-bg-elevated lg:-mx-8 lg:px-8 lg:py-14"
                >
                  {/* Lime fill (GSAP controls its scale) */}
                  <span
                    className="svc-fill pointer-events-none absolute inset-0 bg-estora-accent"
                    style={{
                      transform: "scaleY(0)",
                      transformOrigin: "50% 100%",
                    }}
                    aria-hidden
                  />

                  <div className="relative z-10 grid items-center gap-6 lg:grid-cols-12 lg:gap-8">
                    {/* Number + icon */}
                    <div className="svc-fade reveal flex items-center gap-4 lg:col-span-2">
                      <span className="font-display text-sm font-semibold tabular-nums text-estora-text-muted transition-colors duration-500 group-hover:text-estora-bg/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-estora-accent transition-colors duration-500 group-hover:border-estora-bg/25 group-hover:text-estora-bg">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="svc-fade reveal lg:col-span-5">
                      <span className="svc-title block font-display text-[clamp(2rem,3.8vw,3.75rem)] font-medium leading-[1.02] tracking-tight text-estora-text-primary transition-colors duration-500 group-hover:text-estora-bg">
                        {service.title}
                      </span>
                    </h3>

                    {/* Description */}
                    <p className="svc-fade reveal max-w-md font-body text-base leading-relaxed text-estora-text-muted transition-colors duration-500 group-hover:text-estora-bg/75 lg:col-span-4 lg:text-[17px]">
                      {service.description}
                    </p>

                    {/* Arrow */}
                    <div className="svc-fade reveal flex justify-end lg:col-span-1">
                      <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/20 text-estora-text-primary transition-colors duration-500 group-hover:border-estora-bg group-hover:bg-estora-bg group-hover:text-estora-accent lg:h-16 lg:w-16">
                        <ArrowRight className="svc-arrow-a h-5 w-5" />
                        <ArrowRight
                          className="svc-arrow-b absolute h-5 w-5"
                          style={{ transform: "translateX(-44px)" }}
                          aria-hidden
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}

          {/* Bottom rule closes the list */}
          <span className="svc-end reveal block h-px w-full bg-white/15" />
        </div>
      </div>
    </section>
  );
}
