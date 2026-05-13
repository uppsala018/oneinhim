"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import Breadcrumb from "@/components/breadcrumb";
import SiteHeroPanel from "@/components/site-hero-panel";

type UserDoc = {
  uid: string;
  email: string;
  displayName: string;
  provider: string;
  createdAt: { toDate?: () => Date } | null;
  lastLoginAt: { toDate?: () => Date } | null;
};

type BetaTesterDoc = {
  Name?: string;
  name?: string;
  email: string;
  country?: string;
  interestedGooglePlay: boolean;
  createdAt: { toDate?: () => Date } | null;
};

type FeedbackDoc = {
  id: string;
  type: string;
  title: string;
  description: string;
  pageUrl: string;
  status: "new" | "reviewed" | "planned" | "fixed" | "closed";
  userEmail: string;
  uid?: string;
  createdAt: { toDate?: () => Date } | null;
};

const FEEDBACK_STATUSES = ["new", "reviewed", "planned", "fixed", "closed"] as const;

function fmt(ts: { toDate?: () => Date } | null | undefined) {
  return ts?.toDate?.()?.toLocaleDateString() ?? "—";
}

const statusColors: Record<string, string> = {
  new: "bg-[rgba(230,190,120,0.15)] text-[var(--color-highlight)] border-[rgba(230,190,120,0.4)]",
  reviewed: "bg-[rgba(10,10,10,0.48)] text-[var(--color-muted)] border-[var(--color-border)]",
  planned: "bg-[rgba(10,10,10,0.48)] text-[var(--color-muted)] border-[var(--color-border)]",
  fixed: "bg-[rgba(100,200,100,0.12)] text-green-300 border-green-800",
  closed: "bg-[rgba(10,10,10,0.48)] text-[var(--color-soft)] border-[var(--color-border)]",
};

