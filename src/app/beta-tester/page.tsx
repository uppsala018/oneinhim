"use client";

import { useState } from "react";
import { db } from "@/lib/firebase-client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function BetaTesterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    interestedGooglePlay: false,
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      await addDoc(collection(db, "beta_testers"), {
        Name: formData.name,
        email: formData.email,
        country: formData.country,
        createdAt: serverTimestamp(),
        interestedGooglePlay: formData.interestedGooglePlay,
      });
      setStatus("success");
      setFormData({ name: "", email: "", country: "", interestedGooglePlay: false });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-14 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)] mb-6">
          Become a Beta Tester
        </h1>

        <div className="space-y-4 text-[var(--color-ink)] mb-8">
          <p>
            One in Him Bible Study is a free, installable app for Bible study and church history.
          </p>
          <p>
            Beta testers help us improve by reporting bugs, issues, sharing ideas, and providing feedback.
          </p>
          <p>
            Our goal is to gather 25 beta testers to shape the app&apos;s development.
          </p>
          <p>
            Phase 2 of beta testing will focus on Google Play beta releases.
          </p>
          <p>
            As a beta tester, you&apos;ll influence development priorities and hear updates before anyone else.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-paper)] p-6 text-[var(--color-ink)]">
            <h2 className="text-2xl font-semibold mb-2">Thanks for signing up!</h2>
            <p>We&apos;ll be in touch soon with beta testing details.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-paper)] px-4 py-2 text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-paper)] px-4 py-2 text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-paper)] px-4 py-2 text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                placeholder="Your country"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="interestedGooglePlay"
                name="interestedGooglePlay"
                checked={formData.interestedGooglePlay}
                onChange={handleChange}
                className="h-4 w-4 rounded border-[var(--color-border)] bg-[var(--color-paper)] text-[var(--color-gold)] focus:ring-[var(--color-gold)]"
              />
              <label htmlFor="interestedGooglePlay" className="text-sm text-[var(--color-ink)]">
                I&apos;m interested in Google Play beta testing
              </label>
            </div>

            {status === "error" && (
              <div className="text-red-500 text-sm">{errorMsg}</div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex rounded-full border border-[var(--color-border)] px-6 py-3 text-[var(--color-ink)] font-medium hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] hover:border-[var(--color-gold)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Signing up..." : "Sign Up as Beta Tester"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
