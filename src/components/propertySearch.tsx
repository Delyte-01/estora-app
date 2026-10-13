"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Search, RotateCcw, MapPin, ChevronDown } from "lucide-react";
import {
  type ListingType,
  type PropertyType,
  budgetRanges,
} from "@/data/properties";
import { FINE_POINTER, attachFillButton } from "@/lib/gsap-ui";

gsap.registerPlugin(useGSAP);

export interface SearchFilters {
  listingType: ListingType;
  propertyType: PropertyType | "All";
  location: string;
  budgetIndex: number;
}

export const defaultFilters: SearchFilters = {
  listingType: "buy",
  propertyType: "All",
  location: "",
  budgetIndex: 0,
};

interface PropertySearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  resultCount: number;
}

const propertyTypes: (PropertyType | "All")[] = [
  "All",
  "House",
  "Apartment",
  "Land",
  "Commercial",
];

const labelClass =
  "mb-2 block font-body text-[11px] uppercase tracking-[0.2em] text-estora-text-muted";

const fieldClass =
  "h-14 w-full rounded-full border border-white/10 bg-estora-bg font-body text-sm text-estora-text-primary transition-colors duration-300 hover:border-white/25 focus-lime";

export default function PropertySearch({
  filters,
  onFiltersChange,
  resultCount,
}: PropertySearchProps) {
  const root = useRef<HTMLDivElement>(null);
  const firstPill = useRef(true);
  const firstCount = useRef(true);

  const [localLocation, setLocalLocation] = useState(filters.location);
  const [syncedLocation, setSyncedLocation] = useState(filters.location);

  // Keep the input in step when filters are reset from outside (derived state, no effect)
  if (filters.location !== syncedLocation) {
    setSyncedLocation(filters.location);
    setLocalLocation(filters.location);
  }

  /* Buy / Rent: the accent pill slides between the two options */
  useGSAP(
    () => {
      gsap.to(".seg-pill", {
        xPercent: filters.listingType === "buy" ? 0 : 100,
        duration: firstPill.current ? 0 : 0.7,
        ease: "hero",
      });
      firstPill.current = false;
    },
    { scope: root, dependencies: [filters.listingType] },
  );

  /* Result count: the number rolls up whenever it changes */
  useGSAP(
    () => {
      if (firstCount.current) {
        firstCount.current = false;
        return;
      }
      gsap.fromTo(
        ".count-num",
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, ease: "hero" },
      );
    },
    { scope: root, dependencies: [resultCount] },
  );

  /* Search button hover (mouse devices only) */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FINE_POINTER, () => {
        const btn = root.current?.querySelector<HTMLElement>(".search-btn");
        return btn ? attachFillButton(btn, 0.2) : undefined;
      });
    },
    { scope: root },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, location: localLocation });
  };

  const handleReset = () => {
    setLocalLocation("");
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.listingType !== defaultFilters.listingType ||
    filters.propertyType !== defaultFilters.propertyType ||
    filters.location !== "" ||
    filters.budgetIndex !== 0;

  return (
    <div
      ref={root}
      className="relative rounded-3xl border border-white/10 bg-estora-bg-elevated/70 p-5 backdrop-blur-xl sm:p-7 lg:p-9"
    >
      {/* Top row: Buy/Rent + result count */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Listing type"
          className="relative grid w-full grid-cols-2 rounded-full border border-white/10 bg-estora-bg p-1 sm:w-64"
        >
          <span
            className="seg-pill pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-estora-accent"
            aria-hidden
          />
          {(["buy", "rent"] as ListingType[]).map((type) => {
            const active = filters.listingType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() =>
                  onFiltersChange({ ...filters, listingType: type })
                }
                aria-pressed={active}
                className={`relative z-10 rounded-full py-2.5 font-display text-sm font-medium transition-colors duration-500 ${
                  active
                    ? "text-estora-bg"
                    : "text-estora-text-muted hover:text-estora-text-primary"
                }`}
              >
                {type === "buy" ? "Buy" : "Rent"}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-6 sm:justify-end">
          <p
            className="flex items-baseline gap-2 font-body text-sm text-estora-text-muted"
            aria-live="polite"
          >
            <span className="block overflow-hidden">
              <span className="count-num block font-display text-2xl font-medium tabular-nums text-estora-text-primary">
                {resultCount}
              </span>
            </span>
            {resultCount === 1 ? "property" : "properties"} found
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 border-b border-transparent pb-0.5 font-body text-sm text-estora-text-muted transition-colors duration-300 hover:border-estora-accent hover:text-estora-accent"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Property type chips (scroll sideways on phones) */}
      <div className="-mx-5 mt-6 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div
          role="group"
          aria-label="Property type"
          className="flex w-max gap-2 sm:w-auto sm:flex-wrap"
        >
          {propertyTypes.map((type) => {
            const active = filters.propertyType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() =>
                  onFiltersChange({ ...filters, propertyType: type })
                }
                aria-pressed={active}
                className={`whitespace-nowrap rounded-full border px-5 py-2.5 font-body text-sm transition-colors duration-300 ${
                  active
                    ? "border-estora-accent bg-estora-accent text-estora-bg"
                    : "border-white/15 text-estora-text-muted hover:border-estora-accent/60 hover:text-estora-text-primary"
                }`}
              >
                {type === "All" ? "All types" : type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fields */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_auto] lg:items-end"
      >
        <div>
          <label htmlFor="location-search" className={labelClass}>
            Location
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-estora-accent" />
            <input
              id="location-search"
              type="text"
              value={localLocation}
              onChange={(e) => setLocalLocation(e.target.value)}
              placeholder="Enter a city or neighbourhood"
              className={`${fieldClass} pl-12 pr-5 placeholder:text-estora-text-muted/60`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="budget-select" className={labelClass}>
            Budget
          </label>
          <div className="relative">
            <select
              id="budget-select"
              value={filters.budgetIndex}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  budgetIndex: Number(e.target.value),
                })
              }
              className={`${fieldClass} cursor-pointer appearance-none pl-5 pr-12`}
            >
              {budgetRanges.map((range, i) => (
                <option key={i} value={i} className="bg-estora-bg">
                  {range.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-estora-text-muted" />
          </div>
        </div>

        {/* Search button */}
        <button
          type="submit"
          className="search-btn group relative inline-flex h-14 w-full items-center justify-between gap-4 overflow-hidden rounded-full bg-estora-accent py-1.5 pl-7 pr-1.5 font-display text-sm font-medium text-estora-bg transition-[scale] duration-200 active:scale-[0.97] sm:col-span-2 lg:col-span-1 lg:w-auto lg:justify-center"
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
            <span className="block">Search</span>
            <span className="absolute left-0 top-full block" aria-hidden>
              Search
            </span>
          </span>
          <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-estora-bg text-estora-accent">
            <Search data-arrow-a className="h-4 w-4" />
            <Search
              data-arrow-b
              className="absolute h-4 w-4"
              style={{ transform: "translateX(-40px)" }}
              aria-hidden
            />
          </span>
        </button>
      </form>
    </div>
  );
}