export default function AdminBetaPage() {
  const [dataLoading, setDataLoading] = useState(true);
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [betaTesters, setBetaTesters] = useState<BetaTesterDoc[]>([]);
  const [feedback, setFeedback] = useState<FeedbackDoc[]>([]);
  const [totals, setTotals] = useState({ users: 0, betaTesters: 0, feedback: 0, bugs: 0, ideas: 0, googlePlayInterested: 0 });
  const [googlePlayEmails, setGooglePlayEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!db) { setDataLoading(false); return; }

    const fetchData = async () => {
      try {
        setDataLoading(true);
        setError(null);

        const [usersSnap, betaSnap, feedbackSnap] = await Promise.all([
          getDocs(collection(db!, "users")),
          getDocs(collection(db!, "beta_testers")),
          getDocs(collection(db!, "beta_feedback")),
        ]);

        const usersData = usersSnap.docs.map((d) => d.data() as UserDoc);
        const betaData = betaSnap.docs.map((d) => d.data() as BetaTesterDoc);
        const feedbackData = feedbackSnap.docs.map((d) => ({ id: d.id, ...d.data() } as FeedbackDoc));

        setUsers(usersData);
        setBetaTesters(betaData);
        setFeedback(feedbackData);
        setTotals({
          users: usersData.length,
          betaTesters: betaData.length,
          feedback: feedbackData.length,
          bugs: feedbackData.filter((f) => f.type === "bug").length,
          ideas: feedbackData.filter((f) => f.type === "idea").length,
          googlePlayInterested: betaData.filter((t) => t.interestedGooglePlay).length,
        });
        setGooglePlayEmails(betaData.filter((t) => t.interestedGooglePlay).map((t) => t.email));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        setDataLoading(false);
      }
    };

    void fetchData();
  }, []);

  const handleUpdateFeedbackStatus = async (feedbackId: string, newStatus: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "beta_feedback", feedbackId), { status: newStatus });
      setFeedback((prev) =>
        prev.map((f) => (f.id === feedbackId ? { ...f, status: newStatus as FeedbackDoc["status"] } : f)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  const copyGooglePlayEmails = async () => {
    try {
      await navigator.clipboard.writeText(googlePlayEmails.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy emails.");
    }
  };

  return (
    <div className="flex flex-col gap-5 pt-5">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "User Panel", href: "/user-panel" },
          { label: "Admin Dashboard" },
        ]}
      />

      <SiteHeroPanel
        eyebrow="Admin"
        title="Beta Admin Panel"
        lead="Overview of registered users, beta testers, and submitted feedback."
      />

      {error && (
        <div className="rounded-[1rem] border border-red-800 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {dataLoading ? (
        <p className="text-sm text-[var(--color-muted)]">Loading data…</p>
      ) : (
        <>
          {/* Stats */}
          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">Overview</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Users", value: totals.users },
                { label: "Beta Testers", value: totals.betaTesters },
                { label: "Feedback", value: totals.feedback },
                { label: "Bugs", value: totals.bugs },
                { label: "Ideas", value: totals.ideas },
                { label: "Google Play Interest", value: totals.googlePlayInterested },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] p-4 text-center"
                >
                  <p className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--color-highlight)]">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Google Play emails */}
          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
                Google Play Interest ({googlePlayEmails.length})
              </p>
              <button
                onClick={copyGooglePlayEmails}
                disabled={googlePlayEmails.length === 0}
                className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm text-[var(--color-ink)] transition hover:border-[var(--color-highlight)] disabled:opacity-40"
              >
                {copied ? "Copied ✓" : "Copy All Emails"}
              </button>
            </div>
            {googlePlayEmails.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--color-muted)]">No Google Play interest yet.</p>
            ) : (
              <div className="mt-3 max-h-48 overflow-y-auto rounded-[1rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)]">
                {googlePlayEmails.map((email, i) => (
                  <p key={i} className="border-b border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-ink)] last:border-0">
                    {email}
                  </p>
                ))}
              </div>
            )}
          </section>

          {/* Beta Testers */}
          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
              Beta Testers ({betaTesters.length})
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    {["Name", "Email", "Country", "Google Play", "Signed up"].map((h) => (
                      <th key={h} className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-highlight)]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {betaTesters.map((t, i) => (
                    <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="py-3 pr-4 text-[var(--color-ink)]">{t.Name ?? t.name ?? "—"}</td>
                      <td className="py-3 pr-4 text-[var(--color-muted)]">{t.email}</td>
                      <td className="py-3 pr-4 text-[var(--color-muted)]">{t.country ?? "—"}</td>
                      <td className="py-3 pr-4 text-[var(--color-muted)]">{t.interestedGooglePlay ? "Yes" : "No"}</td>
                      <td className="py-3 text-[var(--color-soft)]">{fmt(t.createdAt)}</td>
                    </tr>
                  ))}
                  {betaTesters.length === 0 && (
                    <tr><td colSpan={5} className="py-4 text-sm text-[var(--color-soft)]">No beta testers yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Feedback */}
          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
              Beta Feedback ({feedback.length})
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    {["Type", "Title", "User", "Status", "Date", "Action"].map((h) => (
                      <th key={h} className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-highlight)]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feedback.map((item) => (
                    <tr key={item.id} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="py-3 pr-4 text-[var(--color-muted)]">{item.type}</td>
                      <td className="py-3 pr-4 max-w-[12rem]">
                        <p className="font-medium text-[var(--color-ink)] truncate">{item.title}</p>
                        <p className="text-xs text-[var(--color-muted)] truncate">{item.description}</p>
                      </td>
                      <td className="py-3 pr-4 text-xs text-[var(--color-muted)]">{item.userEmail || "—"}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[item.status] ?? ""}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-[var(--color-soft)]">{fmt(item.createdAt)}</td>
                      <td className="py-3">
                        <select
                          value={item.status}
                          onChange={(e) => void handleUpdateFeedbackStatus(item.id, e.target.value)}
                          className="rounded-[0.5rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.48)] px-2 py-1 text-xs text-[var(--color-ink)] outline-none focus:border-[var(--color-highlight)]"
                        >
                          {FEEDBACK_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {feedback.length === 0 && (
                    <tr><td colSpan={6} className="py-4 text-sm text-[var(--color-soft)]">No feedback yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Users */}
          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
              Registered Users ({users.length})
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    {["Display Name", "Email", "Provider", "Created", "Last Login"].map((h) => (
                      <th key={h} className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-highlight)]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.uid} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="py-3 pr-4 text-[var(--color-ink)]">{u.displayName || "—"}</td>
                      <td className="py-3 pr-4 text-[var(--color-muted)]">{u.email}</td>
                      <td className="py-3 pr-4 text-[var(--color-muted)]">{u.provider}</td>
                      <td className="py-3 pr-4 text-[var(--color-soft)]">{fmt(u.createdAt)}</td>
                      <td className="py-3 text-[var(--color-soft)]">{fmt(u.lastLoginAt)}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} className="py-4 text-sm text-[var(--color-soft)]">No users yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
