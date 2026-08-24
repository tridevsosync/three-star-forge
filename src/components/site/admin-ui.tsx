import type { ReactNode } from "react";

export function AdminHead({
  title,
  intro,
  action,
}: {
  title: string;
  intro?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
        {intro ? <p className="mt-3 text-sm leading-relaxed text-muted">{intro}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-line bg-surface">
      <header className="border-b border-line px-6 py-4">
        <span className="tech-label text-muted">{title}</span>
      </header>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}

const inputCls =
  "mt-2 w-full border border-line bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent";

export function TextField({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="tech-label text-muted">{label}</span>
      {rows ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="tech-label text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-3 border px-3.5 py-2 text-[0.7rem] font-semibold tracking-[0.1em] uppercase transition-colors ${
        checked
          ? "border-accent bg-accent/10 text-accent"
          : "border-line text-muted hover:border-line-strong"
      }`}
    >
      <span className={`h-2 w-2 ${checked ? "bg-accent" : "bg-line-strong"}`} />
      {label}
    </button>
  );
}

export function MiniBtn({
  children,
  onClick,
  tone = "default",
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: "default" | "danger" | "accent";
}) {
  const cls =
    tone === "danger"
      ? "border-danger/40 text-danger hover:bg-danger/10"
      : tone === "accent"
        ? "border-accent bg-accent/10 text-accent hover:bg-accent hover:text-navy"
        : "border-line-strong text-foreground hover:border-navy hover:bg-navy hover:text-onnavy";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3.5 py-2 text-[0.7rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${cls}`}
    >
      {children}
    </button>
  );
}

export function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div className="border border-line bg-surface p-6">
      <span className="tech-label text-muted">{label}</span>
      <p className="mt-4 font-display text-4xl font-semibold text-foreground">{value}</p>
      {note ? <p className="mt-2 text-xs text-muted">{note}</p> : null}
    </div>
  );
}
