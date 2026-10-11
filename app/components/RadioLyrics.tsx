"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RadioItem } from "../lib/radioSchedule";

// Karaoke-style lyrics for the radio, same idea as the app's player: the current line
// is highlighted and scrolled to the middle. Line timings come from forced alignment
// of the actual recordings (public/radio-lyrics.json, built by
// scripts/generate-radio-lyrics.py); a song without them falls back to spreading the
// lines across the song by length, like the app does.

type Entry = { l: string; t?: (number | null)[] };

// Loaded once, and only when someone first flips to lyrics (it's ~300 KB).
let lyricsPromise: Promise<Record<string, Entry>> | null = null;
function loadLyrics() {
  if (!lyricsPromise) {
    lyricsPromise = fetch("/radio-lyrics.json")
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => {
        lyricsPromise = null; // allow a retry next time
        return {};
      });
  }
  return lyricsPromise;
}

// A few songs have a whole verse stored as one run-on line ("...hold highHe warned me...").
// Real lyric lines are short, so only for long lines: break wherever a lowercase letter or
// punctuation is glued straight onto a capital. Display only — timing is unaffected.
const softBreak = (ln: string) => (ln.length > 90 ? ln.replace(/([a-z.,!?'’”)])([A-Z])/g, "$1\n$2") : ln);

const MANUAL_PAUSE_MS = 4000; // after the listener scrolls by hand, leave them alone this long

export default function RadioLyrics({ track, startedAtMs }: { track: RadioItem; startedAtMs: number }) {
  const [data, setData] = useState<Record<string, Entry> | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const boxRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const manualUntil = useRef(0);
  const lastScrolledTo = useRef(-2);

  const isSong = track.kind === "song";

  useEffect(() => {
    if (!isSong) return;
    let alive = true;
    loadLyrics().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, [isSong]);

  // Smooth highlight: tick a few times a second (the page's own clock only updates once a second).
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const entry = isSong ? data?.[track.id] : undefined;
  const lines = useMemo(() => (entry ? entry.l.split("\n") : []), [entry]);

  // Fallback timing: each non-blank line starts at a share of the song proportional to its length.
  const estimatedStarts = useMemo(() => {
    const w = lines.map((l) => (l.trim() ? Math.max(l.trim().length, 8) : 0));
    const total = w.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    return w.map((x) => {
      const s = acc / total;
      acc += x;
      return s;
    });
  }, [lines]);

  const position = Math.max(0, (now - startedAtMs) / 1000);
  let active = -1;
  if (entry?.t && entry.t.length === lines.length) {
    for (let i = 0; i < lines.length; i++) {
      const t = entry.t[i];
      if (t != null && t <= position) active = i;
    }
  } else if (lines.length) {
    const frac = Math.min(0.999, position / track.duration);
    for (let i = 0; i < lines.length; i++) if (lines[i].trim() && estimatedStarts[i] <= frac) active = i;
  }

  // New song: back to the top.
  useEffect(() => {
    lastScrolledTo.current = -2;
    boxRef.current?.scrollTo({ top: 0 });
  }, [track.id]);

  // Keep the active line in the middle of the card.
  useEffect(() => {
    const box = boxRef.current;
    const el = active >= 0 ? lineRefs.current[active] : null;
    if (!box || !el || active === lastScrolledTo.current) return;
    if (Date.now() < manualUntil.current) return;
    lastScrolledTo.current = active;
    box.scrollTo({ top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2, behavior: "smooth" });
  }, [active]);

  const message = (text: string) => (
    <div className="h-full flex items-center justify-center px-6 text-sm" style={{ color: "var(--text-secondary)" }}>
      {text}
    </div>
  );

  if (!isSong) return message("🎙 Station break");
  if (!data) return message("Loading lyrics…");
  if (!entry) return message("🎼 Instrumental — no lyrics");

  return (
    <div
      ref={boxRef}
      onWheel={() => (manualUntil.current = Date.now() + MANUAL_PAUSE_MS)}
      onTouchStart={() => (manualUntil.current = Date.now() + MANUAL_PAUSE_MS)}
      className="relative h-full overflow-y-auto px-4 text-center"
      style={{
        overscrollBehavior: "contain",
        scrollbarWidth: "none",
        // fade the top and bottom edges so lines drift in and out
        WebkitMaskImage: "linear-gradient(transparent, #000 14%, #000 86%, transparent)",
        maskImage: "linear-gradient(transparent, #000 14%, #000 86%, transparent)",
      }}
    >
      <div style={{ height: "42%" }} />
      {lines.map((ln, i) =>
        ln.trim() ? (
          <p
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className="text-[15px] leading-7 transition-colors duration-300"
            style={{
              color: i === active ? "var(--accent-gold)" : "var(--text-secondary)",
              fontWeight: i === active ? 700 : 400,
              opacity: i === active ? 1 : 0.75,
              whiteSpace: "pre-line",
            }}
          >
            {softBreak(ln)}
          </p>
        ) : (
          <div key={i} style={{ height: 12 }} />
        ),
      )}
      <div style={{ height: "42%" }} />
    </div>
  );
}
