import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import ThreadPageContent from "./thread-page-content";

export default async function ForumThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  return (
    <>
      <AppHeader />
      <ThreadPageContent threadId={threadId} />
      <MobileBottomNav />
    </>
  );
}
