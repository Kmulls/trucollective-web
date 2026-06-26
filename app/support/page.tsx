import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support — Tru Collective",
  description: "Get help with Tru Collective. FAQs and contact information.",
};

const faqs = [
  {
    q: "How do I cancel my subscription?",
    a: "Open the Settings app on your iPhone → Apple ID → Subscriptions → Tru Collective → Cancel Subscription. Your access continues until the end of the current billing period.",
  },
  {
    q: "Is my data private?",
    a: "Yes. We collect only what's needed to run the app — your email address, likes, and mixtapes. We never sell your data to third parties. See our Privacy Policy for full details.",
  },
  {
    q: "How do I delete my account?",
    a: "Inside the app, go to My Stuff → Delete Account. This permanently removes your account and all associated data. You can also email us and we will delete it manually within 48 hours.",
  },
  {
    q: "The app isn't playing audio. What should I do?",
    a: "First check that your device is not on silent mode and that the volume is turned up. Try closing and reopening the app. If the issue persists, restart your device. If audio still won't play, contact us.",
  },
  {
    q: "Can I use Tru Collective offline?",
    a: "Currently Tru Collective requires an internet connection to stream music. Offline mode is on our roadmap.",
  },
  {
    q: "I was charged but can't access premium features.",
    a: "Go to My Stuff → Restore Purchases inside the app. If that doesn't resolve it, contact Apple Support for billing issues, or email us and we'll help sort it out.",
  },
  {
    q: "Is there an Android version?",
    a: "Not yet. Tru Collective is currently iOS only. Android is on our roadmap — follow us for updates.",
  },
];

export default function SupportPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <Link href="/" className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity">
          ← Tru Collective
        </Link>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <h1 className="text-3xl font-bold mb-3">Support</h1>
        <p className="mb-12 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Need help? Check the FAQs below or reach out directly.
        </p>

        <div className="space-y-6 mb-16">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl p-6 border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <h3 className="font-semibold mb-2">{item.q}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl p-8 border text-center"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <h2 className="text-xl font-bold mb-2">Still need help?</h2>
          <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            Email us and we'll get back to you within 48 hours.
          </p>
          <a
            href="mailto:kmullaney67@gmail.com"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: "var(--accent-gold)", color: "#0b0d14" }}
          >
            Email Support
          </a>
        </div>
      </main>

      <footer
        className="flex flex-col sm:flex-row items-center justify-between gap-3 px-8 py-6 text-sm border-t"
        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
      >
        <span>© {new Date().getFullYear()} Tru Collective.</span>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-[#eef1f7] transition-colors">Home</Link>
          <Link href="/privacy" className="hover:text-[#eef1f7] transition-colors">Privacy</Link>
          <a href="mailto:kmullaney67@gmail.com" className="hover:text-[#eef1f7] transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
