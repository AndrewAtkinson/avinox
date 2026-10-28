export type Units = "mi" | "km";

export type Settings = {
  units: Units;
  /** The pack's rated capacity, Wh (Avinox bikes ship with 600 or 800). */
  batteryWh: number;
  bikeName: string;
  /** Names for the assist values the bike records, e.g. {"1": "Eco"}. */
  modeNames: Record<string, string>;
};

/*
 * A ride file stores a number for the assist mode, not its name. These come
 * from riders matching real rides against what the motor did (the factory
 * list order ECO, TRAIL, TURBO, AUTO); custom modes start at 20. Settings
 * lets a rider rename any of them.
 */
export const DEFAULT_MODE_NAMES: Record<string, string> = { "0": "Off", "1": "Eco", "2": "Trail", "3": "Turbo", "4": "Auto", "5": "Boost" };

export const DEFAULT_SETTINGS: Settings = { units: "mi", batteryWh: 800, bikeName: "", modeNames: {} };

export function modeName(settings: Settings, value: string | number) {
  const k = String(value);
  return settings.modeNames[k] || DEFAULT_MODE_NAMES[k] || (Number(k) >= 20 ? `Custom ${Number(k) - 19}` : `Mode ${k}`);
}

const MODE_COLORS: Record<string, string> = {
  eco: "var(--mode-eco)",
  auto: "var(--mode-auto)",
  trail: "var(--mode-trail)",
  turbo: "var(--mode-turbo)",
  boost: "var(--mode-boost)",
  off: "var(--mode-off)",
};

export function modeColor(settings: Settings, value: string | number) {
  return MODE_COLORS[modeName(settings, value).toLowerCase()] ?? "var(--mode-other)";
}

/** Order modes are listed in: least assist first. */
export function modeRank(settings: Settings, value: string | number) {
  const order = ["off", "eco", "auto", "trail", "turbo", "boost"];
  const i = order.indexOf(modeName(settings, value).toLowerCase());
  return i === -1 ? 10 + Number(value) : i;
}

export function cleanSettings(input: unknown): Settings {
  const o = (input && typeof input === "object" ? input : {}) as Partial<Settings>;
  const wh = Number(o.batteryWh);
  const names: Record<string, string> = {};
  if (o.modeNames && typeof o.modeNames === "object") {
    for (const [k, v] of Object.entries(o.modeNames)) {
      if (/^\d{1,3}$/.test(k) && typeof v === "string" && v.trim()) names[k] = v.trim().slice(0, 24);
    }
  }
  return {
    units: o.units === "km" ? "km" : "mi",
    batteryWh: Number.isFinite(wh) && wh >= 200 && wh <= 2000 ? Math.round(wh) : DEFAULT_SETTINGS.batteryWh,
    bikeName: typeof o.bikeName === "string" ? o.bikeName.trim().slice(0, 60) : "",
    modeNames: names,
  };
}
