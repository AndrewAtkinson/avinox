import type { NextConfig } from "next";

// App Hosting sets FIREBASE_WEBAPP_CONFIG at build time when the backend is
// linked to a Firebase web app. Pass it to the browser bundle, or fall back to
// NEXT_PUBLIC_FIREBASE_CONFIG (the same JSON) for local runs.
const webConfig = process.env.FIREBASE_WEBAPP_CONFIG ?? process.env.NEXT_PUBLIC_FIREBASE_CONFIG ?? "";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_FIREBASE_CONFIG: webConfig },
};

export default nextConfig;
