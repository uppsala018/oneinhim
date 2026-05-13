import type { Metadata } from "next";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { buildMeta } from "@/lib/seo";
import ThreadPageContent from "./thread-page-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ threadId: string }>;
}): Promise<Metadata> {
  const { threadId } = await params;

  return buildMeta({
    title: "Prayer Forum Discussion",
    description:
      "Read a public discussion from the One In Him Bible Study prayer forum, a Christian community space for prayer requests and faith questions.",
    path: `/library/prayer-forum/thread/${threadId}`,
  });
}

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
