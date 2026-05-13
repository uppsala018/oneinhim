"use client";

import { useState } from "react";
import { db, isFirebaseConfigured } from "@/lib/firebase-client";
import { serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import SiteHeroPanel from "@/components/site-hero-panel";
import Breadcrumb from "@/components/breadcrumb";
import { useAuth } from "@/lib/use-auth";

const ADMIN_EMAIL = "mosegaard622@gmail.com";

export default function BetaTesterPage() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ name: "", country: "", interestedGooglePlay: false });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isFirebaseConfigured || !db) {
      setStatus("error");
      setErrorMsg("Beta signup is temporarily unavailable. Please try again later.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      // Write to beta_testers collection — use uid as document ID so the
      // dashboard can do a direct getDoc(uid) read instead of a query.
      await setDoc(
        doc(db, "beta_testers", user.uid),
        {
          Name: form.name,
          email: user.email ?? "",
          uid: user.uid,
          country: form.country,
          interestedGooglePlay: form.interestedGooglePlay,
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );

      // Signup to beta_testers succeeded.
      setStatus("success");

      // Write betaSignedUp flag to users/{uid} — this field is not role-restricted
      // and can be read by the dashboard to grant access reliably.
      try {
        await setDoc(
          doc(db, "users", user.uid),
          { uid: user.uid, email: user.email ?? "", betaSignedUp: true, updatedAt: serverTimestamp() },
          { merge: true },
        );
      } catch {
        // If this fails too, dashboard falls back to beta_testers direct read.
      }

      // Also try to sync role — blocked by Firestore rules in most setups, silent fallback.
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const currentRole = (userSnap.data() as { role?: string } | undefined)?.role;
        if (currentRole !== "admin" && currentRole !== "beta_tester" && user.email !== ADMIN_EMAIL) {
          await setDoc(
            userRef,
            { uid: user.uid, email: user.email ?? "", role: "beta_tester", updatedAt: serverTimestamp() },
            { merge: true },
          );
        }
      } catch {
        // Silent — betaSignedUp flag already written above.
      }

      router.push("/beta-dashboard");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <AppHeader />
      <div className="pt-[var(--header-height,96px)]">
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-14">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Beta Tester" }]} />

          {loading ? (
            <p className="text-sm text-[var(--color-muted)]">Checking sign-in status…</p>
          ) : !user ? (
            <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
                Join the Beta
              </p>
              <h1 className="site-page-title mt-3">Become a Beta Tester</h1>
              <p className="site-heading-lead mt-4">
                Sign in first to register as a beta tester and gain access to the Beta Dashboard.
              </p>
              <Link
                href="/login?next=/beta-tester"
                className="mt-6 inline-flex rounded-full bg-[var(--color-highlight)] px-6 py-2.5 text-sm font-semibold text-[#080808]"
              >
                Sign in to continue
              </Link>
            </section>
          ) : status === "success" ? (
            <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
                Welcome
              </p>
              <h1 className="site-page-title mt-3">You&apos;re a Beta Tester</h1>
              <p className="site-heading-lead mt-4">Redirecting to the Beta Dashboard…</p>
            </section>
          ) : (
            <>
              <SiteHeroPanel
                eyebrow="Join the Beta"
                title="Become a Beta Tester"
                lead="One In Him Bible Study is a free, installable app for Scripture study and church history. Beta testers shape development by reporting bugs, sharing ideas, and providing honest feedback before each release."
              />

              {/* What beta testers do */}
              <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
                  What to expect
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                  Your role as a tester
                </h2>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-[var(--color-muted)]">
                  <li>Test the site on desktop, tablet, and mobile.</li>
                  <li>Report bugs, broken links, and confusing pages with as much detail as possible.</li>
                  <li>Ideas and suggestions are welcome — not just bug reports.</li>
                  <li>Phase 2 will include Google Play beta releases.</li>
                  <li>You&apos;ll hear updates before anyone else and influence development priorities.</li>
                </ul>
              </section>

              {/* Sign-up form */}
              <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
                  Sign up
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                  Register as a beta tester
                </h2>

                {!isFirebaseConfigured && (
                  <p className="mt-4 rounded-[1rem] border border-red-800 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                    Beta signup is temporarily unavailable. Please try again later.
                  </p>
                )}

                <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
                  {/* Email — read-only from auth */}
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-soft)] mb-2">
                      Account email
                    </p>
                    <p className="rounded-[0.75rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.28)] px-4 py-3 text-sm text-[var(--color-muted)]">
                      {user.email}
                    </p>
                  </div>

                  <label className="grid gap-2 text-sm text-[var(--color-ink)]">
                    Your name *
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                      disabled={!isFirebaseConfigured}
                      className="rounded-[0.75rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.48)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-highlight)] disabled:opacity-50"
                      placeholder="Your full name"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-[var(--color-ink)]">
                    Country *
                    <input
                      type="text"
                      value={form.country}
                      onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                      required
                      disabled={!isFirebaseConfigured}
                      className="rounded-[0.75rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.48)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-highlight)] disabled:opacity-50"
                      placeholder="Your country"
                    />
                  </label>

                  <label className="flex items-center gap-3 text-sm text-[var(--color-ink)]">
                    <input
                      type="checkbox"
                      checked={form.interestedGooglePlay}
                      onChange={(e) => setForm((f) => ({ ...f, interestedGooglePlay: e.target.checked }))}
                      disabled={!isFirebaseConfigured}
                      className="h-4 w-4 rounded border-[var(--color-border)]"
                    />
                    I&apos;m interested in Google Play beta testing
                  </label>

                  {status === "error" && (
                    <p className="text-sm text-red-300">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting" || !isFirebaseConfigured}
                    className="w-fit rounded-full bg-[var(--color-highlight)] px-6 py-3 text-sm font-semibold text-[#080808] disabled:opacity-60"
                  >
                    {status === "submitting" ? "Signing up…" : "Sign Up as Beta Tester"}
                  </button>
                </form>
              </section>
            </>
          )}
        </main>
      </div>
      <MobileBottomNav />
    </>
  );
}
