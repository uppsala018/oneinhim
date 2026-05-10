"use client";

import { useState } from "react";
import Link from "next/link";
import { collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase-client";
import { useAuth } from "@/lib/use-auth";
import { FORUM_ADMIN_EMAIL, isForumAdmin, slugify, type ForumCategory } from "@/lib/forum";

const CATEGORY_TREE = [
  ["Community", ["Introduce Yourself", "Make Friends", "General Discussion", "Site Feedback"]],
  ["Prayer", ["Prayer Requests", "Praise Reports", "Testimonies", "Answered Prayer", "Encouragement"]],
  ["Catholic Tradition", ["Theology", "Worship", "Liturgy", "Church History", "Marian Theology", "Saints & Devotions", "Sacraments", "Other Topics"]],
  ["Orthodox Tradition", ["Theology", "Divine Liturgy", "Church Fathers", "Icons", "Saints & Devotions", "Church History", "Other Topics"]],
  ["Protestant Tradition", ["Reformation Theology", "Bible Study", "Worship", "Church History", "Denominations", "Evangelism", "Other Topics"]],
  ["Charismatic Tradition", ["Holy Spirit", "Spiritual Gifts", "Worship", "Prayer", "Testimonies", "Discernment", "Other Topics"]],
  ["Non-Denominational Tradition", ["Bible Study", "Worship", "Church Life", "Evangelism", "Discipleship", "Other Topics"]],
  ["Church History", ["Early Church", "Medieval Church", "Reformation", "Modern Church History", "Biographies", "Other Topics"]],
  ["Church Fathers", ["Apostolic Fathers", "Greek Fathers", "Latin Fathers", "Desert Fathers", "Patristic Theology", "Other Topics"]],
  ["Councils", ["Nicaea", "Constantinople", "Ephesus", "Chalcedon", "Later Councils", "Council Questions", "Other Topics"]],
  ["Bible Study", ["Old Testament", "New Testament", "Gospels", "Pauline Letters", "Prophecy", "Bible Questions", "Other Topics"]],
  ["Questions & Answers", ["Beginner Questions", "Theology Questions", "Church Tradition Questions", "Difficult Passages", "Other Questions"]],
] as const;

function categoryDescription(title: string, parent?: string) {
  if (parent) return `${title} discussions in ${parent}.`;
  return `${title} discussions for the One In Him community.`;
}

export default function ForumSeedContent() {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState("");
  const [running, setRunning] = useState(false);
  const admin = isForumAdmin(user?.email);

  async function seedCategories() {
    if (!db || !admin) return;

    setRunning(true);
    setStatus("Seeding categories...");

    try {
      const snapshot = await getDocs(collection(db, "forum_categories"));
      const bySlug = new Map<string, ForumCategory>();
      snapshot.docs.forEach((item) => {
        const data = item.data() as Omit<ForumCategory, "id">;
        if (data.slug) bySlug.set(data.slug, { id: item.id, ...data });
      });

      let writes = 0;

      for (const [rootTitle, children] of CATEGORY_TREE) {
        const rootSlug = slugify(rootTitle);
        const existingRoot = bySlug.get(rootSlug);
        const rootId = existingRoot?.id ?? rootSlug;

        await setDoc(
          doc(db, "forum_categories", rootId),
          {
            title: rootTitle,
            slug: rootSlug,
            description: existingRoot?.description || categoryDescription(rootTitle),
            parentId: null,
            level: 0,
            sortOrder: (CATEGORY_TREE.findIndex(([title]) => title === rootTitle) + 1) * 100,
            isActive: true,
            isLocked: existingRoot?.isLocked ?? false,
            updatedAt: serverTimestamp(),
            createdAt: existingRoot ? existingRoot.createdAt ?? serverTimestamp() : serverTimestamp(),
          },
          { merge: true }
        );
        writes += 1;

        for (const [index, childTitle] of children.entries()) {
          const childSlug = `${rootSlug}-${slugify(childTitle)}`;
          const existingChild = bySlug.get(childSlug);
          const childId = existingChild?.id ?? childSlug;

          await setDoc(
            doc(db, "forum_categories", childId),
            {
              title: childTitle,
              slug: childSlug,
              description:
                existingChild?.description || categoryDescription(childTitle, rootTitle),
              parentId: rootId,
              level: 1,
              sortOrder: ((CATEGORY_TREE.findIndex(([title]) => title === rootTitle) + 1) * 100) + index + 1,
              isActive: true,
              isLocked: existingChild?.isLocked ?? false,
              updatedAt: serverTimestamp(),
              createdAt: existingChild ? existingChild.createdAt ?? serverTimestamp() : serverTimestamp(),
            },
            { merge: true }
          );
          writes += 1;
        }
      }

      setStatus(`Seed complete. Upserted ${writes} category documents.`);
    } catch (err) {
      console.error(err);
      setStatus("Seed failed. Check Firestore rules and admin account.");
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return (
      <main className="mobile-app-shell px-4 py-8">
        <p className="text-sm text-[var(--color-muted)]">Checking admin access...</p>
      </main>
    );
  }

  if (!admin) {
    return (
      <main className="mobile-app-shell px-4 py-8">
        <h1 className="text-2xl font-semibold text-[var(--color-ink)]">
          Admin only
        </h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Sign in as {FORUM_ADMIN_EMAIL} to run the forum category seed.
        </p>
        <Link
          href="/login?next=/admin/forum-seed"
          className="mt-5 inline-flex rounded-full border border-[var(--color-border)] px-5 py-2 text-sm text-[var(--color-ink)]"
        >
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="mobile-app-shell px-4 py-8">
      <Link href="/library/prayer-forum" className="text-sm text-[var(--color-highlight)]">
        Back to forum
      </Link>
      <section className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
        <h1 className="text-2xl font-semibold text-[var(--color-ink)]">
          Forum category seed
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          This upserts missing root categories and subcategories with merge behavior.
          It does not delete existing categories.
        </p>
        <button
          type="button"
          onClick={seedCategories}
          disabled={running}
          className="mt-5 rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-medium text-[var(--color-ink)] disabled:opacity-50"
        >
          {running ? "Running..." : "Seed forum categories"}
        </button>
        {status ? <p className="mt-4 text-sm text-[var(--color-muted)]">{status}</p> : null}
      </section>
    </main>
  );
}
