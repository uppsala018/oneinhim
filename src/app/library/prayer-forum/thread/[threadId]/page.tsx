import ThreadPageContent from "./thread-page-content";

export default async function ForumThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  return <ThreadPageContent threadId={threadId} />;
}
