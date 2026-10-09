import { RADIO_TRACKS, type RadioTrack } from "./radioTracks";

// "Simulated live" radio: there is no stream and no server. What's on air is a
// pure function of the wall clock, so everyone who tunes in at the same moment
// hears the same song at the same spot. The playlist is a seeded shuffle of the
// whole catalogue ("a cycle"); when a cycle ends, the next one reshuffles with a
// new seed. Same code + same track list => same schedule on every device.
//
// NOTE: regenerating radioTracks.ts (new/removed songs) changes the cycle length,
// which reshuffles what's on air for everyone at the next deploy. That's fine.

export const EPOCH_MS = Date.UTC(2026, 0, 1); // fixed reference point, never change

const TRACKS: RadioTrack[] = RADIO_TRACKS;
const DUR_MS: number[] = TRACKS.map((t) => Math.round(t.duration * 1000));
export const CYCLE_MS: number = DUR_MS.reduce((a, b) => a + b, 0);

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

const rawCache = new Map<number, RadioTrack[]>();
function rawOrder(cycle: number): RadioTrack[] {
  const hit = rawCache.get(cycle);
  if (hit) return hit;
  const rng = mulberry32(Math.imul(cycle + 1, 0x9e3779b1) ^ 0x5bd1e995);
  const a = TRACKS.slice();
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

// The order actually played in a cycle: the raw order, with the first two songs
// swapped if the cycle would open with the song the previous cycle ended on.
function orderFor(cycle: number): RadioTrack[] {
  const o = rawOrder(cycle).slice();
  if (cycle > 0 && o.length > 1) {
    const prevLast = rawOrder(cycle - 1)[rawOrder(cycle - 1).length - 1];
    if (o[0].id === prevLast.id) [o[0], o[1]] = [o[1], o[0]];
  }
  return o;
}

export type OnAir = {
  track: RadioTrack;
  /** Seconds into the track right now. */
  offset: number;
  /** Seconds left in the track. */
  remaining: number;
  /** Wall-clock ms at which this track started (for catching up after a load). */
  startedAtMs: number;
  /** The next few songs, crossing into the next cycle if needed. */
  next: RadioTrack[];
};

export function onAir(nowMs: number, nextCount = 3): OnAir {
  const since = Math.max(0, nowMs - EPOCH_MS);
  const cycle = Math.floor(since / CYCLE_MS);
  const pos = since - cycle * CYCLE_MS;

  const order = orderFor(cycle);
  // Durations follow the (reordered) tracks, so walk the order, not DUR_MS directly.
  const durOf = (t: RadioTrack) => Math.round(t.duration * 1000);
  let acc = 0;
  let idx = 0;
  for (; idx < order.length; idx++) {
    const d = durOf(order[idx]);
    if (pos < acc + d) break;
    acc += d;
  }
  if (idx >= order.length) idx = order.length - 1; // rounding guard

  const track = order[idx];
  const offsetMs = pos - acc;

  const next: RadioTrack[] = [];
  let nIdx = idx + 1;
  let nCycle = cycle;
  let nOrder = order;
  while (next.length < nextCount) {
    if (nIdx >= nOrder.length) {
      nCycle += 1;
      nOrder = orderFor(nCycle);
      nIdx = 0;
    }
    next.push(nOrder[nIdx++]);
  }

  return {
    track,
    offset: offsetMs / 1000,
    remaining: (durOf(track) - offsetMs) / 1000,
    startedAtMs: nowMs - offsetMs,
    next,
  };
}
