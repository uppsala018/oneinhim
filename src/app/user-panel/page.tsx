import type { Metadata } from "next";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import UserPanelClient from "./user-panel-client";

export const metadata: Metadata = {
  title: "User Panel",
  description: "View your One In Him Bible Study user profile.",
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
