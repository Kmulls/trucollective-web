import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://trucollective.app"),
  title: "Tru Collective — Independent Music Streaming",
  description:
    "Discover independent artists. Build mixtapes. Stream by mood. Tru Collective is the home for music that moves you.",
  openGraph: {
    title: "Tru Collective",
    description: "Independent music streaming for people who care about music.",
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
