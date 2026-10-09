import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RadioPlayer from "../components/RadioPlayer";

export const metadata: Metadata = {
  title: "Tru Collective Radio — Live",
  description:
    "Tru Collective songs, playing now — in sync for everyone listening. Tune in.",
  openGraph: {
    title: "Tru Collective Radio",
    description: "Tune in — Tru Collective songs, playing now.",
    url: "https://trucollective.app/radio",
    siteName: "Tru Collective",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

export default function RadioPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image src="/icon-tru.png" alt="Tru Collective" width={32} height={32} className="rounded-lg" />
          <span className="font-semibold text-lg tracking-tight">Tru Collective</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm" style={{ color: "var(--text-secondary)" }}>
          <Link href="/" className="hover:text-[#eef1f7] transition-colors">Home</Link>
          <Link href="/support" className="hover:text-[#eef1f7] transition-colors">Support</Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="text-center px-6 pt-14">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Tru Collective Radio</h1>
          <p className="max-w-md mx-auto text-sm" style={{ color: "var(--text-secondary)" }}>
            One loop of the catalogue, playing for everyone at once. Tap tune in and
            you&rsquo;ll land wherever it is right now.
          </p>
        </section>

        <RadioPlayer />
      </main>

      <footer
        className="px-8 py-6 text-sm border-t text-center"
        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
      >
        <p className="mb-2" style={{ opacity: 0.8 }}>
          Lyrics written by a human. Recordings produced with AI assistance.
        </p>
        <span>© {new Date().getFullYear()} Tru Collective Music. All rights reserved.</span>
      </footer>
    </div>
  );
}
