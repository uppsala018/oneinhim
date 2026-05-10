import NewThreadContent from "./new-thread-content";

export default async function NewThreadPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <NewThreadContent initialCategorySlug={category ?? ""} />;
}
