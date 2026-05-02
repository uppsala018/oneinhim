# Supabase Setup

## Environment Variables

Create a local `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database

Run the SQL in `supabase/study_state.sql`.

This creates a `study_state` table used to sync:

- bookmarks
- notes
- future reading progress

## Current Behavior

- Without Supabase env vars, the app stores notes and bookmarks in browser local storage.
- With Supabase env vars and an authenticated user, the app will upsert study state into `public.study_state`.

## Next Backend Step

Add authentication UI and load the remote state on sign-in so browser-only study data can merge into the user account.
