import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Tru Collective",
  description: "Terms of Service for Tru Collective.",
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-3">Terms of Service</h1>
        <p className="text-sm mb-12" style={{ color: "var(--text-secondary)" }}>
          Last updated: June 26, 2026
        </p>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>1. Acceptance of Terms</h2>
            <p>By downloading, installing, or using Tru Collective ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App. These Terms apply to all users of the App, including visitors, registered users, and subscribers.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>2. Description of Service</h2>
            <p>Tru Collective is a music streaming platform that allows users to discover independent artists, build mixtapes, and listen to music curated by mood. The App is available on iOS and is operated by Kevin Mullaney ("we," "us," or "our").</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>3. Accounts</h2>
            <p className="mb-3">To access certain features of the App, you must sign in using Google or Apple. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</p>
            <p>You agree to provide accurate information when creating your account and to keep that information up to date. You must be at least 13 years of age to use the App.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>4. Subscriptions and Payments</h2>
            <p className="mb-3">Tru Collective offers a free tier and a paid subscription ("Premium"). Premium subscriptions are billed through Apple's In-App Purchase system on a recurring basis.</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Subscription fees are charged to your Apple ID account at confirmation of purchase.</li>
              <li>Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.</li>
              <li>To cancel, go to Settings → Apple ID → Subscriptions on your iPhone.</li>
              <li>Refunds are handled by Apple. We do not issue refunds directly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>5. Content and Intellectual Property</h2>
            <p className="mb-3">All music, artwork, and content available through Tru Collective is owned by or licensed to the respective artists and rights holders. You may not download, copy, reproduce, distribute, or create derivative works from any content in the App without explicit permission.</p>
            <p>The Tru Collective name, logo, and app design are our intellectual property. Nothing in these Terms grants you any right to use our trademarks or branding.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>6. Prohibited Conduct</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Use the App for any unlawful purpose</li>
              <li>Attempt to reverse engineer, hack, or circumvent any security feature of the App</li>
              <li>Use automated tools to scrape, download, or collect content from the App</li>
              <li>Share your account credentials with others</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>7. Privacy</h2>
            <p>Your use of the App is also governed by our <Link href="/privacy" className="underline hover:opacity-80">Privacy Policy</Link>, which is incorporated into these Terms by reference. By using the App, you consent to the collection and use of your information as described in the Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>8. Disclaimers</h2>
            <p>The App is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the App will be uninterrupted, error-free, or free of harmful components. We reserve the right to modify, suspend, or discontinue the App at any time without notice.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>9. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the App. Our total liability to you for any claim arising out of these Terms shall not exceed the amount you paid us in the 12 months prior to the claim.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>10. Termination</h2>
            <p>We may terminate or suspend your access to the App at any time, with or without cause, and with or without notice. You may delete your account at any time from within the App. Upon termination, your right to use the App ceases immediately.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>11. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of California, without regard to its conflict of law principles. Any disputes arising under these Terms shall be resolved in the courts located in California.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>12. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. We will notify you of material changes by updating the date at the top of this page. Continued use of the App after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>13. Contact</h2>
            <p>
              Questions about these Terms? Contact us at{" "}
              <a href="mailto:kmullaney67@gmail.com" className="underline hover:opacity-80">
                kmullaney67@gmail.com
              </a>.
            </p>
          </section>

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
