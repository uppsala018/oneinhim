"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createSupabaseBrowserClient,
  hasSupabaseEnv,
  subscribeToAuthChanges,
} from "@/lib/supabase";

type Category = "prayer" | "praise" | "question";
type FilterTab = "all" | Category;

type Post = {
  id: string;
  created_at: string;
  display_name: string;
  request_text: string;
  category: Category;
  amen_count: number;
  user_id: string | null;
  status: "open" | "answered";
  admin_reply: string | null;
  is_deleted: boolean;
};

type Restriction = {
  status: "warned" | "restricted" | "blocked";
  reason: string | null;
};

const CATEGORY_META: Record<Category, { label: string; badge: string; color: string }> = {
  prayer:   { label: "Prayer Request", badge: "Prayer",   color: "rgba(229,197,122,0.18)" },
  praise:   { label: "Praise Report",  badge: "Praise",   color: "rgba(120,200,160,0.18)" },
  question: { label: "Question",       badge: "Question", color: "rgba(120,160,220,0.18)" },
};

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "prayer",   label: "Prayer" },
  { id: "praise",   label: "Praise" },
  { id: "question", label: "Questions" },
];

function timeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function InlineSignIn() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase || !email.trim()) return;
    setPending(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: typeof window === "undefined" ? undefined : window.location.origin },
    });
    setPending(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="forum-signin-card">
        <p className="forum-signin-card__title">Check your email ✓</p>
        <p className="forum-signin-card__body">
          We sent a sign-in link to <strong>{email}</strong>. Open it to join the conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="forum-signin-card">
      <p className="forum-signin-card__title">Sign in to post</p>
      <p className="forum-signin-card__body">
        No password needed — enter your email and we'll send a one-click sign-in link.
      </p>
      <div className="forum-signin-card__row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void send()}
          placeholder="your@email.com"
          className="forum-signin-card__input"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={pending || !email.trim()}
          className="forum-signin-card__button"
        >
          {pending ? "Sending…" : "Send link"}
        </button>
      </div>
      {error ? <p className="forum-signin-card__error">{error}</p> : null}
    </div>
  );
}

