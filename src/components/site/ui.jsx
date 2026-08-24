"use client";

import Link from "next/link";
import { useEffect } from "react";

export function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

export function TechLabel({ children, tone = "muted" }) {
  const color =
    tone === "accent"
      ? "text-accent"
      : tone === "light"
        ? "text-onnavy-muted"
        : tone === "dark"
          ? "text-foreground"
          : "text-muted";
  return <span className={`tech-label ${color}`}>{children}</span>;
}

export function Badge({ children, variant = "default", className = "" }) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em]";
  const variants = {
    default: "border border-line bg-surface text-foreground",
    accent: "border border-accent/60 bg-accent/10 text-accent",
    navy: "border border-onnavy/20 bg-navy text-onnavy",
    success: "border border-success/40 bg-success/10 text-success",
  };
  return <span className={`${base} ${variants[variant] || variants.default} ${className}`}>{children}</span>;
}

export function SectionHead({ index, eyebrow, title, intro, dark = false, align = "left" }) {
  return (
    <div className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        {index ? <span className="tech-label text-accent font-semibold">{index}</span> : null}
        <span className="h-px w-8 bg-accent" />
        <TechLabel tone={dark ? "light" : "muted"}>{eyebrow}</TechLabel>
      </div>
      <h2
        className={`mt-5 text-3xl leading-[1.08] font-bold sm:text-4xl lg:text-[2.85rem] ${
          dark ? "text-onnavy" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            dark ? "text-onnavy-muted" : "text-muted"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

const btnBase =
  "group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-[0.78rem] font-semibold tracking-[0.14em] uppercase transition-all duration-300 rounded-[2px]";
const variants = {
  primary: "bg-accent text-navy hover:bg-navy hover:text-onnavy shadow-[0_4px_16px_rgba(14,165,233,0.25)] hover:shadow-none",
  outline:
    "border border-line-strong text-foreground hover:border-navy hover:bg-navy hover:text-onnavy",
  light: "border border-onnavy/30 text-onnavy hover:bg-onnavy hover:text-navy",
  ghost: "text-foreground hover:text-accent",
  accentGhost: "text-accent hover:bg-accent/10 border border-accent/30",
};

export function Btn({
  children,
  to,
  href,
  params,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
  full = false,
}) {
  const cls = `${btnBase} ${variants[variant] || variants.primary} ${full ? "w-full" : ""} ${className}`;
  const target = href || to;

  const inner = (
    <>
      <span>{children}</span>
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </>
  );

  if (target) {
    let finalHref = target;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        finalHref = finalHref.replace(`$${k}`, v);
      });
    }
    return (
      <Link href={finalHref} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function Rule({ className = "" }) {
  return <div className={`my-8 h-px w-full bg-line ${className}`} />;
}

export function MetricCard({ label, value, subtext, icon }) {
  return (
    <div className="card-soft p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <span className="tech-label text-muted">{label}</span>
        {icon}
      </div>
      <div className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
        {value}
      </div>
      {subtext ? <p className="mt-2 text-xs text-muted leading-relaxed">{subtext}</p> : null}
    </div>
  );
}

export function Lightbox({ isOpen, onClose, image, title, category, onNext, onPrev }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 backdrop-blur-md p-4 sm:p-8">
      <div className="relative max-w-5xl w-full flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:right-0 p-2 text-onnavy hover:text-accent font-mono text-sm tracking-widest uppercase flex items-center gap-2"
        >
          <span>Close [ESC]</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Prev Button */}
        {onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-2 sm:-left-16 top-1/2 -translate-y-1/2 p-3 bg-navy/80 border border-onnavy/20 text-onnavy hover:text-accent hover:border-accent transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Button */}
        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-2 sm:-right-16 top-1/2 -translate-y-1/2 p-3 bg-navy/80 border border-onnavy/20 text-onnavy hover:text-accent hover:border-accent transition-colors"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Main Image */}
        <div className="overflow-hidden border border-onnavy/20 bg-navy max-h-[75vh] w-full flex items-center justify-center">
          <img
            src={image}
            alt={title || "Engineering preview"}
            className="max-h-[75vh] w-auto max-w-full object-contain"
          />
        </div>

        {/* Caption */}
        <div className="mt-4 w-full flex items-center justify-between border-t border-onnavy/15 pt-3 text-onnavy">
          <div>
            {category && <span className="tech-label text-accent block">{category}</span>}
            <h4 className="text-base font-semibold mt-0.5">{title}</h4>
          </div>
          <span className="font-mono text-xs text-onnavy-muted">Three Star Enterprises Precision Archive</span>
        </div>
      </div>
    </div>
  );
}

export function Reveal({ children, className = "" }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}
