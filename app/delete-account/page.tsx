import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delete Your Account — Tru Collective",
  description:
    "How to request deletion of your Tru Collective account and all associated data.",
};

const CONTACT_EMAIL = "trucollectivemusic@gmail.com";

export default function DeleteAccountPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <Link
          href="/"
          className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
        >
          ← Tru Collective
        </Link>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <h1 className="text-3xl font-bold mb-3">Delete your account</h1>
        <p className="mb-10 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          You can permanently delete your <strong>Tru Collective</strong> account and all
          associated data at any time. There are two ways to do it.
        </p>

        {/* Method 1 — in-app */}
        <div
          className="rounded-2xl p-6 border mb-6"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <h2 className="font-semibold text-lg mb-3">Option 1 — In the app</h2>
          <ol
            className="list-decimal list-inside space-y-2 text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            <li>Open the Tru Collective app and sign in.</li>
            <li>
              Go to the <strong>My Stuff</strong> tab.
            </li>
            <li>
              Tap <strong>Delete Account</strong> and confirm.
            </li>
          </ol>
          <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--text-secondary)" }}>
            Your account and data are removed immediately and permanently.
          </p>
        </div>

        {/* Method 2 — email */}
        <div
          className="rounded-2xl p-6 border mb-10"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <h2 className="font-semibold text-lg mb-3">Option 2 — By email</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            If you no longer have the app installed, email us from the address on your account
            with the subject <strong>&ldquo;Delete my account&rdquo;</strong>. We will delete your
            account and all associated data within 48 hours and confirm by reply.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Delete%20my%20account`}
            className="inline-block mt-4 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: "var(--accent-gold)", color: "#0b0d14" }}
          >
            Email a deletion request
          </a>
        </div>

        {/* What is deleted / kept */}
        <h2 className="text-xl font-bold mb-3">What gets deleted</h2>
        <ul
          className="list-disc list-inside space-y-2 text-sm leading-relaxed mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          <li>Your account and the email address used to sign in.</li>
          <li>Your liked songs and saved mixtapes.</li>
          <li>All other data tied to your account on our servers.</li>
        </ul>

        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
          Deletion is permanent and cannot be undone. Data stored only on your device (such as
          your listening history and personalization settings) never leaves your phone and is
          removed when you uninstall the app. We retain no personal data after a deletion request
          is completed, except where we are legally required to keep limited records.
        </p>

        <div
          className="rounded-2xl p-8 border text-center"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <h2 className="text-xl font-bold mb-2">Questions?</h2>
          <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            Email us and we&rsquo;ll get back to you within 48 hours.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
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
          <Link href="/" className="hover:text-[#eef1f7] transition-colors">
            Home
          </Link>
          <Link href="/privacy" className="hover:text-[#eef1f7] transition-colors">
            Privacy
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#eef1f7] transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
