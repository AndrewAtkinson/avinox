import Link from "next/link";
import { AppPreview } from "./AppPreview";
import { BRAND, Mark } from "./brand";

/** Sign-in layout A: the app's colour, headline and a preview on one side, the form on the other. */
export function AuthSplit({ title, sub, children }: { title: string; sub?: React.ReactNode; children: React.ReactNode }) {
  return (
    <main className="mk mk-split">
      <section className="mk-split-brand">
        <Link href="/" className="mk-wordmark">
          <Mark size={36} onBrand />
          {BRAND.name}
        </Link>
        <div className="mk-split-copy">
          <p className="mk-eyebrow">{BRAND.eyebrow}</p>
          <h2 className="mk-display mk-split-headline">{BRAND.headline}</h2>
          <p className="mk-split-sub">{BRAND.sub}</p>
        </div>
        <div className="mk-split-preview">
          <AppPreview compact />
        </div>
      </section>
      <section className="mk-split-form">
        <div className="mk-split-inner">
          <h1 className="mk-display mk-form-title">{title}</h1>
          {sub && <p className="mk-form-sub">{sub}</p>}
          {children}
        </div>
        <p className="mk-split-foot">
          A <a href="https://darkmattersolutions.uk">Dark Matter Solutions</a> app · <Link href="/">About {BRAND.name}</Link>
        </p>
      </section>
    </main>
  );
}
