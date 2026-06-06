import { ImageResponse } from "next/og";
import { SIGNALS, isSignalId } from "@/data/signals";
import { SITE_URL } from "@/lib/config";

export const runtime = "edge";

/**
 * Landscape (1200x630) Open Graph image.
 * Per-Signal preview used for social link unfurls: "I’m [Signal]. What’s your Signal?"
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const signalId = searchParams.get("signal") || "";
  const hasSignal = isSignalId(signalId);
  const signal = hasSignal ? SIGNALS[signalId] : SIGNALS.visionary;
  const emblem = `${SITE_URL}${signal.image}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050505",
          backgroundImage: `radial-gradient(50% 80% at 22% 50%, ${signal.colors.aura}30 0%, rgba(5,5,5,0) 70%)`,
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={emblem} width={420} height={420} alt={signal.name} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 60,
            maxWidth: 560,
          }}
        >
          <div style={{ fontSize: 26, letterSpacing: 12, color: "#A8A095" }}>
            SIGNAL99
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 66,
              color: "#F5F0E8",
              lineHeight: 1.1,
            }}
          >
            {hasSignal ? `I’m ${signal.shortLabel}.` : "What’s your Signal?"}
          </div>
          <div style={{ marginTop: 14, fontSize: 40, color: signal.colors.aura }}>
            What’s your Signal?
          </div>
          <div style={{ marginTop: 26, fontSize: 28, color: "#A8A095" }}>
            Discover your Signal in 7 questions.
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
