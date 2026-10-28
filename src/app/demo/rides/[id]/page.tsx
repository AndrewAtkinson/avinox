import { notFound } from "next/navigation";
import { RideView } from "@/components/RideView";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { measureEfficiency } from "@/lib/stats";
import { typicalRide } from "@/lib/typical";
import { demo } from "../../data";

export default async function DemoRide({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { summaries, tracks } = demo();
  const ride = summaries.find((r) => r.id === id);
  if (!ride) notFound();
  const efficiency = measureEfficiency(summaries, DEFAULT_SETTINGS);
  return <RideView ride={ride} track={tracks[id] ?? []} settings={DEFAULT_SETTINGS} efficiency={efficiency} typical={typicalRide(summaries, DEFAULT_SETTINGS, efficiency)} base="/demo/rides" demo />;
}
