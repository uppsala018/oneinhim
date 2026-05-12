"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase-client";
import { useAuth } from "@/lib/use-auth";
import {
  formatForumDate,
  forumAuthorName,
  isForumAdmin,
  type ForumPost,
  type ForumThread,
} from "@/lib/forum";

const REPORT_REASONS = ["spam", "abuse", "inappropriate", "other"];

function ReportForm({
  targetType,
  targetId,
  onClose,
}: {
  targetType: "thread" | "post";
  targetId: string;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  async function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !user) {
      setStatus("Sign in to report content.");
      return;
    }

    await setDoc(doc(collection(db, "forum_reports")), {
      targetType,
      targetId,
      reason,
      description: description.trim(),
      reporterId: user.uid,
      reporterEmail: user.email ?? "",
      createdAt: serverTimestamp(),
      status: "open",
    });
    setStatus("Report submitted.");
    setDescription("");
  }

  return (
    <form
      onSubmit={submitReport}
      className="mt-3 grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[rgba(10,10,10,0.38)] p-4"
    >
      <select
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        className="rounded-xl border border-[var(--color-border)] bg-[rgba(10,10,10,0.7)] px-3 py-2 text-sm text-[var(--color-ink)]"
      >
        {REPORT_REASONS.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={3}
        placeholder="Optional description"
        className="rounded-xl border border-[var(--color-border)] bg-[rgba(10,10,10,0.7)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
      />
      {status ? <p className="text-xs text-[var(--color-muted)]">{status}</p> : null}
      <div className="flex gap-2">
        <button className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-ink)]">
          Submit report
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-muted)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ThreadPageContent({ threadId }: { threadId: string }) {
  const { user, loading: authLoading } = useAuth();
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const admin = isForumAdmin(user?.email);

  const loadThread = useMemo(
    () => async () => {
      if (!db) {
        setError("Firebase is not configured.");
        setLoading(false);
        return;
      }

      try {
        const threadSnapshot = await getDoc(doc(db, "forum_threads", threadId));
        if (!threadSnapshot.exists()) {
          setThread(null);
          setPosts([]);
          return;
        }

        const postQuery = admin
          ? query(collection(db, "forum_posts"), where("threadId", "==", threadId))
          : query(
              collection(db, "forum_posts"),
              where("threadId", "==", threadId),
              where("isDeleted", "==", false)
            );
        const postSnapshot = await getDocs(postQuery);
        setThread({
          id: threadSnapshot.id,
          ...(threadSnapshot.data() as Omit<ForumThread, "id">),
        });
        setPosts(
          postSnapshot.docs
            .map((item) => ({
              id: item.id,
              ...(item.data() as Omit<ForumPost, "id">),
            }))
            .sort(
              (a, b) =>
                (a.createdAt?.toMillis() ?? 0) - (b.createdAt?.toMillis() ?? 0)
            )
        );
      } catch (err) {
        console.error(err);
        setError("Could not load thread.");
      } finally {
        setLoading(false);
      }
    },
    [admin, threadId]
  );

  useEffect(() => {
    void loadThread();
  }, [loadThread]);

  async function submitReply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!db || !user || !thread || thread.isLocked || thread.isDeleted) return;
    if (reply.trim().length < 3) {
      setError("Reply must be at least 3 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await setDoc(doc(collection(db, "forum_posts")), {
        threadId,
        content: reply.trim(),
        authorUid: user.uid,
        authorEmail: user.email ?? "",
        authorDisplayName: forumAuthorName(user.displayName, user.email),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isFirstPost: false,
        isDeleted: false,
      });
      await updateDoc(doc(db, "forum_threads", threadId), {
        replyCount: increment(1),
        updatedAt: serverTimestamp(),
        lastReplyAt: serverTimestamp(),
      });
      setReply("");
      await loadThread();
    } catch (err) {
      console.error(err);
      setError("Could not post reply.");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateThread(values: Partial<ForumThread>) {
    if (!db || !admin) return;
    await updateDoc(doc(db, "forum_threads", threadId), values);
    await loadThread();
  }

  async function softDeletePost(postId: string) {
    if (!db || !admin || !user) return;
    await updateDoc(doc(db, "forum_posts", postId), {
      isDeleted: true,
      deletedBy: user.uid,
      deletedAt: serverTimestamp(),
    });
    await loadThread();
  }

  if (loading || authLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-24 sm:px-8 lg:pb-14 lg:px-12">
        <p className="text-sm text-[var(--color-muted)]">Loading thread...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-24 sm:px-8 lg:pb-14 lg:px-12">
        <p className="text-sm text-red-400">{error}</p>
      </main>
    );
  }

  if (!thread || (thread.isDeleted && !admin)) {
    return (
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-24 sm:px-8 lg:pb-14 lg:px-12">
        <Link href="/library/prayer-forum" className="text-sm text-[var(--color-highlight)]">
          Back to forum
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-[var(--color-ink)]">
          Thread not found
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-24 sm:px-8 lg:pb-14 lg:px-12">
      <Link href="/library/prayer-forum" className="text-sm text-[var(--color-highlight)]">
        Back to forum
      </Link>

      <section className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.12em] text-[var(--color-highlight)]">
          {thread.isPinned ? <span>Pinned</span> : null}
          {thread.isLocked ? <span>Locked</span> : null}
          {thread.isDeleted ? <span>Deleted</span> : null}
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">
          {thread.title}
        </h1>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          {forumAuthorName(thread.authorDisplayName, thread.authorEmail)} ·{" "}
          {formatForumDate(thread.createdAt)} · {thread.replyCount ?? 0} replies
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {user ? (
            <button
              type="button"
              onClick={() => setReportTarget(`thread:${thread.id}`)}
              className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-muted)]"
            >
              Report
            </button>
          ) : null}
          {admin ? (
            <>
              <button
                type="button"
                onClick={() => updateThread({ isLocked: !thread.isLocked })}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-ink)]"
              >
                {thread.isLocked ? "Unlock" : "Lock"}
              </button>
              <button
                type="button"
                onClick={() => updateThread({ isPinned: !thread.isPinned })}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-ink)]"
              >
                {thread.isPinned ? "Unpin" : "Pin"}
              </button>
              {!thread.isDeleted ? (
                <button
                  type="button"
                  onClick={() => updateThread({ isDeleted: true })}
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs text-red-300"
                >
                  Delete thread
                </button>
              ) : null}
            </>
          ) : null}
        </div>

        {reportTarget === `thread:${thread.id}` ? (
          <ReportForm
            targetType="thread"
            targetId={thread.id}
            onClose={() => setReportTarget(null)}
          />
        ) : null}
      </section>

      <section className="mt-5 grid gap-4">
        {posts.filter((post) => admin || !post.isDeleted).map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--color-ink)]">
                  {forumAuthorName(post.authorDisplayName, post.authorEmail)}
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {formatForumDate(post.createdAt)}
                </p>
              </div>
              {post.isFirstPost ? (
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-highlight)]">
                  First post
                </span>
              ) : null}
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--color-ink)]">
              {post.isDeleted ? "This post was deleted." : post.content}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {user && !post.isDeleted ? (
                <button
                  type="button"
                  onClick={() => setReportTarget(`post:${post.id}`)}
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-muted)]"
                >
                  Report
                </button>
              ) : null}
              {admin && !post.isDeleted ? (
                <button
                  type="button"
                  onClick={() => softDeletePost(post.id)}
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs text-red-300"
                >
                  Delete post
                </button>
              ) : null}
            </div>
            {reportTarget === `post:${post.id}` ? (
              <ReportForm
                targetType="post"
                targetId={post.id}
                onClose={() => setReportTarget(null)}
              />
            ) : null}
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">Reply</h2>
        {thread.isLocked || thread.isDeleted ? (
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            This thread is closed for replies.
          </p>
        ) : user ? (
          <form onSubmit={submitReply} className="mt-4 grid gap-3">
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              rows={5}
              minLength={3}
              className="rounded-2xl border border-[var(--color-border)] bg-[rgba(10,10,10,0.7)] px-4 py-3 text-sm leading-6 text-[var(--color-ink)] outline-none"
              required
            />
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-medium text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post reply"}
            </button>
          </form>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-[var(--color-muted)]">
              Sign in to reply to this discussion.
            </p>
            <Link
              href={`/login?next=/library/prayer-forum/thread/${threadId}`}
              className="mt-4 inline-flex rounded-full border border-[var(--color-border)] px-5 py-2 text-sm text-[var(--color-ink)]"
            >
              Sign in
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
