# Build Plan

## Why PWA First

This project started with strong visual concepts but no surviving source code. A PWA-first architecture is the safest path because it allows:

- immediate browser-based testing and sharing
- Vercel deployment with minimal operational overhead
- a single UI codebase for desktop, mobile web, and later store packaging
- later Android and iOS wrapping through Capacitor without rebuilding the product

## MVP Scope

The first implementation milestone should focus on the study engine instead of trying to ship the entire long-term vision at once.

### First Build

- KJV reader with chapter navigation
- Strong's word-study interaction
- Catholic study section using free texts
- Church Fathers and history landing sections
- Search, bookmarks, and notes

### Later Build

- Orthodox library expansion
- Saints and devotions
- Moderated prayer request community
- Offline-first reading cache

## Content Strategy

Core scripture and study resources should live in a controlled content layer, not only behind third-party APIs.

### Candidate Content Sources

- KJV
- public-domain Strong's data
- Douay-Rheims
- WEB Catholic
- Roman Catechism
- Baltimore Catechism
- Ante-Nicene, Nicene, and Post-Nicene Fathers
- Catholic Encyclopedia and other public-domain historical texts

## Suggested Data Model

The content layer should treat each major resource as structured content with predictable identifiers.

### Core Entities

- `works`: bible, catechism, fathers, councils, history guides
- `books`: scripture books or larger document containers
- `chapters`
- `sections`
- `verses`
- `lexicon_entries`
- `cross_references`
- `user_notes`
- `bookmarks`

## Platform Plan

### Web

- Deploy to Vercel
- Use the current Next.js app as the primary UI

### Backend

- Use Supabase for auth, notes, bookmarks, and synced reading progress
- Store curated text content in database tables or versioned content files

### Mobile Packaging

- Add Capacitor after the main reading flows are stable
- Produce Android builds first
- Handle iOS packaging after PWA behavior, navigation, and auth are proven

## Risks To Manage

- source-license ambiguity if content is scraped from read-only sites
- oversized content ingestion if the first import pipeline is not structured
- moderation overhead if community features launch too early
- accessibility regression if mockup visuals are copied too literally instead of rebuilt in code
