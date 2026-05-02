create extension if not exists pgcrypto;

create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  display_name text not null,
  request_text text not null,
  category text not null default 'prayer' check (category in ('prayer', 'praise', 'question')),
  amen_count integer not null default 0,
  status text not null default 'open' check (status in ('open', 'answered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Migration: add category column if upgrading from the earlier schema
alter table public.prayer_requests
  add column if not exists category text not null default 'prayer'
  check (category in ('prayer', 'praise', 'question'));

create index if not exists prayer_requests_created_at_idx
  on public.prayer_requests (created_at desc);

create index if not exists prayer_requests_category_idx
  on public.prayer_requests (category);

alter table public.prayer_requests enable row level security;

drop policy if exists "Prayer requests are visible to everyone" on public.prayer_requests;
create policy "Prayer requests are visible to everyone"
  on public.prayer_requests
  for select
  using (true);

drop policy if exists "Authenticated users can create prayer requests" on public.prayer_requests;
create policy "Authenticated users can create prayer requests"
  on public.prayer_requests
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authors can update their own prayer requests" on public.prayer_requests;
create policy "Authors can update their own prayer requests"
  on public.prayer_requests
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Authors can delete their own prayer requests" on public.prayer_requests;
create policy "Authors can delete their own prayer requests"
  on public.prayer_requests
  for delete
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.increment_prayer_count(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.prayer_requests
  set amen_count = amen_count + 1,
      updated_at = now()
  where id = target_id;
end;
$$;

revoke all on function public.increment_prayer_count(uuid) from public;
grant execute on function public.increment_prayer_count(uuid) to authenticated;
