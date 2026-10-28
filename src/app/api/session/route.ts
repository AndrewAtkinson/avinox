import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { SESSION_COOKIE } from "@/lib/auth";

const FIVE_DAYS = 5 * 86_400_000;

// Swaps a fresh Firebase ID token for an httpOnly session cookie.
export async function POST(req: Request) {
  const { idToken } = (await req.json().catch(() => ({}))) as { idToken?: string };
  if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
      return NextResponse.json({ error: "Please sign in again" }, { status: 401 });
    }
    const session = await adminAuth.createSessionCookie(idToken, { expiresIn: FIVE_DAYS });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: FIVE_DAYS / 1000,
    });
    return res;
  } catch (e) {
    console.error("[session]", e);
    return NextResponse.json({ error: "Couldn't sign you in" }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
