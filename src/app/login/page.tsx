import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/auth";
import { Logo } from "@/components/ui";
import { LoginForm } from "./LoginForm";

/** Only same-site paths, so a crafted ?next= can't send people elsewhere. */
const safeNext = (next: string | undefined) => (next && next.startsWith("/") && !next.startsWith("//") ? next : "/");

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await getViewer()) redirect(next);
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-8 px-5 py-10">
      <div className="flex flex-col gap-3">
        <Logo />
        <h1 className="font-display text-3xl font-bold tracking-tight">Ride Stats</h1>
        <p className="text-base text-soft">
          Every ride from your DJI Avinox e-bike in one place: miles, assist modes, how far a charge gets you, battery health, gears and torque. Your ride files are read in your browser.
        </p>
        <Link href="/demo" className="font-medium">
          See it with sample rides first →
        </Link>
      </div>
      <div className="rounded-2xl border border-line bg-card p-5">
        <LoginForm next={next} />
      </div>
    </main>
  );
}
