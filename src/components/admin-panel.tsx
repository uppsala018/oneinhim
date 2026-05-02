"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const ADMIN_EMAIL = "mosegaard622@gmail.com";

type Tab = "overview" | "members" | "forum";

type Profile = {
  id: string;
  email: string;
  created_at: string;
  last_seen_at: string;
  restriction?: Restriction | null;
};

type Restriction = {
  id: string;
  user_id: string;
  email: string;
  status: "warned" | "restricted" | "blocked";
  reason: string | null;
};

type AdminPost = {
  id: string;
  created_at: string;
  display_name: string;
  request_text: string;
  category: string;
  amen_count: number;
  user_id: string | null;
  status: string;
  admin_reply: string | null;
  admin_reply_at: string | null;
  is_deleted: boolean;
  user_email?: string;
};

type Stats = {
  totalMembers: number;
  totalPosts: number;
  postsToday: number;
};

function timeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    warned:     "color:#e5c57a;border-color:rgba(229,197,122,0.4)",
    restricted: "color:#e6a97a;border-color:rgba(230,169,122,0.4)",
    blocked:    "color:#e6a5a5;border-color:rgba(230,165,165,0.4)",
  };
  return (
    <span style={{
      border: "1px solid",
      borderRadius: 999,
      padding: "0.15rem 0.55rem",
      fontSize: "0.72rem",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      ...Object.fromEntries((colors[status] ?? "color:#9fb0cb;border-color:rgba(159,176,203,0.3)")
        .split(";").map(s => s.split(":").map(x => x.trim()) as [string, string])),
    }}>
      {status}
    </span>
  );
}

