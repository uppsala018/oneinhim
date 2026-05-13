import type { Metadata } from "next";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { buildMeta } from "@/lib/seo";
import CategoryPageContent from "./category-page-content";

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const categoryTitle = titleFromSlug(categorySlug) || "Forum Category";

  return buildMeta({
    title: `${categoryTitle} Forum`,
    description:
      "Read public prayer forum discussions from the One In Him Bible Study community. Sign in only when you want to start a thread or reply.",
    path: `/library/prayer-forum/category/${categorySlug}`,
  });
}

export default async function ForumCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  return (
    <>
      <AppHeader />
      <CategoryPageContent categorySlug={categorySlug} />
      <MobileBottomNav />
    </>
  );
}
