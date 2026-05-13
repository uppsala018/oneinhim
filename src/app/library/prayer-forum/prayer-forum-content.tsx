import Link from "next/link";
import PrayerForumParticipationStatus from "./prayer-forum-participation-status";

export default function PrayerForumContent() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] p-5">
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">
          Read publicly, sign in to participate
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Anyone can browse the forum. Sign in only when you want to start a discussion
          or reply to a thread.
        </p>
        <Link
          href="/login?next=/library/prayer-forum/new-thread"
          className="mt-4 inline-flex rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-highlight)] hover:text-[var(--color-highlight)]"
        >
          Start a discussion
        </Link>
        <PrayerForumParticipationStatus />
      </div>
    </div>
  );
}
