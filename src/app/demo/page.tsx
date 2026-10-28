import { Dashboard } from "@/components/Dashboard";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { demo } from "./data";

export const metadata = { title: "Demo · Ride Stats" };

export default function DemoPage() {
  return <Dashboard rides={demo().summaries} settings={{ ...DEFAULT_SETTINGS, bikeName: "Sample bike" }} base="/demo/rides" demo />;
}
