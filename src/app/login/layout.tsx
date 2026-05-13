import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMeta({
    title: "Log In",
    description: "Log in to your One In Him Bible Study account.",
    path: "/login",
  }),
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
