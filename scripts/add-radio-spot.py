#!/usr/bin/env python3
"""Add a voice spot (DJ break) to the radio.

    python3 scripts/add-radio-spot.py "/path/a.m4a" "/path/b.m4a" ...      # regular DJ breaks
    python3 scripts/add-radio-spot.py --promo "/path/app-promo.m4a"        # the app promo clip

- Converts to mp3 and levels it to match the music (songs sit around -14/-15 LUFS;
  a phone recording is usually far quieter), with a peak limiter so it can't clip.
- Saves each as public/radio-spots/dj-NN.mp3 (or promo-NN.mp3 with --promo), served
  straight from the website (no Supabase), and rewrites the generated list in
  app/lib/radioSpots.ts. Promo clips are flagged `promo: true` and are scheduled
  separately (roughly every 6th break) — see app/lib/radioSchedule.ts.
- Then redeploy (`npx vercel --prod`) to put it on air.

How often spots play is SPOT_EVERY in app/lib/radioSpots.ts.
"""
import json, os, re, subprocess, sys

TARGET_LUFS = -15.0   # songs measure about -13 to -15 LUFS
PEAK_LIMIT = 0.84     # ~ -1.5 dBFS

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SPOT_DIR = os.path.join(ROOT, "public", "radio-spots")
SPOTS_TS = os.path.join(ROOT, "app", "lib", "radioSpots.ts")


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def duration(path):
    out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", path])
    return float(json.loads(out.stdout)["format"]["duration"])


def integrated_lufs(path):
    out = run(["ffmpeg", "-nostats", "-i", path, "-af", "ebur128", "-f", "null", "-"])
    m = re.findall(r"I:\s+(-?\d+\.\d+) LUFS", out.stderr)
    return float(m[-1])


def regenerate_list():
    files = sorted(f for f in os.listdir(SPOT_DIR) if f.endswith(".mp3"))
    rows = [
        '  { id: "%s", file: "%s", duration: %.3f%s },'
        % (f[:-4], f, duration(os.path.join(SPOT_DIR, f)), ", promo: true" if f.startswith("promo-") else "")
        for f in files
    ]
    block = "// BEGIN GENERATED (scripts/add-radio-spot.py)\nexport const RADIO_SPOTS: RadioSpot[] = [\n%s\n];\n// END GENERATED" % "\n".join(rows)
    src = open(SPOTS_TS).read()
    src = re.sub(r"// BEGIN GENERATED.*?// END GENERATED", lambda _: block, src, flags=re.S)
    open(SPOTS_TS, "w").write(src)
    print(f"radioSpots.ts now lists {len(files)} spot(s)")


def convert(src, prefix):
    nums = [int(m.group(1)) for f in os.listdir(SPOT_DIR) if (m := re.match(prefix + r"-(\d+)\.mp3$", f))]
    name = f"{prefix}-{(max(nums) + 1 if nums else 1):02d}.mp3"
    dest = os.path.join(SPOT_DIR, name)
    d = duration(src)
    loud = integrated_lufs(src)
    gain = TARGET_LUFS - loud
    r = run([
        "ffmpeg", "-y", "-i", src,
        "-af", f"volume={gain}dB,alimiter=limit={PEAK_LIMIT}:level=disabled,afade=t=in:d=0.02,afade=t=out:st={max(0, d - 0.08):.3f}:d=0.08",
        "-ar", "44100", "-b:a", "128k", dest,
    ])
    if r.returncode != 0:
        sys.exit(f"{src}: {r.stderr[-600:]}")
    print(f"{os.path.basename(src):36} {d:5.1f}s  {loud:6.1f} LUFS  {gain:+5.1f} dB -> {name}  (now {integrated_lufs(dest):.1f} LUFS)")


def main():
    promo = "--promo" in sys.argv
    files = [os.path.expanduser(a) for a in sys.argv[1:] if not a.startswith("--")]
    if not files:
        sys.exit(__doc__)
    os.makedirs(SPOT_DIR, exist_ok=True)
    for f in files:
        convert(f, "promo" if promo else "dj")
    regenerate_list()


if __name__ == "__main__":
    main()
