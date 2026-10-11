import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The picture shown when a link to /radio is shared (texts, social, etc.).
// Generated at build time from the app icon — no image file to maintain.
// The site is a static export, so this image is rendered once at build time.
export const dynamic = "force-static";
export const alt = "Tru Collective Radio — tune in";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const icon = await readFile(join(process.cwd(), "public", "icon-tru.png"));
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 90px",
          background: "linear-gradient(135deg, #0b0d14 0%, #161a28 100%)",
          color: "#eef1f7",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} width={260} height={260} alt="" style={{ borderRadius: 56 }} />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 70, width: 690 }}>
          <div style={{ display: "flex", alignItems: "center", color: "#ff5b6e", fontSize: 34, letterSpacing: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: "#ff5b6e", marginRight: 18 }} />
            ON AIR
          </div>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05, marginTop: 18 }}>Tru Collective Radio</div>
          <div style={{ fontSize: 34, lineHeight: 1.3, color: "#8b93a7", marginTop: 22 }}>
            Songs playing now — in sync for everyone listening.
          </div>
          <div style={{ fontSize: 36, color: "#f5b942", marginTop: 34, fontWeight: 700 }}>▶ Tune in</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
