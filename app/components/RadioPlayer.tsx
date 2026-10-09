"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { onAir, type OnAir } from "../lib/radioSchedule";
import { audioUrl, artUrl } from "../lib/media";

// Plays the "simulated live" schedule from radioSchedule.ts. One <audio> element:
// every second we ask the schedule what should be on air right now, load that
// song if it isn't the one playing, jump to the right spot, and nudge the audio
// back into line if it drifts (buffering stalls, a throttled background tab).

const DRIFT_SECONDS = 3; // re-seek if the audio strays this far from the schedule
const RETRY_AFTER_ERROR_MS = 4000;

type Status = "idle" | "connecting" | "live" | "error";

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

export default function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedIdRef = useRef<string | null>(null);
  const tunedRef = useRef(false);
  const lastErrorAtRef = useRef(0);
  // Schedule state starts null so the server render and first client render match;
  // the real value is filled in after mount (it depends on the visitor's clock).
  const [air, setAir] = useState<OnAir | null>(null);
  const [tuned, setTuned] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const sync = useCallback(() => {
    const a = audioRef.current;
    if (!a || !tunedRef.current) return;
    const s = onAir(Date.now());

    // Wrong song loaded (or nothing yet): load what's on air and jump into it.
    if (loadedIdRef.current !== s.track.id) {
      if (Date.now() - lastErrorAtRef.current < RETRY_AFTER_ERROR_MS) return;
      loadedIdRef.current = s.track.id;
      setStatus("connecting");
      a.src = audioUrl(s.track.audioFile);
      try {
        a.currentTime = s.offset; // default start position; honoured by most browsers
      } catch {
        /* onLoadedMetadata corrects it for browsers that reject this early */
      }
      a.play().catch(() => {});
      return;
    }

    // The file ended a hair before the clock says the song is over — wait for the
    // schedule to roll to the next one rather than restarting this one.
    if (a.ended) return;

    if (a.readyState >= 2 && !a.seeking && Math.abs(a.currentTime - s.offset) > DRIFT_SECONDS) {
      a.currentTime = s.offset;
    }
    if (a.paused) a.play().catch(() => {});
  }, []);

  const tuneIn = useCallback(() => {
    tunedRef.current = true;
    setTuned(true);
    loadedIdRef.current = null;
    lastErrorAtRef.current = 0;
    sync(); // runs inside the click, so the browser lets audio start
  }, [sync]);

  const stop = useCallback(() => {
    tunedRef.current = false;
    setTuned(false);
    setStatus("idle");
    loadedIdRef.current = null;
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
      a.load(); // aborts the download
    }
  }, []);

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
      artwork: [{ src: artUrl(air.track.artFile), sizes: "512x512" }],
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

  const onLoadedMetadata = () => {
    const a = audioRef.current;
    if (!a || !tunedRef.current) return;
    const s = onAir(Date.now());
    if (s.track.id !== loadedIdRef.current) return; // sync() will load the right one
    if (Math.abs(a.currentTime - s.offset) > 1.5) {
      a.currentTime = Math.min(s.offset, Math.max(0, a.duration - 0.25));
    }
  };
  const onError = () => {
    if (!tunedRef.current) return;
    lastErrorAtRef.current = Date.now();
    loadedIdRef.current = null; // force a fresh load on the next tick
    setStatus("error");
  };

  const pct = air ? Math.min(100, (air.offset / air.track.duration) * 100) : 0;

  return (
    <div className="w-full max-w-md mx-auto px-6 pt-8 pb-16 text-center">
      <audio
        ref={audioRef}
        preload="auto"
        onLoadedMetadata={onLoadedMetadata}
        onPlaying={() => setStatus("live")}
        onWaiting={() => tunedRef.current && setStatus("connecting")}
        onEnded={sync}
        onError={onError}
      />

      <div
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6"
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

      <div
        className="mx-auto rounded-2xl overflow-hidden border shadow-2xl"
        style={{ width: 280, height: 280, borderColor: "var(--border)", background: "var(--card)" }}
      >
        {air && (
          <Image
            key={air.track.id}
            src={artUrl(air.track.artFile)}
            alt=""
            width={280}
            height={280}
            unoptimized
            priority
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <h2 className="text-2xl font-bold tracking-tight mt-6 min-h-[2rem]">{air?.track.title ?? " "}</h2>
      <p className="text-sm mt-1 min-h-[1.25rem]" style={{ color: "var(--text-secondary)" }}>
        {air ? `${air.track.artist} · ${air.track.genre}` : " "}
      </p>

      <div className="mt-6">
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

      <div className="mt-8">
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
            ▶ Tune in
          </button>
        )}
        <p className="text-xs mt-3 min-h-[1rem]" style={{ color: "var(--text-secondary)" }}>
          {status === "connecting" && "Connecting…"}
          {status === "live" && "Live — in sync with everyone listening"}
          {status === "error" && "Couldn’t load that song — retrying…"}
        </p>
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
                src={artUrl(t.artFile)}
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
