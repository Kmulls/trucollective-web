import { RADIO_TRACKS, type RadioTrack } from "./radioTracks";
import { RADIO_SPOTS, SPOT_EVERY, DJ_NAME } from "./radioSpots";

// "Simulated live" radio: there is no stream and no server. What's on air is a
// pure function of the wall clock, so everyone who tunes in at the same moment
// hears the same thing at the same spot. The playlist is a seeded shuffle of the
// whole catalogue ("a cycle") with voice spots dropped in between songs; when a
// cycle ends, the next one reshuffles with a new seed. Same code + same track
// list => same schedule on every device.
//
// NOTE: regenerating radioTracks.ts or radioSpots.ts (new/removed songs or spots)
// changes the cycle length, which reshuffles what's on air for everyone at the
// next deploy. That's fine.

export const EPOCH_MS = Date.UTC(2026, 0, 1); // fixed reference point, never change

/** Anything that can be on air: a song, or a voice spot (DJ break). */
export type RadioItem = RadioTrack & { kind: "song" | "voice" };

const SONGS: RadioItem[] = RADIO_TRACKS.map((t) => ({ ...t, kind: "song" as const }));

const durMs = (t: RadioItem) => Math.round(t.duration * 1000);

// Tiny seeded PRNG (mulberry32) — integer math only, so it's identical in every JS engine.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rawCache = new Map<number, RadioItem[]>();
function rawOrder(cycle: number): RadioItem[] {
  const hit = rawCache.get(cycle);
  if (hit) return hit;
  const rng = mulberry32(Math.imul(cycle + 1, 0x9e3779b1) ^ 0x5bd1e995);
  const a = SONGS.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Spread artists out: if a song follows the same artist's, swap in the next
  // song by a different artist. Deterministic, so every client agrees.
  for (let i = 1; i < a.length; i++) {
    if (a[i].artist !== a[i - 1].artist) continue;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j].artist !== a[i - 1].artist) {
        [a[i], a[j]] = [a[j], a[i]];
        break;
      }
    }
  }
  if (rawCache.size > 8) rawCache.clear();
  rawCache.set(cycle, a);
  return a;
}

// The song order played in a cycle: the raw order, with the first two songs
// swapped if the cycle would open with the song the previous cycle ended on.
function songOrder(cycle: number): RadioItem[] {
  const o = rawOrder(cycle).slice();
  if (cycle > 0 && o.length > 1) {
    const prevRaw = rawOrder(cycle - 1);
    const prevLast = prevRaw[prevRaw.length - 1];
    if (o[0].id === prevLast.id) [o[0], o[1]] = [o[1], o[0]];
  }
  return o;
}

function spotItem(n: number): RadioItem {
  // Spot n of a cycle always uses the same clip (n % count), in EVERY cycle, so a
  // cycle's total length is the same each time — the clock math depends on that.
  const s = RADIO_SPOTS[n % RADIO_SPOTS.length];
  return {
    id: `voice:${s.id}`,
    title: "Station break",
    artist: DJ_NAME,
    genre: "DJ",
    audioFile: s.file,
    artFile: "",
    duration: s.duration,
    kind: "voice",
  };
}

// Full playout for a cycle: songs, with a voice spot after every SPOT_EVERY songs
// and one after the final song, so no stretch ever runs longer than SPOT_EVERY.
const playoutCache = new Map<number, RadioItem[]>();
function playoutFor(cycle: number): RadioItem[] {
  const hit = playoutCache.get(cycle);
  if (hit) return hit;
  const songs = songOrder(cycle);
  let out: RadioItem[];
  if (RADIO_SPOTS.length === 0) {
    out = songs;
  } else {
    out = [];
    let spotN = 0;
    songs.forEach((s, i) => {
      out.push(s);
      if ((i + 1) % SPOT_EVERY === 0 || i === songs.length - 1) out.push(spotItem(spotN++));
    });
  }
  if (playoutCache.size > 8) playoutCache.clear();
  playoutCache.set(cycle, out);
  return out;
}

export const CYCLE_MS: number = playoutFor(0).reduce((sum, t) => sum + durMs(t), 0);

export type OnAir = {
  track: RadioItem;
  /** Seconds into the item right now. */
  offset: number;
  /** Seconds left in the item. */
  remaining: number;
  /** Wall-clock ms at which this item started (for catching up after a load). */
  startedAtMs: number;
  /** The next few items, crossing into the next cycle if needed. */
  next: RadioItem[];
};

export function onAir(nowMs: number, nextCount = 3): OnAir {
  const since = Math.max(0, nowMs - EPOCH_MS);
  const cycle = Math.floor(since / CYCLE_MS);
  const pos = since - cycle * CYCLE_MS;

  const order = playoutFor(cycle);
  let acc = 0;
  let idx = 0;
  for (; idx < order.length; idx++) {
    const d = durMs(order[idx]);
    if (pos < acc + d) break;
    acc += d;
  }
  if (idx >= order.length) idx = order.length - 1; // rounding guard

  const track = order[idx];
  const offsetMs = pos - acc;

  const next: RadioItem[] = [];
  let nIdx = idx + 1;
  let nCycle = cycle;
  let nOrder = order;
  while (next.length < nextCount) {
    if (nIdx >= nOrder.length) {
      nCycle += 1;
      nOrder = playoutFor(nCycle);
      nIdx = 0;
    }
    next.push(nOrder[nIdx++]);
  }

  return {
    track,
    offset: offsetMs / 1000,
    remaining: (durMs(track) - offsetMs) / 1000,
    startedAtMs: nowMs - offsetMs,
    next,
  };
}
