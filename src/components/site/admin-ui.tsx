"use client";

import React, { ReactNode } from "react";

export interface AdminHeadProps {
  title: string;
  eyebrow?: string;
  intro?: string;
  action?: ReactNode;
  breadcrumb?: string;
}

export function AdminHead({ title, eyebrow = "Admin Console", intro, action, breadcrumb }: AdminHeadProps) {
  return (
    <div className="relative border-b border-line bg-surface p-6 sm:p-8 shadow-sm">
      {/* Subtle blueprint accent line */}
      <div className="absolute top-0 left-0 h-1 w-24 bg-accent" />

      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 font-bold tracking-wider text-accent uppercase">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              {eyebrow}
            </span>
            {breadcrumb ? (
              <>
                <span className="text-muted">/</span>
                <span className="text-muted">{breadcrumb}</span>
              </>
            ) : null}
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {title}
          </h1>

          {intro ? (
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
              {intro}
            </p>
          ) : null}
        </div>

        {action ? <div className="flex flex-wrap items-center gap-3 shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}

export interface PanelProps {
  title: string;
  badge?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, badge, action, children, className = "" }: PanelProps) {
  return (
    <section className={`border border-line bg-surface shadow-sm overflow-hidden ${className}`}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-background/50 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="tech-label font-bold text-foreground text-xs uppercase tracking-wider">
            {title}
          </span>
          {badge ? (
            <span className="border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.65rem] font-semibold text-accent uppercase">
              {badge}
            </span>
          ) : null}
        </div>
        {action ? <div className="flex items-center gap-2">{action}</div> : null}
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}

const inputBaseCls =
  "mt-2 w-full border border-line bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/60 outline-none transition-all duration-200 focus:border-accent focus:ring-1 focus:ring-accent";

export interface TextFieldProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  helper?: string;
  type?: string;
  required?: boolean;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  rows,
  helper,
  type = "text",
  required = false,
}: TextFieldProps) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="tech-label text-muted text-xs">
          {label} {required ? <span className="text-danger">*</span> : null}
        </span>
        {helper ? <span className="font-mono text-[0.68rem] text-muted">{helper}</span> : null}
      </div>
      {rows ? (
        <textarea
          rows={rows}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputBaseCls}
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputBaseCls}
        />
      )}
    </label>
  );
}

export interface SelectFieldProps {
  label: string;
  value?: string;
  options: Array<string | { label: string; value: string }>;
  onChange: (val: string) => void;
  helper?: string;
}

