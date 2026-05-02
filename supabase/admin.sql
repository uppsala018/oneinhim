-- ── Profiles ────────────────────────────────────────────────
-- Auto-populated when a user signs in; gives admin a readable
-- user list without needing the service-role key.

create table if not exists public.profiles (
  id uuid references auth.users (id) on delete cascade primary key,
  email text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id OR auth.email() = 'mosegaard622@gmail.com');

drop policy if exists "Users upsert own profile" on public.profiles;
create policy "Users upsert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id OR auth.email() = 'mosegaard622@gmail.com');

-- Trigger: keep profiles in sync with auth.users
create or replace function public.handle_auth_user_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, last_seen_at)
  values (new.id, new.email, now())
  on conflict (id) do update
    set email = new.email,
        last_seen_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_auth_user_change();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute function public.handle_auth_user_change();


-- ── User restrictions ────────────────────────────────────────

create table if not exists public.user_restrictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  email text not null,
  status text not null check (status in ('warned', 'restricted', 'blocked')),
  reason text,
  created_at timestamptz not null default now()
);

alter table public.user_restrictions enable row level security;

drop policy if exists "Users read own restriction" on public.user_restrictions;
create policy "Users read own restriction"
  on public.user_restrictions for select
  to authenticated
  using (auth.uid() = user_id OR auth.email() = 'mosegaard622@gmail.com');

drop policy if exists "Admin manages restrictions" on public.user_restrictions;
create policy "Admin manages restrictions"
  on public.user_restrictions for all
  to authenticated
  using (auth.email() = 'mosegaard622@gmail.com')
  with check (auth.email() = 'mosegaard622@gmail.com');


-- ── Admin reply + soft delete on prayer_requests ────────────

alter table public.prayer_requests
  add column if not exists admin_reply text,
  add column if not exists admin_reply_at timestamptz,
  add column if not exists is_deleted boolean not null default false;

drop policy if exists "Admin can update any prayer request" on public.prayer_requests;
create policy "Admin can update any prayer request"
  on public.prayer_requests for update
  to authenticated
  using (auth.email() = 'mosegaard622@gmail.com')
  with check (auth.email() = 'mosegaard622@gmail.com');
