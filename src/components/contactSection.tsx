"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MessageCircle, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  getWhatsAppUrl,
  defaultWhatsAppMessage,
  siteConfig,
} from "@/config/site";
import { FINE_POINTER, attachFillButton } from "@/lib/gsap-ui";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Errors = { name?: string; email?: string; message?: string };

const headlineLines = ["Your next", "chapter starts", "with a place."];

const inputClass =
  "block w-full bg-transparent pb-3 pt-3 font-body text-base text-estora-text-primary outline-none placeholder:text-estora-text-muted/50";

/* Underline-style field: a lime line draws across on focus (driven by GSAP) */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="field f-item group relative"
      data-error={error ? "true" : undefined}
    >
      <label
        htmlFor={id}
        className="block font-body text-[11px] uppercase tracking-[0.2em] text-estora-text-muted transition-colors duration-300 group-focus-within:text-estora-accent"
      >
        {label}
      </label>
      <div className="relative">
        {children}
        <span
          className={`absolute bottom-0 left-0 h-px w-full ${
            error ? "bg-red-400/70" : "bg-white/15"
          }`}
        />
        <span
          className="field-line absolute bottom-0 left-0 h-px w-full bg-estora-accent"
          style={{ transform: "scaleX(0)", transformOrigin: "0% 50%" }}
        />
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="err mt-2 font-body text-xs text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactCTA() {
  const root = useRef<HTMLElement>(null);
  const prevSubmitted = useRef(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};

    if (!name.trim()) newErrors.name = "Please enter your name.";
    if (!email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!message.trim())
      newErrors.message = "Please tell us what you are looking for.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  };

  /* ---------------- Intro, scroll reveals and focus lines (run once) ---------------- */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Left column
        gsap
          .timeline({
            defaults: { ease: "hero" },
            scrollTrigger: {
              trigger: el.querySelector(".contact-left"),
              start: "top 78%",
              once: true,
            },
          })
          .fromTo(
            ".ct-eyebrow-rule",
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
            ".ct-eyebrow-text",
            { yPercent: 120 },
            { yPercent: 0, duration: 1 },
            0.1,
          )
          .fromTo(
            ".ct-line",
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
            ".ct-copy",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            0.6,
          )
          .fromTo(
            ".c-btn",
            { y: 30, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.1 },
            0.75,
          );

        // Form card, then its fields
        gsap
          .timeline({
            defaults: { ease: "hero" },
            scrollTrigger: {
              trigger: el.querySelector(".form-card"),
              start: "top 85%",
              once: true,
            },
          })
          .fromTo(
            ".form-card",
            { y: 70, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.3 },
            0,
          )
          .fromTo(
            ".f-item",
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.08 },
            0.3,
          );

        // Soft background glow drifts as you scroll
        gsap.fromTo(
          ".ct-glow",
          { yPercent: 25 },
          {
            yPercent: -25,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
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

      /* Focus line: draws in from the left, leaves to the right (works on touch too) */
      const lineOf = (t: EventTarget | null) =>
        (t as HTMLElement | null)
          ?.closest<HTMLElement>(".field")
          ?.querySelector<HTMLElement>(".field-line") ?? null;

      const focusIn = (e: FocusEvent) => {
        const line = lineOf(e.target);
        if (!line) return;
        gsap.set(line, { transformOrigin: "0% 50%" });
        gsap.to(line, {
          scaleX: 1,
          duration: 0.8,
          ease: "hero",
          overwrite: true,
        });
      };
      const focusOut = (e: FocusEvent) => {
        const line = lineOf(e.target);
        if (!line) return;
        gsap.set(line, { transformOrigin: "100% 50%" });
        gsap.to(line, {
          scaleX: 0,
          duration: 0.6,
          ease: "heroInOut",
          overwrite: true,
        });
      };
      el.addEventListener("focusin", focusIn);
      el.addEventListener("focusout", focusOut);

      return () => {
        el.removeEventListener("focusin", focusIn);
        el.removeEventListener("focusout", focusOut);
        mm.revert();
      };
    },
    { scope: root },
  );

  /* ---------------- Validation feedback: shake fields, drop errors in ---------------- */
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const bad = gsap.utils.toArray<HTMLElement>('.field[data-error="true"]');
      if (!bad.length) return;

      gsap.fromTo(
        bad,
        { x: -10 },
        { x: 0, duration: 0.9, ease: "elastic.out(1, 0.3)", stagger: 0.06 },
      );
      gsap.fromTo(
        ".err",
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "hero", stagger: 0.06 },
      );
    },
    { scope: root, dependencies: [errors] },
  );

  /* ---------------- Swap between form and success state ---------------- */
  useGSAP(
    () => {
      if (prevSubmitted.current === submitted) return;
      prevSubmitted.current = submitted;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      if (submitted) {
        gsap.fromTo(
          ".s-icon",
          { scale: 0, rotate: -30 },
          { scale: 1, rotate: 0, duration: 1.1, ease: "back.out(1.7)" },
        );
        gsap.fromTo(
          ".s-item",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "hero",
            stagger: 0.1,
            delay: 0.15,
          },
        );
      } else {
        gsap.fromTo(
          ".f-item",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "hero", stagger: 0.07 },
        );
      }
    },
    { scope: root, dependencies: [submitted] },
  );

  /* ---------------- Hover effects (mouse devices only), re-attached when the form remounts ---------------- */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(FINE_POINTER, () => {
        const cleanups: Array<() => void> = [];

        el.querySelectorAll<HTMLElement>(".fill-btn").forEach((btn) =>
          cleanups.push(attachFillButton(btn, 0.3)),
        );

        const link = el.querySelector<HTMLElement>(".email-link");
        if (link) {
          const line = link.querySelector<HTMLElement>(".email-line")!;
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
        }

        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [submitted], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="contact"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/10 bg-estora-bg-elevated"
    >
      {/* Hide animated parts until GSAP has set their start state (prevents flash) */}
      <style>{`#contact:not([data-ready]) .reveal{opacity:0}`}</style>

      {/* Background glow */}
      <div className="ct-glow pointer-events-none absolute -left-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-estora-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1600px] px-6 py-24 lg:px-12 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* ------------------------------ Left ------------------------------ */}
          <div className="contact-left flex flex-col lg:col-span-7">
            <div className="flex items-center gap-4">
              <span className="ct-eyebrow-rule reveal h-px w-14 bg-estora-accent" />
              <span className="block overflow-hidden">
                <span className="ct-eyebrow-text reveal block font-body text-xs font-medium uppercase tracking-[0.3em] text-estora-accent lg:text-[13px]">
                  Let&apos;s talk
                </span>
              </span>
            </div>

            <h2 className="mt-6 font-display text-[clamp(2.25rem,6.2vw,6rem)] font-medium leading-[0.95] tracking-[-0.04em] text-estora-text-primary">
              {headlineLines.map((line) => (
                <span
                  key={line}
                  className="-my-[0.12em] block overflow-hidden whitespace-nowrap py-[0.12em] pr-[0.1em]"
                >
                  <span className="ct-line reveal inline-block will-change-transform">
                    {line === "with a place." ? (
                      <>
                        with a{" "}
                        <span className="font-light italic text-estora-accent">
                          place.
                        </span>
                      </>
                    ) : (
                      line
                    )}
                  </span>
                </span>
              ))}
            </h2>

            <p className="ct-copy reveal mt-8 max-w-md font-body text-base leading-relaxed text-estora-text-muted lg:text-lg">
              Tell us what you&apos;re looking for. We&apos;ll help you take the
              next step.
            </p>

            <div className="mt-10 flex flex-col items-stretch gap-4 sm:items-start">
              {/* Primary */}
              <Link
                href="/properties"
                className="c-btn fill-btn reveal group relative inline-flex w-full items-center justify-between gap-4 overflow-hidden whitespace-nowrap rounded-full bg-estora-accent py-2 pl-8 pr-2 font-display text-base font-medium text-estora-bg transition-[scale] duration-200 active:scale-[0.97] sm:w-auto sm:justify-start"
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
                  <span className="block">Find Your Property</span>
                  <span className="absolute left-0 top-full block" aria-hidden>
                    Find Your Property
                  </span>
                </span>
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-estora-bg text-estora-accent">
                  <ArrowRight data-arrow-a className="h-5 w-5" />
                  <ArrowRight
                    data-arrow-b
                    className="absolute h-5 w-5"
                    style={{ transform: "translateX(-40px)" }}
                    aria-hidden
                  />
                </span>
              </Link>

              {/* WhatsApp */}
              <a
                href={getWhatsAppUrl(defaultWhatsAppMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="c-btn fill-btn reveal group relative inline-flex w-full items-center justify-between gap-4 overflow-hidden whitespace-nowrap rounded-full border border-white/20 py-2 pl-8 pr-2 font-display text-base font-medium text-estora-text-primary transition-[color,border-color,scale] duration-500 hover:border-estora-accent hover:text-estora-bg active:scale-[0.97] sm:w-auto sm:justify-start"
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
                  <span className="block">Enquire on WhatsApp</span>
                  <span className="absolute left-0 top-full block" aria-hidden>
                    Enquire on WhatsApp
                  </span>
                </span>
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-estora-accent text-estora-bg transition-colors duration-500 group-hover:bg-estora-bg group-hover:text-estora-accent">
                  <MessageCircle data-arrow-a className="h-5 w-5" />
                  <MessageCircle
                    data-arrow-b
                    className="absolute h-5 w-5"
                    style={{ transform: "translateX(-40px)" }}
                    aria-hidden
                  />
                </span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="c-btn email-link reveal relative mt-2 inline-flex items-center gap-3 self-start pb-2 font-body text-sm text-estora-text-primary lg:text-base"
              >
                <Mail className="h-4 w-4 text-estora-accent" />
                {siteConfig.contact.email}
                <span className="absolute bottom-0 left-0 h-px w-full bg-white/20" />
                <span
                  className="email-line absolute bottom-0 left-0 h-px w-full bg-estora-accent"
                  style={{ transform: "scaleX(0)", transformOrigin: "0% 50%" }}
                />
              </a>
            </div>
          </div>

          {/* ------------------------------ Right: form ------------------------------ */}
          <div className="lg:col-span-5">
            <div className="form-card reveal rounded-3xl border border-white/10 bg-estora-bg p-6 sm:p-8 lg:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center lg:py-16">
                  <span className="s-icon flex h-20 w-20 items-center justify-center rounded-full border border-estora-accent/40 text-estora-accent">
                    <CheckCircle2 className="h-10 w-10" />
                  </span>
                  <h3 className="s-item mt-8 font-display text-3xl font-medium tracking-tight text-estora-text-primary">
                    Thank you, {name.split(" ")[0]}.
                  </h3>
                  <p className="s-item mt-3 max-w-sm font-body text-sm leading-relaxed text-estora-text-muted">
                    This is a portfolio demo, so your message has not been sent
                    to a real business. In a live deployment, this form would
                    connect to a real contact channel.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setErrors({});
                      setName("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="s-item mt-8 border-b border-estora-accent/40 pb-1 font-display text-sm font-medium text-estora-accent transition-colors duration-300 hover:border-estora-text-primary hover:text-estora-text-primary"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-7"
                >
                  <div className="f-item">
                    <h3 className="font-display text-2xl font-medium tracking-tight text-estora-text-primary lg:text-3xl">
                      Send an enquiry
                    </h3>
                    <p className="mt-2 font-body text-sm text-estora-text-muted">
                      We usually reply within one working day.
                    </p>
                  </div>

                  <Field id="contact-name" label="Name" error={errors.name}>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      aria-invalid={!!errors.name}
                      aria-describedby={
                        errors.name ? "contact-name-error" : undefined
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field id="contact-email" label="Email" error={errors.email}>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "contact-email-error" : undefined
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    id="contact-message"
                    label="What are you looking for?"
                    error={errors.message}
                  >
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about the property you have in mind..."
                      rows={4}
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "contact-message-error" : undefined
                      }
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  <button
                    type="submit"
                    className="f-item fill-btn group relative inline-flex w-full items-center justify-between gap-4 overflow-hidden whitespace-nowrap rounded-full bg-estora-text-primary py-2 pl-8 pr-2 font-display text-base font-medium text-estora-bg transition-[scale] duration-200 active:scale-[0.98]"
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
                      <span className="block">Send Enquiry</span>
                      <span
                        className="absolute left-0 top-full block"
                        aria-hidden
                      >
                        Send Enquiry
                      </span>
                    </span>
                    <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-estora-bg text-estora-text-primary">
                      <ArrowRight data-arrow-a className="h-5 w-5" />
                      <ArrowRight
                        data-arrow-b
                        className="absolute h-5 w-5"
                        style={{ transform: "translateX(-40px)" }}
                        aria-hidden
                      />
                    </span>
                  </button>

                  <p className="f-item text-center font-body text-xs text-estora-text-muted/60">
                    Portfolio demo. No message is actually sent.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
