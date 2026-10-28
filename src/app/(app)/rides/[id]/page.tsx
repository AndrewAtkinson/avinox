import { notFound } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { getRide, getSettings, listRides } from "@/lib/data";
import { measureEfficiency } from "@/lib/stats";
import { typicalRide } from "@/lib/typical";
import { RIDE_ID } from "@/lib/validate";
import { RideView } from "@/components/RideView";

export const dynamic = "force-dynamic";

export default async function RidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!RIDE_ID.test(id)) notFound();
  const viewer = await requireViewer();
  const [settings, found, rides] = await Promise.all([getSettings(viewer.uid), getRide(viewer.uid, id), listRides(viewer.uid)]);
  if (!found) notFound();
  const efficiency = measureEfficiency(rides, settings);
  return <RideView ride={found.ride} track={found.track} settings={settings} efficiency={efficiency} typical={typicalRide(rides, settings, efficiency)} base="/rides" />;
}
