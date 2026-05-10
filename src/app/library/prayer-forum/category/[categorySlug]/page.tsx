import CategoryPageContent from "./category-page-content";

export default async function ForumCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  return <CategoryPageContent categorySlug={categorySlug} />;
}