"use client";

import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase-client";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import SiteHeroPanel from "@/components/site-hero-panel";
import Breadcrumb from "@/components/breadcrumb";
import { useAuth } from "@/lib/use-auth";
import { toUserProfile, type UserProfile } from "@/lib/user-profile";

const ADMIN_EMAIL = "mosegaard622@gmail.com";

type AccessState = "loading" | "denied" | "granted";

export default function BetaDashboardPage() {
  const { user, loading } = useAuth();
  const [accessState, setAccessState] = useState<AccessState>("loading");
  const [profile, setProfile] = useState<Partial<UserProfile> | null>(null);

  const [formData, setFormData] = useState({
    type: "bug",
    title: "",
    description: "",
    pageUrl: "",
    deviceType: "",
  });
  const [browserInfo, setBrowserInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setBrowserInfo(navigator.userAgent || "Unknown");
    }
    if (typeof window !== "undefined") {
      setFormData((prev) => ({ ...prev, pageUrl: window.location.href }));
    }
  }, []);

  // Access check
  useEffect(() => {
    if (loading) return;

    if (!user) {
      setAccessState("denied");
      return;
    }

    if (!isFirebaseConfigured || !db) {
      setAccessState("denied");
      return;
    }

    const checkAccess = async () => {
      try {
        // Admin always has access
        if (user.email === ADMIN_EMAIL) {
          setAccessState("granted");
          return;
        }

        // Load user profile and check role
        const snap = await getDoc(doc(db!, "users", user.uid));
        const profileData = toUserProfile(snap.data());
        setProfile(profileData);

        if (profileData.role === "beta_tester" || profileData.role === "admin") {
          setAccessState("granted");
          return;
        }

        // Fallback: direct read by uid — signup now writes doc ID = user.uid,
        // so this is a get (not a list/query) and works without broader rules.
        const betaSnap = await getDoc(doc(db!, "beta_testers", user.uid));
        setAccessState(betaSnap.exists() ? "granted" : "denied");
      } catch {
        setAccessState("denied");
      }
    };

    void checkAccess();
  }, [user, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.title.trim()) { setError("Title is required."); return; }
    if (!formData.description.trim()) { setError("Description is required."); return; }
    if (!isFirebaseConfigured || !db) {
      setError("Feedback submission is currently unavailable.");
      return;
    }
    if (!user) { setError("You must be signed in to submit feedback."); return; }

    setSubmitting(true);

    try {
      await addDoc(collection(db, "beta_feedback"), {
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        pageUrl: formData.pageUrl.trim() || (typeof window !== "undefined" ? window.location.href : ""),
        deviceType: formData.deviceType.trim(),
        uid: user.uid,
        userEmail: user.email ?? "",
        displayName: profile?.displayName ?? "",
        status: "new",
        browserInfo,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setFormData((prev) => ({
        ...prev,
        type: "bug",
        title: "",
        description: "",
        deviceType: "",
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      const code = (err as { code?: string })?.code;
      if (code === "permission-denied") {
        setError("Permission denied. Please try again later or contact support.");
      } else {
        setError(`Could not submit feedback: ${msg}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-[0.75rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.48)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-highlight)]";
  const labelClass = "grid gap-2 text-sm text-[var(--color-ink)]";

  return (
    <>
      <AppHeader />
      <div className="pt-[var(--header-height,96px)]">
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-14">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "User Panel", href: "/user-panel" },
              { label: "Beta Dashboard" },
            ]}
          />

          {/* Loading */}
          {(loading || (!user && accessState === "loading") || (user && accessState === "loading")) && (
            <p className="text-sm text-[var(--color-muted)]">Checking access…</p>
          )}

          {/* Not signed in */}
          {!loading && !user && accessState === "denied" && (
            <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
                Beta Dashboard
              </p>
              <h1 className="site-page-title mt-3">Sign in required</h1>
              <p className="site-heading-lead mt-4">
                The Beta Dashboard is only available to registered beta testers. Sign in to continue.
              </p>
              <Link
                href="/login?next=/beta-dashboard"
                className="mt-6 inline-flex rounded-full bg-[var(--color-highlight)] px-6 py-2.5 text-sm font-semibold text-[#080808]"
              >
                Sign in
              </Link>
            </section>
          )}

          {/* Signed in but access denied */}
          {!loading && user && accessState === "denied" && (
            <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
                Beta Dashboard
              </p>
              <h1 className="site-page-title mt-3">Join the beta first</h1>
              <p className="site-heading-lead mt-4">
                You need to register as a beta tester before accessing this dashboard.
              </p>
              <Link
                href="/beta-tester"
                className="mt-6 inline-flex rounded-full bg-[var(--color-highlight)] px-6 py-2.5 text-sm font-semibold text-[#080808]"
              >
                Register as beta tester →
              </Link>
            </section>
          )}

          {/* Access granted */}
          {accessState === "granted" && (
            <>
              <SiteHeroPanel
                eyebrow="Beta Tester"
                title="Feedback Dashboard"
                lead="Report bugs, share ideas, and help improve the platform. Your feedback directly shapes development priorities."
              />

              {/* How to test */}
              <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
                  Guide
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                  How to test
                </h2>
                <ul className="mt-4 space-y-1.5 text-sm leading-7 text-[var(--color-muted)]">
                  <li>Test on desktop, tablet, and mobile if possible.</li>
                  <li>Look for bugs, broken links, layout issues, and confusing pages.</li>
                  <li>Be specific — include the page URL when reporting an issue.</li>
                  <li>Ideas and suggestions are welcome, not only bugs.</li>
                  <li>Google Play beta testing will come in a later phase.</li>
                </ul>
              </section>

              {/* Feedback form */}
              <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
                  Submit
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                  Report feedback
                </h2>

                {success && (
                  <div className="mt-4 rounded-[1rem] border border-[rgba(230,190,120,0.35)] bg-[rgba(230,190,120,0.08)] px-4 py-3 text-sm text-[var(--color-highlight)]">
                    Thank you — your feedback has been received.
                  </div>
                )}

                {!isFirebaseConfigured && (
                  <p className="mt-4 rounded-[1rem] border border-red-800 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                    Feedback submission is unavailable. Firebase is not configured.
                  </p>
                )}

                <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
                  <label className={labelClass}>
                    Feedback type *
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                      className="rounded-[0.75rem] border border-[var(--color-border)] bg-[#101010] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-highlight)]"
                      required
                    >
                      <option value="bug">Bug</option>
                      <option value="issue">Issue</option>
                      <option value="idea">Idea</option>
                      <option value="general_feedback">General Feedback</option>
                    </select>
                  </label>

                  <label className={labelClass}>
                    Title *
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                      className={inputClass}
                      placeholder="Short summary of your feedback"
                      required
                    />
                  </label>

                  <label className={labelClass}>
                    Description *
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      rows={5}
                      className={inputClass + " resize-y"}
                      placeholder="Describe the issue or idea in detail"
                      required
                    />
                  </label>

                  <label className={labelClass}>
                    Page URL
                    <input
                      type="text"
                      value={formData.pageUrl}
                      onChange={(e) => setFormData((p) => ({ ...p, pageUrl: e.target.value }))}
                      className={inputClass}
                      placeholder="https://oneinhimbiblestudy.com/..."
                    />
                  </label>

                  <label className={labelClass}>
                    Device type
                    <input
                      type="text"
                      value={formData.deviceType}
                      onChange={(e) => setFormData((p) => ({ ...p, deviceType: e.target.value }))}
                      className={inputClass}
                      placeholder="Desktop, Mobile, Tablet…"
                    />
                  </label>

                  {error && (
                    <p className="text-sm text-red-300">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !isFirebaseConfigured}
                    className="w-fit rounded-full bg-[var(--color-highlight)] px-6 py-3 text-sm font-semibold text-[#080808] disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Submit Feedback"}
                  </button>
                </form>
              </section>

              <div className="text-center">
                <Link
                  href="/user-panel"
                  className="text-sm text-[var(--color-highlight)] hover:underline"
                >
                  ← Back to User Panel
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
      <MobileBottomNav />
    </>
  );
}
