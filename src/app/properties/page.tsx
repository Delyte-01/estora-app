"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Search,
  RotateCcw,
  SearchX,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

import {
  properties,
  budgetRanges,
  propertyTypes,
  sortOptions,
  type SortOption,
  type ListingType,
  type PropertyType,
} from "@/data/properties";

import PropertyCard from "@/components/propertyCard";
import { FINE_POINTER, attachFillButton } from "@/lib/gsap-ui";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ListingFilter = ListingType | "all";

interface PageFilters {
  search: string;
  listingType: ListingFilter;
  propertyType: PropertyType | "All";
  location: string;
  budgetIndex: number;
  sort: SortOption;
}

const defaultPageFilters: PageFilters = {
  search: "",
  listingType: "all",
  propertyType: "All",
  location: "",
  budgetIndex: 0,
  sort: "recommended",
};

const ITEMS_PER_PAGE = 6;
const listingIndex: Record<ListingFilter, number> = { all: 0, buy: 1, rent: 2 };

const labelClass =
  "mb-2 block font-body text-[11px] uppercase tracking-[0.2em] text-estora-text-muted";

/* -------------------------------------------------------------------------- */
/*                              Small UI pieces                               */
/* -------------------------------------------------------------------------- */
function SearchInput({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-estora-accent" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search properties..."
        aria-label="Search properties"
        className="h-11 w-full rounded-full border border-white/10 bg-estora-bg pl-11 pr-4 font-body text-sm text-estora-text-primary transition-colors duration-300 placeholder:text-estora-text-muted/60 hover:border-white/25 focus-lime"
      />
    </div>
  );
}

function Select({
  value,
  onChange,
  label,
  className = "",
  children,
}: {
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        aria-label={label}
        className="h-11 w-full cursor-pointer appearance-none rounded-full border border-white/10 bg-estora-bg pl-5 pr-10 font-body text-sm text-estora-text-primary transition-colors duration-300 hover:border-white/25 focus-lime"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-estora-text-muted" />
    </div>
  );
}

