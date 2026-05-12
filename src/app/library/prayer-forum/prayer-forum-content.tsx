"use client";

import Link from "next/link";
import { useAuth } from "@/lib/use-auth";

export default function PrayerForumContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <p className="text-sm text-[var(--color-muted)]">Checking sign-in status…</p>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] p-5">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">
          {user ? "You are signed in" : "Sign in to participate"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          {user
            ? `Signed in as ${user.email ?? "your account"}. You can start discussions and reply to threads.`
            : "Anyone can read the forum. Sign in with Firebase Auth before starting a discussion or replying."}
        </p>
        <Link
          href={
            user
              ? "/library/prayer-forum/new-thread"
              : "/login?next=/library/prayer-forum/new-thread"
          }
          className="mt-4 inline-flex rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-highlight)] hover:text-[var(--color-highlight)]"
        >
          Start a discussion
        </Link>
      </div>
    </div>
  );
}
