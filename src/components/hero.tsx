"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowDown, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase);

const stats = [
  {
    to: 1200,
    prefix: "",
    suffix: "+",
    decimals: 0,
    label: "Properties curated",
  },
  {
    to: 15,
    prefix: "",
    suffix: " yrs",
    decimals: 0,
    label: "Market experience",
  },
  { to: 2.4, prefix: "$", suffix: "B", decimals: 1, label: "Total value sold" },
  {
    to: 98,
    prefix: "",
    suffix: "%",
    decimals: 0,
    label: "Client satisfaction",
  },
];

const formatStat = (
  n: number,
  decimals: number,
  prefix: string,
  suffix: string,
) =>
  `${prefix}${n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;

/* -------------------------------------------------------------------------- */
/*  Hover + pointer interactions (fine pointers only, so never runs on touch)  */
/* -------------------------------------------------------------------------- */
function setupInteractions(root: HTMLElement) {
  const cleanups: Array<() => void> = [];
  const targets: Element[] = [];

  const listen = (
    target: HTMLElement,
    type: string,
    fn: (e: PointerEvent) => void,
  ) => {
    target.addEventListener(type, fn as EventListener);
    cleanups.push(() => target.removeEventListener(type, fn as EventListener));
  };

  /* ---- Primary button: magnetic + cursor-origin fill + label/arrow swap ---- */
  const btn = root.querySelector<HTMLElement>(".btn-primary");
  if (btn) {
    const fill = btn.querySelector<HTMLElement>(".btn-fill")!;
    const labels = btn.querySelectorAll<HTMLElement>(".btn-label > span");
    const arrowA = btn.querySelector<HTMLElement>(".arrow-a")!;
    const arrowB = btn.querySelector<HTMLElement>(".arrow-b")!;
    targets.push(btn, fill, arrowA, arrowB, ...Array.from(labels));

    let rect = btn.getBoundingClientRect();

    listen(btn, "pointerenter", (e) => {
      rect = btn.getBoundingClientRect();
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
      gsap.to(labels, {
        yPercent: -100,
        duration: 0.6,
        ease: "hero",
        overwrite: true,
      });
      gsap.to(arrowA, { x: 40, duration: 0.6, ease: "hero", overwrite: true });
      gsap.to(arrowB, { x: 0, duration: 0.6, ease: "hero", overwrite: true });
    });

    listen(btn, "pointermove", (e) => {
      const curX = gsap.getProperty(btn, "x") as number;
      const curY = gsap.getProperty(btn, "y") as number;
      const cx = rect.left - curX + rect.width / 2;
      const cy = rect.top - curY + rect.height / 2;
      gsap.to(btn, {
        x: (e.clientX - cx) * 0.3,
        y: (e.clientY - cy) * 0.4,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    });

    listen(btn, "pointerleave", () => {
      gsap.to(btn, {
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
      gsap.to(arrowB, { x: -40, duration: 0.6, ease: "hero", overwrite: true });
    });
  }

  /* ---- Secondary link: underline wipe + arrow swap ---- */
  const link = root.querySelector<HTMLElement>(".btn-link");
  if (link) {
    const line = link.querySelector<HTMLElement>(".link-line")!;
    const arrowA = link.querySelector<HTMLElement>(".link-arrow-a")!;
    const arrowB = link.querySelector<HTMLElement>(".link-arrow-b")!;
    targets.push(line, arrowA, arrowB);

    listen(link, "pointerenter", () => {
      gsap.set(line, { transformOrigin: "0% 50%" });
      gsap.to(line, {
        scaleX: 1,
        duration: 0.7,
        ease: "hero",
        overwrite: true,
      });
      gsap.to(arrowA, { y: 20, duration: 0.5, ease: "hero", overwrite: true });
      gsap.to(arrowB, { y: 0, duration: 0.5, ease: "hero", overwrite: true });
    });
    listen(link, "pointerleave", () => {
      gsap.set(line, { transformOrigin: "100% 50%" });
      gsap.to(line, {
        scaleX: 0,
        duration: 0.6,
        ease: "heroInOut",
        overwrite: true,
      });
      gsap.to(arrowA, { y: 0, duration: 0.5, ease: "hero", overwrite: true });
      gsap.to(arrowB, { y: -20, duration: 0.5, ease: "hero", overwrite: true });
    });
  }

  /* ---- Featured card: lift + arrow button spin ---- */
  const card = root.querySelector<HTMLElement>(".feat-card");
  if (card) {
    targets.push(card);
    listen(card, "pointerenter", () =>
      gsap.to(card, { y: -8, duration: 0.7, ease: "hero", overwrite: "auto" }),
    );
    listen(card, "pointerleave", () =>
      gsap.to(card, { y: 0, duration: 0.7, ease: "hero", overwrite: "auto" }),
    );
  }

  /* ---- Mouse parallax: photo drifts opposite, card drifts with the cursor ---- */
  const imgMouse = root.querySelector<HTMLElement>(".img-mouse");
  const featWrap = root.querySelector<HTMLElement>(".feat-wrap");
  if (imgMouse && featWrap) {
    targets.push(imgMouse, featWrap);
    const imgX = gsap.quickTo(imgMouse, "x", {
      duration: 1.4,
      ease: "power3.out",
    });
    const imgY = gsap.quickTo(imgMouse, "y", {
      duration: 1.4,
      ease: "power3.out",
    });
    const cardX = gsap.quickTo(featWrap, "x", {
      duration: 1.1,
      ease: "power3.out",
    });
    const cardY = gsap.quickTo(featWrap, "y", {
      duration: 1.1,
      ease: "power3.out",
    });

    listen(root, "pointermove", (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      imgX(nx * -36);
      imgY(ny * -24);
      cardX(nx * 18);
      cardY(ny * 12);
    });
    listen(root, "pointerleave", () => {
      imgX(0);
      imgY(0);
      cardX(0);
      cardY(0);
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
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      // Custom eases: an expo-out for reveals and a sharp in-out for wipes
      CustomEase.create("hero", "0.16, 1, 0.3, 1");
      CustomEase.create("heroInOut", "0.76, 0, 0.24, 1");

      const $ = (s: string) => el.querySelector<HTMLElement>(s)!;
      const $$ = (s: string) =>
        gsap.utils.toArray<HTMLElement>(el.querySelectorAll(s));

      /* ---------- Intro + scroll (re-runs only if reduced-motion toggles) ---------- */
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduce } = (context.conditions ?? {}) as { reduce?: boolean };

          if (reduce) {
            el.setAttribute("data-ready", "");
            return () => el.removeAttribute("data-ready");
          }

          const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
          const media = $(".media");

          const tl = gsap.timeline({ defaults: { ease: "hero" }, delay: 0.15 });
          tl.timeScale(isDesktop ? 1 : 1.15);

          /* Photo: starts as a small arch in the centre, then opens to full screen */
          const archInset = isDesktop ? "14% 35% 14% 35%" : "16% 18% 16% 18%";
          tl.fromTo(
            media,
            { clipPath: `inset(${archInset} round 999px 999px 0px 0px)` },
            {
              clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
              duration: 2.1,
              ease: "heroInOut",
              clearProps: "clipPath",
            },
            0,
          ).fromTo(
            $(".img-mouse"),
            { scale: 1.65 },
            { scale: 1.1, duration: 2.6 },
            0,
          );

          /* Eyebrow */
          tl.fromTo(
            $(".eyebrow-rule"),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "heroInOut",
              transformOrigin: "0% 50%",
            },
            0.9,
          ).fromTo(
            $(".eyebrow-text"),
            { yPercent: 120 },
            { yPercent: 0, duration: 1 },
            1.0,
          );

          /* Headline: masked line reveal with a slight rotation */
          tl.fromTo(
            $$(".headline-line"),
            { yPercent: 125, rotate: 5 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 1.4,
              stagger: 0.12,
              transformOrigin: "0% 100%",
            },
            1.0,
          );

          /* Copy + CTAs */
          tl.fromTo(
            $(".hero-copy"),
            { y: 32, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1 },
            1.5,
          ).fromTo(
            $$(".hero-cta"),
            { y: 28, opacity: 0, scale: 0.94 },
            { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.1 },
            1.65,
          );

          /* Featured card */
          tl.fromTo(
            $(".feat-card"),
            { y: 70, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.3 },
            1.7,
          );

          /* Stats bar + count-up */
          tl.fromTo(
            $(".stats-bar"),
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2 },
            1.9,
          ).fromTo(
            $$(".stat"),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
            2.05,
          );

          $$(".stat-num").forEach((num) => {
            const to = Number(num.dataset.to);
            const dec = Number(num.dataset.dec);
            const prefix = num.dataset.prefix ?? "";
            const suffix = num.dataset.suffix ?? "";
            const counter = { v: 0 };
            num.textContent = formatStat(0, dec, prefix, suffix);
            tl.to(
              counter,
              {
                v: to,
                duration: 2.2,
                ease: "power3.out",
                onUpdate: () => {
                  num.textContent = formatStat(counter.v, dec, prefix, suffix);
                },
              },
              2.1,
            );
          });

          /* Scroll cue (desktop only element, harmless if hidden) */
          tl.fromTo(
            $(".cue"),
            { opacity: 0 },
            { opacity: 1, duration: 1 },
            2.4,
          );
          gsap
            .timeline({
              repeat: -1,
              defaults: { duration: 1.1, ease: "power2.inOut" },
            })
            .fromTo(
              $(".cue-line"),
              { scaleY: 0, transformOrigin: "50% 0%" },
              { scaleY: 1 },
            )
            .set($(".cue-line"), { transformOrigin: "50% 100%" })
            .to($(".cue-line"), { scaleY: 0 });

          // Every animated element is now in its start state, safe to reveal
          el.setAttribute("data-ready", "");

          /* Scroll: photo shrinks into a rounded card, content drifts up and fades */
          gsap.to(media, {
            scale: isDesktop ? 0.9 : 0.94,
            borderRadius: isDesktop ? 48 : 28,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.to($(".img-scroll"), {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.to($(".hero-content"), {
            y: -70,
            opacity: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "70% top",
              scrub: true,
            },
          });

          return () => el.removeAttribute("data-ready");
        },
      );

      /* ---------- Hover effects: mouse devices only ---------- */
      const mmPointer = gsap.matchMedia();
      mmPointer.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => setupInteractions(el),
      );

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
      id="top"
      className="relative box-border flex min-h-svh flex-col overflow-hidden bg-estora-bg lg:h-svh lg:min-h-[680px]"
    >
      {/* Hide animated parts until GSAP has set their start state (prevents flash) */}
      <style>{`#top:not([data-ready]) .reveal,#top:not([data-ready]) .line-inner,#top:not([data-ready]) .media{opacity:0}`}</style>

      {/* ------------------------- Full-bleed photo ------------------------- */}
      <div className="media reveal absolute inset-0 overflow-hidden will-change-transform">
        <div className="img-scroll absolute inset-0">
          <div className="img-mouse absolute inset-0 will-change-transform">
            <Image
              src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&h=1400&w=2000"
              alt="Contemporary luxury home with glass balconies showcasing modern architectural design"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[70%_50%] lg:object-center"
            />
          </div>
        </div>
        {/* Readability overlays: bottom + left, so text always wins over the sky */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-estora-bg via-estora-bg/30 to-estora-bg/40" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-estora-bg/80 via-estora-bg/20 to-transparent" />
      </div>

      {/* ------------------------------ Content ----------------------------- */}
      <div className="hero-content relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-6 pb-6 pt-28 lg:min-h-0 lg:px-12 lg:pb-8 lg:pt-24">
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left: text */}
          <div className="flex flex-col gap-6 lg:col-span-8 lg:gap-[clamp(1.25rem,3.5vh,2.5rem)]">
            {/* Eyebrow */}
            <div className="flex items-center gap-4">
              <span className="eyebrow-rule reveal h-px w-14 bg-estora-accent" />
              <span className="block overflow-hidden">
                <span className="eyebrow-text line-inner block font-body text-xs font-medium uppercase tracking-[0.3em] text-estora-accent lg:text-[13px]">
                  Property, reimagined
                </span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display  text-[clamp(3rem,min(16vh,9vw),10rem)] font-medium leading-[0.92] tracking-[-0.04em] text-estora-text-primary">
              <span className="-my-[0.12em] block overflow-hidden whitespace-nowrap py-[0.12em] pr-[0.1em]">
                <span className="headline-line line-inner inline-block will-change-transform">
                  Spaces that
                </span>
              </span>
              <span className="-my-[0.12em] block overflow-hidden whitespace-nowrap py-[0.12em] pr-[0.1em]">
                <span className="headline-line line-inner inline-block will-change-transform">
                  <span className="font-light italic text-estora-accent">
                    move
                  </span>{" "}
                  you.
                </span>
              </span>
            </h1>

            {/* Copy + CTAs */}
            <div className="flex flex-col gap-6 lg:gap-8">
              <p className="hero-copy reveal max-w-md font-body text-lg leading-relaxed text-estora-text-primary/80 lg:max-w-lg lg:text-xl">
                Exceptional properties. Remarkable possibilities. Find your next
                place to live, invest, and grow.
              </p>

              <div className="flex w-fit max-w-full flex-col items-start gap-5 rounded-3xl border border-estora-bg/20 px-5 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-8 sm:rounded-full sm:px-6 sm:py-3 lg:px-8 lg:py-4">
                {/* Primary */}
                <Link
                  href="/properties"
                  className="btn-primary hero-cta reveal group relative inline-flex shrink-0 items-center gap-4 overflow-hidden whitespace-nowrap rounded-full bg-estora-accent py-2 pl-8 pr-2 font-display text-base font-medium text-estora-bg transition-[scale] duration-200 active:scale-[0.97]"
                >
                  <span
                    className="btn-fill pointer-events-none absolute rounded-full bg-estora-text-primary"
                    style={{ transform: "scale(0)" }}
                    aria-hidden
                  />
                  <span className="btn-label relative z-10 block overflow-hidden whitespace-nowrap">
                    <span className="block">Explore Properties</span>
                    <span
                      className="absolute left-0 top-full block"
                      aria-hidden
                    >
                      Explore Properties
                    </span>
                  </span>
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-estora-bg text-estora-accent">
                    <ArrowRight className="arrow-a h-5 w-5" />
                    <ArrowRight
                      className="arrow-b absolute h-5 w-5"
                      style={{ transform: "translateX(-40px)" }}
                      aria-hidden
                    />
                  </span>
                </Link>

                {/* Secondary */}
                <Link
                  href="#approach"
                  className="btn-link hero-cta reveal relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap pb-2 font-display text-base font-medium text-estora-text-primary"
                >
                  <span>Discover our approach</span>
                  <span className="relative flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden">
                    <ArrowDown className="link-arrow-a h-4 w-4 text-estora-accent" />
                    <ArrowDown
                      className="link-arrow-b absolute h-4 w-4 text-estora-accent"
                      style={{ transform: "translateY(-20px)" }}
                      aria-hidden
                    />
                  </span>
                  <span className="absolute bottom-0 left-0 h-px w-full bg-estora-text-primary/30" />
                  <span
                    className="link-line absolute bottom-0 left-0 h-px w-full bg-estora-accent"
                    style={{
                      transform: "scaleX(0)",
                      transformOrigin: "0% 50%",
                    }}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: featured card */}
          <div className="feat-wrap w-full sm:max-w-sm lg:col-span-4 lg:justify-self-end">
            <Link
              href="/properties"
              className="feat-card reveal group flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-estora-bg/50 p-5 backdrop-blur-xl transition-colors duration-300 hover:border-estora-accent/50"
            >
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.25em] text-estora-accent">
                  Featured
                </p>
                <p className="mt-1.5 font-display text-xl font-medium leading-tight text-estora-text-primary">
                  The Glass Residence
                </p>
                <p className="mt-1 font-body text-sm text-estora-text-muted">
                  5 bed · 6 bath · From $2.8M
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-estora-text-primary transition-all duration-300 group-hover:border-estora-accent group-hover:bg-estora-accent group-hover:text-estora-bg">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Stats: glass bar */}
        <dl className="stats-bar reveal mt-6 grid shrink-0 grid-cols-2 rounded-2xl border border-white/10 bg-estora-bg/40 backdrop-blur-xl md:grid-cols-4 lg:mt-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`stat reveal flex flex-col gap-1 px-5 py-4 lg:flex-row lg:items-baseline lg:gap-3 lg:px-8 ${
                i % 2 !== 0 ? "border-l border-white/10" : ""
              } ${i >= 2 ? "border-t border-white/10 md:border-t-0" : ""} ${
                i !== 0 ? "md:border-l md:border-white/10" : ""
              }`}
            >
              <dd
                className="stat-num font-display text-2xl font-medium tabular-nums tracking-tight text-estora-text-primary lg:text-3xl"
                data-to={s.to}
                data-dec={s.decimals}
                data-prefix={s.prefix}
                data-suffix={s.suffix}
              >
                {formatStat(s.to, s.decimals, s.prefix, s.suffix)}
              </dd>
              <dt className="font-body text-xs uppercase tracking-[0.18em] text-estora-text-muted">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Scroll cue */}
      <div className="cue reveal pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 xl:flex lg:right-10">
        <span className="font-body text-[10px] uppercase tracking-[0.35em] text-estora-text-primary/70 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="relative h-16 w-px bg-white/20">
          <span className="cue-line absolute inset-0 bg-estora-accent" />
        </span>
      </div>
    </section>
  );
}
