"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { onAir, type OnAir, type RadioItem } from "../lib/radioSchedule";
import { audioUrl, artUrl } from "../lib/media";
import RadioLyrics from "./RadioLyrics";

// Plays the "simulated live" schedule from radioSchedule.ts. Every second we ask the
// schedule what should be on air right now, load that if it isn't what's playing,
// jump to the right spot, and nudge the audio back into line if it drifts (buffering
// stalls, a throttled background tab).
//
// Two <audio> "decks": while one plays, the other quietly loads whatever is next, so
// the hand-off is near-instant instead of waiting ~1s for the next file. If the browser
// won't start the second deck on its own (iPhone Safari only lets an element play after
// a tap), we drop back to a single deck for the rest of the session — exactly how it
// worked before. Experimental: /radio?unlock=1 also primes the second deck on the tap,
// for testing on an iPhone.

const DRIFT_SECONDS = 3; // re-seek if the audio strays this far from the schedule
const RETRY_AFTER_ERROR_MS = 4000;
const PRELOAD_SECONDS = 25; // start loading the next item this long before the current one ends
// A zero-length WAV, only used by the experimental ?unlock=1 mode.
const SILENT_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

type Status = "idle" | "connecting" | "live" | "error";

// Songs stream from the audio bucket; voice spots are static files on this site.
const audioSrc = (t: RadioItem) => (t.kind === "voice" ? `/radio-spots/${t.audioFile}` : audioUrl(t.audioFile));
const artSrc = (t: RadioItem) => (t.kind === "voice" ? "/icon-tru.png" : artUrl(t.artFile));

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

