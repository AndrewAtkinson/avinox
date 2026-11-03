import posthog from "posthog-js";

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
  });
  posthog.register({ app: APP });

  // Put a name to signed-in people. Firebase keeps the browser signed in
  // alongside the server session, so this also covers people already signed in.
  if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    void Promise.all([import("@/lib/firebase-client"), import("firebase/auth")]).then(([{ clientAuth }, { onAuthStateChanged }]) => {
      onAuthStateChanged(clientAuth(), (user) => {
        if (user) posthog.identify(user.uid, { email: user.email, name: user.displayName });
        else if (posthog.get_property("$user_state") === "identified") posthog.reset();
      });
    });
  }
}
