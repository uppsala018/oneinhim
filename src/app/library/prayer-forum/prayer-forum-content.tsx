'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase-client';
import Link from 'next/link';
import PrayerForumBoard from '@/components/prayer-forum-board';

export default function PrayerForumContent() {
  const [user, setUser] = useState<null | { email: string | null }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user ? { email: user.email } : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="px-4 pt-4 pb-2 text-[var(--color-muted)]">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="px-4 pt-4 pb-2">
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-paper)] p-6 text-[var(--color-ink)]">
          <h3 className="text-lg font-semibold mb-2">Sign in to participate</h3>
          <p className="mb-4">Sign in to participate in the prayer forum.</p>
          <Link
            href="/login?next=/library/prayer-forum"
            className="inline-flex rounded-full border border-[var(--color-border)] px-6 py-3 text-[var(--color-ink)] font-medium hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:border-[var(--color-gold)] transition-colors"
          >
            Sign in / Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-2">
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        Signed in as {user.email}. You can participate in the forum below.
      </p>
      <PrayerForumBoard />
    </div>
  );
}
