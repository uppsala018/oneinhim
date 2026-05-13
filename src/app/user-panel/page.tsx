import type { Metadata } from "next";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { buildMeta } from "@/lib/seo";
import UserPanelClient from "./user-panel-client";

export const metadata: Metadata = {
  ...buildMeta({
    title: "User Panel",
    description: "View your One In Him Bible Study user profile.",
    path: "/user-panel",
  }),
  robots: { index: false, follow: false },
};

export default function UserPanelPage() {
  return (
    <>
      <AppHeader />
      <div className="pt-[var(--header-height,96px)]">
        <UserPanelClient />
      </div>
      <MobileBottomNav />
    </>
  );
}
