"use client";
import { useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type User,
} from "firebase/auth";
import { clientAuth, firebaseConfigured } from "@/lib/firebase-client";

type Mode = "signin" | "signup" | "reset";

function message(e: unknown) {
  const code = (e as { code?: string }).code ?? "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "That email and password don't match.";
  if (code.includes("email-already-in-use")) return "There's already an account for that email. Sign in instead.";
  if (code.includes("weak-password")) return "Use at least 8 characters for your password.";
  if (code.includes("popup-closed") || code.includes("cancelled-popup")) return "";
  if (code.includes("unauthorized-domain")) return "Sign-in isn't switched on for this web address yet.";
  if (code.includes("too-many-requests")) return "Too many attempts. Wait a minute and try again.";
  return (e as Error).message ?? "Something went wrong.";
}

const input = "h-12 rounded-xl border border-edge bg-sunk px-3 text-base font-normal text-ink";

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  if (!firebaseConfigured()) {
    return <p className="text-sm text-warn">Sign-in isn&apos;t set up for this site yet. See the README.</p>;
  }

  async function startSession(user: User) {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken: await user.getIdToken(true) }),
    });
    if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "Sign-in failed");
    // A full load, so the server pages see the new cookie.
    location.replace(next);
  }

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setError(message(e));
      setBusy(false);
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const auth = clientAuth();
      if (mode === "reset") {
        await sendPasswordResetEmail(auth, email);
        setNotice("If there's an account for that email, a reset link is on its way.");
        setMode("signin");
        setBusy(false);
        return;
      }
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name.trim() });
        await sendEmailVerification(cred.user).catch(() => undefined);
        await startSession(cred.user);
        return;
      }
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await startSession(cred.user);
    });
  };

  const google = () =>
    run(async () => {
      const cred = await signInWithPopup(clientAuth(), new GoogleAuthProvider());
      await startSession(cred.user);
    });

  return (
    <div className="flex flex-col gap-5">
      <button type="button" onClick={google} disabled={busy} className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-edge font-bold disabled:opacity-60">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z" />
        </svg>
        Continue with Google
      </button>
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-edge" />
        or email
        <span className="h-px flex-1 bg-edge" />
      </div>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {mode === "signup" && (
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Your first name
            <input className={input} autoComplete="given-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input className={input} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {mode !== "reset" && (
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Password
            <input
              className={input}
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={mode === "signup" ? 8 : undefined}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        )}
        {error && (
          <p className="text-sm text-warn" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="text-sm text-good" role="status">
            {notice}
          </p>
        )}
        <button type="submit" disabled={busy} className="h-12 rounded-xl bg-accent font-bold text-on-accent disabled:opacity-60">
          {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
      </form>
      <div className="flex flex-wrap justify-between gap-2 text-sm font-medium text-muted">
        {mode === "signin" ? (
          <button type="button" className="min-h-11" onClick={() => setMode("signup")}>
            New here? Create an account
          </button>
        ) : (
          <button type="button" className="min-h-11" onClick={() => setMode("signin")}>
            Back to sign in
          </button>
        )}
        {mode === "signin" && (
          <button type="button" className="min-h-11" onClick={() => setMode("reset")}>
            Forgot password?
          </button>
        )}
      </div>
    </div>
  );
}
