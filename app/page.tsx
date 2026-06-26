import Image from "next/image";

const features = [
  {
    icon: "🎭",
    title: "Mood Mixes",
    description:
      "Find the perfect soundtrack for every moment. Curated mixes built around how you feel right now.",
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
      "Send playlists with a link. No account required to listen.",
  },
  {
    icon: "🎧",
    title: "Background Playback",
    description:
      "Music keeps playing when you lock your screen. Lock screen controls, AirPlay support.",
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
          <a href="/support" className="hover:text-[#eef1f7] transition-colors">Support</a>
          <a href="/privacy" className="hover:text-[#eef1f7] transition-colors">Privacy</a>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="flex flex-col items-center text-center px-6 pt-24 pb-20">
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
          <p className="text-xl max-w-xl mb-10" style={{ color: "var(--text-secondary)" }}>
            Tru Collective is the home for independent artists. Discover songs by
            mood, build mixtapes, and support the artists you love.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a
              href="https://apps.apple.com/app/tru-collective/id6746897469"
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
            <span
              className="text-sm px-5 py-2 rounded-xl border"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              iOS · Android coming soon
            </span>
          </div>
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
              { src: "/screen-home.png", alt: "Home — mood mixes and featured tracks" },
              { src: "/screen-explore.png", alt: "Explore — browse all songs" },
              { src: "/screen-player.png", alt: "Player — full-screen now playing" },
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

        {/* App Store badge row */}
        <section
          className="border-t py-16 px-6 text-center"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <p className="text-2xl font-bold mb-2">Ready to listen?</p>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
            Available now on the App Store. Free to start.
          </p>
          <a
            href="https://apps.apple.com/app/tru-collective/id6746897469"
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
        </section>
      </main>

      {/* Footer */}
      <footer
        className="flex flex-col sm:flex-row items-center justify-between gap-3 px-8 py-6 text-sm border-t"
        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
      >
        <span>© {new Date().getFullYear()} Tru Collective. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:text-[#eef1f7] transition-colors">Privacy Policy</a>
          <a href="/support" className="hover:text-[#eef1f7] transition-colors">Support</a>
          <a href="mailto:kmullaney67@gmail.com" className="hover:text-[#eef1f7] transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
