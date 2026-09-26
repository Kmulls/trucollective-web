import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://trucollective.app"),
  title: "Tru Collective — A Soundtrack for Personal Growth",
  description:
    "Stream by mood, build mixtapes, sing along. Written by one person through one hard year, and built to lift you.",
  openGraph: {
    title: "Tru Collective",
    description: "A soundtrack for personal growth. Mood mixes that run on your device.",
    url: "https://trucollective.app",
    siteName: "Tru Collective",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