export default function PrayerForumBoard() {
  const [userId, setUserId]       = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [posts, setPosts]         = useState<Post[]>([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [composing, setComposing] = useState(false);

  const [displayName, setDisplayName]   = useState("");
  const [postText, setPostText]         = useState("");
  const [category, setCategory]         = useState<Category>("prayer");
  const [posting, setPosting]           = useState(false);
  const [postError, setPostError]       = useState<string | null>(null);
  const [postMessage, setPostMessage]   = useState<string | null>(null);

  const [prayingId, setPrayingId]       = useState<string | null>(null);
  const [loadError, setLoadError]       = useState<string | null>(null);
  const [restriction, setRestriction]   = useState<Restriction | null>(null);
  const [warningDismissed, setWarningDismissed] = useState(false);

  const defaultName = useMemo(() => userEmail?.split("@")[0] ?? "", [userEmail]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setUserEmail(data.user?.email ?? null);
    });
    return subscribeToAuthChanges((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? null);
    });
  }, []);

  // Check if signed-in user has a restriction
  useEffect(() => {
    if (!userId) { setRestriction(null); return; }
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    void supabase
      .from("user_restrictions")
      .select("status, reason")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => setRestriction(data as Restriction | null));
  }, [userId]);

  const loadPosts = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("prayer_requests")
      .select("id, created_at, display_name, request_text, category, amen_count, user_id, status, admin_reply, is_deleted")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(60);
    setLoading(false);
    if (error) { setLoadError("Could not load posts. Check your Supabase setup."); return; }
    setPosts((data ?? []) as Post[]);
  }, []);

  useEffect(() => { void loadPosts(); }, [loadPosts]);

  const visiblePosts = useMemo(
    () => activeTab === "all" ? posts : posts.filter((p) => p.category === activeTab),
    [posts, activeTab],
  );

  async function handlePost() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase || !userEmail) return;
    const text = postText.trim();
    if (text.length < 10) { setPostError("Write at least a sentence."); return; }
    setPosting(true);
    setPostError(null);
    setPostMessage(null);
    const name = displayName.trim() || defaultName || "Anonymous";
    const { data, error } = await supabase
      .from("prayer_requests")
      .insert({ display_name: name, request_text: text, category, user_id: userId, status: "open", amen_count: 0 })
      .select("id, created_at, display_name, request_text, category, amen_count, user_id, status")
      .single();
    setPosting(false);
    if (error || !data) { setPostError(error?.message ?? "Could not post."); return; }
    setPosts((prev) => [data as Post, ...prev]);
    setPostText("");
    setComposing(false);
    setPostMessage("Posted.");
  }

  async function handlePray(id: string) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase || !userEmail) return;
    setPrayingId(id);
    const { error } = await supabase.rpc("increment_prayer_count", { target_id: id });
    setPrayingId(null);
    if (!error) {
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, amen_count: p.amen_count + 1 } : p));
    }
  }

  async function handleMarkAnswered(id: string) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase
      .from("prayer_requests")
      .update({ status: "answered" })
      .eq("id", id)
      .eq("user_id", userId);
    if (!error) {
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, status: "answered" } : p));
    }
  }

  return (
    <div className="forum">

      {/* Blocked */}
      {restriction?.status === "blocked" && (
        <div className="forum-notice" style={{ borderColor: "rgba(230,165,165,0.4)", color: "#e6a5a5" }}>
          Your account has been suspended from this forum.
          {restriction.reason ? ` Reason: ${restriction.reason}` : ""}{" "}
          Contact support if you believe this is an error.
        </div>
      )}

      {/* Warning banner */}
      {restriction?.status === "warned" && !warningDismissed && (
        <div className="forum-notice" style={{ borderColor: "rgba(229,197,122,0.4)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
          <span>⚠ You have received a warning from the admin.{restriction.reason ? ` "${restriction.reason}"` : ""}</span>
          <button type="button" onClick={() => setWarningDismissed(true)} style={{ flexShrink: 0, color: "var(--color-soft)", fontSize: "0.8rem", textDecoration: "underline" }}>Dismiss</button>
        </div>
      )}

      {/* Sign-in / user bar */}
      {!hasSupabaseEnv() ? (
        <div className="forum-notice">Supabase not configured — posts will not save yet.</div>
      ) : userEmail ? (
        <div className="forum-user-bar">
          <span className="forum-user-bar__email">{userEmail}</span>
          <button
            type="button"
            className="forum-user-bar__signout"
            onClick={() => void createSupabaseBrowserClient()?.auth.signOut()}
          >
            Sign out
          </button>
        </div>
      ) : (
        <InlineSignIn />
      )}

      {/* Compose toggle */}
      {userEmail && !composing && !restriction?.status?.match(/restricted|blocked/) && (
        <button
          type="button"
          className="forum-compose-trigger"
          onClick={() => { setComposing(true); setPostError(null); setPostMessage(null); }}
        >
          + Share with the community
        </button>
      )}
      {postMessage && !composing ? (
        <p className="forum-post-message">{postMessage}</p>
      ) : null}

      {/* Compose form */}
      {composing && (
        <div className="forum-compose">
          <p className="forum-compose__heading">New post</p>

          <div className="forum-compose__category-row">
            {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`forum-compose__cat-btn${category === c ? " forum-compose__cat-btn--active" : ""}`}
              >
                {CATEGORY_META[c].label}
              </button>
            ))}
          </div>

          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={defaultName || "Your name"}
            className="forum-input"
          />
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={5}
            placeholder={
              category === "prayer" ? "Share your prayer request…" :
              category === "praise" ? "Share what God has done…" :
              "Ask your question or start a discussion…"
            }
            className="forum-input forum-input--textarea"
          />

          {postError ? <p className="forum-error">{postError}</p> : null}

          <div className="forum-compose__actions">
            <button
              type="button"
              onClick={() => void handlePost()}
              disabled={posting || !postText.trim()}
              className="forum-btn forum-btn--primary"
            >
              {posting ? "Posting…" : "Post"}
            </button>
            <button
              type="button"
              onClick={() => { setComposing(false); setPostError(null); }}
              className="forum-btn forum-btn--ghost"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="forum-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`forum-tab${activeTab === tab.id ? " forum-tab--active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void loadPosts()}
          disabled={loading}
          className="forum-tab forum-tab--refresh"
          aria-label="Refresh"
        >
          ↻
        </button>
      </div>

      {/* Feed */}
      {loading ? (
        <p className="forum-status">Loading…</p>
      ) : loadError ? (
        <p className="forum-status forum-status--error">{loadError}</p>
      ) : visiblePosts.length === 0 ? (
        <p className="forum-status">Nothing here yet — be the first to post.</p>
      ) : (
        <div className="forum-feed">
          {visiblePosts.map((post) => {
            const meta = CATEGORY_META[post.category] ?? CATEGORY_META.prayer;
            const isOwn = post.user_id === userId;
            return (
              <article key={post.id} className="forum-card" style={{ "--cat-color": meta.color } as React.CSSProperties}>
                <div className="forum-card__top">
                  <div className="forum-card__meta">
                    <span className="forum-card__name">{post.display_name}</span>
                    <span className="forum-card__time">{timeAgo(post.created_at)}</span>
                  </div>
                  <div className="forum-card__badges">
                    <span className="forum-card__badge">{meta.badge}</span>
                    {post.status === "answered" && (
                      <span className="forum-card__badge forum-card__badge--answered">Answered</span>
                    )}
                  </div>
                </div>

                <p className="forum-card__text">{post.request_text}</p>

                {post.admin_reply && (
                  <div className="forum-card__admin-reply">
                    <p className="forum-card__admin-reply-label">Admin ✓</p>
                    <p className="forum-card__admin-reply-text">{post.admin_reply}</p>
                  </div>
                )}

                <div className="forum-card__actions">
                  <button
                    type="button"
                    onClick={() => userEmail ? void handlePray(post.id) : undefined}
                    disabled={prayingId === post.id || !userEmail}
                    className="forum-card__pray-btn"
                    title={userEmail ? undefined : "Sign in to pray"}
                  >
                    🙏 {post.amen_count > 0 ? post.amen_count : ""} Amen
                  </button>
                  {isOwn && post.status === "open" && (
                    <button
                      type="button"
                      onClick={() => void handleMarkAnswered(post.id)}
                      className="forum-card__answered-btn"
                    >
                      Mark answered
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
