import type { Brand } from "./types";

export const BRAND: Brand = {
  name: "Ride Stats",
  eyebrow: "For DJI Avinox e-bikes",
  headline: "Every ride, every watt.",
  sub: "Miles, assist modes, how far a charge gets you, battery health, gears and torque, from your Avinox ride files.",
  preview: {
    title: "This month",
    tag: "11 rides",
    stat: "214 mi",
    statLabel: "Average 38 mi per charge",
    bars: [30, 55, 0, 42, 80, 0, 0, 64, 36, 90, 0, 48],
    rows: [
      { label: "Eco", sub: "Most of your miles", value: "42%", tone: "accent", colour: "var(--mode-eco)" },
      { label: "Auto", sub: "Climbs and town", value: "31%", tone: "accent", colour: "var(--mode-auto)" },
      { label: "Turbo", sub: "The steep bits", value: "18%", tone: "accent", colour: "var(--mode-turbo)" },
    ],
  },
  landing: {
    primary: { label: "Get started", href: "/login" },
    secondary: { label: "See sample rides", href: "/demo" },
    trust: "Try it with sample rides first, no account needed.",
    featuresTitle: "What your ride files can tell you",
    features: [
      { title: "Range you can trust", body: "How far a charge really gets you in each assist mode, from your own rides." },
      { title: "Battery health", body: "Capacity and charge cycles over time, so you can spot wear early." },
      { title: "Assist, gears and torque", body: "Which modes you use, where you change gear, and how hard you push." },
    ],
    steps: ["Export ride files from the DJI app", "Add them here; they are read in your browser", "See every ride, month and charge"],
    cta: "Your rides, properly counted.",
    ctaSub: "Start with the sample rides, then add your own.",
  },
};

export function Mark({ size = 36 }: { size?: number; onBrand?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, borderRadius: size / 4, background: "var(--accent)" }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="#0B0F14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17" r="3.5" />
        <circle cx="18.5" cy="17" r="3.5" />
        <path d="M5.5 17 10 8h5l3.5 9M10 8 8 5H6M15 8l-3 9" />
      </svg>
    </span>
  );
}
