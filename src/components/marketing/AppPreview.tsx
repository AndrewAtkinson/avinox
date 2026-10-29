import { BRAND } from "./brand";

/** A static sample of the app, so people can see what they're signing in to. */
export function AppPreview({ compact = false }: { compact?: boolean }) {
  const p = BRAND.preview;
  return (
    <div className="mk-preview" aria-label={`Example: ${p.title}`} role="img">
      <div className="mk-preview-head">
        <span>{p.title}</span>
        <span className="mk-pill">{p.tag}</span>
      </div>
      <div>
        <div className="mk-preview-stat">{p.stat}</div>
        <div className="mk-preview-label">{p.statLabel}</div>
      </div>
      {!compact && p.bars.length > 0 && (
        <div className="mk-bars" aria-hidden="true">
          {p.bars.map((h, i) => (
            <span key={i} data-bad={h < 0 ? "" : undefined} style={{ height: `${Math.max(7, Math.abs(h))}%` }} />
          ))}
        </div>
      )}
      <ul className="mk-rows">
        {p.rows.map((r) => (
          <li key={r.label + r.sub} className="mk-row">
            <span className="mk-dot" data-tone={r.tone} style={r.colour ? { background: r.colour } : undefined} />
            <div className="mk-row-main">
              <div className="mk-row-label">{r.label}</div>
              <div className="mk-row-sub">{r.sub}</div>
            </div>
            <span className="mk-row-value" data-tone={r.tone}>
              {r.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
