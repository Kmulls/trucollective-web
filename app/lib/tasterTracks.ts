// Curated 10-track shortlist, 2 per artist voice, spanning all 5 genres in the
// catalog. Picked for a diverse first impression of the sound — swap freely.
// Audio bucket is public (same as the app), so these are plain storage URLs.
const SUPA_URL = "https://wwdjwzdlkyijvtaqlmqz.supabase.co";
export const audioUrl = (file: string) => `${SUPA_URL}/storage/v1/object/public/audio/${file}`;
export const artUrl = (file: string) => `${SUPA_URL}/storage/v1/object/public/images/${file}`;

export type TasterTrack = {
  id: string;
  title: string;
  artist: string;
  audioFile: string;
  artFile: string;
  genre: string;
};

export const TASTER_TRACKS: TasterTrack[] = [
  { id: "ROOTS-002", title: "Manifest the Best", artist: "Tru Roots", audioFile: "ROOTS-002.mp3", artFile: "ROOTS-002.jpg", genre: "reggae" },
  { id: "ROOTS-003", title: "One Love, one sound", artist: "Tru Roots", audioFile: "ROOTS-003.mp3", artFile: "ROOTS-003.jpg", genre: "reggae" },
  { id: "KAI-014", title: "One Percent Better", artist: "144Kai", audioFile: "KAI-014.mp3", artFile: "KAI-014.jpg", genre: "hip-hop" },
  { id: "KAI-004", title: "Kill the Killers", artist: "144Kai", audioFile: "KAI-004.mp3", artFile: "KAI-004.jpg", genre: "hip-hop" },
  { id: "MERCY-027", title: "Spark to Flame", artist: "Mercy Hearts", audioFile: "MERCY-027.mp3", artFile: "MERCY-027.jpg", genre: "indie" },
  { id: "MERCY-057", title: "Love the life you have", artist: "Mercy Hearts", audioFile: "MERCY-057.mp3", artFile: "MERCY-057.jpg", genre: "indie" },
  { id: "RUA-013", title: "The Spark Inside", artist: "Rua Isbe", audioFile: "RUA-013.mp3", artFile: "RUA-013.jpg", genre: "spiritual" },
  { id: "RUA-001", title: "Chose Me First", artist: "Rua Isbe", audioFile: "RUA-001.mp3", artFile: "RUA-001.jpg", genre: "spiritual" },
  { id: "SOUL-002", title: "Miracles in the Breaking", artist: "Soul Fam", audioFile: "SOUL-002.mp3", artFile: "SOUL-002.jpg", genre: "soul" },
  { id: "SOUL-031", title: "Don’t Be Afraid of Your Upgrade", artist: "Soul Fam", audioFile: "SOUL-031.mp3", artFile: "SOUL-031.jpg", genre: "soul" },
];

// Every clip is capped at this many seconds, starting from 0:00. Simple v1 —
// per-track custom start offsets can be added later (see TasterGrid.tsx).
export const TASTER_CLIP_SECONDS = 30;
