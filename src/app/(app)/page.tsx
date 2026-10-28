import { requireViewer } from "@/lib/auth";
import { getSettings, listRides } from "@/lib/data";
import { Dashboard } from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const viewer = await requireViewer();
  const [settings, rides] = await Promise.all([getSettings(viewer.uid), listRides(viewer.uid)]);
  return <Dashboard rides={rides} settings={settings} base="/rides" />;
}
