"use client";

import { useEffect, useState } from "react";

// id -> "Title — Artist", generated from the app catalog. Extra/held ids are
// harmless: an old shared link still resolves its title.
const SONGS: Record<string, string> = {
  "ROOTS-001": "The Game is Ending — Tru Roots",
  "ROOTS-002": "Manifest the Best — Tru Roots",
  "ROOTS-003": "One Love, one sound — Tru Roots",
  "ROOTS-004": "Whispers of 444 — Tru Roots",
  "ROOTS-005": "Two Ways — Tru Roots",
  "ROOTS-006": "The Spark Inside — Tru Roots",
  "ROOTS-007": "Pulse Panic — Tru Roots",
  "ROOTS-008": "The Volume of I — Tru Roots",
  "ROOTS-009": "Sing it Loud — Tru Roots",
  "ROOTS-010": "Stay Alive in the Truth — Tru Roots",
  "ROOTS-011": "The Devils Lie — Tru Roots",
  "ROOTS-012": "Truth Seeker — Tru Roots",
  "ROOTS-013": "Pick yourself Up — Tru Roots",
  "ROOTS-014": "The Great Remembering — Tru Roots",
  "ROOTS-015": "So it isBe — Tru Roots",
  "ROOTS-016": "Sacred Loneliness — Tru Roots",
  "ROOTS-017": "Why you so Sad — Tru Roots",
  "ROOTS-018": "Bird in a cage — Tru Roots",
  "ROOTS-019": "Roots & Branches — Tru Roots",
  "ROOTS-020": "Show Me — Tru Roots",
  "ROOTS-021": "Inner Flame — Tru Roots",
  "KAI-001": "The End of the Illuminati — 144Kai",
  "KAI-002": "False light — 144Kai",
  "KAI-003": "Trapped in da Trap — 144Kai",
  "KAI-004": "Kill the Killers — 144Kai",
  "KAI-005": "Ready to Heal — 144Kai",
  "KAI-006": "Honeymoon High — 144Kai",
  "KAI-007": "Dirt on the beat — 144Kai",
  "KAI-008": "Mind Over Mirage — 144Kai",
  "KAI-009": "Erase the pain — 144Kai",
  "KAI-010": "Life Unfiltered — 144Kai",
  "KAI-011": "The whole Story After — 144Kai",
  "KAI-012": "Elevation Mind — 144Kai",
  "KAI-013": "Are we gonna talk? — 144Kai",
  "KAI-014": "One Percent Better — 144Kai",
  "KAI-015": "Build it right (144Kai) entrepreneur — 144Kai",
  "KAI-016": "Wake Up Different — 144Kai",
  "KAI-017": "Fuvk your Mood — 144Kai",
  "KAI-018": "Manifest in 4 — 144Kai",
  "KAI-019": "Respect Yourself — 144Kai",
  "KAI-020": "Two Roads, One Cup — 144Kai",
  "KAI-021": "Face the Truth — 144Kai",
  "KAI-022": "Why Do I — 144Kai",
  "KAI-023": "Finding Light — 144Kai",
  "KAI-024": "Goggins Flow — 144Kai",
  "KAI-025": "PARADOX — 144Kai",
  "KAI-026": "Let’s get to work — 144Kai",
  "KAI-027": "You are the One Neo — 144Kai",
  "KAI-028": "BroCode — 144Kai",
  "KAI-029": "Quiet progress — 144Kai",
  "KAI-030": "Make it Count — 144Kai",
  "KAI-031": "Tonight he dies — 144Kai",
  "KAI-032": "Control What’s Mine — 144Kai",
  "KAI-033": "FOMO — 144Kai",
  "KAI-034": "555 Flow — 144Kai",
  "KAI-035": "Hold Nothing Back — 144Kai",
  "KAI-036": "THE MASK — 144Kai",
  "KAI-037": "Broken Love — 144Kai",
  "KAI-038": "Ghosted — 144Kai",
  "KAI-039": "Ghosted — 144Kai",
  "KAI-040": "Fuvk your mood — 144Kai",
  "KAI-041": "Rearview Ghosts — 144Kai",
  "KAI-042": "Beauty Inside — 144Kai",
  "KAI-043": "Thaw it out — 144Kai",
  "KAI-044": "Thoughts to Gold — 144Kai",
  "KAI-045": "What I Believe Now — 144Kai",
  "KAI-046": "Threshold — 144Kai",
  "KAI-047": "Feared By Weak men — 144Kai",
  "KAI-048": "Sky & Earth — 144Kai",
  "KAI-049": "Hold the Line — 144Kai",
  "KAI-050": "Steady (144Kai) For Theo — 144Kai",
  "KAI-051": "Karmic Retribution — 144Kai",
  "KAI-052": "The Wound Is The Weapon — 144Kai",
  "KAI-053": "Untouchable — 144Kai",
  "MERCY-001": "Still Feel You — Mercy Hearts",
  "MERCY-002": "East of Everything — Mercy Hearts",
  "MERCY-003": "Born into Winter — Mercy Hearts",
  "MERCY-004": "Ten Years in Between — Mercy Hearts",
  "MERCY-005": "Midnight Frontier — Mercy Hearts",
  "MERCY-006": "Where the Pines Still Sing — Mercy Hearts",
  "MERCY-007": "Harvest Moon Don’t Lie — Mercy Hearts",
  "MERCY-008": "Where the Pines Still Sing Duet — Mercy Hearts",
  "MERCY-009": "Why I Still Care — Mercy Hearts",
  "MERCY-010": "Small Things — Mercy Hearts",
  "MERCY-011": "One More Mile — Mercy Hearts",
  "MERCY-012": "Lantern — Mercy Hearts",
  "MERCY-013": "All them Broken Pieces — Mercy Hearts",
  "MERCY-014": "You Were There — Mercy Hearts",
  "MERCY-015": "Drove Away — Mercy Hearts",
  "MERCY-016": "I Should’ve Said — Mercy Hearts",
  "MERCY-017": "Lost Myself — Mercy Hearts",
  "MERCY-018": "Parallel Lives — Mercy Hearts",
  "MERCY-019": "Not Turning Around — Mercy Hearts",
  "MERCY-020": "Trembling Hands — Mercy Hearts",
  "MERCY-021": "Peace After the Storm — Mercy Hearts",
  "MERCY-022": "Garden of Ashes — Mercy Hearts",
  "MERCY-023": "What I’m Worth — Mercy Hearts",
  "MERCY-024": "No Loose Ends — Mercy Hearts",
  "MERCY-025": "Nothing Pie — Mercy Hearts",
  "MERCY-026": "Four Years Before — Mercy Hearts",
  "MERCY-027": "Spark to Flame — Mercy Hearts",
  "MERCY-028": "Test the Brakes — Mercy Hearts",
  "MERCY-029": "Ladybug at my Door — Mercy Hearts",
  "MERCY-030": "Still Standing — Mercy Hearts",
  "MERCY-031": "Lantern in the Dark — Mercy Hearts",
  "MERCY-032": "One Last Time — Mercy Hearts",
  "MERCY-033": "Slow Burn — Mercy Hearts",
  "MERCY-034": "Wrong Room, Right Moment — Mercy Hearts",
  "MERCY-035": "Maya n Jack — Mercy Hearts",
  "MERCY-036": "In All You Do — Mercy Hearts",
  "MERCY-037": "The Armored One — Mercy Hearts",
  "MERCY-038": "Under the Mask — Mercy Hearts",
  "MERCY-039": "The Sound of It — Mercy Hearts",
  "MERCY-040": "The teacher — Mercy Hearts",
  "MERCY-041": "The Projection — Mercy Hearts",
  "MERCY-042": "Open Road Faith — Mercy Hearts",
  "MERCY-043": "Plastic Flowers in the Fall — Mercy Hearts",
  "MERCY-044": "Good All By Myself — Mercy Hearts",
  "MERCY-045": "Pocket full of stars — Mercy Hearts",
  "MERCY-046": "Cards on the Table — Mercy Hearts",
  "MERCY-047": "Dad’s 10 Year Old — Mercy Hearts",
  "MERCY-048": "Dad’s 10 Year Old — Mercy Hearts",
  "MERCY-049": "Growing up is Hard — Mercy Hearts",
  "MERCY-050": "UNDER THE SNOW — Mercy Hearts",
  "MERCY-051": "Janie’s Gone — Mercy Hearts",
  "MERCY-052": "Wide Awake — Tru Roots",
  "MERCY-053": "Unplugged — Rua Isbe",
  "MERCY-054": "Love Alone — Mercy Hearts",
  "MERCY-055": "Entangled — Mercy Hearts",
  "MERCY-056": "No Scoreboard in the Sky — Mercy Hearts",
  "MERCY-057": "Love the life you have — Mercy Hearts",
  "RUA-001": "Chose Me First — Rua Isbe",
  "RUA-002": "Be my home — Rua Isbe",
  "RUA-003": "Fading Polaroids — Rua Isbe",
  "RUA-004": "Shine Again — Rua Isbe",
  "RUA-005": "Love Me Light — Rua Isbe",
  "RUA-006": "Comet’s Tail — Rua Isbe",
  "RUA-007": "Body Keeps the Score — Rua Isbe",
  "RUA-008": "Broadcast — Rua Isbe",
  "RUA-009": "The Storm — Rua Isbe",
  "RUA-010": "Cracks 2 Canyons — Rua Isbe",
  "RUA-011": "Sunrise Starts with You — Rua Isbe",
  "RUA-012": "Living Unafraid — Rua Isbe",
  "RUA-013": "The Spark Inside — Rua Isbe",
  "RUA-014": "We Let Go — Rua Isbe",
  "RUA-015": "Save me First — Rua Isbe",
  "RUA-016": "Foundation Flow — Rua Isbe",
  "RUA-017": "Not the One — Rua Isbe",
  "RUA-018": "Lost becomes Found — Rua Isbe",
  "RUA-019": "Done with That — Rua Isbe",
  "RUA-020": "Back to Center — Rua Isbe",
  "RUA-021": "Ambient Vibe — Rua Isbe",
  "RUA-022": "Cut those Cords — Rua Isbe",
  "RUA-023": "What I want, Wants Me — Rua Isbe",
  "RUA-024": "Ho’oponopono Journey — Rua Isbe",
  "SOUL-001": "Faith Over Fear — Soul Fam",
  "SOUL-002": "Miracles in the Breaking — Soul Fam",
  "SOUL-003": "Sacred Goodnight — Soul Fam",
  "SOUL-004": "Into Me You See — Soul Fam",
  "SOUL-005": "Echoes of the Stars — Soul Fam",
  "SOUL-006": "Let go to Let God — Soul Fam",
  "SOUL-007": "Music is my Medicine — Soul Fam",
  "SOUL-008": "Find that Downbeat — Soul Fam",
  "SOUL-009": "Clear Vision — Soul Fam",
  "SOUL-010": "Upside Down — Soul Fam",
  "SOUL-011": "What’s Going Right — Soul Fam",
  "SOUL-012": "Beyond the Romance — Soul Fam",
  "SOUL-013": "Heart soars Like a hawk — Soul Fam",
  "SOUL-014": "Real Ones Rise — Soul Fam",
  "SOUL-015": "You Belong Here — Soul Fam",
  "SOUL-016": "I Still Need You — Soul Fam",
  "SOUL-017": "Grow Through It — Soul Fam",
  "SOUL-018": "And So on… — Soul Fam",
  "SOUL-019": "Let Them — Soul Fam",
  "SOUL-020": "We Came to Play — Soul Fam",
  "SOUL-021": "Because it’s you — Soul Fam",
  "SOUL-022": "Not too small — Soul Fam",
  "SOUL-023": "Three Small Things — Soul Fam",
  "SOUL-024": "Carry me — Soul Fam",
  "SOUL-025": "Signals — Soul Fam",
  "SOUL-026": "Grandmas Love — Soul Fam",
  "SOUL-027": "Made to Create — Soul Fam",
  "SOUL-028": "Cooper’s Song — Soul Fam",
  "SOUL-029": "Naming & Claiming — Soul Fam",
  "SOUL-030": "There is no tomorrow — Soul Fam",
  "SOUL-031": "Don’t Be Afraid of Your Upgrade — Soul Fam",
  "SOUL-032": "Chaos By Design — Soul Fam",
  "SOUL-033": "Keep On, Keeping On — Soul Fam"
};

