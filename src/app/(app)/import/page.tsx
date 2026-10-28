import Link from "next/link";
import { Importer } from "@/components/Importer";

export const metadata = { title: "Import rides · Ride Stats" };

export default function ImportPage() {
  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-4 px-4 pt-6 pb-16 sm:px-6">
      <Link href="/" className="flex min-h-11 items-center gap-1.5 font-medium">
        <span aria-hidden="true">←</span> Dashboard
      </Link>
      <h1 className="font-display text-3xl font-semibold">Import rides</h1>
      <Importer />
    </div>
  );
}
