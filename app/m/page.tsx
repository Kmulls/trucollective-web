import type { Metadata } from "next";
import MixtapeClient from "./MixtapeClient";

export const metadata: Metadata = {
  title: "Tru Collective — a mixtape for you",
  description: "Tap to open it in Tru Collective. Your growth has a soundtrack.",
  openGraph: {
    type: "music.playlist",
    siteName: "Tru Collective",
    title: "\u{1F3A7} A mixtape made for you on Tru Collective",
    description: "Tap to open it in Tru Collective. Your growth has a soundtrack.",
    url: "https://www.trucollective.app/m",
    images: [{ url: "https://www.trucollective.app/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function MixtapePage() {
  return <MixtapeClient />;
}
