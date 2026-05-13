import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMeta({
    title: "Beta Tester",
    description: "Beta tester signup for One In Him Bible Study.",
    path: "/beta-tester",
  }),
  robots: { index: false, follow: false },
};

export default function BetaTesterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
