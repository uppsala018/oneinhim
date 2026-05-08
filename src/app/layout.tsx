import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import PwaBoot from "@/components/pwa-boot";
import PreferencesBoot from "@/components/preferences-boot";
import JsonLd from "@/components/json-ld";
import BetaReportWidget from "@/components/beta-report-widget";
import "./globals.css";

const SITE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.oneinhimbiblestudy.com/#organization",
      name: "One In Him Bible Study",
      url: "https://www.oneinhimbiblestudy.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.oneinhimbiblestudy.com/assets/art/icon-512.png",
        width: 512,
        height: 512,
      },
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
  metadataBase: new URL("https://www.oneinhimbiblestudy.com"),
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
  openGraph: {
    title: "One In Him Bible Study | KJV, Church Fathers & Church History",
    description:
      "Free Bible study with KJV + Strong's concordance, Church Fathers, Ecumenical Councils, Roman Catechism, and complete Church History.",
    url: "https://www.oneinhimbiblestudy.com",
    siteName: "One In Him Bible Study",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/art/hero-banner.png",
        width: 1200,
        height: 630,
        alt: "One In Him Bible Study — KJV, Church Fathers & Church History",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "One In Him Bible Study | KJV, Church Fathers & Church History",
    description:
      "Free Bible study with KJV + Strong's concordance, Church Fathers, Ecumenical Councils, Roman Catechism, and complete Church History.",
    images: ["/assets/art/hero-banner.png"],
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
        <BetaReportWidget />
      </body>
    </html>
  );
}
