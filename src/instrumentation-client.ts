import posthog from "posthog-js";
import { startFeedback } from "./lib/feedback";

// Usage and error tracking (PostHog, EU). Every app sends to the same PostHog
// project and tags its events with `app`, so they can be seen together or apart.
const APP = "ride-stats";
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key && process.env.NODE_ENV === "production") {
  posthog.init(key, {
    api_host: "https://eu.i.posthog.com",
    defaults: "2025-05-24",
    person_profiles: "always",
    capture_exceptions: true,
    // Page load times (for "Slow pages") and taps that do nothing ("Frustrated tapping").
    capture_performance: { web_vitals: true },
    capture_dead_clicks: true,
  });
  posthog.register({
    app: APP,
    // Opened from the home screen (installed app) rather than a browser tab.
    installed: window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true,
  });
  startFeedback(posthog, "Ride Stats");

  // Put a name to signed-in people. Firebase keeps the browser signed in
  // alongside the server session, so this also covers people already signed in.
  if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    void Promise.all([import("@/lib/firebase-client"), import("firebase/auth")]).then(([{ clientAuth }, { onAuthStateChanged }]) => {
      onAuthStateChanged(clientAuth(), (user) => {
        if (user) {
          posthog.identify(user.uid, { email: user.email, name: user.displayName });
          // A brand-new account (made in the last 10 minutes) counts as a sign-up, once.
          try {
            const mark = `ph_signed_up_${user.uid}`;
            if (Date.now() - Date.parse(user.metadata.creationTime ?? "") < 600_000 && !localStorage.getItem(mark)) {
              localStorage.setItem(mark, "1");
              posthog.capture("signed_up");
            }
          } catch {}
        } else if (posthog.get_property("$user_state") === "identified") posthog.reset();
      });
    });
  }
}
