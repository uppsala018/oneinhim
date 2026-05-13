"use client";

import { useState } from "react";
import { collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useAuth } from "@/lib/use-auth";
import { slugify, type ForumCategory } from "@/lib/forum";
import Breadcrumb from "@/components/breadcrumb";
import SiteHeroPanel from "@/components/site-hero-panel";

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
  const { user } = useAuth();
  const [status, setStatus] = useState("");
  const [running, setRunning] = useState(false);

  async function seedCategories() {
    if (!db || !user) return;

    setRunning(true);
    setStatus("Seeding categories…");

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
          { merge: true },
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
              description: existingChild?.description || categoryDescription(childTitle, rootTitle),
              parentId: rootId,
              level: 1,
              sortOrder: ((CATEGORY_TREE.findIndex(([title]) => title === rootTitle) + 1) * 100) + index + 1,
              isActive: true,
              isLocked: existingChild?.isLocked ?? false,
              updatedAt: serverTimestamp(),
              createdAt: existingChild ? existingChild.createdAt ?? serverTimestamp() : serverTimestamp(),
            },
            { merge: true },
          );
          writes += 1;
        }
      }

      setStatus(`Seed complete. Upserted ${writes} category documents.`);
    } catch (err) {
      console.error(err);
      setStatus("Seed failed. Check Firestore rules.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 pt-5">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "User Panel", href: "/user-panel" },
          { label: "Forum Seed" },
        ]}
      />

      <SiteHeroPanel
        eyebrow="Admin Tool"
        title="Forum Category Seed"
        lead="Upserts missing root categories and subcategories with merge behavior. Does not delete existing categories."
      />

      <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
          Run Seed
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
          Seed forum categories
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          This operation is safe to run multiple times — it uses merge behavior and will not
          delete or overwrite custom descriptions on existing categories.
        </p>
        <button
          type="button"
          onClick={() => void seedCategories()}
          disabled={running}
          className="mt-5 rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-highlight)] hover:text-[var(--color-highlight)] disabled:opacity-50"
        >
          {running ? "Running…" : "Seed Forum Categories"}
        </button>
        {status && (
          <p className={`mt-4 text-sm ${status.startsWith("Seed complete") ? "text-green-300" : "text-[var(--color-muted)]"}`}>
            {status}
          </p>
        )}
      </section>
    </div>
  );
}
