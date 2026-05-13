import type { Timestamp } from "firebase/firestore";

export const FORUM_ADMIN_EMAIL = "mosegaard622@gmail.com";

export type ForumCategory = {
  id: string;
  title: string;
  slug: string;
  description: string;
  parentId: string | null;
  level: number;
  sortOrder: number;
  isActive: boolean;
  isLocked?: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

export type ForumThread = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  parentCategoryId: string | null;
  authorId: string;
  authorEmail: string;
  authorDisplayName: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  lastReplyAt: Timestamp | null;
  replyCount: number;
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  isDeleted: boolean;
};

export type ForumPost = {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  authorEmail: string;
  authorDisplayName: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  isFirstPost: boolean;
  isDeleted: boolean;
  deletedBy?: string;
  deletedAt?: Timestamp | null;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatForumDate(value: Timestamp | null | undefined) {
  if (!value) return "Just now";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value.toDate());
}

export function forumAuthorName(
  displayName: string | null | undefined,
  email: string | null | undefined
) {
  return displayName?.trim() || email?.trim() || "Forum member";
}

export function isForumAdmin(email: string | null | undefined) {
  return email?.toLowerCase() === FORUM_ADMIN_EMAIL;
}
