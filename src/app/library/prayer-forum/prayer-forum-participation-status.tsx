"use client";

import Link from "next/link";
import { useAuth } from "@/lib/use-auth";

export default function PrayerForumParticipationStatus() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <p className="mt-3 text-xs text-[var(--color-soft)]" aria-live="polite">
        Checking sign-in status...
      </p>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <p className="mt-3 text-xs text-[var(--color-soft)]" aria-live="polite">
      Signed in as {user.email ?? "your account"}.{" "}
      <Link
        href="/library/prayer-forum/new-thread"
        className="text-[var(--color-highlight)] hover:underline"
      >
        Start a signed-in discussion
      </Link>
      .
    </p>
  );
}
