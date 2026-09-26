"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TASTER_TRACKS, TASTER_CLIP_SECONDS, audioUrl, artUrl } from "../lib/tasterTracks";

// One shared <audio> element for the whole grid — guarantees only one track
// plays at a time (switching tracks just repoints its src) and keeps this
// simple: no per-card audio instances to juggle. Every clip auto-stops at
// TASTER_CLIP_SECONDS and resets, so nobody's phone silently plays a full song.
export default function TasterGrid() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // 0..1 within the 30s window

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const pct = Math.min(1, audio.currentTime / TASTER_CLIP_SECONDS);
      setProgress(pct);
      if (audio.currentTime >= TASTER_CLIP_SECONDS) {
        audio.pause();
        audio.currentTime = 0;
        setPlayingId(null);
        setProgress(0);
      }
    };
    const onEnded = () => {
      // A clip shorter than 30s ending naturally.
      setPlayingId(null);
      setProgress(0);
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = (id: string, file: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playingId === id) {
      audio.pause();
      setPlayingId(null);
      return;
    }
    audio.src = audioUrl(file);
    audio.currentTime = 0;
    audio.play().catch(() => {
      /* autoplay/gesture edge cases — silently ignore, button just stays idle */
    });
    setPlayingId(id);
    setProgress(0);
  };

  return (
    <section className="px-6 pb-20 max-w-5xl mx-auto">
      <h2
        className="text-center text-sm font-semibold uppercase tracking-widest mb-2"
        style={{ color: "var(--accent-gold)" }}
      >
        Hear it for yourself
      </h2>
      <p className="text-center text-sm mb-10" style={{ color: "var(--text-secondary)" }}>
        30-second tastes from across the catalog.
      </p>

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} preload="none" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TASTER_TRACKS.map((t) => {
          const isPlaying = playingId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => toggle(t.id, t.audioFile)}
              className="flex items-center gap-3 p-3 rounded-xl border text-left transition-colors"
              style={{
                background: isPlaying ? "var(--card)" : "transparent",
                borderColor: isPlaying ? "var(--accent-gold)" : "var(--border)",
              }}
            >
              <div className="relative flex-shrink-0" style={{ width: 48, height: 48 }}>
                <Image
                  src={artUrl(t.artFile)}
                  alt=""
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                  style={{ width: 48, height: 48 }}
                  unoptimized
                />
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-lg"
                  style={{ background: "rgba(11,13,20,0.45)" }}
                >
                  <span style={{ color: "#fff", fontSize: 16, lineHeight: 1 }}>
                    {isPlaying ? "⏸" : "▶"}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{t.title}</div>
                <div className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                  {t.artist} · {t.genre}
                </div>
                {isPlaying && (
                  <div
                    className="mt-2 h-[3px] rounded-full overflow-hidden"
                    style={{ background: "var(--border)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress * 100}%`,
                        background: "var(--accent-gold)",
                        transition: "width 200ms linear",
                      }}
                    />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
