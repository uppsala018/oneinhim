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
    return null;
  }

  if (userEmail) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden lg:block text-xs text-[var(--color-soft)] max-w-[9rem] truncate">{userEmail}</span>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={pending}
          className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink)] whitespace-nowrap disabled:opacity-60"
        >
          {pending ? "…" : "Sign out"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email"
        className="w-40 rounded-full border border-[var(--color-border)] bg-transparent px-3 py-1.5 text-xs text-[var(--color-ink)] outline-none placeholder:text-[var(--color-soft)]"
      />
      <button
        type="button"
        onClick={handleMagicLink}
        disabled={pending || !email.trim()}
        className="rounded-full bg-[linear-gradient(180deg,#f0cf84,#cba45b)] px-3 py-1.5 text-xs font-semibold text-[#0a1530] whitespace-nowrap disabled:opacity-60"
      >
        {pending ? "…" : "Sign In"}
      </button>
    </div>
  );
}

