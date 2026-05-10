"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase-client";
import { useAuth } from "@/lib/use-auth";
import {
  forumAuthorName,
  slugify,
  type ForumCategory,
} from "@/lib/forum";

export default function NewThreadContent({
  initialCategorySlug,
}: {
  initialCategorySlug: string;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      if (!db) {
        setError("Firebase is not configured.");
        setLoadingCategories(false);
        return;
      }

      try {
        const snapshot = await getDocs(
          query(collection(db, "forum_categories"), orderBy("sortOrder", "asc"))
        );
        setCategories(
          snapshot.docs
            .map((item) => ({
              id: item.id,
              ...(item.data() as Omit<ForumCategory, "id">),
            }))
            .filter((item) => item.isActive)
        );
      } catch (err) {
        console.error(err);
        setError("Could not load categories.");
      } finally {
        setLoadingCategories(false);
      }
    }

    void loadCategories();
  }, []);

  const selectableCategories = useMemo(() => {
    const parentIds = new Set(
      categories
        .filter((item) => item.parentId)
        .map((item) => item.parentId as string)
    );

    return categories.filter(
      (item) => item.level === 1 || (item.level === 0 && !parentIds.has(item.id))
    );
  }, [categories]);

  useEffect(() => {
    if (categoryId || selectableCategories.length === 0) return;

    const initial =
      selectableCategories.find((item) => item.slug === initialCategorySlug) ??
      selectableCategories[0];
    setCategoryId(initial.id);
  }, [categoryId, initialCategorySlug, selectableCategories]);

  const selectedCategory = selectableCategories.find(
    (item) => item.id === categoryId
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!db || !user) {
      setError("You must be signed in to start a discussion.");
      return;
    }
    if (!selectedCategory) {
      setError("Choose a category.");
      return;
    }
    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters.");
      return;
    }
    if (content.trim().length < 10) {
      setError("Content must be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const threadRef = doc(collection(db, "forum_threads"));
      const postRef = doc(collection(db, "forum_posts"));
      const batch = writeBatch(db);
      const authorDisplayName = forumAuthorName(user.displayName, user.email);

      batch.set(threadRef, {
        title: title.trim(),
        slug: `${slugify(title)}-${threadRef.id.slice(0, 8)}`,
        categoryId: selectedCategory.id,
        parentCategoryId: selectedCategory.parentId ?? null,
        authorUid: user.uid,
        authorEmail: user.email ?? "",
        authorDisplayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastReplyAt: serverTimestamp(),
        replyCount: 0,
        viewCount: 0,
        isPinned: false,
        isLocked: false,
        isDeleted: false,
      });

     batch.set(postRef, {
  threadId: threadRef.id,
  categoryId: selectedCategory.id,
  content: content.trim(),
  authorUid: user.uid,
        authorEmail: user.email ?? "",
        authorDisplayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isFirstPost: true,
        isDeleted: false,
      });

      await batch.commit();
      router.push(`/library/prayer-forum/thread/${threadRef.id}`);
    } catch (err) {
      console.error(err);
      setError("Could not create discussion. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loadingCategories) {
    return (
      <main className="mobile-app-shell px-4 py-8">
        <p className="text-sm text-[var(--color-muted)]">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mobile-app-shell px-4 py-8">
        <Link
          href="/library/prayer-forum"
          className="text-sm text-[var(--color-highlight)]"
        >
          Back to forum
        </Link>
        <section className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
          <h1 className="text-xl font-semibold text-[var(--color-ink)]">
            Sign in to start a discussion
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Forum posting uses your Firebase account.
          </p>
          <Link
            href="/login?next=/library/prayer-forum/new-thread"
            className="mt-5 inline-flex rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-medium text-[var(--color-ink)]"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mobile-app-shell px-4 py-8" style={{ paddingBottom: "7rem" }}>
      <Link
        href="/library/prayer-forum"
        className="text-sm text-[var(--color-highlight)]"
      >
        Back to forum
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-[var(--color-ink)]">
        Start a discussion
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5"
      >
        <label className="grid gap-2 text-sm text-[var(--color-ink)]">
          Category
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="rounded-2xl border border-[var(--color-border)] bg-[rgba(10,10,10,0.7)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none"
            required
          >
            {selectableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm text-[var(--color-ink)]">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            minLength={5}
            maxLength={140}
            className="rounded-2xl border border-[var(--color-border)] bg-[rgba(10,10,10,0.7)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none"
            required
          />
        </label>

        <label className="grid gap-2 text-sm text-[var(--color-ink)]">
          Content
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            minLength={10}
            rows={8}
            className="rounded-2xl border border-[var(--color-border)] bg-[rgba(10,10,10,0.7)] px-4 py-3 text-sm leading-6 text-[var(--color-ink)] outline-none"
            required
          />
        </label>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-medium text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post discussion"}
        </button>
      </form>
    </main>
  );
}
