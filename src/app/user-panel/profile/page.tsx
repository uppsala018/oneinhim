import type { Metadata } from "next";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import ProfileClient from "./profile-client";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Edit your One In Him Bible Study user profile.",
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
