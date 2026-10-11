import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RadioPlayer from "../components/RadioPlayer";
import { APP_PUBLISHED, APP_STORE_URL, ACCESS_EMAIL, ACCESS_MAILTO } from "../lib/siteConfig";

export const metadata: Metadata = {
  title: "Tru Collective Radio — Live",
  description:
    "Tru Collective songs, playing now — in sync for everyone listening. Tune in.",
  openGraph: {
    title: "Tru Collective Radio",
    description: "Tune in — Tru Collective songs, playing now.",
    url: "https://trucollective.app/radio",
    siteName: "Tru Collective",
    images: [{ url: "/radio-og.png", width: 1200, height: 630, alt: "Tru Collective Radio — tune in" }],
  },
  twitter: { card: "summary_large_image", images: ["/radio-og.png"] },
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

        <section className="px-6 pb-16 text-center">
          {APP_PUBLISHED ? (
            <>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Want to pick your own songs, build mixtapes, and get mood mixes made on your phone?
              </p>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm border transition-opacity hover:opacity-90"
                style={{ borderColor: "var(--accent-gold)", color: "var(--accent-gold)" }}
              >
                Get the app
              </a>
            </>
          ) : (
            <>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                {`Want the app? It’s invite-only right now — email ${ACCESS_EMAIL} for access, and just tell us if you’re on an Apple or Android phone, plus the email you use for your Apple ID or Google account.`}
              </p>
              <a
                href={ACCESS_MAILTO}
                className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm border transition-opacity hover:opacity-90"
                style={{ borderColor: "var(--accent-gold)", color: "var(--accent-gold)" }}
              >
                Email for access
              </a>
            </>
          )}
        </section>
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
