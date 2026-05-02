-- ─────────────────────────────────────────────────────────────────
-- One In Him — full database schema
-- Run this in Supabase SQL Editor (project: bqlajxlgupfqywcprwzb)
-- ─────────────────────────────────────────────────────────────────

-- ── 1. study_state (bookmarks & notes) ──────────────────────────
create table if not exists public.study_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  bookmarks  jsonb not null default '[]'::jsonb,
  notes      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.study_state enable row level security;

create policy "Users manage their own study state"
  on public.study_state for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── 2. prayer_requests ──────────────────────────────────────────
create table if not exists public.prayer_requests (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  display_name  text not null,
  request_text  text not null,
  category      text not null default 'prayer'
                  check (category in ('prayer', 'praise', 'question')),
  amen_count    integer not null default 0,
  user_id       uuid references auth.users(id) on delete set null,
  status        text not null default 'open'
                  check (status in ('open', 'answered')),
  admin_reply   text,
  is_deleted    boolean not null default false
);

alter table public.prayer_requests enable row level security;

-- Anyone (including anon) can read non-deleted posts
create policy "Public read non-deleted posts"
  on public.prayer_requests for select
  using (is_deleted = false);

-- Signed-in users can insert their own posts
create policy "Authenticated users can post"
  on public.prayer_requests for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own posts (e.g. mark answered)
create policy "Users update own posts"
  on public.prayer_requests for update
  to authenticated
  using (auth.uid() = user_id);


-- ── 3. user_restrictions (moderation) ───────────────────────────
create table if not exists public.user_restrictions (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  status     text not null check (status in ('warned', 'restricted', 'blocked')),
  reason     text,
  created_at timestamptz not null default now()
);

alter table public.user_restrictions enable row level security;

-- Users can read their own restriction status
create policy "Users read own restriction"
  on public.user_restrictions for select
  to authenticated
  using (auth.uid() = user_id);


-- ── 4. increment_prayer_count RPC ───────────────────────────────
-- Called as: supabase.rpc('increment_prayer_count', { target_id: id })
create or replace function public.increment_prayer_count(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.prayer_requests
  set amen_count = amen_count + 1
  where id = target_id
    and is_deleted = false;
end;
$$;
