import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { userDoc } from "@/lib/firebase-admin";
import { cleanSettings } from "@/lib/settings";

export async function PUT(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  const settings = cleanSettings(await req.json().catch(() => ({})));
  await userDoc(viewer.uid).set({ settings, email: viewer.email }, { merge: true });
  return NextResponse.json({ ok: true, settings });
}
