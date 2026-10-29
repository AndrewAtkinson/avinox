import { redirect } from "next/navigation";
import { getViewer } from "@/lib/auth";
import { Landing } from "@/components/marketing/Landing";

// Signed-out visitors to / are shown this page (see src/middleware.ts).
export default async function Welcome() {
  if (await getViewer()) redirect("/");
  return <Landing />;
}