export default function RadioPlayer() {
  const decksRef = useRef<(HTMLAudioElement | null)[]>([null, null]);
  const activeRef = useRef(0); // which deck is on air
  const holdsRef = useRef<(string | null)[]>([null, null]); // id of the item each deck holds
  const dualRef = useRef(true); // false once a hand-off to the second deck fails
  const tunedRef = useRef(false);
  const lastErrorAtRef = useRef(0);
  const preloadBlockedUntilRef = useRef(0);
  const syncRef = useRef<() => void>(() => {});
  // Schedule state starts null so the server render and first client render match;
  // the real value is filled in after mount (it depends on the visitor's clock).
  const [air, setAir] = useState<OnAir | null>(null);
  const [tuned, setTuned] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  // Tap the artwork to flip it to scrolling lyrics (and back). Stays flipped from song to song.
  const [showLyrics, setShowLyrics] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false); // stop the hint arrow bouncing once they've tried it

  // Empty a deck. Marks it empty FIRST so any events the reset triggers are ignored.
  const clearDeck = useCallback((i: number) => {
    holdsRef.current[i] = null;
    const a = decksRef.current[i];
    if (a) {
      a.pause();
      a.removeAttribute("src");
      a.load(); // aborts any download
    }
  }, []);

  const sync = useCallback(() => {
    if (!tunedRef.current) return;
    const decks = decksRef.current;
    const ai = activeRef.current;
    const ii = 1 - ai;
    const active = decks[ai];
    if (!active) return;
    const s = onAir(Date.now());

    // 1) The playing deck already holds what's on air: keep it on time, preload what's next.
    if (holdsRef.current[ai] === s.track.id) {
      // The file ended a hair before the clock says the song is over — wait for the
      // schedule to roll to the next one (onEnded sets a timer for the exact moment).
      if (active.ended) return;
      if (active.readyState >= 2 && !active.seeking && Math.abs(active.currentTime - s.offset) > DRIFT_SECONDS) {
        active.currentTime = s.offset;
      }
      if (active.paused) active.play().catch(() => {});

      const idle = decks[ii];
      if (dualRef.current && idle && s.remaining <= PRELOAD_SECONDS && Date.now() >= preloadBlockedUntilRef.current) {
        const nxt = s.next[0];
        if (holdsRef.current[ii] !== nxt.id) {
          holdsRef.current[ii] = nxt.id;
          idle.preload = "auto";
          idle.src = audioSrc(nxt); // buffers quietly; not played yet
        }
      }
      return;
    }

    // 2) The other deck was preloaded with exactly what's on air now: hand off to it.
    const other = decks[ii];
    if (dualRef.current && other && holdsRef.current[ii] === s.track.id) {
      try {
        if (Math.abs(other.currentTime - s.offset) > 0.5) other.currentTime = s.offset;
      } catch {
        /* not seekable yet — onLoadedMetadata / drift correction will fix it */
      }
      const started = other.play();
      clearDeck(ai);
      activeRef.current = ii;
      const itemId = s.track.id;
      // If the browser refuses to start it, go back to the single-deck behaviour:
      // reload on deck 0 (the one the tap unlocked) and stay there for this session.
      const fail = () => {
        if (!tunedRef.current || holdsRef.current[activeRef.current] !== itemId) return;
        dualRef.current = false;
        clearDeck(0);
        clearDeck(1);
        activeRef.current = 0;
        lastErrorAtRef.current = 0;
        syncRef.current();
      };
      started?.catch(fail);
      window.setTimeout(() => {
        const a = decksRef.current[activeRef.current];
        if (a && a.paused && !a.ended) fail();
      }, 2500);
      return;
    }

    // 3) Nothing ready (first tune-in, an error, a big clock jump): load it on this deck.
    if (Date.now() - lastErrorAtRef.current < RETRY_AFTER_ERROR_MS) return;
    setStatus("connecting");
    holdsRef.current[ai] = s.track.id;
    active.src = audioSrc(s.track);
    try {
      active.currentTime = s.offset; // default start position; honoured by most browsers
    } catch {
      /* onLoadedMetadata corrects it for browsers that reject this early */
    }
    active.play().catch(() => {});
  }, [clearDeck]);
  useEffect(() => {
    syncRef.current = sync;
  }, [sync]);

  const tuneIn = useCallback(() => {
    tunedRef.current = true;
    setTuned(true);
    activeRef.current = 0;
    holdsRef.current = [null, null];
    lastErrorAtRef.current = 0;
    preloadBlockedUntilRef.current = 0;
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("unlock")) {
      const b = decksRef.current[1];
      if (b) {
        b.src = SILENT_WAV; // a tap-initiated play() "unlocks" the element on iPhone
        b.play().then(() => b.pause()).catch(() => {});
      }
    }
    sync(); // runs inside the click, so the browser lets audio start
  }, [sync]);

  const stop = useCallback(() => {
    tunedRef.current = false;
    setTuned(false);
    setStatus("idle");
    clearDeck(0);
    clearDeck(1);
    activeRef.current = 0;
  }, [clearDeck]);

  useEffect(() => {
    setAir(onAir(Date.now()));
    const tick = () => {
      setAir(onAir(Date.now()));
      sync();
    };
    const id = setInterval(tick, 1000);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [sync]);

  // Lock-screen / headphone controls: show what's on air; there's no pause or
  // skip on a radio, so "pause" means "stop listening".
  const trackId = air?.track.id;
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    if (!tuned || !air) {
      ms.playbackState = "none";
      return;
    }
    ms.metadata = new MediaMetadata({
      title: air.track.title,
      artist: air.track.artist,
      album: "Tru Collective Radio",
      artwork: [{ src: new URL(artSrc(air.track), window.location.origin).href, sizes: "512x512" }],
    });
    ms.playbackState = "playing";
    ms.setActionHandler("play", tuneIn);
    ms.setActionHandler("pause", stop);
    ms.setActionHandler("stop", stop);
    for (const action of ["seekbackward", "seekforward", "seekto", "previoustrack", "nexttrack"] as const) {
      try {
        ms.setActionHandler(action, null);
      } catch {
        /* not supported in this browser */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuned, trackId, tuneIn, stop]);

  const onLoadedMetadata = (i: number) => {
    const a = decksRef.current[i];
    if (!a || !tunedRef.current || i !== activeRef.current) return; // the idle deck is just preloading
    const s = onAir(Date.now());
    if (s.track.id !== holdsRef.current[i]) return; // sync() will load the right one
    if (Math.abs(a.currentTime - s.offset) > 1.5) {
      a.currentTime = Math.min(s.offset, Math.max(0, a.duration - 0.25));
    }
  };
  const onError = (i: number) => {
    if (!tunedRef.current || holdsRef.current[i] === null) return; // ignore our own clearing
    if (i === activeRef.current) {
      lastErrorAtRef.current = Date.now();
      holdsRef.current[i] = null; // force a fresh load on the next tick
      setStatus("error");
    } else {
      holdsRef.current[i] = null; // the preload failed; try again in a few seconds
      preloadBlockedUntilRef.current = Date.now() + 5000;
    }
  };
  // When a file ends, roll to the next item at the exact moment the clock says so —
  // not up to a second later at the next tick.
  const onEnded = (i: number) => {
    if (i !== activeRef.current) return;
    syncRef.current();
    const s = onAir(Date.now());
    if (s.remaining < 2) window.setTimeout(() => syncRef.current(), Math.max(0, s.remaining * 1000) + 15);
  };

  const pct = air ? Math.min(100, (air.offset / air.track.duration) * 100) : 0;

  return (
    <div className="w-full max-w-md mx-auto px-6 pt-3 sm:pt-6 pb-16 text-center">
      {[0, 1].map((i) => (
        <audio
          key={i}
          ref={(el) => {
            decksRef.current[i] = el;
          }}
          preload="auto"
          onLoadedMetadata={() => onLoadedMetadata(i)}
          onPlaying={() => {
            if (i === activeRef.current) setStatus("live");
          }}
          onWaiting={() => {
            if (tunedRef.current && i === activeRef.current) setStatus("connecting");
          }}
          onEnded={() => onEnded(i)}
          onError={() => onError(i)}
        />
      ))}

      <div
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-5"
        style={{ color: "var(--accent-red)" }}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: "var(--accent-red)" }}
          />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: "var(--accent-red)" }} />
        </span>
        On air
      </div>

      {!showLyrics && (
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--accent-gold)" }}>
          <span className={hasFlipped ? "inline-block" : "inline-block animate-bounce"}>↓</span> Tap the art for lyrics
        </p>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-label={showLyrics ? "Show artwork" : "Show lyrics"}
        onClick={() => {
          setShowLyrics((v) => !v);
          setHasFlipped(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowLyrics((v) => !v);
            setHasFlipped(true);
          }
        }}
        className="relative mx-auto rounded-2xl overflow-hidden border shadow-2xl cursor-pointer"
        // Shrinks on short screens so the Play button stays on the first screen.
        style={{ width: "min(280px, 34vh)", height: "min(280px, 34vh)", borderColor: "var(--border)", background: "var(--card)" }}
      >
        {air && showLyrics ? (
          <>
            <RadioLyrics track={air.track} startedAtMs={air.startedAtMs} />
            <span
              className="absolute bottom-1.5 inset-x-0 text-[11px] pointer-events-none"
              style={{ color: "var(--text-secondary)" }}
            >
              tap to show art
            </span>
          </>
        ) : (
          air && (
            <>
              <Image
                key={air.track.id}
                src={artSrc(air.track)}
                alt=""
                width={280}
                height={280}
                unoptimized
                priority
                className="w-full h-full object-cover"
              />
              {air.track.kind === "song" && (
                <span
                  className="absolute bottom-2 right-2 rounded-full px-3 py-1.5 text-xs font-bold pointer-events-none"
                  style={{ background: "rgba(11,13,20,0.78)", color: "var(--text-primary)" }}
                >
                  📃 Lyrics
                </span>
              )}
            </>
          )
        )}
      </div>

      <h2 className="text-2xl font-bold tracking-tight mt-4 min-h-[2rem]">{air?.track.title ?? " "}</h2>
      <p className="text-sm mt-1 min-h-[1.25rem]" style={{ color: "var(--text-secondary)" }}>
        {air ? `${air.track.artist} · ${air.track.genre}` : " "}
      </p>

      <div className="mt-4">
        <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: "var(--accent-gold)",
              transition: "width 1s linear",
            }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
          <span>{air ? fmt(air.offset) : "0:00"}</span>
          <span>{air ? fmt(air.track.duration) : "0:00"}</span>
        </div>
      </div>

      <div className="mt-5">
        {tuned ? (
          <button
            onClick={stop}
            className="px-8 py-4 rounded-xl font-semibold text-base border transition-opacity hover:opacity-90"
            style={{ borderColor: "var(--accent-gold)", color: "var(--accent-gold)" }}
          >
            ■ Stop
          </button>
        ) : (
          <button
            onClick={tuneIn}
            disabled={!air}
            className="px-8 py-4 rounded-xl font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--accent-gold)", color: "#0b0d14" }}
          >
            ▶ Press Play
          </button>
        )}
        <p className="text-xs mt-3 min-h-[1rem]" style={{ color: "var(--text-secondary)" }}>
          {status === "connecting" && "Connecting…"}
          {status === "live" && "Live — in sync with everyone listening"}
          {status === "error" && "Couldn’t load that song — retrying…"}
        </p>
        {!showLyrics && (
          <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
            <span style={{ color: "var(--accent-gold)" }}>↑</span> Tap the art to sing along &mdash; lyrics scroll like karaoke
          </p>
        )}
      </div>

      {air && (
        <div className="mt-10 text-left">
          <h3
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--accent-gold)" }}
          >
            Up next
          </h3>
          {air.next.map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-2">
              <Image
                src={artSrc(t)}
                alt=""
                width={40}
                height={40}
                unoptimized
                className="rounded-lg object-cover flex-shrink-0"
                style={{ width: 40, height: 40 }}
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{t.title}</div>
                <div className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                  {t.artist}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
