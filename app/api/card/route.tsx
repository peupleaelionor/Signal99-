import { ImageResponse } from "next/og";
import { SIGNALS, isSignalId } from "@/data/signals";
import { SITE_URL } from "@/lib/config";

export const runtime = "edge";

/**
 * Story-format (1080x1920) PNG of a Signal card.
 * Used for "Télécharger ma carte" (with ?dl=1) and rich vertical previews.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const signalId = searchParams.get("signal") || "visionary";
  const name = searchParams.get("name") || "";
  const download = searchParams.get("dl") === "1";

  const signal = isSignalId(signalId) ? SIGNALS[signalId] : SIGNALS.visionary;
  const emblem = `${SITE_URL}${signal.image}`;

  const headers: Record<string, string> = {
    "Cache-Control": "public, max-age=86400, immutable",
  };
  if (download) {
    headers["Content-Disposition"] =
      `attachment; filename="signal99-${signal.id}.png"`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1920px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#050505",
          backgroundImage: `radial-gradient(60% 40% at 50% 12%, ${signal.colors.aura}33 0%, rgba(5,5,5,0) 70%)`,
          padding: "90px 70px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 34,
              letterSpacing: 18,
              color: "#A8A095",
            }}
          >
            SIGNAL99
          </div>
          {name ? (
            <div style={{ marginTop: 18, fontSize: 30, color: "#A8A095" }}>
              {`Le Signal de ${name}`}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={emblem} width={720} height={720} alt={signal.name} />
          <div
            style={{
              marginTop: 10,
              fontSize: 36,
              color: "#A8A095",
              textAlign: "center",
              maxWidth: 820,
            }}
          >
            {signal.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 46,
              fontStyle: "italic",
              color: signal.colors.aura,
              textAlign: "center",
              maxWidth: 860,
              lineHeight: 1.3,
            }}
          >
            {`“${signal.powerPhrase}”`}
          </div>
          <div
            style={{
              marginTop: 70,
              fontSize: 28,
              letterSpacing: 10,
              color: "#A8A095",
            }}
          >
            DÉCOUVRE TON SIGNAL
          </div>
          <div style={{ marginTop: 12, fontSize: 30, color: "#F5F0E8" }}>
            signal99.com
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920, headers },
  );
}
