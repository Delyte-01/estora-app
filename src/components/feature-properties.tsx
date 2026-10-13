"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, SearchX } from "lucide-react";
import PropertyCard from "@/components/propertyCard";
import PropertySearch, {
  type SearchFilters,
  defaultFilters,
} from "@/components/propertySearch";
import { properties, budgetRanges } from "@/data/properties";
import { FINE_POINTER, attachFillButton } from "@/lib/gsap-ui";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function FeaturedProperties() {
  const root = useRef<HTMLElement>(null);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const filteredProperties = useMemo(() => {
    const budget = budgetRanges[filters.budgetIndex];
    const locationQuery = filters.location.trim().toLowerCase();

    return properties.filter((property) => {
      if (property.listingType !== filters.listingType) return false;

      if (
        filters.propertyType !== "All" &&
        property.propertyType !== filters.propertyType
      ) {
        return false;
      }

      if (property.price < budget.min || property.price > budget.max) {
        return false;
      }

      if (
        locationQuery &&
        !property.location.toLowerCase().includes(locationQuery) &&
        !property.city.toLowerCase().includes(locationQuery)
      ) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Changes whenever the visible set of cards changes
  const listKey = filteredProperties.map((p) => p.id).join("|");

  /* ---------- Header + search panel reveal (runs once, on scroll) ---------- */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "hero" },
            scrollTrigger: {
              trigger: el.querySelector(".sec-head"),
              start: "top 80%",
              once: true,
            },
          })
          .fromTo(
            ".eyebrow-rule",
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
            ".eyebrow-text",
            { yPercent: 120 },
            { yPercent: 0, duration: 1 },
            0.1,
          )
          .fromTo(
            ".sec-line",
            { yPercent: 115, rotate: 4 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 1.3,
              stagger: 0.12,
              transformOrigin: "0% 100%",
            },
            0.15,
          )
          .fromTo(
            ".sec-copy",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            0.5,
          )
          .fromTo(
            ".search-wrap",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2 },
            0.6,
          );

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

  /* ---------- Cards: reveal on scroll, and again after every filter change ---------- */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll(".prop-card"),
      );
      const empty = el.querySelector<HTMLElement>(".empty-state");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (empty) {
          gsap.fromTo(
            empty,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "hero" },
          );
        }

        if (cards.length) {
          const imgs = cards.map((c) =>
            c.querySelector<HTMLElement>(".card-img"),
          );
          gsap.set(cards, { y: 70, opacity: 0 });
          gsap.set(imgs, { scale: 1.25 });

          ScrollTrigger.batch(cards, {
            start: "top 88%",
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
      });

      /* "View all" button: magnetic fill hover (mouse devices only) */
      const mmPointer = gsap.matchMedia();
      mmPointer.add(FINE_POINTER, () => {
        const btn = el.querySelector<HTMLElement>(".view-all");
        return btn ? attachFillButton(btn, 0.3) : undefined;
      });

      return () => {
        mm.revert();
        mmPointer.revert();
      };
    },
    { scope: root, dependencies: [listKey], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="properties"
      className="relative scroll-mt-20 overflow-hidden bg-estora-bg"
    >
      {/* Hide animated parts until GSAP has set their start state (prevents flash) */}
      <style>{`#properties:not([data-ready]) .reveal{opacity:0}`}</style>

      <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-36">
        {/* Section header */}
        <div className="sec-head mb-12 grid gap-8 lg:mb-16 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4">
              <span className="eyebrow-rule reveal h-px w-14 bg-estora-accent" />
              <span className="block overflow-hidden">
                <span className="eyebrow-text reveal block font-body text-xs font-medium uppercase tracking-[0.3em] text-estora-accent lg:text-[13px]">
                  The Collection
                </span>
              </span>
            </div>

            <h2 className="mt-6 font-display text-[clamp(2.25rem,6.5vw,6rem)] font-medium leading-[0.95] tracking-[-0.04em] text-estora-text-primary">
              <span className="-my-[0.12em] block overflow-hidden py-[0.12em] pr-[0.1em]">
                <span className="sec-line reveal inline-block">
                  Exceptional spaces.
                </span>
              </span>
              <span className="-my-[0.12em] block overflow-hidden py-[0.12em] pr-[0.1em]">
                <span className="sec-line reveal inline-block">
                  Distinctive{" "}
                  <span className="font-light italic text-estora-accent">
                    living.
                  </span>
                </span>
              </span>
            </h2>
          </div>

          <p className="sec-copy reveal max-w-md font-body text-base leading-relaxed text-estora-text-muted lg:col-span-4 lg:justify-self-end lg:text-lg">
            A thoughtfully selected collection of properties, from contemporary
            city apartments to architectural family homes across Nigeria.
          </p>
        </div>

        {/* Search panel */}
        <div className="search-wrap reveal">
          <PropertySearch
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredProperties.length}
          />
        </div>

        {/* Property grid */}
        <div className="mt-12 lg:mt-16">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="empty-state reveal flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 px-6 py-24 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 text-estora-accent">
                <SearchX className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-medium tracking-tight text-estora-text-primary">
                No properties match your search
              </h3>
              <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-estora-text-muted">
                Try adjusting your filters or clearing them to see the full
                collection.
              </p>
              <button
                type="button"
                onClick={() => setFilters(defaultFilters)}
                className="mt-8 border-b border-estora-text-primary/30 pb-1 font-display text-sm font-medium text-estora-text-primary transition-colors duration-300 hover:border-estora-accent hover:text-estora-accent"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* View all CTA */}
        {filteredProperties.length > 0 && (
          <div className="mt-16 flex justify-center lg:mt-24">
            <Link
              href="/properties"
              className="view-all group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-white/20 py-2 pl-8 pr-2 font-display text-base font-medium text-estora-text-primary transition-[color,border-color,scale] duration-500 hover:border-estora-accent hover:text-estora-bg active:scale-[0.97]"
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
                <span className="block">View All Properties</span>
                <span className="absolute left-0 top-full block" aria-hidden>
                  View All Properties
                </span>
              </span>
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-estora-accent text-estora-bg transition-colors duration-500 group-hover:bg-estora-bg group-hover:text-estora-accent">
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
        )}
      </div>
    </section>
  );
}
