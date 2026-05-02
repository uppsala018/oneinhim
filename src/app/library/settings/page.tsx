"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "@/components/app-header";
import AdminPanel from "@/components/admin-panel";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { createSupabaseBrowserClient, hasSupabaseEnv, subscribeToAuthChanges } from "@/lib/supabase";
import {
  applyTheme,
  readPreferences,
  savePreferences,
  type ThemeMode,
  type UserPreferences,
} from "@/lib/user-preferences";

const themeOptions: Array<{ value: ThemeMode; label: string; description: string }> = [
  { value: "dark", label: "Dark", description: "Keeps the current deep navy look." },
  { value: "light", label: "Light", description: "Uses a lighter reading background." },
  { value: "system", label: "System", description: "Matches your device theme." },
];

function togglePreference<T extends keyof UserPreferences>(
  current: UserPreferences,
  key: T,
  value: UserPreferences[T],
) {
  return { ...current, [key]: value };
}

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => readPreferences());
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseEnv()) return;
    const sb = createSupabaseBrowserClient();
    if (!sb) return;
    void sb.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    return subscribeToAuthChanges((_e, session) => setUserEmail(session?.user?.email ?? null));
  }, []);

  useEffect(() => {
    applyTheme(preferences.theme);
  }, [preferences.theme]);

  function updatePreferences(next: UserPreferences) {
    setPreferences(next);
    savePreferences(next);
    applyTheme(next.theme);
  }

  return (
    <>
      <div className="hidden lg:block">
        <AppHeader />
      </div>

      <section className="mobile-app-shell min-h-screen">
        <header className="kjv-mobile__topbar">
          <Link href="/library" className="kjv-mobile__icon-button" aria-label="Back to library">
            ←
          </Link>
          <h1>Settings</h1>
          <Link href="/" className="kjv-mobile__icon-button" aria-label="Home">
            ⌂
          </Link>
        </header>

        <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pb-28 pt-6 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
              Theme
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
              Choose how the app looks.
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updatePreferences(togglePreference(preferences, "theme", option.value))}
                  className={`rounded-[1.5rem] border p-4 text-left transition ${
                    preferences.theme === option.value
                      ? "border-transparent bg-[linear-gradient(180deg,#f0cf84,#cba45b)] text-[#0a1530]"
                      : "border-[var(--color-border)] bg-[rgba(5,17,34,0.48)] text-[var(--color-ink)]"
                  }`}
                >
                  <p className="font-[family-name:var(--font-display)] text-2xl">{option.label}</p>
                  <p className="mt-2 text-sm leading-6 opacity-90">{option.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
              Reader
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
              Keep Strong&apos;s visible in the KJV reader.
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  updatePreferences(togglePreference(preferences, "showStrongs", true))
                }
                className={`rounded-[1.5rem] border p-5 text-left transition ${
                  preferences.showStrongs
                    ? "border-transparent bg-[linear-gradient(180deg,#f0cf84,#cba45b)] text-[#0a1530]"
                    : "border-[var(--color-border)] bg-[rgba(5,17,34,0.48)] text-[var(--color-ink)]"
                }`}
              >
                <p className="font-[family-name:var(--font-display)] text-2xl">Strong&apos;s On</p>
                <p className="mt-2 text-sm leading-6 opacity-90">
                  Show the Strong&apos;s word buttons and the concordance panel under the verse.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  updatePreferences(togglePreference(preferences, "showStrongs", false))
                }
                className={`rounded-[1.5rem] border p-5 text-left transition ${
                  !preferences.showStrongs
                    ? "border-transparent bg-[linear-gradient(180deg,#f0cf84,#cba45b)] text-[#0a1530]"
                    : "border-[var(--color-border)] bg-[rgba(5,17,34,0.48)] text-[var(--color-ink)]"
                }`}
              >
                <p className="font-[family-name:var(--font-display)] text-2xl">Strong&apos;s Off</p>
                <p className="mt-2 text-sm leading-6 opacity-90">
                  Hide the lexicon window for a cleaner reading-only chapter view.
                </p>
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-highlight)]">
              Reader Style
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
              Compact reading mode.
            </h2>
            <button
              type="button"
              onClick={() =>
                updatePreferences(togglePreference(preferences, "compactReader", !preferences.compactReader))
              }
              className={`mt-5 rounded-[1.5rem] border px-5 py-4 text-left transition ${
                preferences.compactReader
                  ? "border-transparent bg-[linear-gradient(180deg,#f0cf84,#cba45b)] text-[#0a1530]"
                  : "border-[var(--color-border)] bg-[rgba(5,17,34,0.48)] text-[var(--color-ink)]"
              }`}
            >
              <p className="font-[family-name:var(--font-display)] text-2xl">
                {preferences.compactReader ? "Compact mode on" : "Compact mode off"}
              </p>
              <p className="mt-2 text-sm leading-6 opacity-90">
                Leave this off for now if you prefer the current wider reading layout.
              </p>
            </button>
          </section>
          {userEmail === "mosegaard622@gmail.com" && (
            <AdminPanel userEmail={userEmail} />
          )}

          <div className="flex flex-wrap gap-4 pt-2 text-sm text-[var(--color-soft)]">
            <Link href="/privacy" className="hover:text-[var(--color-highlight)]">
              Privacy Policy
            </Link>
            <Link href="/donate" className="hover:text-[var(--color-highlight)]">
              Support the app
            </Link>
            <Link href="/library/prayer-forum/support" className="hover:text-[var(--color-highlight)]">
              Contact
            </Link>
          </div>
        </main>

        <MobileBottomNav active="Settings" />
      </section>
    </>
  );
}
