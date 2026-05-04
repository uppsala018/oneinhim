import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "Settings",
  description: "Manage your One In Him Bible Study settings â€” theme, preferences, and account options for your personalized study experience.",
  path: "/library/settings",
});

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

