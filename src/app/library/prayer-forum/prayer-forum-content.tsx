"use client";

import Link from "next/link";
import { useAuth } from "@/lib/use-auth";

export default function PrayerForumContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="px-4 pt-4 pb-2 text-sm text-[var(--color-muted)]">
        Checking sign-in status...
      </section>
    );
  }

  return (
    <section className="px-4 pt-4 pb-2">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
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
    </section>
  );
}
