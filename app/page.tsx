import Image from "next/image";
import TasterGrid from "./components/TasterGrid";
import { APP_PUBLISHED, APP_STORE_URL, ACCESS_EMAIL, ACCESS_MAILTO } from "./lib/siteConfig";

const features = [
  {
    icon: "🎭",
    title: "Mood Mixes",
    description:
      "Find the soundtrack for the moment you're actually in. The matching runs on your phone from a matrix built into the app — no API calls, no service listening.",
  },
  {
    icon: "📼",
    title: "Build Mixtapes",
    description:
      "Create and share mixtapes the old-school way — your picks, your order, your vibe.",
  },
  {
    icon: "🔗",
    title: "Share with Friends",
    description:
      "Send a mixtape with a link — your friend just needs the app to listen and follow along.",
  },
  {
    icon: "🎧",
    title: "Background Playback",
    description:
      "Music keeps playing when you lock your screen. Lock screen controls, AirPlay support.",
  },
  {
    icon: "🎤",
    title: "Sing Along",
    description:
      "Tap the art for lyrics. Singing it out loud is how we use Word Sound Power to heal and create.",
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      {/* Nav */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/icon-tru.png"
            alt="Tru Collective"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-semibold text-lg tracking-tight">Tru Collective</span>
        </div>
        <nav className="flex items-center gap-6 text-sm" style={{ color: "var(--text-secondary)" }}>
          <a href="/radio" className="hover:text-[#eef1f7] transition-colors">Radio</a>
          <a href="/support" className="hover:text-[#eef1f7] transition-colors">Support</a>
          <a href="/privacy" className="hover:text-[#eef1f7] transition-colors">Privacy</a>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center text-center px-6 pt-24 pb-16">
          <Image
            src="/icon-tru.png"
            alt="Tru Collective app icon"
            width={96}
            height={96}
            className="rounded-2xl mb-8 shadow-2xl"
            priority
          />
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
            Music that moves you.
          </h1>
          <p className="text-xl max-w-xl mb-3" style={{ color: "var(--text-secondary)" }}>
            A soundtrack for personal growth. Name where you are, and your mix is
            built on your phone — nothing about how you feel leaves your device.
          </p>
          <p className="text-sm max-w-xl mb-10" style={{ color: "var(--text-secondary)", opacity: 0.75 }}>
            Lyrics written by a human. Recordings produced with AI assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {APP_PUBLISHED ? (
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-semibold text-base transition-opacity hover:opacity-90"
              style={{ background: "var(--accent-gold)", color: "#0b0d14" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download on the App Store
            </a>
            ) : (
              <a
                href="/radio"
                className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-semibold text-base transition-opacity hover:opacity-90"
                style={{ background: "var(--accent-gold)", color: "#0b0d14" }}
              >
                ▶ Tune in to Tru Collective Radio
              </a>
            )}
            <span
              className="text-sm px-5 py-2 rounded-xl border"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              iOS · Android coming soon
            </span>
          </div>
          {APP_PUBLISHED ? (
            <a
              href="/radio"
              className="mt-6 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: "var(--accent-gold)" }}
            >
              ▶ Or tune in to Tru Collective Radio — live now
            </a>
          ) : (
            <p className="mt-6 text-sm" style={{ color: "var(--text-secondary)" }}>
              The app is invite-only right now &mdash; email{" "}
              <a href={ACCESS_MAILTO} className="underline" style={{ color: "var(--accent-gold)" }}>
                {ACCESS_EMAIL}
              </a>{" "}
              for access &mdash; just tell us if you&rsquo;re on an Apple or Android phone.
            </p>
          )}
        </section>

        {/* Taster tracks */}
        <TasterGrid />

        {/* The story */}
        <section className="px-6 pb-20 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            The Tru Collective Story
          </h2>
          <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
            Tru Collective started as a soundtrack for surviving. Over one year of
            extreme stress, loss and pressure, one person wrote across five voices
            — 144Kai, Tru Roots, The Mercy Hearts, Soul Fam, Rua Isbe. Not songs
            about the hard year. Songs written through it, to get to the other side
            of it.
          </p>
          <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
            They worked. So the app got built, alone, so the songs could do the
            same for you. Let music be thy medicine.
          </p>
          <a
            href="#for-artists"
            className="text-sm font-semibold"
            style={{ color: "var(--accent-gold)" }}
          >
            For artists →
          </a>
        </section>

        {/* Screenshots */}
        <section className="px-6 pb-20 max-w-5xl mx-auto">
          <h2
            className="text-center text-sm font-semibold uppercase tracking-widest mb-12"
            style={{ color: "var(--accent-gold)" }}
          >
            See it in action
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 justify-center">
            {[
              { src: "/screen-home.png", alt: "Home — mood mixes, matched on your device" },
              { src: "/screen-explore.png", alt: "Explore — browse the full catalogue" },
              { src: "/screen-player.png", alt: "Player — tap the art for lyrics and sing along" },
              { src: "/screen-artist.png", alt: "Artist page" },
            ].map((s) => (
              <div
                key={s.src}
                className="flex-shrink-0 rounded-2xl overflow-hidden border shadow-xl"
                style={{ borderColor: "var(--border)", width: 200 }}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={200}
                  height={433}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-6 pb-24 max-w-5xl mx-auto">
          <h2
            className="text-center text-sm font-semibold uppercase tracking-widest mb-12"
            style={{ color: "var(--accent-gold)" }}
          >
            Everything you need
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 border"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* For artists */}
        <section
          id="for-artists"
          className="px-6 py-20 text-center border-t"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4">The door is open.</h2>
          <p className="max-w-xl mx-auto mb-8" style={{ color: "var(--text-secondary)" }}>
            Tru Collective starts with one catalogue, but it isn&rsquo;t meant to end
            there. If you want to cover a song, collaborate, or talk about bringing
            your music in, get in touch.
          </p>
          <a
            href="mailto:trucollectivemusic@gmail.com"
            className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm border transition-colors hover:opacity-90"
            style={{ borderColor: "var(--accent-gold)", color: "var(--accent-gold)" }}
          >
            trucollectivemusic@gmail.com
          </a>
        </section>

        {/* Closing */}
        <section className="border-t py-16 px-6 text-center" style={{ borderColor: "var(--border)" }}>
          {APP_PUBLISHED ? (
            <>
              <p className="text-2xl font-bold mb-2">Ready to listen?</p>
              <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
                Available now on the App Store. Free.
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold mb-2">Want in?</p>
              <p className="mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
                {`The app is invite-only right now. Email ${ACCESS_EMAIL} and tell us if you’re on an Apple or Android phone, and we’ll get you access.`}
              </p>
            </>
          )}
          {APP_PUBLISHED ? (
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-semibold text-base transition-opacity hover:opacity-90"
            style={{ background: "var(--accent-gold)", color: "#0b0d14" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on the App Store
          </a>
          ) : (
            <a
              href={ACCESS_MAILTO}
              className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-semibold text-base transition-opacity hover:opacity-90"
              style={{ background: "var(--accent-gold)", color: "#0b0d14" }}
            >
              Email for access
            </a>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer
        className="px-8 py-8 text-sm border-t"
        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
      >
        <p className="max-w-2xl mx-auto text-center mb-6" style={{ opacity: 0.7 }}>
          Tru Collective is music made with the intention to uplift. It is not a
          medical device, not therapy, and not a substitute for professional care.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Tru Collective Music. All rights reserved. Tru Collective Music™</span>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-[#eef1f7] transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#eef1f7] transition-colors">Terms</a>
            <a href="/support" className="hover:text-[#eef1f7] transition-colors">Support</a>
            <a href="mailto:trucollectivemusic@gmail.com" className="hover:text-[#eef1f7] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
