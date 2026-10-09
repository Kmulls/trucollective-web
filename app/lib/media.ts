// Public Supabase storage URLs (the audio + images buckets are public, same as the app).
const SUPA_URL = "https://wwdjwzdlkyijvtaqlmqz.supabase.co";
export const audioUrl = (file: string) => `${SUPA_URL}/storage/v1/object/public/audio/${file}`;
export const artUrl = (file: string) => `${SUPA_URL}/storage/v1/object/public/images/${file}`;
