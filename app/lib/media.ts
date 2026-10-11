// Public Supabase storage URLs (the audio + images buckets are public, same as the app).
const SUPA_URL = "https://wwdjwzdlkyijvtaqlmqz.supabase.co";
// Songs the website streams (radio + home-page tasters). Still the app's `audio` bucket.
// To decouple from the app (e.g. before locking `audio` down), run
// `python3 scripts/sync-radio-audio.py` and change this to "radio".
const SONG_BUCKET = "audio";
export const audioUrl = (file: string) => `${SUPA_URL}/storage/v1/object/public/${SONG_BUCKET}/${file}`;
export const artUrl = (file: string) => `${SUPA_URL}/storage/v1/object/public/images/${file}`;
