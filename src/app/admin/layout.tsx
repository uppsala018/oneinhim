import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import AdminLayoutClient from "./admin-layout-client";

export const metadata: Metadata = {
  ...buildMeta({
    title: "Admin",
    description: "Administrative tools for One In Him Bible Study.",
    path: "/admin",
  }),
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
