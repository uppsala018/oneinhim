import type { Metadata } from "next";
import ProfileClient from "./profile-client";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Edit your One In Him Bible Study user profile.",
};

export default function UserPanelProfilePage() {
  return (
    <section className="mobile-app-shell min-h-screen">
      <ProfileClient />
    </section>
  );
}
