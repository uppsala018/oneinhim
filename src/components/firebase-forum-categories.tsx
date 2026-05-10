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

export default function FirebaseForumCategories() {
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
        setError("Could not load forum categories.");
      } finally {
        setLoading(false);
      }
    }

    void loadCategories();
  }, []);

  const topLevelCategories = useMemo(
    () => categories.filter((category) => category.level === 0),
    [categories]
  );

  function getChildren(parentId: string) {
    return categories.filter((category) => category.parentId === parentId);
  }

  if (loading) {
    return (
      <section className="px-4 py-6">
        <p className="text-sm text-[var(--color-muted)]">Loading forum categories...</p>
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

  return (
    <section className="px-4 py-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-highlight)]">
            Forum
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">
            Discussion Categories
          </h2>
        </div>

        <Link
          href="/library/prayer-forum/new-thread"
          className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]"
        >
          Start a discussion
        </Link>
      </div>

      <div className="grid gap-4">
        {topLevelCategories.map((category) => {
          const children = getChildren(category.id);

          return (
            <article
              key={category.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper)] p-5"
            >
              <Link
                href={`/library/prayer-forum/category/${category.slug}`}
                className="block"
              >
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  {category.description}
                </p>
              </Link>

              {children.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/library/prayer-forum/category/${child.slug}`}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]"
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}