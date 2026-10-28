"use client";
import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";

let auth: Auth | null = null;

export function firebaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
}

export function clientAuth(): Auth {
  if (auth) return auth;
  const config = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "{}") as FirebaseOptions;
  const app = getApps()[0] ?? initializeApp(config);
  auth = getAuth(app);
  const emulator = process.env.NEXT_PUBLIC_AUTH_EMULATOR;
  if (emulator) connectAuthEmulator(auth, emulator, { disableWarnings: true });
  return auth;
}
