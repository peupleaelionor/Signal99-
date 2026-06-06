import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/config";
import { BRAND, LANDING } from "@/lib/copy";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SIGNAL99 — What’s your Signal?",
    template: "%s · SIGNAL99",
  },
  description:
    "Answer 7 questions and reveal your dominant Signal. Get your personal card to keep and share.",
  applicationName: "SIGNAL99",
  manifest: "/manifest.webmanifest",
  keywords: ["signal", "archetype", "identity", "card", "presence", "signal99"],
  openGraph: {
    type: "website",
    siteName: "SIGNAL99",
    title: LANDING.title,
    description: LANDING.subtitle,
    url: SITE_URL,
    images: [{ url: "/api/og?signal=visionary", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: LANDING.title,
    description: "Discover your Signal in 7 questions.",
    images: ["/api/og?signal=visionary"],
  },
  icons: {
    icon: "/brand/app-icon.png",
    apple: "/brand/app-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SIGNAL99",
  },
};

export const viewport: Viewport = {
  themeColor: BRAND.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <ServiceWorkerRegister />
        <InstallPrompt />
      </body>
    </html>
  );
}
