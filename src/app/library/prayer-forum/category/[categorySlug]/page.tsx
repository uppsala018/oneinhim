import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import CategoryPageContent from "./category-page-content";

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
