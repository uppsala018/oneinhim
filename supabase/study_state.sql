create table if not exists public.study_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  bookmarks jsonb not null default '[]'::jsonb,
  notes jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.study_state enable row level security;

create policy "Users manage their own study state"
on public.study_state
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