/* All / Buy / Rent: the accent pill slides (animated by GSAP via .seg-pill) */
function Segmented({
  value,
  onChange,
  className = "",
}: {
  value: ListingFilter;
  onChange: (v: ListingFilter) => void;
  className?: string;
}) {
  const options: ListingFilter[] = ["all", "buy", "rent"];
  return (
    <div
      role="group"
      aria-label="Listing type"
      className={`relative grid grid-cols-3 rounded-full border border-white/10 bg-estora-bg p-1 ${className}`}
    >
      <span
        className="seg-pill pointer-events-none absolute inset-y-1 left-1 w-[calc((100%-8px)/3)] rounded-full bg-estora-accent"
        aria-hidden
      />
      {options.map((type) => {
        const active = value === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            aria-pressed={active}
            className={`relative z-10 rounded-full px-5 py-2 font-display text-sm font-medium capitalize transition-colors duration-500 ${
              active
                ? "text-estora-bg"
                : "text-estora-text-muted hover:text-estora-text-primary"
            }`}
          >
            {type === "all" ? "All" : type}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */
export default function PropertiesPage() {
  const root = useRef<HTMLElement>(null);
  const firstSeg = useRef(true);
  const firstPanel = useRef(true);
  const firstCount = useRef(true);

  const [filters, setFilters] = useState<PageFilters>(defaultPageFilters);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProperties = useMemo(() => {
    const budget = budgetRanges[filters.budgetIndex];
    const searchQuery = filters.search.trim().toLowerCase();
    const locationQuery = filters.location.trim().toLowerCase();

    let result = properties.filter((property) => {
      if (
        filters.listingType !== "all" &&
        property.listingType !== filters.listingType
      ) {
        return false;
      }

      if (
        filters.propertyType !== "All" &&
        property.propertyType !== filters.propertyType
      ) {
        return false;
      }

      if (property.price < budget.min || property.price > budget.max) {
        return false;
      }

      if (locationQuery) {
        const matchesLocation =
          property.location.toLowerCase().includes(locationQuery) ||
          property.city.toLowerCase().includes(locationQuery);
        if (!matchesLocation) return false;
      }

      if (searchQuery) {
        const matchesSearch =
          property.title.toLowerCase().includes(searchQuery) ||
          property.location.toLowerCase().includes(searchQuery) ||
          property.city.toLowerCase().includes(searchQuery) ||
          property.description.toLowerCase().includes(searchQuery) ||
          property.propertyType.toLowerCase().includes(searchQuery);
        if (!matchesSearch) return false;
      }

      return true;
    });

    result = [...result].sort((a, b) => {
      switch (filters.sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }, [filters]);

  const visibleProperties = filteredProperties.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProperties.length;
  const total = filteredProperties.length;
  const progress = total ? (visibleProperties.length / total) * 100 : 0;

  const handleReset = () => {
    setFilters(defaultPageFilters);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleFilterChange = (partial: Partial<PageFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.listingType !== "all" ||
    filters.propertyType !== "All" ||
    filters.location !== "" ||
    filters.budgetIndex !== 0 ||
    filters.sort !== "recommended";

  // Remounts the grid when the main filters or the sort change, so every card re-animates
  const gridKey = `${filters.listingType}|${filters.propertyType}|${filters.budgetIndex}|${filters.sort}`;
  // Changes whenever the visible set of cards changes
  const listKey = visibleProperties.map((p) => p.id).join("|");

  /* ---------------- Page intro + scroll parallax (runs once) ---------------- */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "hero" }, delay: 0.3 })
          .fromTo(
            ".pg-glow",
            { scale: 0.3, opacity: 0 },
            { scale: 1, opacity: 1, duration: 2 },
            0,
          )
          .fromTo(
            ".pg-crumb",
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            0,
          )
          .fromTo(
            ".pg-rule",
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "heroInOut",
              transformOrigin: "0% 50%",
            },
            0.15,
          )
          .fromTo(
            ".pg-eyebrow",
            { yPercent: 120 },
            { yPercent: 0, duration: 1 },
            0.25,
          )
          .fromTo(
            ".pg-line",
            { yPercent: 115, rotate: 4 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 1.4,
              stagger: 0.12,
              transformOrigin: "0% 100%",
            },
            0.3,
          )
          .fromTo(
            ".pg-copy",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            0.85,
          )
          .fromTo(
            ".pg-count",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            1,
          )
          .fromTo(
            ".bar-wrap",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2 },
            1.15,
          );

        // Header drifts up and fades slightly as you scroll away
        gsap.to(".pg-head", {
          y: -60,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: ".pg-header",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".pg-glow", {
          yPercent: 40,
          ease: "none",
          scrollTrigger: {
            trigger: ".pg-header",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Everything is in its start state, so it's safe to reveal the page
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

  /* ---------------- Cards: animate only the NEW ones (filter changes + load more) ---------------- */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const cards = Array.from(
        el.querySelectorAll<HTMLElement>(".prop-card:not([data-anim])"),
      );
      cards.forEach((c) => c.setAttribute("data-anim", ""));

      const empty = el.querySelector<HTMLElement>(
        ".empty-state:not([data-anim])",
      );
      empty?.setAttribute("data-anim", "");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    },
    { scope: root, dependencies: [gridKey, listKey, total === 0] },
  );

  /* ---------------- Segmented pill slides between All / Buy / Rent ---------------- */
  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      gsap.to(".seg-pill", {
        xPercent: listingIndex[filters.listingType] * 100,
        duration: firstSeg.current || reduce ? 0 : 0.7,
        ease: "hero",
      });
      firstSeg.current = false;
    },
    { scope: root, dependencies: [filters.listingType] },
  );

  /* ---------------- Result count rolls up whenever it changes ---------------- */
  useGSAP(
    () => {
      if (firstCount.current) {
        firstCount.current = false;
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ".count-num",
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, ease: "hero" },
      );
    },
    { scope: root, dependencies: [total] },
  );

  /* ---------------- Mobile filter panel: height animates open/closed ---------------- */
  useGSAP(
    () => {
      const panel = root.current?.querySelector<HTMLElement>(".m-panel");
      if (!panel) return;
      if (firstPanel.current) {
        firstPanel.current = false;
        return;
      }
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.to(panel, {
        height: mobileFiltersOpen ? "auto" : 0,
        duration: reduce ? 0 : 0.8,
        ease: "hero",
      });
      if (mobileFiltersOpen && !reduce) {
        gsap.fromTo(
          ".m-field",
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "hero",
            stagger: 0.05,
            delay: 0.1,
          },
        );
      }
    },
    { scope: root, dependencies: [mobileFiltersOpen] },
  );

  /* ---------------- Load more button hover (re-attached when it remounts) ---------------- */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(FINE_POINTER, () => {
        const btn = el.querySelector<HTMLElement>(".load-more");
        return btn ? attachFillButton(btn, 0.3) : undefined;
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [hasMore], revertOnUpdate: true },
  );

  return (
    <main ref={root} id="props-page" className="min-h-svh bg-estora-bg">
      {/* Hide animated parts until GSAP has set their start state (prevents flash) */}
      <style>{`#props-page:not([data-ready]) .reveal{opacity:0}`}</style>

      {/* ------------------------------ Page header ------------------------------ */}
      <section className="pg-header relative overflow-hidden border-b border-white/10 pb-14 pt-32 lg:pb-20 lg:pt-44">
        <div className="pg-glow reveal pointer-events-none absolute -right-32 top-10 h-[26rem] w-[26rem] rounded-full bg-estora-accent/10 blur-3xl" />

        <div className="pg-head relative mx-auto max-w-[1600px] px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="pg-crumb reveal mb-10 flex items-center gap-1.5 font-body text-xs text-estora-text-muted lg:mb-14"
          >
            <Link
              href="/"
              className="transition-colors duration-300 hover:text-estora-accent"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-estora-text-primary">Properties</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4">
                <span className="pg-rule reveal h-px w-14 bg-estora-accent" />
                <span className="block overflow-hidden">
                  <span className="pg-eyebrow reveal block font-body text-xs font-medium uppercase tracking-[0.3em] text-estora-accent lg:text-[13px]">
                    The Estora Collection
                  </span>
                </span>
              </div>

              <h1 className="mt-6 font-display text-[clamp(2.4rem,7.5vw,7rem)] font-medium leading-[0.95] tracking-[-0.04em] text-estora-text-primary">
                {["Find a place", "that feels like"].map((line) => (
                  <span
                    key={line}
                    className="-my-[0.12em] block overflow-hidden whitespace-nowrap py-[0.12em] pr-[0.1em]"
                  >
                    <span className="pg-line reveal inline-block will-change-transform">
                      {line}
                    </span>
                  </span>
                ))}
                <span className="-my-[0.12em] block overflow-hidden whitespace-nowrap py-[0.12em] pr-[0.1em]">
                  <span className="pg-line reveal inline-block will-change-transform">
                    <span className="font-light italic text-estora-accent">
                      yours.
                    </span>
                  </span>
                </span>
              </h1>
            </div>

            <div className="lg:col-span-4 lg:justify-self-end">
              <p className="pg-copy reveal max-w-md font-body text-base leading-relaxed text-estora-text-muted lg:text-lg">
                Explore thoughtfully selected homes, apartments, and investment
                properties to match your next move.
              </p>

              <p
                className="pg-count reveal mt-8 flex items-baseline gap-3 font-body text-sm text-estora-text-muted"
                aria-live="polite"
              >
                <span className="block overflow-hidden">
                  <span className="count-num block font-display text-5xl font-medium tabular-nums tracking-tight text-estora-accent lg:text-6xl">
                    {total}
                  </span>
                </span>
                {total === 1 ? "property" : "properties"} available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------- Filter bar ------------------------------- */}
      <section className="bar-wrap reveal sticky top-14 z-30 border-b border-white/10 bg-estora-bg/80 backdrop-blur-xl lg:top-[68px]">
        <div className="mx-auto max-w-[1600px] px-6 py-3 lg:px-12 lg:py-4">
          {/* Desktop (xl and up) */}
          <div className="hidden items-center gap-3 xl:flex">
            <SearchInput
              value={filters.search}
              onChange={(v) => handleFilterChange({ search: v })}
              className="w-56 shrink-0"
            />

            <Segmented
              value={filters.listingType}
              onChange={(v) => handleFilterChange({ listingType: v })}
              className="shrink-0"
            />

            <Select
              label="Property type"
              value={filters.propertyType}
              onChange={(e) =>
                handleFilterChange({
                  propertyType: e.target.value as PropertyType | "All",
                })
              }
              className="w-36 shrink-0"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type} className="bg-estora-bg">
                  {type === "All" ? "All Types" : type}
                </option>
              ))}
            </Select>

            <Select
              label="Budget range"
              value={filters.budgetIndex}
              onChange={(e) =>
                handleFilterChange({ budgetIndex: Number(e.target.value) })
              }
              className="w-44 shrink-0"
            >
              {budgetRanges.map((range, i) => (
                <option key={i} value={i} className="bg-estora-bg">
                  {range.label}
                </option>
              ))}
            </Select>

            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange({ location: e.target.value })}
              placeholder="City or area"
              aria-label="Location filter"
              className="h-11 w-36 shrink-0 rounded-full border border-white/10 bg-estora-bg px-5 font-body text-sm text-estora-text-primary transition-colors duration-300 placeholder:text-estora-text-muted/60 hover:border-white/25 focus-lime"
            />

            <div className="ml-auto flex items-center gap-5">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b border-transparent pb-0.5 font-body text-sm text-estora-text-muted transition-colors duration-300 hover:border-estora-accent hover:text-estora-accent"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear all
                </button>
              )}

              <Select
                label="Sort order"
                value={filters.sort}
                onChange={(e) =>
                  handleFilterChange({ sort: e.target.value as SortOption })
                }
                className="w-44 shrink-0"
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-estora-bg"
                  >
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Mobile + tablet (below xl) */}
          <div className="xl:hidden">
            <div className="flex items-center gap-3">
              <SearchInput
                value={filters.search}
                onChange={(v) => handleFilterChange({ search: v })}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen((o) => !o)}
                aria-expanded={mobileFiltersOpen}
                aria-controls="mobile-filters"
                className="relative inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-white/10 px-5 font-body text-sm text-estora-text-primary transition-colors duration-300 hover:border-white/25 active:scale-[0.97]"
              >
                <SlidersHorizontal className="h-4 w-4 text-estora-accent" />
                Filters
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-500 ${
                    mobileFiltersOpen ? "rotate-180" : ""
                  }`}
                />
                {hasActiveFilters && (
                  <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-estora-accent" />
                )}
              </button>
            </div>

            <div
              id="mobile-filters"
              className="m-panel h-0 overflow-hidden"
              inert={!mobileFiltersOpen}
            >
              <div className="flex flex-col gap-5 pb-2 pt-5">
                <div className="m-field">
                  <span className={labelClass}>Listing type</span>
                  <Segmented
                    value={filters.listingType}
                    onChange={(v) => handleFilterChange({ listingType: v })}
                    className="w-full sm:w-72"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="m-field">
                    <span className={labelClass}>Property type</span>
                    <Select
                      label="Property type"
                      value={filters.propertyType}
                      onChange={(e) =>
                        handleFilterChange({
                          propertyType: e.target.value as PropertyType | "All",
                        })
                      }
                    >
                      {propertyTypes.map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="bg-estora-bg"
                        >
                          {type === "All" ? "All Types" : type}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="m-field">
                    <span className={labelClass}>Budget</span>
                    <Select
                      label="Budget range"
                      value={filters.budgetIndex}
                      onChange={(e) =>
                        handleFilterChange({
                          budgetIndex: Number(e.target.value),
                        })
                      }
                    >
                      {budgetRanges.map((range, i) => (
                        <option key={i} value={i} className="bg-estora-bg">
                          {range.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="m-field">
                    <span className={labelClass}>Location</span>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) =>
                        handleFilterChange({ location: e.target.value })
                      }
                      placeholder="City or neighbourhood"
                      aria-label="Location filter"
                      className="h-11 w-full rounded-full border border-white/10 bg-estora-bg px-5 font-body text-base text-estora-text-primary transition-colors duration-300 placeholder:text-estora-text-muted/60 hover:border-white/25 focus-lime sm:text-sm"
                    />
                  </div>

                  <div className="m-field">
                    <span className={labelClass}>Sort by</span>
                    <Select
                      label="Sort order"
                      value={filters.sort}
                      onChange={(e) =>
                        handleFilterChange({
                          sort: e.target.value as SortOption,
                        })
                      }
                    >
                      {sortOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-estora-bg"
                        >
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="m-field inline-flex items-center gap-1.5 self-start border-b border-estora-accent/40 pb-0.5 font-body text-sm text-estora-accent"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ Property grid ------------------------------ */}
      <section className="bg-estora-bg">
        <div className="mx-auto max-w-[1600px] px-6 py-14 lg:px-12 lg:py-24">
          {visibleProperties.length > 0 ? (
            <>
              <div
                key={gridKey}
                className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20"
              >
                {visibleProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-16 flex flex-col items-center gap-6 lg:mt-24">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                    }
                    className="load-more group relative inline-flex items-center gap-4 overflow-hidden whitespace-nowrap rounded-full border border-white/20 py-2 pl-8 pr-2 font-display text-base font-medium text-estora-text-primary transition-[color,border-color,scale] duration-500 hover:border-estora-accent hover:text-estora-bg active:scale-[0.97]"
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
                      <span className="block">Load More Properties</span>
                      <span
                        className="absolute left-0 top-full block"
                        aria-hidden
                      >
                        Load More Properties
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
                  </button>

                  {/* Progress */}
                  <div className="flex w-full max-w-xs flex-col items-center gap-3">
                    <div className="h-px w-full overflow-hidden bg-white/10">
                      <div
                        className="h-full bg-estora-accent transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-estora-text-muted">
                      Showing {visibleProperties.length} of {total}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 px-6 py-24 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 text-estora-accent">
                <SearchX className="h-7 w-7" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-medium tracking-tight text-estora-text-primary">
                No properties match your search
              </h2>
              <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-estora-text-muted">
                Try adjusting your filters or clearing them to see the full
                collection.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-8 inline-flex items-center gap-2 border-b border-estora-text-primary/30 pb-1 font-display text-sm font-medium text-estora-text-primary transition-colors duration-300 hover:border-estora-accent hover:text-estora-accent"
              >
                <RotateCcw className="h-4 w-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
