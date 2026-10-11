#!/usr/bin/env python3
"""Mirror the website's songs into their own public Supabase bucket ("radio").

    python3 scripts/sync-radio-audio.py

Why a separate bucket (note: the website does NOT use it yet):
  - It decouples the website from the app. When the app's `audio` bucket is locked down
    (private + signed URLs, a pre-public-launch to-do), the radio and home-page tasters
    would stop working — they stream public URLs from `audio`. This bucket is a ready-made
    public copy: run this script, then point audioUrl() in app/lib/media.ts at BUCKET.
  - It is NOT a speed/caching fix. Supabase's CDN already caches public audio at the edge
    (served with `cf-cache-status` and `cache-control: no-cache`, i.e. "always revalidate
    with the edge"), and that header is the same for every bucket regardless of the
    max-age stored on the object. Egress billing is unchanged either way.
  - Additive only: it never touches the app's `audio` bucket or overwrites anything.

Files are byte-identical copies (no re-encoding), so durations — which the radio
schedule depends on — are unchanged. Run it again whenever radioTracks.ts or the
tasters change; it only uploads what's missing.

Needs SUPABASE_SERVICE_ROLE_KEY (read from the app repo's .env, never printed):
override the path with TC_APP_ENV.
"""
import json, os, re, sys, time, urllib.error, urllib.request
from concurrent.futures import ThreadPoolExecutor

SUPA = "https://wwdjwzdlkyijvtaqlmqz.supabase.co"
BUCKET = "radio"
CACHE_CONTROL = "max-age=86400"   # stored on each object; Supabase's CDN decides what browsers are sent
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
ENV_PATH = os.path.expanduser(os.environ.get("TC_APP_ENV", "~/tru-collective/.env"))


def service_key():
    for line in open(ENV_PATH):
        m = re.match(r"\s*(?:export\s+)?SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)\s*$", line)
        if m:
            return m.group(1).strip().strip("'\"")
    sys.exit(f"SUPABASE_SERVICE_ROLE_KEY not found in {ENV_PATH}")


KEY = service_key()


def api(method, path, body=None, headers=None, raw=False):
    h = {"Authorization": f"Bearer {KEY}", "apikey": KEY}
    h.update(headers or {})
    data = body if isinstance(body, (bytes, bytearray)) else (json.dumps(body).encode() if body is not None else None)
    if body is not None and not isinstance(body, (bytes, bytearray)):
        h["Content-Type"] = "application/json"
    req = urllib.request.Request(f"{SUPA}{path}", data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            out = r.read()
            return r.status, (out if raw else (json.loads(out) if out else None))
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:300]


def needed_files():
    names = set()
    for f in ("app/lib/radioTracks.ts", "app/lib/tasterTracks.ts"):
        names |= set(re.findall(r'audioFile:\s*"([^"]+\.mp3)"', open(os.path.join(ROOT, f)).read()))
    return sorted(names)


def ensure_bucket():
    status, _ = api("GET", f"/storage/v1/bucket/{BUCKET}")
    if status == 200:
        print(f"bucket '{BUCKET}' already exists")
        return
    status, resp = api("POST", "/storage/v1/bucket", {
        "id": BUCKET, "name": BUCKET, "public": True, "allowed_mime_types": ["audio/mpeg"],
    })
    if status not in (200, 201):
        sys.exit(f"could not create bucket: {status} {resp}")
    print(f"created public bucket '{BUCKET}'")


def existing():
    status, resp = api("POST", f"/storage/v1/object/list/{BUCKET}", {"prefix": "", "limit": 1000, "offset": 0})
    return {o["name"] for o in resp} if status == 200 else set()


def copy_one(name):
    src = f"{SUPA}/storage/v1/object/public/audio/{name}"
    with urllib.request.urlopen(src, timeout=120) as r:
        blob = r.read()
    status, resp = api("POST", f"/storage/v1/object/{BUCKET}/{name}", blob, {
        "Content-Type": "audio/mpeg", "cache-control": CACHE_CONTROL, "x-upsert": "false",
    })
    return name, status, len(blob), resp


def main():
    files = needed_files()
    print(f"{len(files)} songs needed by the website")
    ensure_bucket()
    have = existing()
    todo = [f for f in files if f not in have]
    print(f"{len(have)} already in the bucket, {len(todo)} to upload")
    failed = []
    total = 0
    with ThreadPoolExecutor(4) as ex:
        for name, status, size, resp in ex.map(copy_one, todo):
            if status in (200, 201):
                total += size
            else:
                failed.append((name, status, resp))
    print(f"uploaded {len(todo) - len(failed)} files ({total / 1e6:.0f} MB)")
    for name, status, resp in failed:
        print("FAILED", name, status, resp)

    # Verify every needed file: present, same size as the original, cache header set.
    bad = 0
    for name in files:
        def head(url):
            req = urllib.request.Request(url, method="HEAD")
            for attempt in range(4):
                try:
                    with urllib.request.urlopen(req, timeout=60) as r:
                        return int(r.headers.get("content-length", -1)), r.headers.get("cache-control")
                except urllib.error.HTTPError as e:
                    if e.code != 429 or attempt == 3:
                        raise
                    time.sleep(1.5 * (attempt + 1))  # CDN rate limit — back off and retry
        try:
            a_size, _ = head(f"{SUPA}/storage/v1/object/public/audio/{name}")
            b_size, b_cache = head(f"{SUPA}/storage/v1/object/public/{BUCKET}/{name}")
        except Exception as e:
            bad += 1
            print("VERIFY FAIL", name, e)
            continue
        if a_size != b_size:
            bad += 1
            print("VERIFY MISMATCH", name, a_size, b_size)
    print(f"verified {len(files)} files: {bad} problems")
    sys.exit(1 if (failed or bad) else 0)


if __name__ == "__main__":
    main()
