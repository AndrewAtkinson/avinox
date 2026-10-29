// Copy and sample data for the sign-in and landing pages.
export type Tone = "good" | "warn" | "bad" | "accent" | "muted";

export type Brand = {
  name: string;
  eyebrow: string;
  headline: string;
  sub: string;
  preview: {
    title: string;
    tag: string;
    stat: string;
    statLabel: string;
    /** Bar heights 0-100; negative draws a red bar. Empty for no chart. */
    bars: number[];
    rows: { label: string; sub: string; value: string; tone: Tone; colour?: string }[];
  };
  landing: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
    trust: string;
    featuresTitle: string;
    features: { title: string; body: string }[];
    steps: string[];
    cta: string;
    ctaSub: string;
  };
};
