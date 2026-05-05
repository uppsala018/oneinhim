import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import PwaBoot from "@/components/pwa-boot";
import PreferencesBoot from "@/components/preferences-boot";
import JsonLd from "@/components/json-ld";
import "./globals.css";

const SITE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.oneinhimbiblestudy.com/#organization",
      name: "One In Him Bible Study",
      url: "https://www.oneinhimbiblestudy.com",
      description:
        "Free Bible study platform covering KJV + Strong's concordance, Church Fathers, Ecumenical Councils, Roman Catechism, and 2000 years of Christian history.",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.oneinhimbiblestudy.com/#website",
      url: "https://www.oneinhimbiblestudy.com",
      name: "One In Him Bible Study",
      publisher: { "@id": "https://www.oneinhimbiblestudy.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://www.oneinhimbiblestudy.com/library/kjv?verse={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "One In Him Bible Study | KJV, Church Fathers & Church History",
    template: "%s | One In Him Bible Study",
  },
  description:
    "Free Bible study with KJV + Strong's concordance, Church Fathers, Ecumenical Councils, Roman Catechism, and complete Church History — all free, all in one place.",
  keywords:
    "bible study, KJV bible, Strong's concordance, church fathers, church history, ecumenical councils, early church, Roman Catechism",
  applicationName: "One In Him Bible Study",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "One In Him",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/assets/art/icon-192.png",
    apple: "/assets/art/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <JsonLd data={SITE_SCHEMA} />
        <PwaBoot />
        <PreferencesBoot />
        {children}
      </body>
    </html>
  );
}

