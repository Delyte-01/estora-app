"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { FINE_POINTER, attachFillButton } from "@/lib/gsap-ui";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const principles = [
  {
    number: "01",
    title: "Thoughtfully selected.",
    description:
      "Every property is chosen for its character, quality, and potential, not just its address.",
  },
  {
    number: "02",
    title: "Clearly presented.",
    description:
      "Honest descriptions, accurate details, and real photography so you can decide with confidence.",
  },
  {
    number: "03",
    title: "Built around your next move.",
    description:
      "Whether you are buying, renting, or investing, the focus stays on what comes next for you.",
  },
];

const copy =
  "ESTORA exists to make finding a property clearer, calmer, and more considered. We bring together homes, apartments, and investment opportunities in one curated space, so you can focus on the decision, not the search.";

export default function AboutSection() {
  const root = useRef<HTMLElement>(null);

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
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

        /* Header: eyebrow + masked headline lines */
        gsap
          .timeline({
            defaults: { ease: "hero" },
            scrollTrigger: { trigger: $(".about-head"), start: "top 80%", once: true },
          })
          .fromTo(
            ".about-eyebrow-rule",
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, ease: "heroInOut", transformOrigin: "0% 50%" },
            0
          )
          .fromTo(".about-eyebrow-text", { yPercent: 120 }, { yPercent: 0, duration: 1 }, 0.1)
          .fromTo(
            ".about-line",
            { yPercent: 115, rotate: 4 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 1.4,
              stagger: 0.12,
              transformOrigin: "0% 100%",
            },
            0.15
          );

        /* Image: curtain wipe, inner zoom settle, badge pop and count-up */
        const counter = { v: 0 };
        const badgeNum = $(".badge-num");
        badgeNum.textContent = "0";

        gsap
          .timeline({
            defaults: { ease: "hero" },
            scrollTrigger: { trigger: $(".about-media-wrap"), start: "top 80%", once: true },
          })
          .fromTo(
            ".about-media",
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.6,
              ease: "heroInOut",
              clearProps: "clipPath",
            },
            0
          )
          .fromTo(".about-img", { scale: 1.4 }, { scale: 1, duration: 2.2 }, 0)
          .fromTo(
            ".about-badge",
            { y: 50, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 1.1 },
            1
          )
          .to(
            counter,
            {
              v: 1200,
              duration: 2,
              ease: "power3.out",
              onUpdate: () => {
                badgeNum.textContent = `${Math.round(counter.v).toLocaleString("en-US")}+`;
              },
            },
            1.1
          );

        /* Image parallax while scrolling */
        gsap.fromTo(
          ".about-parallax",
          { yPercent: isDesktop ? -7 : -5 },
          {
            yPercent: isDesktop ? 7 : 5,
            ease: "none",
            scrollTrigger: {
              trigger: ".about-media-wrap",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        /* Paragraph: words light up as you scroll through it */
        gsap.fromTo(
          $$(".word"),
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: ".about-copy",
              start: "top 85%",
              end: "bottom 55%",
              scrub: true,
            },
          }
        );

        /* CTA */
        gsap.fromTo(
          ".about-cta",
          { y: 30, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: "hero",
            scrollTrigger: { trigger: ".about-cta", start: "top 92%", once: true },
          }
        );

        /* Principles: rules draw across, content rises */
        gsap
          .timeline({
            defaults: { ease: "hero" },
            scrollTrigger: { trigger: $(".principles"), start: "top 85%", once: true },
          })
          .fromTo(
            $$(".p-rule"),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.3,
              stagger: 0.12,
              ease: "heroInOut",
              transformOrigin: "0% 50%",
            },
            0
          )
          .fromTo(
            $$(".p-fade"),
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.07 },
            0.25
          );

        // Everything is in its start state, so it's safe to reveal the section
        el.setAttribute("data-ready", "");
        return () => el.removeAttribute("data-ready");
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        $(".badge-num").textContent = "1,200+";
        el.setAttribute("data-ready", "");
        return () => el.removeAttribute("data-ready");
      });

      /* ---------------- Hover effects (mouse devices only) ---------------- */
      const mmPointer = gsap.matchMedia();
      mmPointer.add(FINE_POINTER, () => {
        const cleanups: Array<() => void> = [];

        // CTA: magnetic, cursor-origin fill, label/arrow swap
        const cta = el.querySelector<HTMLElement>(".about-cta");
        if (cta) cleanups.push(attachFillButton(cta, 0.3));

        // Principles: dark line fills in, content nudges right
        $$(".principle").forEach((item) => {
          const fill = item.querySelector<HTMLElement>(".p-fill")!;
          const num = item.querySelector<HTMLElement>(".p-num")!;
          const title = item.querySelector<HTMLElement>(".p-title")!;

          const enter = () => {
            gsap.set(fill, { transformOrigin: "0% 50%" });
            gsap.to(fill, { scaleX: 1, duration: 0.9, ease: "hero", overwrite: true });
            gsap.to([num, title], { x: 10, duration: 0.7, ease: "hero", stagger: 0.04, overwrite: true });
          };
          const leave = () => {
            gsap.set(fill, { transformOrigin: "100% 50%" });
            gsap.to(fill, { scaleX: 0, duration: 0.7, ease: "heroInOut", overwrite: true });
            gsap.to([num, title], { x: 0, duration: 0.7, ease: "hero", overwrite: true });
          };

          item.addEventListener("pointerenter", enter);
          item.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            item.removeEventListener("pointerenter", enter);
            item.removeEventListener("pointerleave", leave);
            gsap.killTweensOf([fill, num, title]);
          });
        });

        return () => cleanups.forEach((fn) => fn());
      });

      return () => {
        mm.revert();
        mmPointer.revert();
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="about"
      className="relative scroll-mt-20 overflow-hidden bg-estora-ivory"
    >
      {/* Hide animated parts until GSAP has set their start state (prevents flash) */}
      <style>{`#about:not([data-ready]) .reveal{opacity:0}`}</style>

      <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-36">
        {/* ------------------------------ Header ------------------------------ */}
        <div className="about-head">
          <div className="flex items-center gap-4">
            <span className="about-eyebrow-rule reveal h-px w-14 bg-estora-text-dark/60" />
            <span className="block overflow-hidden">
              <span className="about-eyebrow-text reveal block font-body text-xs font-medium uppercase tracking-[0.3em] text-estora-text-dark/60 lg:text-[13px]">
                Beyond the address
              </span>
            </span>
          </div>

          <h2 className="mt-6 font-display text-[clamp(2.5rem,8.5vw,8rem)] font-medium leading-[0.95] tracking-[-0.04em] text-estora-text-dark">
            {["A better way to", "find your place", "in the world."].map(
              (line, i) => (
                <span
                  key={line}
                  className="-my-[0.12em] block overflow-hidden whitespace-nowrap py-[0.12em] pr-[0.1em]"
                >
                  <span className="about-line reveal inline-block will-change-transform">
                    {i === 1 ? (
                      <>
                        find your{" "}
                        <span className="font-light italic text-estora-text-dark/40">
                          place
                        </span>
                      </>
                    ) : (
                      line
                    )}
                  </span>
                </span>
              )
            )}
          </h2>
        </div>

        {/* ------------------------------ Body ------------------------------- */}
        <div className="mt-14 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* Image */}
          <div className="about-media-wrap relative lg:col-span-5">
            <div className="about-media reveal relative h-[420px] overflow-hidden rounded-3xl sm:h-[540px] lg:h-[680px]">
              <div className="about-parallax absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
                <div className="about-img absolute inset-0 will-change-transform">
                  <Image
                    src="https://images.pexels.com/photos/7031604/pexels-photo-7031604.jpeg?auto=compress&cs=tinysrgb&h=1200&w=940"
                    alt="Exterior of contemporary residential house with panoramic windows and green lawn"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating badge (placeholder figure, swap for your real number) */}
            <div className="about-badge reveal absolute -bottom-6 left-4 rounded-2xl bg-estora-bg px-6 py-5 shadow-2xl shadow-black/20 lg:-left-8">
              <p className="font-display text-4xl font-medium tabular-nums tracking-tight text-estora-text-primary">
                <span className="badge-num">1,200+</span>
              </p>
              <p className="mt-1 font-body text-[11px] uppercase tracking-[0.2em] text-estora-text-muted">
                Properties curated
              </p>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col justify-between gap-10 lg:col-span-7 lg:gap-12 lg:pb-6 lg:pl-8 lg:pt-4">
            <p
              className="about-copy reveal font-display text-[1.65rem] font-normal leading-[1.3] tracking-tight text-estora-text-dark sm:text-3xl lg:text-[2.6rem] lg:leading-[1.25]"
              aria-label={copy}
            >
              {copy.split(" ").map((w, i) => (
                <span key={i} aria-hidden>
                  <span className="word inline-block">{w}</span>{" "}
                </span>
              ))}
            </p>

            <div>
              <Link
                href="#approach"
                className="about-cta reveal group relative inline-flex items-center gap-4 overflow-hidden whitespace-nowrap rounded-full bg-estora-bg py-2 pl-8 pr-2 font-display text-base font-medium text-estora-text-primary transition-[scale] duration-200 active:scale-[0.97]"
              >
                <span
                  data-fill
                  className="pointer-events-none absolute rounded-full bg-estora-accent"
                  style={{ transform: "scale(0)" }}
                  aria-hidden
                />
                <span
                  data-label
                  className="relative z-10 block overflow-hidden whitespace-nowrap"
                >
                  <span className="block">See our approach</span>
                  <span
                    className="absolute left-0 top-full block text-estora-bg"
                    aria-hidden
                  >
                    See our approach
                  </span>
                </span>
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-estora-text-primary text-estora-bg">
                  <ArrowRight data-arrow-a className="h-5 w-5" />
                  <ArrowRight
                    data-arrow-b
                    className="absolute h-5 w-5"
                    style={{ transform: "translateX(-40px)" }}
                    aria-hidden
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ---------------------------- Principles ---------------------------- */}
        <div className="principles mt-24 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:mt-36 lg:gap-12">
          {principles.map((p) => (
            <div key={p.number} className="principle relative pt-6 lg:pt-8">
              {/* Rules: the base line draws in, the dark line fills on hover */}
              <span className="p-rule reveal absolute left-0 top-0 h-px w-full bg-estora-text-dark/20" />
              <span
                className="p-fill absolute left-0 top-0 h-px w-full bg-estora-text-dark"
                style={{ transform: "scaleX(0)", transformOrigin: "0% 50%" }}
              />

              <span className="p-num p-fade reveal block font-display text-sm font-semibold tabular-nums text-estora-text-dark/40">
                {p.number}
              </span>
              <h3 className="p-title p-fade reveal mt-4 font-display text-2xl font-medium leading-snug tracking-tight text-estora-text-dark lg:text-[1.75rem]">
                {p.title}
              </h3>
              <p className="p-fade reveal mt-3 max-w-sm font-body text-sm leading-relaxed text-estora-text-dark/65 lg:text-base">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}