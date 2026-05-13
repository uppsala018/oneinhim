import type { Metadata } from "next";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { buildMeta } from "@/lib/seo";
import ProfileClient from "./profile-client";

export const metadata: Metadata = {
  ...buildMeta({
    title: "Edit Profile",
    description: "Edit your One In Him Bible Study user profile.",
    path: "/user-panel/profile",
  }),
  robots: { index: false, follow: false },
};

export default function UserPanelProfilePage() {
  return (
    <>
      <AppHeader />
      <div className="pt-[var(--header-height,96px)]">
        <ProfileClient />
      </div>
      <MobileBottomNav />
    </>
  );
}
