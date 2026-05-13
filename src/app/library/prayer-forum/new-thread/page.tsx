import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import NewThreadContent from "./new-thread-content";

export const metadata: Metadata = {
  ...buildMeta({
    title: "Start a Discussion",
    description: "Start a new discussion in the One In Him Bible Study prayer forum.",
    path: "/library/prayer-forum/new-thread",
  }),
  robots: { index: false, follow: false },
};

export default async function NewThreadPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <NewThreadContent initialCategorySlug={category ?? ""} />;
}
