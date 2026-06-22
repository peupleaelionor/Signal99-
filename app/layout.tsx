import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/config";
import { PwaRegister } from "@/components/PwaRegister";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SIGNAL99 — Ton énergie parle avant toi",
    template: "%s · SIGNAL99",
  },
  description:
    "Réponds à 7 questions. Révèle ton Signal. Débloque ta carte. 99 cartes, 1 Signal, une identité à collectionner.",
  applicationName: "SIGNAL99",
  keywords: ["signal", "archétype", "cartes", "collection", "identité", "signal99"],
  openGraph: {
    type: "website",
    siteName: "SIGNAL99",
    title: "Ton énergie parle avant toi.",
    description:
      "Révèle ton Signal en 7 questions. Débloque ta carte et collectionne ton identité.",
    url: SITE_URL,
    images: [{ url: "/api/og?signal=visionary", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ton énergie parle avant toi.",
    description: "Révèle ton Signal en 7 questions. Débloque ta carte.",
    images: ["/api/og?signal=visionary"],
  },
  icons: {
    icon: "/brand/app-icon.png",
    apple: "/brand/app-icon.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SIGNAL99",
    statusBarStyle: "black-translucent",
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
      <body className="font-sans antialiased">
        {children}
        <PwaRegister />
        <InstallPrompt />
        <Analytics />
      </body>
    </html>
  );
}
