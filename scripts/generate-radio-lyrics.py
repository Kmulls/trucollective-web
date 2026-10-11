#!/usr/bin/env python3
"""Package the app's lyrics + line timings for the radio's karaoke view.

    python3 scripts/generate-radio-lyrics.py [path-to-tru-collective-app-repo]

Reads the song ids from app/lib/radioTracks.ts, pulls each song's lyrics and per-line
start times (from forced alignment) out of the app repo, and writes
public/radio-lyrics.json — a static file the radio page loads only when someone flips the
artwork to lyrics. Format: { "<song id>": { "l": "line1\\nline2...", "t": [secs|null, ...] } }
`t` lines up 1:1 with the lines of `l`; if the app has no matching timings for a song, `t`
is omitted and the page estimates timing from line length (same fallback as the app).
Re-run after radioTracks.ts or the app's lyrics change.
"""
import json, os, re, sys

APP = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "~/tru-collective")
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

lyrics = json.load(open(f"{APP}/src/data/lyrics.json"))
timings = json.load(open(f"{APP}/src/data/lyric_timings.json"))
ids = re.findall(r'\{ id: "([^"]+)"', open(os.path.join(ROOT, "app/lib/radioTracks.ts")).read())

out, real, none = {}, 0, []
for i in ids:
    text = (lyrics.get(i) or "").strip("\n")
    if not text.strip():
        none.append(i)
        continue
    entry = {"l": text}
    t = timings.get(i)
    if t and len(t) == len(text.split("\n")):
        entry["t"] = [None if x is None else round(float(x), 2) for x in t]
        real += 1
    out[i] = entry

dest = os.path.join(ROOT, "public", "radio-lyrics.json")
json.dump(out, open(dest, "w"), ensure_ascii=False, separators=(",", ":"))
print(f"{len(ids)} songs | {len(out)} with lyrics ({real} with real timings) | no lyrics: {none}")
print(f"wrote {os.path.relpath(dest, ROOT)} ({os.path.getsize(dest) / 1024:.0f} KB)")
