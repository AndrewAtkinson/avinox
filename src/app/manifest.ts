import type { MetadataRoute } from "next";

/** Lets the app be installed to a phone's home screen and open full screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ride Stats",
    short_name: "Ride Stats",
    description: "Every ride from your DJI Avinox e-bike",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0f14",
    theme_color: "#0b0f14",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
