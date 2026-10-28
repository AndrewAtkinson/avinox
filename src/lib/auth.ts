import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "./firebase-admin";

export const SESSION_COOKIE = "__session";

export type Viewer = { uid: string; email: string; emailVerified: boolean; name: string };

export const getViewer = cache(async (): Promise<Viewer | null> => {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    const claims = await adminAuth.verifySessionCookie(cookie, true);
    const email = (claims.email ?? "").toLowerCase();
    // The cookie keeps the claims from sign-in, so a link clicked since then
    // only shows up by asking Firebase again.
    const emailVerified = claims.email_verified === true || (email !== "" && (await adminAuth.getUser(claims.uid)).emailVerified);
    return {
      uid: claims.uid,
      email,
      emailVerified,
      name: typeof claims.name === "string" && claims.name ? claims.name : "",
    };
  } catch {
    return null;
  }
});

export async function requireViewer() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  return viewer;
}