const APP_STORE = "https://apps.apple.com/app/id6781126475";

export default function MixtapeClient() {
  const [name, setName] = useState("A mixtape");
  const [ids, setIds] = useState<string[]>([]);
  const [deepLink, setDeepLink] = useState("#");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const n = (q.get("n") || "A mixtape").trim();
    const s = (q.get("s") || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    setName(n);
    setIds(s);
    setDeepLink(
      `trucollective://m?n=${encodeURIComponent(n)}&s=${encodeURIComponent(s.join(","))}`,
    );
  }, []);

  const single = ids.length === 1;

  return (
    <main style={S.wrap}>
      <img style={S.logo} src="/logo.png" alt="Tru Collective" />
      <h1 style={S.h1}>{single ? "Someone shared a song \u{1F3B5}" : "Someone made you a mixtape \u{1F3A7}"}</h1>
      <p style={S.sub}>on Tru Collective — your growth has a soundtrack.</p>
      <div style={S.name}>{name}</div>
      <div style={S.count}>{ids.length} song{ids.length === 1 ? "" : "s"}</div>
      <ul style={S.list}>
        {ids.map((id, i) => {
          const t = SONGS[id];
          if (!t) return null;
          return (
            <li key={id + i} style={S.li}>
              <b style={S.liB}>{i + 1}.</b> {t}
            </li>
          );
        })}
      </ul>
      <a style={{ ...S.btn, ...S.open }} href={deepLink}>
        {"\u25B6"} Open in Tru Collective
      </a>
      <a style={{ ...S.btn, ...S.get }} href={APP_STORE}>
        Get the app
      </a>
      <div style={S.foot}>Music is medicine for the soul. ~ Captain Cosmic</div>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, system-ui, sans-serif", background: "#0b0d14", color: "#eef1f7", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 20px 48px", textAlign: "center" },
  logo: { width: 96, height: 96, borderRadius: 24, marginTop: 18, objectFit: "cover" },
  h1: { fontSize: 26, fontWeight: 800, margin: "18px 0 4px", textWrap: "balance" },
  sub: { color: "#cdd5ea", fontSize: 15 },
  name: { color: "#f5b942", fontSize: 22, fontWeight: 800, margin: "16px 0 2px" },
  count: { color: "#cdd5ea", fontSize: 14, marginBottom: 14 },
  list: { listStyle: "none", width: "100%", maxWidth: 440, padding: 0, margin: "0 0 22px" },
  li: { background: "#161a28", borderRadius: 12, padding: "11px 14px", marginBottom: 7, fontSize: 14, textAlign: "left", color: "#cdd3e0" },
  liB: { color: "#eef1f7" },
  btn: { display: "block", width: "100%", maxWidth: 440, padding: 15, borderRadius: 13, fontSize: 16, fontWeight: 800, textDecoration: "none", marginBottom: 12 },
  open: { background: "#7c5cff", color: "#fff" },
  get: { background: "#f5b942", color: "#1a1300" },
  foot: { color: "#5d647a", fontSize: 12, marginTop: 18 },
};
