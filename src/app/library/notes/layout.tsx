import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "My Notes & Bookmarks",
  description: "Access your personal Bible study notes and bookmarks â€” saved verses, study notes, and bookmarked passages from across the One In Him library.",
  path: "/library/notes",
});

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

