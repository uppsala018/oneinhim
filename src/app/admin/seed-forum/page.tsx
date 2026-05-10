"use client";

import { useState } from "react";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase-client";

const categories = [
  {
    id: "community",
    title: "Community",
    description: "General Christian fellowship and discussion.",
    parentId: null,
    level: 0,
    sortOrder: 10,
  },
  {
    id: "community-introduce-yourself",
    title: "Introduce Yourself",
    description: "Introduce yourself to the community.",
    parentId: "community",
    level: 1,
    sortOrder: 11,
  },
  {
    id: "community-make-friends",
    title: "Make Friends",
    description: "Meet and connect with other Christians.",
    parentId: "community",
    level: 1,
    sortOrder: 12,
  },
  {
    id: "prayer",
    title: "Prayer",
    description: "Prayer requests, praise reports, and encouragement.",
    parentId: null,
    level: 0,
    sortOrder: 20,
  },
  {
    id: "prayer-requests",
    title: "Prayer Requests",
    description: "Share prayer requests with the community.",
    parentId: "prayer",
    level: 1,
    sortOrder: 21,
  },
  {
    id: "prayer-testimonies",
    title: "Testimonies",
    description: "Share testimonies and answered prayers.",
    parentId: "prayer",
    level: 1,
    sortOrder: 22,
  },
  {
    id: "catholic-tradition",
    title: "Catholic Tradition",
    description: "Catholic theology, worship, and history.",
    parentId: null,
    level: 0,
    sortOrder: 30,
  },
  {
    id: "catholic-theology",
    title: "Theology",
    description: "Catholic theology discussions.",
    parentId: "catholic-tradition",
    level: 1,
    sortOrder: 31,
  },
  {
    id: "catholic-marian-theology",
    title: "Marian Theology",
    description: "Discussion about Mary and Marian doctrine.",
    parentId: "catholic-tradition",
    level: 1,
    sortOrder: 32,
  },
  {
    id: "orthodox-tradition",
    title: "Orthodox Tradition",
    description: "Orthodox theology, liturgy, and history.",
    parentId: null,
    level: 0,
    sortOrder: 40,
  },
  {
    id: "orthodox-theology",
    title: "Theology",
    description: "Orthodox theology discussions.",
    parentId: "orthodox-tradition",
    level: 1,
    sortOrder: 41,
  },
  {
    id: "protestant-tradition",
    title: "Protestant Tradition",
    description: "Protestant theology and church traditions.",
    parentId: null,
    level: 0,
    sortOrder: 50,
  },
  {
    id: "protestant-reformation-theology",
    title: "Reformation Theology",
    description: "Discussion about Protestant theology and reformers.",
    parentId: "protestant-tradition",
    level: 1,
    sortOrder: 51,
  },
  {
    id: "church-history",
    title: "Church History",
    description: "Historical discussions about Christianity.",
    parentId: null,
    level: 0,
    sortOrder: 60,
  },
  {
    id: "early-church",
    title: "Early Church",
    description: "Discussion about the early church.",
    parentId: "church-history",
    level: 1,
    sortOrder: 61,
  },
  {
    id: "church-fathers",
    title: "Church Fathers",
    description: "Discussion about the church fathers.",
    parentId: null,
    level: 0,
    sortOrder: 70,
  },
  {
    id: "apostolic-fathers",
    title: "Apostolic Fathers",
    description: "Discussion about the apostolic fathers.",
    parentId: "church-fathers",
    level: 1,
    sortOrder: 71,
  },
  {
    id: "councils",
    title: "Councils",
    description: "Ecumenical councils and theology.",
    parentId: null,
    level: 0,
    sortOrder: 80,
  },
  {
    id: "nicaea",
    title: "Nicaea",
    description: "Discussion about the Council of Nicaea.",
    parentId: "councils",
    level: 1,
    sortOrder: 81,
  },
  {
    id: "bible-study",
    title: "Bible Study",
    description: "Bible study and scripture discussions.",
    parentId: null,
    level: 0,
    sortOrder: 90,
  },
  {
    id: "old-testament",
    title: "Old Testament",
    description: "Old Testament discussions.",
    parentId: "bible-study",
    level: 1,
    sortOrder: 91,
  },
  {
    id: "new-testament",
    title: "New Testament",
    description: "New Testament discussions.",
    parentId: "bible-study",
    level: 1,
    sortOrder: 92,
  },
  {
    id: "questions-answers",
    title: "Questions & Answers",
    description: "Ask questions about Christianity.",
    parentId: null,
    level: 0,
    sortOrder: 100,
  },
  {
    id: "beginner-questions",
    title: "Beginner Questions",
    description: "Questions for beginners in the faith.",
    parentId: "questions-answers",
    level: 1,
    sortOrder: 101,
  },
];

export default function SeedForumPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function seedForum() {
    if (!db) {
      setMessage("Firebase not configured.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Creating forum categories...");

      for (const category of categories) {
        const ref = doc(collection(db, "forum_categories"), category.id);

        await setDoc(
          ref,
          {
            title: category.title,
            slug: category.id,
            description: category.description,
            parentId: category.parentId,
            level: category.level,
            sortOrder: category.sortOrder,
            isActive: true,
            isLocked: false,
            createdAt: serverTimestamp(),
            createdBy: "admin",
          },
          { merge: true }
        );
      }

      setMessage("Forum categories created successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Error creating categories.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">
        Forum Category Seeder
      </h1>

      <button
        onClick={seedForum}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded"
      >
        {loading ? "Creating..." : "Create Forum Categories"}
      </button>

      {message && (
        <p className="mt-4 text-lg">
          {message}
        </p>
      )}
    </main>
  );
}