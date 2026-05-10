import type { Metadata } from "next";
import UserPanelClient from "./user-panel-client";

export const metadata: Metadata = {
  title: "User Panel",
  description: "View your One In Him Bible Study user profile.",
};

export default function UserPanelPage() {
  return (
    <section className="mobile-app-shell min-h-screen">
      <UserPanelClient />
    </section>
  );
}
