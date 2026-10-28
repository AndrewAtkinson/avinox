/*
 * Reads an Avinox `cloud_ride_rec_*.proto` ride file, the raw recording the
 * Avinox Ride app keeps for each ride.
 *
 * Layout: a 251-byte header (magic 0xA5A5A5A5) then frames of type 0x02EB,
 * each holding one protobuf-encoded sample. DJI publishes no spec: the field
 * numbers come from the community's reverse engineering (Avinox Ride
 * Explorer, and lucad87/avinox-setup-app, MIT licence, Copyright (c) 2026
 * Luca Donnaloia, whose parser this follows).
 *
 * Runs in the browser (and under Node for the tests). Nothing is uploaded here.
 */

const HEADER_SIZE = 251;
const MAGIC = 0xa5a5a5a5;
const FRAME_TYPE = 0x02eb;

export type Sample = {
  /** Unix seconds. */
  t: number;
  /** km/h */
  speed: number;
  /** The assist value the bike recorded: a number, not a mode name. */
  assist: number | null;
  cadence: number;
  /** Nm */
  motorTorque: number;
  riderTorque: number;
  /** W */
  riderPower: number;
  motorPower: number;
  gear: number | null;
  /** Distance since the ride started, km. */
  km: number;
  lat: number | null;
  lng: number | null;
  /** Metres */
  altitude: number | null;
  /** °C */
  temperature: number | null;
  heartRate: number | null;
  /** % */
  battery: number | null;
  odometerKm: number | null;
};

export type RideFile = {
  rideId: number;
  serial: string;
  /** Unix seconds. */
  start: number;
  end: number;
  ascentM: number;
  descentM: number;
  samples: Sample[];
};

type Fields = Record<number, bigint | Uint8Array>;

function varint(bytes: Uint8Array, pos: number): [bigint, number] {
  let value = 0n;
  let shift = 0n;
  let b: number;
  do {
    if (pos >= bytes.length) throw new Error("Invalid varint");
    b = bytes[pos++];
    value |= BigInt(b & 127) << shift;
    shift += 7n;
  } while (b & 128);
  return [value, pos];
}

/** One protobuf message as {field number: last value}. */
function message(bytes: Uint8Array): Fields {
  const out: Fields = {};
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let p = 0;
  while (p < bytes.length) {
    const [tag, next] = varint(bytes, p);
    p = next;
    const field = Number(tag >> 3n);
    const wire = Number(tag & 7n);
    if (wire === 0) {
      const [v, q] = varint(bytes, p);
      out[field] = v;
      p = q;
    } else if (wire === 1) {
      out[field] = view.getBigUint64(p, true);
      p += 8;
    } else if (wire === 5) {
      out[field] = BigInt(view.getUint32(p, true));
      p += 4;
    } else if (wire === 2) {
      const [n, q] = varint(bytes, p);
      p = q;
      out[field] = bytes.slice(p, p + Number(n));
      p += Number(n);
    } else {
      throw new Error(`Unsupported protobuf wire type ${wire}`);
    }
  }
  return out;
}

const big = (v: bigint | Uint8Array | undefined) => (typeof v === "bigint" ? v : null);
const num = (v: bigint | Uint8Array | undefined) => {
  const b = big(v);
  return b === null ? null : Number(b);
};
const signed = (v: bigint | Uint8Array | undefined) => {
  const b = big(v);
  if (b === null) return null;
  return b >= 1n << 63n ? Number(b - (1n << 64n)) : Number(b);
};
const scaled = (v: bigint | Uint8Array | undefined, d: number) => {
  const n = num(v);
  return n === null ? 0 : n / d;
};
/** GPS doubles arrive as the raw 64-bit pattern. */
function f64(v: bigint | Uint8Array | undefined) {
  const b = big(v);
  if (b === null) return null;
  const view = new DataView(new ArrayBuffer(8));
  view.setBigUint64(0, BigInt.asUintN(64, b), true);
  const x = view.getFloat64(0, true);
  return Number.isFinite(x) && x !== 0 ? x : null;
}

function sample(f: Fields): Sample {
  const temp = signed(f[41]);
  const alt = signed(f[39]);
  const lat = f64(f[31]);
  const lng = f64(f[32]);
  const valid = lat !== null && lng !== null && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  return {
    t: num(f[72]) ?? 0,
    speed: scaled(f[7], 100),
    assist: num(f[8]),
    cadence: scaled(f[9], 100),
    motorTorque: scaled(f[10], 100),
    riderTorque: scaled(f[11], 100),
    riderPower: scaled(f[13], 100),
    motorPower: scaled(f[14], 100),
    gear: num(f[22]),
    km: scaled(f[23], 1000),
    lat: valid ? lat : null,
    lng: valid ? lng : null,
    altitude: alt === null ? null : alt / 100,
    temperature: temp === null || temp === -99900 ? null : temp / 100,
    heartRate: num(f[51]) || null,
    battery: num(f[71]),
    odometerKm: f[73] === undefined ? null : scaled(f[73], 1000),
  };
}

export function isRideFile(buffer: ArrayBuffer) {
  return buffer.byteLength >= HEADER_SIZE && new DataView(buffer).getUint32(0, true) === MAGIC;
}

export function parseRide(buffer: ArrayBuffer): RideFile {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  if (!isRideFile(buffer)) throw new Error("This isn't an Avinox ride file.");

  let serial = "";
  for (let i = 110; i < 128 && bytes[i]; i++) serial += String.fromCharCode(bytes[i]);

  // Walk the frames to the end of the file: the header's sample count is
  // sometimes one short.
  const samples: Sample[] = [];
  let p = HEADER_SIZE;
  while (p + 4 <= bytes.length) {
    const type = view.getUint16(p, true);
    const len = view.getUint16(p + 2, true);
    if (type !== FRAME_TYPE) throw new Error(`Unknown frame type at byte ${p}`);
    if (p + 4 + len > bytes.length) break; // a ride cut off mid-write keeps what it has
    samples.push(sample(message(bytes.subarray(p + 4, p + 4 + len))));
    p += len + 6;
  }

  return {
    rideId: view.getUint32(6, true),
    serial,
    start: view.getUint32(10, true),
    end: view.getUint32(14, true),
    ascentM: view.getFloat32(22, true),
    descentM: view.getFloat32(26, true),
    samples: samples.filter((s) => s.t > 0),
  };
}
