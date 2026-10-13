"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Check,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

import { type Property, formatPriceFull, formatPrice } from "@/data/properties";
import { getWhatsAppUrl } from "@/config/site";
import PropertyGallery from "@/components/propertyGallery";
import PropertyCard from "@/components/propertyCard";
import { FINE_POINTER, attachFillButton } from "@/lib/gsap-ui";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PropertyDetail({
  property,
  related,
}: {
  property: Property;
  related: Property[];
}) {
  const root = useRef<HTMLElement>(null);

  const isBuy = property.listingType === "buy";
  const words = property.title.split(" ");

  const specs: { Icon: LucideIcon; value: number; label: string }[] = [];
  if (property.bedrooms !== null)
    specs.push({ Icon: Bed, value: property.bedrooms, label: "Bedrooms" });
  if (property.bathrooms !== null)
    specs.push({ Icon: Bath, value: property.bathrooms, label: "Bathrooms" });
  if (property.area !== null)
    specs.push({ Icon: Maximize, value: property.area, label: "m²" });

  const whatsappUrl = getWhatsAppUrl(
    `Hello ESTORA, I'm interested in ${property.title} at ${property.location}. The price is ${formatPrice(property.price, property.listingType)}.`,
  );

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const $$ = (s: string) =>
        gsap.utils.toArray<HTMLElement>(el.querySelectorAll(s));

      const mm = gsap.matchMedia();

      /* ---------------- Intro + scroll reveals ---------------- */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

        // Intro: breadcrumb, badges, title words, location
        gsap
          .timeline({ defaults: { ease: "hero" }, delay: 0.2 })
          .fromTo(
            ".pd-crumb",
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            0,
          )
          .fromTo(
            ".pd-badge",
            { y: 20, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.08 },
            0.1,
          )
          .fromTo(
            ".pd-word",
            { yPercent: 120, rotate: 4 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 1.3,
              stagger: 0.06,
              transformOrigin: "0% 100%",
            },
            0.2,
          )
          .fromTo(
            ".pd-loc",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            0.8,
          );

        // Summary card: rises in, rules draw, spec numbers count up.
        // On desktop it's already on screen at load, so it waits for the title.
        const o = isDesktop ? 1 : 0;
        const summaryTl = gsap
          .timeline({
            defaults: { ease: "hero" },
            scrollTrigger: {
              trigger: ".summary",
              start: "top 90%",
              once: true,
            },
          })
          .fromTo(
            ".summary-card",
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.3 },
            o,
          )
          .fromTo(
            $$(".s-fade"),
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.08 },
            o + 0.2,
          )
          .fromTo(
            $$(".s-rule"),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "heroInOut",
              stagger: 0.1,
              transformOrigin: "0% 50%",
            },
            o + 0.3,
          );

        $$(".spec-num").forEach((num) => {
          const to = Number(num.dataset.to);
          const counter = { v: 0 };
          num.textContent = "0";
          summaryTl.to(
            counter,
            {
              v: to,
              duration: 1.6,
              ease: "power3.out",
              onUpdate: () => {
                num.textContent = String(Math.round(counter.v));
              },
              onComplete: () => {
                num.textContent = String(to);
              },
            },
            o + 0.5,
          );
        });

        // Description + features
        gsap
          .timeline({
            defaults: { ease: "hero" },
            scrollTrigger: {
              trigger: ".desc-wrap",
              start: "top 80%",
              once: true,
            },
          })
          .fromTo(
            ".d-rule",
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "heroInOut",
              stagger: 0.08,
              transformOrigin: "0% 50%",
            },
            0,
          )
          .fromTo(
            ".d-fade",
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, stagger: 0.07 },
            0.15,
          );

        // Related
        if (el.querySelector(".related")) {
          gsap
            .timeline({
              defaults: { ease: "hero" },
              scrollTrigger: {
                trigger: ".rel-head",
                start: "top 82%",
                once: true,
              },
            })
            .fromTo(
              ".rel-rule",
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
              ".rel-eyebrow",
              { yPercent: 120 },
              { yPercent: 0, duration: 1 },
              0.1,
            )
            .fromTo(
              ".rel-line",
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
              ".rel-link",
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 1 },
              0.6,
            );

          const cards = $$(".related .prop-card");
          if (cards.length) {
            const imgs = cards.map((c) =>
              c.querySelector<HTMLElement>(".card-img"),
            );
            gsap.set(cards, { y: 70, opacity: 0 });
            gsap.set(imgs, { scale: 1.25 });

            ScrollTrigger.batch(cards, {
              start: "top 90%",
              once: true,
              onEnter: (batch) => {
                gsap.to(batch, {
                  y: 0,
                  opacity: 1,
                  duration: 1.2,
                  ease: "hero",
                  stagger: 0.12,
                  overwrite: true,
                });
                gsap.to(
                  batch.map((c) => c.querySelector(".card-img")),
                  {
                    scale: 1,
                    duration: 1.8,
                    ease: "hero",
                    stagger: 0.12,
                    overwrite: "auto",
                  },
                );
              },
            });
          }
        }

        // Everything is in its start state, so it's safe to reveal the page
        el.setAttribute("data-ready", "");
        return () => el.removeAttribute("data-ready");
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        el.setAttribute("data-ready", "");
        return () => el.removeAttribute("data-ready");
      });

      /* ---------------- Mobile enquiry bar: slides up while the summary card is off screen ---------------- */
      const mmBar = gsap.matchMedia();
      mmBar.add("(max-width: 1023px)", () => {
        const bar = el.querySelector<HTMLElement>(".m-bar");
        if (!bar) return;

        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const s = { past: false, summary: false, end: false, shown: false };

        gsap.set(bar, { yPercent: 100 });

        const sync = () => {
          const show = s.past && !s.summary && !s.end;
          if (show === s.shown) return;
          s.shown = show;
          gsap.to(bar, {
            yPercent: show ? 0 : 100,
            autoAlpha: show ? 1 : 0,
            duration: reduce ? 0 : 0.7,
            ease: "hero",
            overwrite: true,
          });
        };

        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const y = self.scroll();
            s.past = y > 500;
            s.end = ScrollTrigger.maxScroll(window) - y < 700;
            sync();
          },
        });
        ScrollTrigger.create({
          trigger: ".summary",
          start: "top 90%",
          end: "bottom 10%",
          onToggle: (self) => {
            s.summary = self.isActive;
            sync();
          },
        });
      });

      /* ---------------- Hover effects (mouse devices only) ---------------- */
      const mmPointer = gsap.matchMedia();
      mmPointer.add(FINE_POINTER, () => {
        const cleanups: Array<() => void> = [];

        $$(".fill-btn").forEach((btn) =>
          cleanups.push(attachFillButton(btn, 0.3)),
        );

        // Underline-wipe links
        $$(".uline").forEach((link) => {
          const line = link.querySelector<HTMLElement>(".uline-line");
          if (!line) return;
          const enter = () => {
            gsap.set(line, { transformOrigin: "0% 50%" });
            gsap.to(line, {
              scaleX: 1,
              duration: 0.7,
              ease: "hero",
              overwrite: true,
            });
          };
          const leave = () => {
            gsap.set(line, { transformOrigin: "100% 50%" });
            gsap.to(line, {
              scaleX: 0,
              duration: 0.6,
              ease: "heroInOut",
              overwrite: true,
            });
          };
          link.addEventListener("pointerenter", enter);
          link.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            link.removeEventListener("pointerenter", enter);
            link.removeEventListener("pointerleave", leave);
            gsap.killTweensOf(line);
          });
        });

        return () => cleanups.forEach((fn) => fn());
      });

      return () => {
        mm.revert();
        mmBar.revert();
        mmPointer.revert();
      };
    },
    { scope: root },
  );

  return (
    <main ref={root} id="prop-detail" className="min-h-svh bg-estora-bg">
      {/* Hide animated parts until GSAP has set their start state (prevents flash) */}
      <style>{`#prop-detail:not([data-ready]) .reveal{opacity:0}`}</style>

      {/* ------------------------------- Title block ------------------------------- */}
      <section className="mx-auto max-w-[1600px] px-6 pb-10 pt-28 lg:px-12 lg:pb-14 lg:pt-36">
        <nav
          aria-label="Breadcrumb"
          className="pd-crumb reveal mb-8 flex items-center gap-1.5 font-body text-xs text-estora-text-muted lg:mb-12"
        >
          <Link
            href="/"
            className="transition-colors duration-300 hover:text-estora-accent"
          >
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href="/properties"
            className="transition-colors duration-300 hover:text-estora-accent"
          >
            Properties
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="max-w-[9rem] truncate text-estora-text-primary sm:max-w-xs">
            {property.title}
          </span>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`pd-badge reveal inline-flex items-center rounded-full px-4 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.15em] ${
              isBuy
                ? "bg-estora-accent text-estora-bg"
                : "bg-estora-text-primary text-estora-bg"
            }`}
          >
            {isBuy ? "For sale" : "For rent"}
          </span>
          <span className="pd-badge reveal inline-flex items-center rounded-full border border-white/20 px-4 py-1.5 font-body text-[11px] font-medium uppercase tracking-[0.15em] text-estora-text-muted">
            {property.propertyType}
          </span>
        </div>

        <h1 className="mt-6 max-w-5xl font-display text-[clamp(2.25rem,6.2vw,6rem)] font-medium leading-[0.98] tracking-[-0.035em] text-estora-text-primary">
          {words.map((word, i) => {
            const last = i === words.length - 1 && words.length > 1;
            return (
              <span key={i}>
                <span className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] pr-[0.05em] align-bottom">
                  <span
                    className={`pd-word reveal inline-block will-change-transform ${
                      last ? "font-light italic text-estora-accent" : ""
                    }`}
                  >
                    {word}
                  </span>
                </span>{" "}
              </span>
            );
          })}
        </h1>

        <p className="pd-loc reveal mt-6 flex items-center gap-2 font-body text-base text-estora-text-muted lg:text-lg">
          <MapPin className="h-4 w-4 shrink-0 text-estora-accent" />
          {property.location}
        </p>
      </section>

      {/* --------------------------- Gallery + summary card --------------------------- */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-14">
          <PropertyGallery images={property.gallery} alt={property.alt} />

          <aside className="summary lg:sticky lg:top-28 lg:self-start">
            <div className="summary-card reveal rounded-3xl border border-white/10 bg-estora-bg-elevated/70 p-6 backdrop-blur-xl sm:p-8">
              <p className="s-fade reveal font-body text-[11px] uppercase tracking-[0.25em] text-estora-text-muted">
                Price
              </p>
              <p className="s-fade reveal mt-3 font-display text-4xl font-medium tracking-tight text-estora-text-primary lg:text-5xl">
                {formatPriceFull(property.price, property.listingType)}
              </p>

              {specs.length > 0 && (
                <>
                  <span className="s-rule reveal mt-8 block h-px w-full bg-white/15" />
                  <div
                    className="grid py-6"
                    style={{
                      gridTemplateColumns: `repeat(${specs.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {specs.map(({ Icon, value, label }, i) => (
                      <div
                        key={label}
                        className={`s-fade reveal flex flex-col items-center text-center ${
                          i > 0 ? "border-l border-white/10" : ""
                        }`}
                      >
                        <Icon className="mb-3 h-5 w-5 text-estora-accent" />
                        <span
                          className="spec-num font-display text-3xl font-medium tabular-nums tracking-tight text-estora-text-primary"
                          data-to={value}
                        >
                          {value}
                        </span>
                        <span className="mt-1 font-body text-[11px] uppercase tracking-[0.18em] text-estora-text-muted">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="s-rule reveal block h-px w-full bg-white/15" />
                </>
              )}

              <div className="mt-8 flex flex-col gap-5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fill-btn s-fade reveal group relative flex w-full items-center justify-between gap-4 overflow-hidden whitespace-nowrap rounded-full bg-estora-accent py-2 pl-8 pr-2 font-display text-base font-medium text-estora-bg transition-[scale] duration-200 active:scale-[0.97]"
                >
                  <span
                    data-fill
                    className="pointer-events-none absolute rounded-full bg-estora-text-primary"
                    style={{ transform: "scale(0)" }}
                    aria-hidden
                  />
                  <span
                    data-label
                    className="relative z-10 block overflow-hidden whitespace-nowrap"
                  >
                    <span className="block">Enquire on WhatsApp</span>
                    <span
                      className="absolute left-0 top-full block"
                      aria-hidden
                    >
                      Enquire on WhatsApp
                    </span>
                  </span>
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-estora-bg text-estora-accent">
                    <MessageCircle data-arrow-a className="h-5 w-5" />
                    <MessageCircle
                      data-arrow-b
                      className="absolute h-5 w-5"
                      style={{ transform: "translateX(-40px)" }}
                      aria-hidden
                    />
                  </span>
                </a>

                <Link
                  href="/properties"
                  className="uline s-fade reveal group relative inline-flex items-center gap-2 self-center pb-1.5 font-display text-sm font-medium text-estora-text-primary"
                >
                  <ArrowLeft className="h-4 w-4 text-estora-accent transition-transform duration-500 group-hover:-translate-x-1" />
                  Back to Properties
                  <span className="absolute bottom-0 left-0 h-px w-full bg-white/25" />
                  <span
                    className="uline-line absolute bottom-0 left-0 h-px w-full bg-estora-accent"
                    style={{
                      transform: "scaleX(0)",
                      transformOrigin: "0% 50%",
                    }}
                  />
                </Link>
              </div>

              <p className="s-fade reveal mt-6 text-center font-body text-xs text-estora-text-muted/60">
                Portfolio demo. Listings are illustrative.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ----------------------------- Description + features ----------------------------- */}
      <section className="mx-auto max-w-[1600px] px-6 py-20 lg:px-12 lg:py-32">
        <div className="desc-wrap grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="d-fade reveal flex items-center gap-4">
              <span className="d-rule reveal h-px w-14 bg-estora-accent" />
              <span className="font-body text-xs font-medium uppercase tracking-[0.3em] text-estora-accent lg:text-[13px]">
                About this property
              </span>
            </div>
            <p className="d-fade reveal mt-8 font-display text-xl font-normal leading-[1.5] tracking-tight text-estora-text-primary/90 lg:text-[1.65rem]">
              {property.description}
            </p>
          </div>

          <div className="lg:col-span-5 lg:pl-8">
            <div className="d-fade reveal flex items-center gap-4">
              <span className="d-rule reveal h-px w-14 bg-estora-accent" />
              <span className="font-body text-xs font-medium uppercase tracking-[0.3em] text-estora-accent lg:text-[13px]">
                Key features
              </span>
            </div>
            <ul className="mt-8">
              {property.features.map((feature, i) => (
                <li
                  key={i}
                  className="d-fade reveal relative flex items-center gap-4 py-4"
                >
                  <span className="d-rule reveal absolute left-0 top-0 h-px w-full bg-white/15" />
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-estora-accent/40 text-estora-accent">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-body text-base text-estora-text-primary">
                    {feature}
                  </span>
                </li>
              ))}
              <li
                aria-hidden
                className="d-rule reveal block h-px w-full bg-white/15"
              />
            </ul>
          </div>
        </div>
      </section>

      {/* ----------------------------- Related properties ----------------------------- */}
      {related.length > 0 && (
        <section className="related border-t border-white/10 bg-estora-bg-elevated">
          <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-36">
            <div className="rel-head mb-12 flex items-end justify-between gap-6 lg:mb-16">
              <div>
                <div className="flex items-center gap-4">
                  <span className="rel-rule reveal h-px w-14 bg-estora-accent" />
                  <span className="block overflow-hidden">
                    <span className="rel-eyebrow reveal block font-body text-xs font-medium uppercase tracking-[0.3em] text-estora-accent lg:text-[13px]">
                      More in {property.city}
                    </span>
                  </span>
                </div>

                <h2 className="mt-6 font-display text-[clamp(2.25rem,6.5vw,6rem)] font-medium leading-[0.95] tracking-[-0.04em] text-estora-text-primary">
                  <span className="-my-[0.12em] block overflow-hidden py-[0.12em] pr-[0.1em]">
                    <span className="rel-line reveal inline-block">
                      Similar
                    </span>
                  </span>
                  <span className="-my-[0.12em] block overflow-hidden py-[0.12em] pr-[0.1em]">
                    <span className="rel-line reveal inline-block font-light italic text-estora-accent">
                      properties.
                    </span>
                  </span>
                </h2>
              </div>

              <Link
                href="/properties"
                className="rel-link uline reveal group relative hidden shrink-0 items-center gap-2 pb-1.5 font-display text-sm font-medium text-estora-text-primary sm:inline-flex"
              >
                View all
                <ArrowRight className="h-4 w-4 text-estora-accent transition-transform duration-500 group-hover:translate-x-1" />
                <span className="absolute bottom-0 left-0 h-px w-full bg-white/25" />
                <span
                  className="uline-line absolute bottom-0 left-0 h-px w-full bg-estora-accent"
                  style={{ transform: "scaleX(0)", transformOrigin: "0% 50%" }}
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------- Mobile enquiry bar (hidden on desktop, shown by GSAP on scroll) ------------- */}
      <div
        className="m-bar invisible fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-estora-bg/85 px-5 pt-3 backdrop-blur-xl lg:hidden"
        style={{
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-estora-text-muted">
              {isBuy ? "For sale" : "For rent"}
            </p>
            <p className="truncate font-display text-xl font-medium tracking-tight text-estora-text-primary">
              {formatPrice(property.price, property.listingType)}
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-estora-accent px-6 font-display text-sm font-medium text-estora-bg transition-[scale] duration-200 active:scale-[0.96]"
          >
            <MessageCircle className="h-4 w-4" />
            Enquire
          </a>
        </div>
      </div>
    </main>
  );
}
