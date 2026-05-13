import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMeta({
    title: "Beta Dashboard",
    description: "Beta tester feedback dashboard for One In Him Bible Study.",
    path: "/beta-dashboard",
  }),
  robots: { index: false, follow: false },
};

export default function BetaDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
