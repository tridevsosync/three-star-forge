"use client";

import Link from "next/link";
import React, { useEffect, useState, ReactNode, MouseEvent } from "react";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

export interface TechLabelProps {
  children: ReactNode;
  tone?: "accent" | "light" | "dark" | "muted";
}

export function TechLabel({ children, tone = "muted" }: TechLabelProps) {
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

export interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "accent" | "navy" | "success";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.08em] rounded-full";
  const variants = {
    default: "border border-line bg-surface text-foreground shadow-xs",
    accent: "border border-accent/50 bg-accent/15 text-accent shadow-xs",
    navy: "border border-onnavy/20 bg-navy text-onnavy shadow-xs",
    success: "border border-success/40 bg-success/15 text-success shadow-xs",
  };
  return <span className={`${base} ${variants[variant] || variants.default} ${className}`}>{children}</span>;
}

export interface SectionHeadProps {
  index?: string | number;
  eyebrow?: string;
  title: string;
  intro?: string;
  dark?: boolean;
  align?: "left" | "center";
}

export function SectionHead({ index, eyebrow, title, intro, dark = false, align = "left" }: SectionHeadProps) {
  return (
    <div className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        {index ? (
          <span className="font-sans text-xs font-bold text-accent px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
            {index}
          </span>
        ) : null}
        <span className="h-px w-8 bg-accent/50" />
        {eyebrow && <TechLabel tone={dark ? "light" : "muted"}>{eyebrow}</TechLabel>}
      </div>
      <h2
        className={`mt-4 text-3xl leading-[1.1] font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-onnavy" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
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
  "group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 rounded-xl cursor-pointer whitespace-nowrap select-none";
const variants = {
  primary:
    "bg-accent text-navy hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98] font-bold",
  outline:
    "border border-line-strong text-foreground hover:border-accent hover:bg-accent/5 hover:text-accent bg-surface font-semibold active:scale-[0.98]",
  light:
    "border border-white/25 bg-white/10 text-onnavy hover:bg-white hover:text-navy font-semibold backdrop-blur-md shadow-sm active:scale-[0.98]",
  ghost: "text-foreground hover:text-accent hover:bg-accent/10 font-semibold active:scale-[0.98]",
  accentGhost: "text-accent hover:bg-accent/15 border border-accent/40 font-semibold active:scale-[0.98]",
  accentOutline: "border border-accent bg-accent/10 text-accent hover:bg-accent hover:text-navy font-bold shadow-sm active:scale-[0.98]",
};

export interface BtnProps {
  children: ReactNode;
  to?: string;
  href?: string;
  params?: Record<string, string>;
  variant?: "primary" | "outline" | "light" | "ghost" | "accentGhost" | "accentOutline";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  full?: boolean;
}

export function Btn({
  children,
  to,
  href,
  params,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
  full = false,
}: BtnProps) {
  const cls = `${btnBase} ${variants[variant] || variants.primary} ${full ? "w-full" : ""} ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""} ${className}`;
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

export function Rule({ className = "" }: { className?: string }) {
  return <div className={`my-8 h-px w-full bg-line ${className}`} />;
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
}

export function MetricCard({ label, value, subtext, icon }: MetricCardProps) {
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

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  image?: string;
  title?: string;
  category?: string;
  description?: string;
  items?: Array<{ id?: string; image: string; title?: string; category?: string; description?: string }>;
  currentIndex?: number;
  onChangeIndex?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function Lightbox({
  isOpen,
  onClose,
  image,
  title,
  category,
  description,
  items = [],
  currentIndex = 0,
  onChangeIndex,
  onNext,
  onPrev,
}: LightboxProps) {
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setZoom(false);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        if (onNext) onNext();
        else if (items.length > 0 && onChangeIndex) {
          onChangeIndex((currentIndex + 1) % items.length);
        }
      }
      if (e.key === "ArrowLeft") {
        if (onPrev) onPrev();
        else if (items.length > 0 && onChangeIndex) {
          onChangeIndex((currentIndex - 1 + items.length) % items.length);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev, items, currentIndex, onChangeIndex]);

  if (!isOpen) return null;

  const currentItem = items.length > 0 && items[currentIndex] ? items[currentIndex] : null;
  const displayImage = currentItem?.image || image;
  const displayTitle = currentItem?.title || title || "Equipment Photograph";
  const displayCategory = currentItem?.category || category;
  const displayDesc = currentItem?.description || description;

  const handleNextAction = () => {
    if (onNext) onNext();
    else if (items.length > 0 && onChangeIndex) {
      onChangeIndex((currentIndex + 1) % items.length);
    }
  };

  const handlePrevAction = () => {
    if (onPrev) onPrev();
    else if (items.length > 0 && onChangeIndex) {
      onChangeIndex((currentIndex - 1 + items.length) % items.length);
    }
  };

  const total = items.length > 0 ? items.length : 1;
  const currentNum = items.length > 0 ? currentIndex + 1 : 1;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-navy/95 backdrop-blur-md p-3 sm:p-6 overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between max-w-6xl py-2 z-10 border-b border-onnavy/15 text-onnavy">
        <div className="flex items-center gap-3">
          <span className="font-sans text-xs font-bold text-accent px-3 py-1 bg-accent/10 border border-accent/30 rounded-full">
            {String(currentNum).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          {displayCategory && (
            <span className="tech-label text-onnavy-muted hidden sm:inline-block">
              {displayCategory}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={() => setZoom(!zoom)}
            className="px-3.5 py-1.5 rounded-lg border border-onnavy/20 text-onnavy-muted hover:text-accent hover:border-accent font-sans font-semibold text-xs transition-colors flex items-center gap-1.5"
            title={zoom ? "Normal view" : "Zoom in"}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {zoom ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              )}
            </svg>
            <span className="hidden sm:inline">{zoom ? "100%" : "Zoom"}</span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-navy font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <span>Close</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="relative w-full max-w-6xl flex-1 flex items-center justify-center min-h-0 my-2">
        {/* Prev Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrevAction}
            className="absolute left-1 sm:left-4 z-20 p-3.5 bg-navy/80 border border-onnavy/20 text-onnavy hover:text-accent hover:border-accent hover:bg-navy transition-all backdrop-blur-sm"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={handleNextAction}
            className="absolute right-1 sm:right-4 z-20 p-3.5 bg-navy/80 border border-onnavy/20 text-onnavy hover:text-accent hover:border-accent hover:bg-navy transition-all backdrop-blur-sm"
            aria-label="Next image"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Image Container */}
        <div
          className={`relative max-h-[68vh] w-full flex items-center justify-center overflow-auto p-1 transition-all ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
          onClick={() => setZoom(!zoom)}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayTitle}
              className={`object-contain transition-all duration-300 ${
                zoom ? "max-h-none max-w-none scale-125 my-auto" : "max-h-[68vh] max-w-full"
              }`}
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center text-xs text-onnavy-muted">
              No Image Available
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info Bar & Thumbnails */}
      <div className="w-full max-w-6xl border-t border-onnavy/15 pt-3 z-10 flex flex-col gap-3 text-onnavy">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <h4 className="text-base sm:text-lg font-semibold text-onnavy leading-snug">{displayTitle}</h4>
            {displayDesc && (
              <p className="mt-1 text-xs text-onnavy-muted leading-relaxed">{displayDesc}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/quote?project=${encodeURIComponent(displayTitle)}&machine=${encodeURIComponent(displayCategory || "Induction Hardening Machine")}`}
              className="rounded-xl border border-accent bg-accent/15 px-4 py-2 text-xs font-semibold tracking-wider text-accent uppercase hover:bg-accent hover:text-navy transition-all flex items-center gap-2"
            >
              <span>Request Quote for This Build</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Thumbnail Ribbon */}
        {items.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {items.map((it, idx) => (
              <button
                key={it.id || idx}
                type="button"
                onClick={() => (onChangeIndex ? onChangeIndex(idx) : null)}
                className={`relative h-12 w-16 shrink-0 rounded-lg border overflow-hidden transition-all cursor-pointer ${
                  idx === currentIndex
                    ? "border-accent ring-2 ring-accent/50 opacity-100 scale-105"
                    : "border-onnavy/20 opacity-50 hover:opacity-100"
                }`}
              >
                {it.image ? (
                  <img src={it.image} alt={it.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[0.65rem] text-onnavy-muted">
                    No Img
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}