export default function AdminPanel({ userEmail }: { userEmail: string }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [members, setMembers] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(false);

  const [restrictTarget, setRestrictTarget] = useState<Profile | null>(null);
  const [restrictStatus, setRestrictStatus] = useState<"warned" | "restricted" | "blocked">("warned");
  const [restrictReason, setRestrictReason] = useState("");
  const [restrictPending, setRestrictPending] = useState(false);

  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyPending, setReplyPending] = useState(false);

  const loadOverview = useCallback(async () => {
    const sb = createSupabaseBrowserClient();
    if (!sb) return;
    setLoading(true);
    const [membersRes, postsRes, todayRes] = await Promise.all([
      sb.from("profiles").select("id", { count: "exact", head: true }),
      sb.from("prayer_requests").select("id", { count: "exact", head: true }).eq("is_deleted", false),
      sb.from("prayer_requests")
        .select("id", { count: "exact", head: true })
        .eq("is_deleted", false)
        .gte("created_at", new Date(Date.now() - 86400000).toISOString()),
    ]);
    setStats({
      totalMembers: membersRes.count ?? 0,
      totalPosts:   postsRes.count ?? 0,
      postsToday:   todayRes.count ?? 0,
    });
    setLoading(false);
  }, []);

  const loadMembers = useCallback(async () => {
    const sb = createSupabaseBrowserClient();
    if (!sb) return;
    setLoading(true);
    const [profilesRes, restrictionsRes] = await Promise.all([
      sb.from("profiles").select("id, email, created_at, last_seen_at").order("created_at", { ascending: false }),
      sb.from("user_restrictions").select("id, user_id, email, status, reason"),
    ]);
    const restrictMap = new Map((restrictionsRes.data ?? []).map((r) => [r.user_id, r as Restriction]));
    setMembers(
      (profilesRes.data ?? []).map((p) => ({
        ...p,
        restriction: restrictMap.get(p.id) ?? null,
      })) as Profile[],
    );
    setLoading(false);
  }, []);

  const loadForum = useCallback(async () => {
    const sb = createSupabaseBrowserClient();
    if (!sb) return;
    setLoading(true);
    const { data } = await sb
      .from("prayer_requests")
      .select("id, created_at, display_name, request_text, category, amen_count, user_id, status, admin_reply, admin_reply_at, is_deleted")
      .order("created_at", { ascending: false })
      .limit(80);

    if (!data) { setLoading(false); return; }

    // attach emails from profiles
    const userIds = [...new Set(data.map((p) => p.user_id).filter(Boolean))] as string[];
    const { data: profileData } = userIds.length
      ? await sb.from("profiles").select("id, email").in("id", userIds)
      : { data: [] };
    const emailMap = new Map((profileData ?? []).map((p) => [p.id, p.email as string]));

    setPosts(data.map((p) => ({ ...p, user_email: emailMap.get(p.user_id ?? "") ?? "—" })) as AdminPost[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (tab === "overview") void loadOverview();
    if (tab === "members")  void loadMembers();
    if (tab === "forum")    void loadForum();
  }, [tab, loadOverview, loadMembers, loadForum]);

  async function handleRestrict() {
    const sb = createSupabaseBrowserClient();
    if (!sb || !restrictTarget) return;
    setRestrictPending(true);
    // remove old restriction first
    await sb.from("user_restrictions").delete().eq("user_id", restrictTarget.id);
    if (restrictStatus !== "blocked" || restrictReason) {
      await sb.from("user_restrictions").insert({
        user_id: restrictTarget.id,
        email: restrictTarget.email,
        status: restrictStatus,
        reason: restrictReason.trim() || null,
      });
    }
    setRestrictPending(false);
    setRestrictTarget(null);
    setRestrictReason("");
    void loadMembers();
  }

  async function handleClearRestriction(userId: string) {
    const sb = createSupabaseBrowserClient();
    if (!sb) return;
    await sb.from("user_restrictions").delete().eq("user_id", userId);
    void loadMembers();
  }

  async function handleAdminReply(postId: string) {
    const sb = createSupabaseBrowserClient();
    if (!sb || !replyText.trim()) return;
    setReplyPending(true);
    await sb.from("prayer_requests")
      .update({ admin_reply: replyText.trim(), admin_reply_at: new Date().toISOString() })
      .eq("id", postId);
    setReplyPending(false);
    setReplyTarget(null);
    setReplyText("");
    void loadForum();
  }

  async function handleDeletePost(postId: string) {
    const sb = createSupabaseBrowserClient();
    if (!sb) return;
    await sb.from("prayer_requests").update({ is_deleted: true }).eq("id", postId);
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, is_deleted: true } : p));
  }

  async function handleRestorePost(postId: string) {
    const sb = createSupabaseBrowserClient();
    if (!sb) return;
    await sb.from("prayer_requests").update({ is_deleted: false }).eq("id", postId);
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, is_deleted: false } : p));
  }

  if (userEmail !== ADMIN_EMAIL) return null;

  const panelBg   = "rgba(7,25,54,0.82)";
  const border    = "1px solid rgba(229,197,122,0.22)";
  const gold      = "var(--color-highlight)";
  const muted     = "var(--color-muted)";
  const soft      = "var(--color-soft)";
  const inkColor  = "var(--color-ink)";

  const tabStyle = (active: boolean): React.CSSProperties => ({
    border: "1px solid",
    borderColor: active ? gold : "rgba(229,197,122,0.2)",
    borderRadius: 999,
    background: active ? "rgba(229,197,122,0.12)" : "transparent",
    padding: "0.4rem 1rem",
    color: active ? gold : soft,
    fontSize: "0.82rem",
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
  });

  const btnStyle = (variant: "primary" | "ghost" | "danger"): React.CSSProperties => ({
    border: "1px solid",
    borderColor: variant === "danger" ? "rgba(230,165,165,0.4)"
               : variant === "primary" ? gold
               : "rgba(229,197,122,0.25)",
    borderRadius: 999,
    background: variant === "primary" ? "rgba(229,197,122,0.12)" : "transparent",
    padding: "0.3rem 0.8rem",
    color: variant === "danger" ? "#e6a5a5" : variant === "primary" ? gold : muted,
    fontSize: "0.78rem",
    cursor: "pointer",
  });

  return (
    <section style={{ border, borderRadius: "1.6rem", background: panelBg, padding: "1.4rem" }}>
      <p style={{ margin: 0, color: gold, fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Admin Panel</p>
      <p style={{ margin: "0.2rem 0 1rem", color: muted, fontSize: "0.82rem" }}>Signed in as {userEmail}</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.2rem", flexWrap: "wrap" }}>
        {(["overview", "members", "forum"] as Tab[]).map((t) => (
          <button key={t} type="button" style={tabStyle(tab === t)} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <button type="button" style={{ ...tabStyle(false), marginLeft: "auto" }}
          onClick={() => { if (tab === "overview") void loadOverview(); if (tab === "members") void loadMembers(); if (tab === "forum") void loadForum(); }}>
          ↻ Refresh
        </button>
      </div>

      {loading && <p style={{ color: soft, fontSize: "0.88rem" }}>Loading…</p>}

      {/* ── Overview ── */}
      {tab === "overview" && stats && (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.6rem" }}>
            {[
              { label: "Members",     value: stats.totalMembers },
              { label: "Total Posts", value: stats.totalPosts },
              { label: "Posts Today", value: stats.postsToday },
            ].map((s) => (
              <div key={s.label} style={{ border, borderRadius: "1.1rem", background: "rgba(4,17,38,0.5)", padding: "0.9rem", textAlign: "center" }}>
                <p style={{ margin: 0, color: gold, fontFamily: "var(--font-display),serif", fontSize: "clamp(1.6rem,6vw,2.2rem)", fontWeight: 600 }}>{s.value}</p>
                <p style={{ margin: "0.25rem 0 0", color: soft, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div style={{ border, borderRadius: "1.1rem", background: "rgba(4,17,38,0.5)", padding: "1rem" }}>
            <p style={{ margin: "0 0 0.5rem", color: gold, fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>External</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <a href="https://play.google.com/console" target="_blank" rel="noopener noreferrer" style={{ ...btnStyle("ghost"), textDecoration: "none" }}>
                Google Play Console ↗
              </a>
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" style={{ ...btnStyle("ghost"), textDecoration: "none" }}>
                Vercel Dashboard ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Members ── */}
      {tab === "members" && !loading && (
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {members.length === 0 && <p style={{ color: muted, fontSize: "0.88rem" }}>No members yet.</p>}
          {members.map((m) => (
            <div key={m.id} style={{ border, borderRadius: "1.1rem", background: "rgba(4,17,38,0.5)", padding: "0.85rem 1rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
                <div>
                  <p style={{ margin: 0, color: inkColor, fontSize: "0.88rem", fontWeight: 600 }}>{m.email}</p>
                  <p style={{ margin: "0.2rem 0 0", color: soft, fontSize: "0.72rem" }}>
                    Joined {timeAgo(m.created_at)} · Last seen {timeAgo(m.last_seen_at)}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }}>
                  {m.restriction && <StatusBadge status={m.restriction.status} />}
                  {m.restriction
                    ? <button type="button" style={btnStyle("ghost")} onClick={() => void handleClearRestriction(m.id)}>Clear</button>
                    : <button type="button" style={btnStyle("primary")} onClick={() => { setRestrictTarget(m); setRestrictStatus("warned"); setRestrictReason(""); }}>Action</button>
                  }
                </div>
              </div>
              {m.restriction?.reason && (
                <p style={{ margin: "0.4rem 0 0", color: soft, fontSize: "0.78rem", fontStyle: "italic" }}>Reason: {m.restriction.reason}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Forum ── */}
      {tab === "forum" && !loading && (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          {posts.length === 0 && <p style={{ color: muted, fontSize: "0.88rem" }}>No posts yet.</p>}
          {posts.map((p) => (
            <div key={p.id} style={{ border, borderRadius: "1.1rem", background: p.is_deleted ? "rgba(100,0,0,0.12)" : "rgba(4,17,38,0.5)", padding: "0.85rem 1rem", opacity: p.is_deleted ? 0.6 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                <div>
                  <span style={{ color: gold, fontSize: "0.82rem", fontWeight: 600 }}>{p.display_name}</span>
                  <span style={{ color: soft, fontSize: "0.72rem", marginLeft: "0.5rem" }}>{p.user_email}</span>
                  <span style={{ color: soft, fontSize: "0.72rem", marginLeft: "0.5rem" }}>{timeAgo(p.created_at)}</span>
                </div>
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                  <span style={{ border: "1px solid rgba(229,197,122,0.25)", borderRadius: 999, padding: "0.12rem 0.5rem", color: gold, fontSize: "0.68rem", textTransform: "uppercase" }}>{p.category}</span>
                  {p.is_deleted
                    ? <button type="button" style={btnStyle("ghost")} onClick={() => void handleRestorePost(p.id)}>Restore</button>
                    : <button type="button" style={btnStyle("danger")} onClick={() => void handleDeletePost(p.id)}>Delete</button>
                  }
                </div>
              </div>
              <p style={{ margin: "0 0 0.6rem", color: inkColor, fontSize: "0.9rem", lineHeight: 1.5 }}>{p.request_text}</p>

              {p.admin_reply && (
                <div style={{ border: "1px solid rgba(229,197,122,0.28)", borderRadius: "0.8rem", background: "rgba(229,197,122,0.07)", padding: "0.6rem 0.85rem", marginBottom: "0.5rem" }}>
                  <p style={{ margin: "0 0 0.2rem", color: gold, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin reply</p>
                  <p style={{ margin: 0, color: inkColor, fontSize: "0.87rem", lineHeight: 1.45 }}>{p.admin_reply}</p>
                </div>
              )}

              {replyTarget === p.id ? (
                <div style={{ display: "grid", gap: "0.4rem" }}>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder="Write your admin reply…"
                    style={{ width: "100%", border: "1px solid rgba(229,197,122,0.25)", borderRadius: "0.75rem", background: "rgba(4,17,38,0.7)", padding: "0.6rem 0.8rem", color: inkColor, fontSize: "0.88rem", outline: "none", resize: "vertical", fontFamily: "inherit" }}
                  />
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button type="button" style={btnStyle("primary")} disabled={replyPending || !replyText.trim()} onClick={() => void handleAdminReply(p.id)}>
                      {replyPending ? "Saving…" : "Post reply"}
                    </button>
                    <button type="button" style={btnStyle("ghost")} onClick={() => { setReplyTarget(null); setReplyText(""); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button type="button" style={btnStyle("ghost")} onClick={() => { setReplyTarget(p.id); setReplyText(p.admin_reply ?? ""); }}>
                  {p.admin_reply ? "Edit reply" : "Reply as Admin"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Restrict modal ── */}
      {restrictTarget && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,17,38,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          <div style={{ width: "100%", maxWidth: "28rem", border: "1.5px solid rgba(229,197,122,0.35)", borderRadius: "1.6rem", background: "#06172e", padding: "1.5rem", display: "grid", gap: "0.85rem" }}>
            <p style={{ margin: 0, color: gold, fontFamily: "var(--font-display),serif", fontSize: "1.4rem", fontWeight: 600 }}>Moderate user</p>
            <p style={{ margin: 0, color: inkColor, fontSize: "0.88rem" }}>{restrictTarget.email}</p>

            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {(["warned", "restricted", "blocked"] as const).map((s) => (
                <button key={s} type="button" style={tabStyle(restrictStatus === s)} onClick={() => setRestrictStatus(s)}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ fontSize: "0.8rem", color: soft, lineHeight: 1.45 }}>
              {restrictStatus === "warned"     && "User sees a warning banner in the forum. Can still post."}
              {restrictStatus === "restricted" && "User cannot post or reply. Can still study the app."}
              {restrictStatus === "blocked"    && "User sees a suspension message and cannot access the forum."}
            </div>

            <textarea
              value={restrictReason}
              onChange={(e) => setRestrictReason(e.target.value)}
              rows={2}
              placeholder="Reason (shown to user)…"
              style={{ border: "1px solid rgba(229,197,122,0.25)", borderRadius: "0.75rem", background: "rgba(4,17,38,0.7)", padding: "0.6rem 0.8rem", color: inkColor, fontSize: "0.88rem", outline: "none", resize: "vertical", fontFamily: "inherit" }}
            />

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" style={btnStyle("primary")} disabled={restrictPending} onClick={() => void handleRestrict()}>
                {restrictPending ? "Saving…" : "Apply"}
              </button>
              <button type="button" style={btnStyle("ghost")} onClick={() => setRestrictTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
