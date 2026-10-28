import Link from "next/link";

export function Card({ title, sub, badge, children, className = "" }: { title: string; sub?: React.ReactNode; badge?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-line bg-card p-5 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        {badge && <span className="rounded-full bg-good-soft px-2 py-0.5 text-[11px] font-semibold text-good">{badge}</span>}
      </div>
      {sub && <p className="mt-1 mb-4 text-[13px] text-muted">{sub}</p>}
      {!sub && <div className="mb-4" />}
      {children}
    </section>
  );
}

export function Stat({ label, value, sub, className = "" }: { label: string; value: string; sub?: string; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-card px-4 py-4 ${className}`}>
      <div className="text-xs tracking-wide text-muted uppercase">{label}</div>
      <div className="mt-1.5 font-display text-2xl leading-tight font-semibold sm:text-[28px]">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl bg-sunk px-4 py-6 text-center text-[13px] text-muted">{children}</p>;
}

export function Logo() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B0F14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17" r="3.5" />
        <circle cx="18.5" cy="17" r="3.5" />
        <path d="M5.5 17 10 8h5l3.5 9M10 8 8 5H6M15 8l-3 9" />
      </svg>
    </span>
  );
}

export function ButtonLink({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={
        primary
          ? "flex min-h-11 items-center rounded-[10px] bg-accent px-4 font-semibold !text-on-accent hover:opacity-90"
          : "flex min-h-11 items-center rounded-[10px] border border-edge px-4 font-semibold !text-ink hover:bg-white/5"
      }
    >
      {children}
    </Link>
  );
}

/** Miles / Km switch. */
export function UnitSwitch({ units, onChange }: { units: "mi" | "km"; onChange: (u: "mi" | "km") => void }) {
  return (
    <div className="flex rounded-[10px] border border-edge bg-card p-[3px]" role="group" aria-label="Units">
      {(["mi", "km"] as const).map((u) => (
        <button
          key={u}
          type="button"
          aria-pressed={units === u}
          onClick={() => onChange(u)}
          className={`min-h-9 rounded-lg px-3.5 text-[13px] font-semibold ${units === u ? "bg-accent text-on-accent" : "text-soft hover:text-ink"}`}
        >
          {u === "mi" ? "Miles" : "Km"}
        </button>
      ))}
    </div>
  );
}

/** A thin stacked bar of assist modes. */
export function ModeBar({ parts, className = "h-3.5" }: { parts: { key: string; share: number; color: string; name: string }[]; className?: string }) {
  return (
    <div className={`flex overflow-hidden rounded bg-line ${className}`} role="img" aria-label={parts.map((p) => `${p.name} ${Math.round(p.share * 100)}%`).join(", ")}>
      {parts.map((p) => (
        <div key={p.key} style={{ width: `${p.share * 100}%`, background: p.color }} />
      ))}
    </div>
  );
}
