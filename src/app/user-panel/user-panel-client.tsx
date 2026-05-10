"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useAuth } from "@/lib/use-auth";
import { toProfileFormValues, type UserProfileFormValues } from "@/lib/user-profile";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/library/prayer-forum", label: "Prayer Forum" },
  { href: "/user-panel/profile", label: "Edit Profile" },
];

function SignInPrompt() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-10">
      <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-highlight)]">
          User Panel
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">
          Sign in required
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Sign in to view and edit your user profile.
        </p>
        <Link
          href="/login?next=/user-panel"
          className="mt-5 inline-flex rounded-full bg-[var(--color-highlight)] px-5 py-2 text-sm font-semibold text-[#080808]"
        >
          Sign in
        </Link>
      </div>
    </section>
  );
}

export default function UserPanelClient() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfileFormValues | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!user || !db) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
      setError("");

      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (!cancelled) {
          setProfile(toProfileFormValues(snapshot.data()));
        }
      } catch (loadError) {
        console.error("Error loading user profile:", loadError);
        if (!cancelled) {
          setError("Unable to load your profile right now.");
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <section className="px-4 py-10 text-sm text-[var(--color-muted)]">
        Checking sign-in status...
      </section>
    );
  }

  if (!user) {
    return <SignInPrompt />;
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 pb-28 pt-6 sm:px-6 lg:px-8">
      <nav className="flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-[var(--color-highlight)]">
            {link.label}
          </Link>
        ))}
      </nav>

      <section className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
          Dashboard
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">
          User Panel
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Signed in as <span className="text-[var(--color-ink)]">{user.email ?? "your account"}</span>
        </p>
      </section>

      <section className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-highlight)]">
          Profile Summary
        </h2>

        {profileLoading ? (
          <p className="mt-4 text-sm text-[var(--color-muted)]">Loading profile...</p>
        ) : error ? (
          <p className="mt-4 text-sm text-red-300">{error}</p>
        ) : (
          <div className="mt-5 grid gap-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-soft)]">
                Display name
              </p>
              <p className="mt-1 text-[var(--color-ink)]">
                {profile?.displayName || "Not saved yet"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-soft)]">
                Christian tradition
              </p>
              <p className="mt-1 text-[var(--color-ink)]">
                {profile?.christianTradition || "Not saved yet"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-soft)]">
                About
              </p>
              <p className="mt-1 line-clamp-4 leading-6 text-[var(--color-muted)]">
                {profile?.bio || "No bio saved yet."}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-[1rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.48)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-highlight)] hover:text-[var(--color-highlight)]"
          >
            {link.label}
          </Link>
        ))}
      </section>
    </main>
  );
}
