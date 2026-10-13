"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { type Property, formatPrice } from "@/data/properties";
import { getWhatsAppUrl } from "@/config/site";
import { FINE_POINTER } from "@/lib/gsap-ui";

gsap.registerPlugin(useGSAP);

export default function PropertyCard({ property }: { property: Property }) {
  const ref = useRef<HTMLElement>(null);
  const isBuy = property.listingType === "buy";

  const specs: { Icon: LucideIcon; label: string }[] = [];
  if (property.bedrooms !== null)
    specs.push({ Icon: Bed, label: `${property.bedrooms} Beds` });
  if (property.bathrooms !== null)
    specs.push({ Icon: Bath, label: `${property.bathrooms} Baths` });
  if (property.area !== null)
    specs.push({ Icon: Maximize, label: `${property.area} m²` });

  /* Hover: cursor-following "View" chip, image zoom + drift, line draw, arrow swap */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(FINE_POINTER, () => {
        const el = ref.current;
        if (!el) return;

        const media = el.querySelector<HTMLElement>(".card-media")!;
        const img = el.querySelector<HTMLElement>(".card-img")!;
        const chip = el.querySelector<HTMLElement>(".card-chip")!;
        const line = el.querySelector<HTMLElement>(".card-line")!;
        const va = el.querySelector<HTMLElement>(".va")!;
        const vb = el.querySelector<HTMLElement>(".vb")!;

        gsap.set(chip, { xPercent: -50, yPercent: -50, scale: 0 });

        const chipX = gsap.quickTo(chip, "x", {
          duration: 0.5,
          ease: "power3.out",
        });
        const chipY = gsap.quickTo(chip, "y", {
          duration: 0.5,
          ease: "power3.out",
        });
        const imgX = gsap.quickTo(img, "x", {
          duration: 1,
          ease: "power3.out",
        });
        const imgY = gsap.quickTo(img, "y", {
          duration: 1,
          ease: "power3.out",
        });

        const local = (e: PointerEvent) => {
          const r = media.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          return { x, y, nx: x / r.width - 0.5, ny: y / r.height - 0.5 };
        };

        const mediaEnter = (e: PointerEvent) => {
          const p = local(e);
          gsap.set(chip, { x: p.x, y: p.y });
          gsap.to(chip, {
            scale: 1,
            duration: 0.6,
            ease: "hero",
            overwrite: "auto",
          });
          gsap.to(img, {
            scale: 1.08,
            duration: 1.4,
            ease: "hero",
            overwrite: "auto",
          });
        };
        const mediaMove = (e: PointerEvent) => {
          const p = local(e);
          chipX(p.x);
          chipY(p.y);
          imgX(-p.nx * 14);
          imgY(-p.ny * 14);
        };
        const mediaLeave = () => {
          gsap.to(chip, {
            scale: 0,
            duration: 0.4,
            ease: "hero",
            overwrite: "auto",
          });
          gsap.to(img, {
            scale: 1,
            duration: 1.2,
            ease: "hero",
            overwrite: "auto",
          });
          imgX(0);
          imgY(0);
        };

        const cardEnter = () => {
          gsap.set(line, { transformOrigin: "0% 50%" });
          gsap.to(line, {
            scaleX: 1,
            duration: 0.9,
            ease: "hero",
            overwrite: true,
          });
          gsap.to(va, {
            x: 18,
            y: -18,
            duration: 0.5,
            ease: "hero",
            overwrite: true,
          });
          gsap.to(vb, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "hero",
            overwrite: true,
          });
        };
        const cardLeave = () => {
          gsap.set(line, { transformOrigin: "100% 50%" });
          gsap.to(line, {
            scaleX: 0,
            duration: 0.7,
            ease: "heroInOut",
            overwrite: true,
          });
          gsap.to(va, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "hero",
            overwrite: true,
          });
          gsap.to(vb, {
            x: -18,
            y: 18,
            duration: 0.5,
            ease: "hero",
            overwrite: true,
          });
        };

        media.addEventListener("pointerenter", mediaEnter);
        media.addEventListener("pointermove", mediaMove);
        media.addEventListener("pointerleave", mediaLeave);
        el.addEventListener("pointerenter", cardEnter);
        el.addEventListener("pointerleave", cardLeave);

        return () => {
          media.removeEventListener("pointerenter", mediaEnter);
          media.removeEventListener("pointermove", mediaMove);
          media.removeEventListener("pointerleave", mediaLeave);
          el.removeEventListener("pointerenter", cardEnter);
          el.removeEventListener("pointerleave", cardLeave);
          gsap.killTweensOf([chip, img, line, va, vb]);
        };
      });
    },
    { scope: ref },
  );

  return (
    <article
      ref={ref}
      className="prop-card reveal group flex flex-col transition-transform duration-200 active:scale-[0.99]"
    >
      {/* Media */}
      <Link
        href={`/properties/${property.slug}`}
        className="card-media relative block aspect-[4/4.4] overflow-hidden rounded-2xl bg-estora-bg-elevated sm:aspect-[4/4.6]"
        aria-label={`View ${property.title}`}
      >
        <div className="card-img absolute inset-0 will-change-transform">
          <Image
            src={property.image}
            alt={property.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Badges */}
        <span
          className={`absolute left-4 top-4 inline-flex items-center rounded-full px-3.5 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.15em] ${
            isBuy
              ? "bg-estora-accent text-estora-bg"
              : "bg-estora-text-primary text-estora-bg"
          }`}
        >
          {isBuy ? "For sale" : "For rent"}
        </span>
        <span className="absolute right-4 top-4 inline-flex items-center rounded-full border border-white/20 bg-estora-bg/40 px-3.5 py-1.5 font-body text-[11px] font-medium uppercase tracking-[0.15em] text-estora-text-primary backdrop-blur-md">
          {property.propertyType}
        </span>

        {/* Cursor chip (mouse devices only; stays hidden on touch) */}
        <span
          className="card-chip pointer-events-none absolute left-0 top-0 z-10 flex h-20 w-20 items-center justify-center rounded-full bg-estora-accent font-display text-xs font-semibold uppercase tracking-[0.15em] text-estora-bg will-change-transform"
          style={{ transform: "scale(0)" }}
          aria-hidden
        >
          View
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col pt-5">
        <h3 className="font-display text-xl font-medium leading-snug tracking-tight text-estora-text-primary lg:text-2xl">
          {property.title}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 font-body text-sm text-estora-text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-estora-accent" />
          {property.location}
        </p>

        <p className="mt-5 font-display text-2xl font-medium tracking-tight text-estora-text-primary lg:text-3xl">
          {formatPrice(property.price, property.listingType)}
        </p>

        {specs.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {specs.map(({ Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 font-body text-xs text-estora-text-muted"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="mt-auto pt-6">
          <div className="relative h-px w-full bg-white/10">
            <span
              className="card-line absolute inset-0 bg-estora-accent"
              style={{ transform: "scaleX(0)", transformOrigin: "0% 50%" }}
            />
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <Link
              href={`/properties/${property.slug}`}
              className="card-view inline-flex items-center gap-2 font-display text-sm font-medium text-estora-text-primary transition-colors duration-300 hover:text-estora-accent"
            >
              View Property
              <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden text-estora-accent">
                <ArrowUpRight className="va h-4 w-4" />
                <ArrowUpRight
                  className="vb absolute h-4 w-4"
                  style={{ transform: "translate(-18px, 18px)" }}
                  aria-hidden
                />
              </span>
            </Link>

            <a
              href={getWhatsAppUrl(
                `Hello ESTORA, I'm interested in ${property.title} at ${property.location}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-transparent pb-0.5 font-body text-sm text-estora-text-muted transition-colors duration-300 hover:border-estora-accent hover:text-estora-accent"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
