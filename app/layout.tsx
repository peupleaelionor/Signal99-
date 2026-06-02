import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SIGNAL99 — Quel est ton Signal ?",
    template: "%s · SIGNAL99",
  },
  description:
    "Réponds à 7 questions et découvre ton Signal dominant. Reçois ta carte personnelle à partager.",
  applicationName: "SIGNAL99",
  keywords: ["signal", "archétype", "test", "personnalité", "carte", "signal99"],
  openGraph: {
    type: "website",
    siteName: "SIGNAL99",
    title: "Quel est ton Signal ?",
    description:
      "Réponds à 7 questions et découvre ton archétype dominant. Reçois ta carte personnelle.",
    url: SITE_URL,
    images: [{ url: "/api/og?signal=visionary", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quel est ton Signal ?",
    description: "Découvre ton archétype dominant en 7 questions.",
    images: ["/api/og?signal=visionary"],
  },
  icons: {
    icon: "/brand/app-icon.png",
    apple: "/brand/app-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
