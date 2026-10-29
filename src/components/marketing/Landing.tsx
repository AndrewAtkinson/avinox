import Link from "next/link";
import { AppPreview } from "./AppPreview";
import { BRAND, Mark } from "./brand";

/** What signed-out visitors see at the root of the site. */
export function Landing({ signInHref = "/login" }: { signInHref?: string }) {
  const l = BRAND.landing;
  return (
    <div className="mk mk-landing">
      <header className="mk-nav">
        <Link href="/" className="mk-wordmark">
          <Mark size={32} />
          {BRAND.name}
        </Link>
        <nav className="mk-nav-links" aria-label="Main">
          <a href="#features" className="mk-nav-link">
            Features
          </a>
          <a href="#how" className="mk-nav-link">
            How it works
          </a>
          <Link href={signInHref} className="mk-btn mk-btn-ghost mk-btn-sm">
            Sign in
          </Link>
        </nav>
      </header>
      <main>
        <section className="mk-hero">
          <div className="mk-hero-copy">
            <span className="mk-pill">{BRAND.eyebrow}</span>
            <h1 className="mk-display mk-hero-title">{BRAND.headline}</h1>
            <p className="mk-lead">{BRAND.sub}</p>
            <div className="mk-actions">
              <Link href={l.primary.href} className="mk-btn mk-btn-primary">
                {l.primary.label}
              </Link>
              <Link href={l.secondary.href} className="mk-btn mk-btn-ghost">
                {l.secondary.label}
              </Link>
            </div>
            <p className="mk-trust">{l.trust}</p>
          </div>
          <div className="mk-hero-preview">
            <AppPreview />
          </div>
        </section>
        <section id="features" className="mk-section">
          <div className="mk-section-inner">
            <h2 className="mk-display mk-h2">{l.featuresTitle}</h2>
            <ul className="mk-grid">
              {l.features.map((f, i) => (
                <li key={f.title} className="mk-card">
                  <span className="mk-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section id="how" className="mk-section mk-how">
          <div className="mk-section-inner">
            <h2 className="mk-display mk-h2">How it works</h2>
            <ol className="mk-grid">
              {l.steps.map((s, i) => (
                <li key={s} className="mk-step">
                  <span className="mk-step-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="mk-step-t">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="mk-section mk-cta">
          <div className="mk-section-inner">
            <h2 className="mk-display mk-h2">{l.cta}</h2>
            <p>{l.ctaSub}</p>
            <Link href={l.primary.href} className="mk-btn mk-btn-primary">
              {l.primary.label}
            </Link>
          </div>
        </section>
      </main>
      <footer className="mk-foot">
        <span>
          A <a href="https://darkmattersolutions.uk">Dark Matter Solutions</a> app
        </span>
        <Link href={signInHref}>Sign in</Link>
      </footer>
    </div>
  );
}
