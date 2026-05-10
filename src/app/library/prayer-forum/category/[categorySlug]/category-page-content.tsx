"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase-client";
import {
  formatForumDate,
  forumAuthorName,
  type ForumCategory,
  type ForumThread,
} from "@/lib/forum";

export default function CategoryPageContent({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadForum() {
      if (!db) {
        setError("Firebase is not configured.");
        setLoading(false);
        return;
      }

      try {
        const categoryQuery = query(
          collection(db, "forum_categories"),
          orderBy("sortOrder", "asc")
        );

        const [categorySnapshot, threadSnapshot] = await Promise.all([
          getDocs(categoryQuery),
          getDocs(
            query(collection(db, "forum_threads"), where("isDeleted", "==", false))
          ),
        ]);

        setCategories(
          categorySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<ForumCategory, "id">),
            }))
            .filter((item) => item.isActive)
        );
        setThreads(
          threadSnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<ForumThread, "id">),
            }))
        );
      } catch (err) {
        console.error(err);
        setError("Could not load category.");
      } finally {
        setLoading(false);
      }
    }

    void loadForum();
  }, []);

  const category = useMemo(
    () => categories.find((item) => item.slug === categorySlug) ?? null,
    [categories, categorySlug]
  );

  const childCategories = useMemo(() => {
    if (!category) return [];
    return categories.filter((item) => item.parentId === category.id);
  }, [categories, category]);

  const visibleThreads = useMemo(() => {
    if (!category) return [];
    const childIds = new Set(childCategories.map((child) => child.id));

    return threads
      .filter(
        (thread) =>
          thread.categoryId === category.id ||
          thread.parentCategoryId === category.id ||
          childIds.has(thread.categoryId)
      )
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return (
          (b.lastReplyAt?.toMillis() ?? b.updatedAt?.toMillis() ?? 0) -
          (a.lastReplyAt?.toMillis() ?? a.updatedAt?.toMillis() ?? 0)
        );
      });
  }, [category, childCategories, threads]);

  if (loading) {
    return (
      <main className="mobile-app-shell px-4 py-8">
        <p className="text-sm text-[var(--color-muted)]">Loading category...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mobile-app-shell px-4 py-8">
        <p className="text-sm text-red-500">{error}</p>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="mobile-app-shell px-4 py-8">
        <Link
          href="/library/prayer-forum"
          className="text-sm text-[var(--color-highlight)]"
        >
          Back to forum
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-[var(--color-ink)]">
          Category not found
        </h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          This category does not exist or may have been removed.
        </p>
      </main>
    );
  }

  return (
    <main className="mobile-app-shell" style={{ paddingBottom: "7rem" }}>
      <section className="border-b border-[var(--color-border)] px-4 pt-6 pb-5">
        <Link
          href="/library/prayer-forum"
          className="text-sm text-[var(--color-highlight)]"
        >
          Back to forum
        </Link>

        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[var(--color-highlight)]">
          Forum Category
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">
          {category.title}
        </h1>
        <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
          {category.description}
        </p>
      </section>

      {childCategories.length > 0 && (
        <section className="px-4 py-6">
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">
            Subcategories
          </h2>
          <div className="mt-4 grid gap-3">
            {childCategories.map((child) => (
              <Link
                key={child.id}
                href={`/library/prayer-forum/category/${child.slug}`}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper)] p-4"
              >
                <h3 className="text-base font-medium text-[var(--color-ink)]">
                  {child.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {child.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 pb-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">
              Threads
            </h2>
            <Link
              href={`/library/prayer-forum/new-thread?category=${category.slug}`}
              className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]"
            >
              Start a discussion
            </Link>
          </div>

          {visibleThreads.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              No discussions have been started in this category yet.
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {visibleThreads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/library/prayer-forum/thread/${thread.id}`}
                  className="block rounded-2xl border border-[var(--color-border)] bg-[rgba(10,10,10,0.42)] p-4 transition hover:border-[var(--color-highlight)]"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-[var(--color-highlight)]">
                    {thread.isPinned ? <span>Pinned</span> : null}
                    {thread.isLocked ? <span>Locked</span> : null}
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-[var(--color-ink)]">
                    {thread.title}
                  </h3>
                  <p className="mt-2 text-xs text-[var(--color-muted)]">
                    {forumAuthorName(thread.authorDisplayName, thread.authorEmail)} ·{" "}
                    {formatForumDate(thread.createdAt)} · {thread.replyCount ?? 0}{" "}
                    replies
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
