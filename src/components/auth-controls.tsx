"use client";

import { useEffect, useState } from "react";
import {
  createSupabaseBrowserClient,
  hasSupabaseEnv,
  subscribeToAuthChanges,
} from "@/lib/supabase";

export default function AuthControls() {
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    void supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    return subscribeToAuthChanges((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
  }, []);

  async function handleMagicLink() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase || !email.trim()) {
      return;
    }

    setPending(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo:
          typeof window === "undefined" ? undefined : window.location.origin,
      },
    });

    setPending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Magic link sent. Open the email and follow the link to sign in.");
  }

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    setPending(true);
    setMessage(null);
    const { error } = await supabase.auth.signOut();
    setPending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Signed out.");
  }

  if (!hasSupabaseEnv()) {
    return (
      <div className="text-right">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-soft)]">
          Local mode
        </p>
        <p className="text-sm text-[var(--color-muted)]">Supabase env not loaded</p>
      </div>
    );
  }

  if (userEmail) {
    return (
      <div className="flex flex-col items-end gap-2 text-right">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-soft)]">
          Synced
        </p>
        <p className="text-sm text-[var(--color-muted)]">{userEmail}</p>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={pending}
          className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-ink)] disabled:opacity-60"
        >
          {pending ? "Signing out..." : "Sign out"}
        </button>
        {message ? <p className="max-w-56 text-xs text-[var(--color-soft)]">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email for magic link"
        className="w-56 rounded-full border border-[var(--color-border)] bg-[rgba(5,17,34,0.78)] px-4 py-2 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-soft)]"
      />
      <button
        type="button"
        onClick={handleMagicLink}
        disabled={pending || !email.trim()}
        className="rounded-full bg-[linear-gradient(180deg,#f0cf84,#cba45b)] px-4 py-2 text-sm font-semibold text-[#0a1530] disabled:opacity-60"
      >
        {pending ? "Sending..." : "Email Sign-In Link"}
      </button>
      {message ? <p className="max-w-56 text-right text-xs text-[var(--color-soft)]">{message}</p> : null}
    </div>
  );
}
