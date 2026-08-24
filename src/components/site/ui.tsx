import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

export function TechLabel({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "accent" | "light";
}) {
  const color =
    tone === "accent" ? "text-accent" : tone === "light" ? "text-onnavy-muted" : "text-muted";
  return <span className={`tech-label ${color}`}>{children}</span>;
}

export function SectionHead({
  index,
  eyebrow,
  title,
  intro,
  dark = false,
  align = "left",
}: {
  index?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  dark?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        {index ? <span className="tech-label text-accent">{index}</span> : null}
        <span className="h-px w-8 bg-accent" />
        <TechLabel tone={dark ? "light" : "muted"}>{eyebrow}</TechLabel>
      </div>
      <h2
        className={`mt-5 text-3xl leading-[1.08] font-semibold sm:text-4xl lg:text-[2.9rem] ${
          dark ? "text-onnavy" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={`mt-5 text-base leading-relaxed ${dark ? "text-onnavy-muted" : "text-muted"}`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

type BtnProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  params?: Record<string, string>;
  variant?: "primary" | "outline" | "ghost" | "light";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
  full?: boolean;
};

const btnBase =
  "group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-[0.8rem] font-semibold tracking-[0.12em] uppercase transition-all duration-300 rounded-[2px]";

const variants: Record<string, string> = {
  primary: "bg-accent text-navy hover:bg-navy hover:text-onnavy",
  outline:
    "border border-line-strong text-foreground hover:border-navy hover:bg-navy hover:text-onnavy",
  light: "border border-onnavy/30 text-onnavy hover:bg-onnavy hover:text-navy",
  ghost: "text-foreground hover:text-accent",
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
}: BtnProps) {
  const cls = `${btnBase} ${variants[variant]} ${full ? "w-full" : ""} ${className}`;
  const inner = (
    <>
      {children}
      <Arrow />
    </>
  );
  if (to) {
    const LinkAny = Link as unknown as (p: {
      to: string;
      params?: Record<string, string>;
      className?: string;
      children?: ReactNode;
    }) => ReactNode;
    return (
      <LinkAny to={to} {...(params ? { params } : {})} className={cls}>
        {inner}
      </LinkAny>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Rule({ dark = false }: { dark?: boolean }) {
  return <div className={`h-px w-full ${dark ? "bg-onnavy/12" : "bg-line"}`} />;
}