export function SelectField({ label, value, options, onChange, helper }: SelectFieldProps) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="tech-label text-muted text-xs">{label}</span>
        {helper ? <span className="font-mono text-[0.68rem] text-muted">{helper}</span> : null}
      </div>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBaseCls} font-mono`}
      >
        {options.map((o) => {
          const val = typeof o === "object" ? o.value : o;
          const lbl = typeof o === "object" ? o.label : o;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  description?: string;
}

export function Toggle({ label, checked, onChange, description }: ToggleProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`group flex items-center justify-between gap-4 border p-3.5 transition-all duration-200 cursor-pointer select-none ${
        checked
          ? "border-accent/60 bg-accent/5"
          : "border-line bg-background/50 hover:border-line-strong"
      }`}
    >
      <div>
        <span
          className={`font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
            checked ? "text-accent" : "text-foreground"
          }`}
        >
          {label}
        </span>
        {description ? (
          <p className="mt-0.5 text-[0.7rem] text-muted leading-tight">{description}</p>
        ) : null}
      </div>
      <div
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-line-strong"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow-sm transition-transform duration-200 mt-0.5 ml-0.5 ${
            checked ? "translate-x-5 bg-navy" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
}

export interface MiniBtnProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  tone?: "default" | "accent" | "primary" | "danger" | "success" | "light" | "ghost";
  disabled?: boolean;
  title?: string;
  type?: "button" | "submit" | "reset";
}

export function MiniBtn({
  children,
  onClick,
  tone = "default",
  disabled = false,
  title,
  type = "button",
}: MiniBtnProps) {
  const tones: Record<string, string> = {
    default: "border-line-strong bg-surface text-foreground hover:border-navy hover:bg-navy hover:text-onnavy",
    accent: "border-accent bg-accent/15 text-accent hover:bg-accent hover:text-navy font-bold",
    primary: "border-accent bg-accent text-navy hover:bg-navy hover:text-onnavy font-bold shadow-sm",
    danger: "border-danger/40 bg-danger/10 text-danger hover:bg-danger hover:text-white",
    success: "border-success/40 bg-success/10 text-success hover:bg-success hover:text-navy",
    light: "border-line bg-background text-muted hover:border-accent hover:text-foreground",
    ghost: "border-transparent text-muted hover:text-foreground hover:bg-line/40",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`inline-flex items-center justify-center gap-2 border px-3.5 py-2 font-mono text-[0.7rem] font-semibold tracking-[0.1em] uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        tones[tone] || tones.default
      }`}
    >
      {children}
    </button>
  );
}

export interface StatProps {
  label: string;
  value: string | number;
  note?: string;
  icon?: ReactNode;
  tone?: "default" | "accent" | "danger" | "success";
}

export function Stat({ label, value, note, icon, tone = "default" }: StatProps) {
  const toneClasses: Record<string, string> = {
    default: "border-line bg-surface",
    accent: "border-accent/40 bg-accent/5",
    danger: "border-danger/40 bg-danger/5",
    success: "border-success/40 bg-success/5",
  };

  const textToneClasses: Record<string, string> = {
    default: "text-foreground",
    accent: "text-accent",
    danger: "text-danger",
    success: "text-success",
  };

  return (
    <div className={`relative border p-6 transition-all duration-300 hover:border-line-strong hover:shadow-md ${toneClasses[tone] || toneClasses.default}`}>
      <div className="flex items-center justify-between">
        <span className="tech-label text-muted text-xs tracking-wider uppercase">{label}</span>
        {icon ? <div className="text-muted/70">{icon}</div> : null}
      </div>
      <p className={`mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight ${textToneClasses[tone] || textToneClasses.default}`}>
        {value}
      </p>
      {note ? <p className="mt-2 font-mono text-xs text-muted truncate">{note}</p> : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; label: string }> = {
    new: { bg: "bg-danger/10 text-danger border-danger/30", label: "New / Unread" },
    unread: { bg: "bg-danger/10 text-danger border-danger/30", label: "Unread" },
    "in-progress": { bg: "bg-accent/15 text-accent border-accent/40", label: "In Progress" },
    "under-review": { bg: "bg-accent/15 text-accent border-accent/40", label: "Under Review" },
    quoted: { bg: "bg-success/15 text-success border-success/40", label: "Quotation Issued" },
    resolved: { bg: "bg-success/15 text-success border-success/40", label: "Resolved" },
    closed: { bg: "bg-line text-muted border-line-strong", label: "Closed" },
  };

  const item = map[status] || { bg: "bg-line text-muted border-line", label: status || "Unknown" };

  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider ${item.bg}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {item.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    urgent: "bg-danger/15 text-danger border-danger/40 animate-pulse",
    high: "bg-accent/15 text-accent border-accent/40",
    standard: "bg-line text-muted border-line",
  };

  return (
    <span className={`inline-flex items-center border px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider ${map[priority] || map.standard}`}>
      {priority === "urgent" ? "🔥 Urgent" : priority === "high" ? "★ High" : "Standard"}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-line bg-surface/50 p-12 sm:p-16 text-center">
      {icon ? <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-line/50 text-muted">{icon}</div> : null}
      <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted leading-relaxed">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
  className?: string;
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  size = "lg",
  className = "",
}: AdminModalProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<string, string> = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-5xl",
    "4xl": "max-w-6xl",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-navy-deep/80 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full ${
          sizeClasses[size] || sizeClasses.lg
        } border border-line bg-surface shadow-2xl overflow-hidden transition-all transform animate-scaleUp my-auto max-h-[90vh] flex flex-col ${className}`}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/70 to-transparent" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-line bg-background/60 px-6 py-4 shrink-0">
          <div>
            {eyebrow ? (
              <span className="tech-label text-accent text-[0.65rem] font-bold tracking-widest uppercase block">
                {eyebrow}
              </span>
            ) : null}
            <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground mt-0.5">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded p-1.5 text-muted hover:text-foreground hover:bg-line/40 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 font-sans text-sm text-foreground">
          {children}
        </div>

        {/* Modal Footer */}
        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line bg-background/60 px-6 py-3.5 shrink-0">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  itemName?: string;
  itemDetails?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDeleting?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this record? This action cannot be undone and will permanently remove data from the database.",
  itemName,
  itemDetails,
  confirmLabel = "Delete Permanently",
  cancelLabel = "Cancel",
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-navy-deep/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="relative w-full max-w-md border border-danger/40 bg-surface shadow-2xl overflow-hidden animate-scaleUp my-auto">
        {/* Top Danger Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-danger" />

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border border-danger/40 bg-danger/10 flex items-center justify-center text-danger shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="tech-label text-danger text-[0.65rem] font-bold tracking-wider uppercase block">
                Warning: Permanent Action
              </span>
              <h3 className="font-display text-lg font-bold text-foreground mt-0.5">{title}</h3>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted leading-relaxed">{message}</p>

          {itemName ? (
            <div className="mt-3.5 border border-line bg-background p-3 font-mono text-xs text-foreground flex items-center gap-2">
              <span className="text-muted shrink-0">Target:</span>
              <span className="font-bold text-danger truncate">{itemName}</span>
            </div>
          ) : null}

          {itemDetails ? <div className="mt-3">{itemDetails}</div> : null}

          <div className="mt-6 flex items-center justify-end gap-2.5">
            <MiniBtn onClick={onClose} disabled={isDeleting}>
              {cancelLabel}
            </MiniBtn>
            <MiniBtn tone="danger" onClick={onConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : confirmLabel}
            </MiniBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

