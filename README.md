# Logos & Legacy

Logos & Legacy is a PWA-first Bible study and church history app built from free and redistributable Christian sources. The current codebase establishes the visual system, installable app shell, and implementation direction recovered from the saved Manus concept artwork.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Vercel-friendly static-first deployment

## Current State

- Product landing shell rebuilt from the recovered design language
- Recovered mockups and artwork imported into `public/assets`
- Web app manifest and service worker registration added for installability
- Route-based library pages for scripture, Catholic study, fathers, history, and notes
- Persistence abstraction added with local-first storage and Supabase-ready sync path
- Import scripts added for growing seeded content into larger structured text datasets
- Build and lint verified locally

## Run Locally

```bash
npm install
npm run dev
```

Optional Supabase env:

```bash
copy .env.example .env.local
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

- `src/app/page.tsx`: current product shell and MVP framing
- `src/app/library/*`: dedicated study routes
- `src/app/manifest.ts`: installable app metadata
- `src/components/pwa-boot.tsx`: service worker registration
- `src/components/study-workspace.tsx`: route-aware interactive study experience
- `src/lib/content.ts`: structured content loader and search index
- `src/lib/persistence.ts`: local-first persistence plus Supabase-ready sync hook
- `public/assets/mockups`: recovered Manus screen mockups
- `public/assets/art`: recovered artwork reused in the coded interface
- `docs/build-plan.md`: content, platform, and roadmap notes
- `imports/raw`: staging area for incoming public-domain text files
- `supabase/study_state.sql`: starter schema for cloud note and bookmark sync

## Product Direction

The recommended path is:

1. Build the reader and content platform as a web app first.
2. Store redistributable Bible and study content in your own content layer or database.
3. Add Supabase for sync, notes, bookmarks, and optional account features.
4. Package the mature web app with Capacitor for Google Play and App Store submission.

## Source Rules

Only use public-domain or otherwise redistributable content inside the app bundle or database. Third-party APIs may help import or enrich data, but they should not be the licensing backbone of the product.

## Import Commands

```bash
npm run import:kjv
npm run import:catholic
```
