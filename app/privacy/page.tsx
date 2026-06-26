import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Tru Collective",
  description: "How Tru Collective collects, uses, and protects your data.",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm mb-10" style={{ color: "var(--text-secondary)" }}>
          Last updated: June 25, 2026
        </p>

        <p className="mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Tru Collective ("we", "our", or "us") is committed to protecting your
          privacy. This policy explains what information we collect, how we use
          it, and your rights regarding your data.
        </p>

        <Section title="1. Information We Collect">
          <p className="mb-4">
            When you create an account using Apple Sign-In, we receive your
            email address and a unique Apple-assigned user ID. We do not receive
            your Apple ID password.
          </p>
          <p className="mb-3">We store the following data associated with your account:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Email address (from Apple Sign-In)</li>
            <li>Songs you have liked</li>
            <li>Mixtapes you have created</li>
            <li>App usage statistics (session counts, feature interactions)</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and personalise the Tru Collective experience</li>
            <li>To sync your likes and mixtapes across devices</li>
            <li>To process subscription payments via Apple's in-app purchase system</li>
            <li>To respond to support requests</li>
          </ul>
          <p className="mt-4">
            We do not sell, rent, or share your personal information with third
            parties for marketing purposes.
          </p>
        </Section>

        <Section title="3. Data Storage">
          <p>
            Your account data is stored securely using Supabase (PostgreSQL).
            Audio content is served from secure cloud storage. We do not store
            payment card details — all billing is handled by Apple.
          </p>
        </Section>

        <Section title="4. Third-Party Services">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Apple Sign-In</strong> — authentication</li>
            <li><strong>Supabase</strong> — database and authentication infrastructure</li>
            <li><strong>Apple In-App Purchases</strong> — subscription billing</li>
          </ul>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain your data for as long as your account is active. You may
            request deletion of your account and all associated data at any time
            from within the app (My Stuff → Delete account) or by emailing us.
          </p>
        </Section>

        <Section title="6. Children's Privacy">
          <p>
            Tru Collective is not directed at children under 13. We do not
            knowingly collect personal information from minors.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>
            Depending on your location, you may have the right to access,
            correct, or delete your personal data. To exercise these rights,
            contact us at the address below.
          </p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>
            We may update this policy periodically and will notify users of
            significant changes by updating the date at the top of this
            document.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            For questions about this privacy policy, reach out to:{" "}
            <a
              href="mailto:kmullaney67@gmail.com"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: "var(--accent-gold)" }}
            >
              kmullaney67@gmail.com
            </a>
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {children}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="flex flex-col sm:flex-row items-center justify-between gap-3 px-8 py-6 text-sm border-t"
      style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
    >
      <span>© {new Date().getFullYear()} Tru Collective.</span>
      <div className="flex gap-6">
        <Link href="/" className="hover:text-[#eef1f7] transition-colors">Home</Link>
        <Link href="/support" className="hover:text-[#eef1f7] transition-colors">Support</Link>
        <a href="mailto:kmullaney67@gmail.com" className="hover:text-[#eef1f7] transition-colors">Contact</a>
      </div>
    </footer>
  );
}
