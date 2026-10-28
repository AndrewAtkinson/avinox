import { cache } from "react";
import { demoRides } from "@/lib/demo";

/** The same made-up rides every time, built once per server. */
export const demo = cache(() => demoRides());
