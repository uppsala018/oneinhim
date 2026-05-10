"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase-client";
import {
  formatForumDate,
  forumAuthorName,
  type ForumCategory,
  type ForumThread,
} from "@/lib/forum";

const DISCUSSION_LIMIT = 10;

export default function FirebaseLatestDiscussions() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDiscussions() {
      if (!db) {
        setError("Firebase is not configured.");
        setLoading(false);
        return;
      }

      try {
        const [categorySnapshot, threadSnapshot] = await Promise.all([
          getDocs(collection(db, "forum_categories")),
          getDocs(
            query(collection(db, "forum_threads"), where("isDeleted", "==", false))
          ),
        ]);

        setCategories(
          categorySnapshot.docs.map((item) => ({
            id: item.id,
            ...(item.data() as Omit<ForumCategory, "id">),
          }))
        );
        setThreads(
          threadSnapshot.docs.map((item) => ({
            id: item.id,
            ...(item.data() as Omit<ForumThread, "id">),
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Could not load latest discussions.");
      } finally {
        setLoading(false);
      }
    }

    void loadDiscussions();
  }, []);

  const categoryById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]));
  }, [categories]);

  const latestThreads = useMemo(() => {
    return [...threads]
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return (
          (b.lastReplyAt?.toMillis() ?? b.createdAt?.toMillis() ?? 0) -
          (a.lastReplyAt?.toMillis() ?? a.createdAt?.toMillis() ?? 0)
        );
      })
      .slice(0, DISCUSSION_LIMIT);
  }, [threads]);

  if (loading) {
    return (
      <section className="px-4 py-6">
        <p className="text-sm text-[var(--color-muted)]">
          Loading latest discussions...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 py-6">
        <p className="text-sm text-red-500">{error}</p>
      </section>
    );
  }

  if (latestThreads.length === 0) {
    return (
      <section className="px-4 py-6">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-highlight)]">
            Forum
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">
            Latest Discussions
          </h2>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            No discussions have been started yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-highlight)]">
          Forum
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">
          Latest Discussions
        </h2>
      </div>

      <div className="grid gap-3">
        {latestThreads.map((thread) => {
          const category = categoryById.get(thread.categoryId);
          const activeDate = thread.lastReplyAt ?? thread.createdAt;

          return (
            <Link
              key={thread.id}
              href={`/library/prayer-forum/thread/${thread.id}`}
              className="block rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 transition hover:border-[var(--color-highlight)]"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-[var(--color-highlight)]">
                {category ? <span>{category.title}</span> : null}
                {thread.isPinned ? <span>Pinned</span> : null}
                {thread.isLocked ? <span>Locked</span> : null}
              </div>

              <h3 className="mt-2 text-base font-semibold text-[var(--color-ink)]">
                {thread.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
                {forumAuthorName(thread.authorDisplayName, thread.authorEmail)} ·{" "}
                {thread.replyCount ?? 0} replies · Active{" "}
                {formatForumDate(activeDate)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
