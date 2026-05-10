"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import { db } from "@/lib/firebase-client";

type ForumCategory = {
  id: string;
  title: string;
  slug: string;
  description: string;
  parentId: string | null;
  level: number;
  sortOrder: number;
  isActive: boolean;
  isLocked: boolean;
};

export default function CategoryPageContent({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      if (!db) {
        setError("Firebase is not configured.");
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "forum_categories"),
          orderBy("sortOrder", "asc")
        );

        const snapshot = await getDocs(q);

        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ForumCategory, "id">),
        }));

        setCategories(items.filter((item) => item.isActive));
      } catch (err) {
        console.error(err);
        setError("Could not load category.");
      } finally {
        setLoading(false);
      }
    }

    void loadCategories();
  }, []);

  const category = useMemo(
    () =>
      categories.find(
        (item) => item.slug === categorySlug
      ) ?? null,
    [categories, categorySlug]
  );

  const childCategories = useMemo(() => {
    if (!category) return [];

    return categories.filter(
      (item) => item.parentId === category.id
    );
  }, [categories, category]);

  if (loading) {
    return (
      <main className="mobile-app-shell px-4 py-8">
        <p className="text-sm text-[var(--color-muted)]">
          Loading category...
        </p>
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
          ← Back to forum
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
    <main
      className="mobile-app-shell"
      style={{ paddingBottom: "7rem" }}
    >
      <section className="border-b border-[var(--color-border)] px-4 pt-6 pb-5">
        <Link
          href="/library/prayer-forum"
          className="text-sm text-[var(--color-highlight)]"
        >
          ← Back to forum
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
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper)] p-5">
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">
            Threads
          </h2>

          <p className="mt-3 text-sm text-[var(--color-muted)]">
            Thread creation and discussion threads will appear here in the next phase.
          </p>

          <Link
            href="/library/prayer-forum/new-thread"
            className="mt-5 inline-flex rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-medium text-[var(--color-ink)]"
          >
            Start a discussion
          </Link>
        </div>
      </section>
    </main>
  );
}