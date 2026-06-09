# Life Log (personalWebsite)

A personal app for logging your life in one place: photos, workouts, books, and blog posts in a single feed. Right now it is a **starter project** with web, mobile, and API shells wired together. You are not expected to know this stack already — this README explains what everything is and what to do first.

Built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack).

---

## What you have (big picture)

This repo is a **monorepo**: one git project containing three apps and several shared packages.

```text
┌─────────────┐     ┌─────────────┐
│  Web app    │     │ Mobile app  │
│  (browser)  │     │ (Expo)      │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 │  HTTP / API calls
                 ▼
         ┌───────────────┐
         │  API server   │  ← Hono on Cloudflare Workers (local dev too)
         │  + Auth       │
         └───────┬───────┘
                 │
                 ▼
         ┌───────────────┐
         │  PostgreSQL   │  ← Supabase (hosted Postgres)
         └───────────────┘
```

- **Web** (`apps/web`) — The site you open in Chrome/Safari. Built with TanStack Start (React + server rendering).
- **Mobile** (`apps/native`) — The iPhone/Android app. Built with Expo (React Native).
- **Server** (`apps/server`) — The backend API. Handles login, database reads/writes, and business logic.
- **Database** — Supabase Postgres. Stores users, sessions, and (later) posts, activities, books, etc.

Web and mobile **do not talk to the database directly**. They talk to the server, which talks to the database. That is normal and good.

---

## Glossary (technologies in plain English)

| Term | What it is | Why it is here |
|------|------------|----------------|
| **TypeScript** | JavaScript with types | Catches mistakes before you run the app |
| **Bun** | Fast JS runtime + package manager | Runs scripts and installs dependencies (`bun install`) |
| **Turborepo** | Monorepo task runner | One `bun run dev` can start web + server + native |
| **TanStack Start** | Full-stack React web framework | Your website (routes, pages, SSR) |
| **Expo** | React Native toolkit | Build the phone app without Xcode/Android Studio at first |
| **Hono** | Small web server framework | Powers the API |
| **oRPC** | Type-safe API layer | Web/mobile call server functions with shared types |
| **Drizzle** | Database ORM | TypeScript-friendly way to read/write Postgres tables |
| **Better Auth** | Authentication library | Sign up, sign in, sessions (web + mobile) |
| **Supabase** | Hosted Postgres (+ extras) | Your database in the cloud; free tier is fine for solo use |
| **Cloudflare Workers** | Serverless edge runtime | Where the API deploys in production |
| **Alchemy** | Deploy tool for Cloudflare | `bun run deploy` uses this (see `packages/infra`) |
| **Biome** | Linter + formatter | Keeps code style consistent (`bun run check`) |
| **NativeWind / Uniwind** | Tailwind for React Native | Utility classes on mobile, similar to web CSS |

---

## Prerequisites (install once)

| Tool | Install | Check it works |
|------|---------|----------------|
| **Bun** | https://bun.sh | `bun --version` |
| **Git** | https://git-scm.com | `git --version` |
| **Supabase account** | https://supabase.com | Free tier, no card required for basic use |
| **Cloudflare account** | https://dash.cloudflare.com | For deployment later |
| **Expo Go** (optional) | App Store / Play Store | Mobile uses **Expo SDK 54** — App Store Expo Go must match (SDK 56 projects won't work on phone) |

You do **not** need Docker for day-to-day dev if you use Supabase hosted Postgres.

---

## Quick demo (mock feed — no backend)

You can preview the Instagram-style feed **without** Supabase, the API server, or signing in.

### 1. Enable mock mode

Copy the example env files (or ensure these are set):

```bash
cp apps/web/.env.example apps/web/.env
cp apps/native/.env.example apps/native/.env
```

Both should include:

```env
VITE_USE_MOCK_FEED=true          # web
VITE_USE_MOCK_AUTH=true          # web — dev login admin / admin
EXPO_PUBLIC_USE_MOCK_FEED=true   # mobile
EXPO_PUBLIC_USE_MOCK_AUTH=true   # mobile — dev login admin / admin
```

Sign in on `/login` (web) or the Home drawer screen (mobile) with **admin** / **admin** when mock auth is enabled.

### 2. Launch web only

```bash
bun run dev:web
```

Open http://localhost:3001/feed — scroll to load more mock posts (photos, runs, books, articles).

### 3. Launch mobile only

```bash
bun run dev:native
```

Open the **Feed** tab in Expo Go or the simulator. No sign-in required in mock mode.

> **iPhone:** The project targets **SDK 54** so it works with the App Store version of Expo Go. After pulling SDK changes, restart Metro (`Ctrl+C`, then `bun run dev:native`) and reload the app (shake → Reload, or press `r` in the terminal).

### Switch to the real API later

Set `VITE_USE_MOCK_FEED=false`, `VITE_USE_MOCK_AUTH=false`, `EXPO_PUBLIC_USE_MOCK_FEED=false`, and `EXPO_PUBLIC_USE_MOCK_AUTH=false`, then follow full setup below.

---

## First-time setup (step by step)

### 1. Clone and install dependencies

```bash
cd /path/to/personalWebsite
bun install
```

This downloads all packages for web, mobile, and server into `node_modules/`.

### 2. Create a Supabase database

1. Go to https://supabase.com/dashboard
2. **New project** → pick a name and password (save the password)
3. Wait for the project to finish provisioning
4. Go to **Project Settings → Database**
5. Copy the **Connection string** (URI format). It looks like:
   ```text
   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
   Use the **Transaction** pooler URI for serverless/Workers if Supabase offers a choice.

### 3. Generate an auth secret

```bash
openssl rand -base64 32
```

Copy the output — you will use it as `BETTER_AUTH_SECRET`.

### 4. Configure environment variables

Create or edit these files (they are gitignored; never commit real secrets):

**`apps/server/.env`**

```env
DATABASE_URL=postgresql://...your supabase connection string...
BETTER_AUTH_SECRET=...paste openssl output...
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001
```

**`apps/web/.env`**

```env
VITE_SERVER_URL=http://localhost:3000
```

**`apps/native/.env`**

```env
# Use your Mac's LAN IP when testing on a physical phone (not localhost)
EXPO_PUBLIC_SERVER_URL=http://localhost:3000
```

**`packages/infra/.env`** (for deploy)

Same values as server + web as needed by Alchemy (`DATABASE_URL`, `BETTER_AUTH_*`, `CORS_ORIGIN`).

| Variable | What it means |
|----------|----------------|
| `DATABASE_URL` | Postgres connection string (Supabase) |
| `BETTER_AUTH_SECRET` | Random secret to encrypt sessions — keep private |
| `BETTER_AUTH_URL` | Public URL of the **API** server (port 3000 in dev) |
| `CORS_ORIGIN` | Public URL of the **web** app (port 3001 in dev) — browser security |
| `VITE_SERVER_URL` | Web app's idea of where the API lives |
| `EXPO_PUBLIC_SERVER_URL` | Mobile app's idea of where the API lives |

### 5. Push the database schema

This creates tables (users, sessions, etc.) in Supabase:

```bash
bun run db:push
```

If it fails, double-check `DATABASE_URL` in `apps/server/.env`.

Optional — browse tables in a GUI:

```bash
bun run db:studio
```

### 6. Run the app locally

**Option A — everything at once**

```bash
bun run dev
```

**Option B — separate terminals (easier to debug)**

```bash
# Terminal 1 — API (port 3000)
bun run dev:server

# Terminal 2 — Web (port 3001)
bun run dev:web

# Terminal 3 — Mobile (Expo)
bun run dev:native
```

### 7. Open the apps

| App | URL / action |
|-----|----------------|
| **Web** | http://localhost:3001 |
| **API** | http://localhost:3000 |
| **API health** | http://localhost:3000/ (or check server logs) |
| **Mobile** | Scan QR code in terminal with **Expo Go**, or press `i` for iOS simulator |

### 8. Create your first user

1. Open http://localhost:3001
2. Go to login / sign up
3. Register with email + password
4. You should land on the dashboard if auth is wired correctly

---

## Project structure (where to edit what)

```text
personalWebsite/
├── apps/
│   ├── web/              # Website — pages, layout, web-only UI
│   │   └── src/routes/   # File-based routes (/, /login, /dashboard, ...)
│   ├── native/           # Mobile app — Expo Router screens
│   │   └── app/          # File-based routes (tabs, drawer, ...)
│   └── server/           # API entrypoint — mounts auth + oRPC
├── packages/
│   ├── api/              # API routes/procedures (add feed, posts, sync here)
│   ├── auth/             # Better Auth configuration
│   ├── db/               # Drizzle schema + migrations
│   │   └── src/schema/   # Database table definitions
│   ├── env/              # Typed environment variables per app
│   ├── infra/            # Alchemy deploy config (Cloudflare)
│   └── ui/               # Shared shadcn/ui components (web)
├── package.json          # Root scripts
├── turbo.json            # Monorepo task config
└── bts.jsonc             # Stack metadata from scaffold CLI
```

**Rule of thumb**

- New **API endpoint** → `packages/api/src/routers/`
- New **database table** → `packages/db/src/schema/` then `bun run db:push`
- New **web page** → `apps/web/src/routes/`
- New **mobile screen** → `apps/native/app/`
- **Login / sessions** → `packages/auth/` (touch carefully)

---

## How data flows (example: loading the dashboard)

1. You open `/dashboard` in the browser.
2. TanStack Start runs a server function or client code that calls the API via oRPC.
3. The request hits `apps/server` (Hono).
4. Better Auth checks your session cookie.
5. If valid, oRPC runs the procedure in `packages/api`.
6. Drizzle queries Postgres (Supabase).
7. JSON comes back to the web app and React renders it.

Mobile is the same flow, except Expo sends the session cookie manually (see `apps/native/utils/orpc.ts`).

---

## Available scripts

| Command | What it does |
|---------|----------------|
| `bun run dev` | Start web + server + native together |
| `bun run dev:web` | Web only (port 3001) |
| `bun run dev:server` | API + web via Alchemy (port 3000 API, 3001 web) |
| `bun run dev:native` | Expo dev server |
| `bun run build` | Production build for all apps |
| `bun run check-types` | TypeScript check across the monorepo |
| `bun run check` | Biome lint + format |
| `bun run db:push` | Apply schema to Supabase (quick dev) |
| `bun run db:migrate` | Run SQL migration files |
| `bun run db:generate` | Generate new migration from schema changes |
| `bun run db:studio` | Open Drizzle Studio (DB browser) |
| `bun run deploy` | Deploy web + server to Cloudflare (Alchemy) |
| `bun run destroy` | Tear down Cloudflare resources (careful) |

---

## UI customization (web)

Shared components live in `packages/ui`:

- Global styles: `packages/ui/src/styles/globals.css`
- Components: `packages/ui/src/components/*`

Add more shadcn components:

```bash
npx shadcn@latest add accordion dialog table -c packages/ui
```

Import in web app:

```tsx
import { Button } from "@personalWebsite/ui/components/button";
```

Mobile uses **Uniwind** (Tailwind-like classes) — styles live in `apps/native/global.css` and screen files.

---

## Deployment (Cloudflare)

Production deploy uses **Alchemy** (`packages/infra/alchemy.run.ts`).

```bash
# Ensure packages/infra/.env has production values
bun run deploy
```

Before deploying:

1. Supabase `DATABASE_URL` works from Cloudflare (use Supabase pooler URI)
2. Set `BETTER_AUTH_URL` to your deployed **server** URL
3. Set `CORS_ORIGIN` to your deployed **web** URL
4. Set secrets in Cloudflare (Alchemy/wrangler handles much of this)

Guide: [Deploying to Cloudflare with Alchemy](https://www.better-t-stack.dev/docs/guides/cloudflare-alchemy)

For a side project, **local dev only is fine** until you are ready to deploy.

---

## Troubleshooting

### `bun run db:push` fails

- Check `DATABASE_URL` in `apps/server/.env`
- Ensure Supabase project is running (not paused)
- Try the direct connection string vs pooler string from Supabase docs

### Web loads but login fails

- `BETTER_AUTH_URL` must point to the **server** (3000), not the web app (3001)
- `CORS_ORIGIN` must match the web URL exactly (`http://localhost:3001`)
- Restart `dev:server` after changing `.env`

### Mobile cannot reach API

- **Simulator:** `http://localhost:3000` usually works
- **Physical phone:** use your Mac's LAN IP, not `localhost`:
  ```bash
  ipconfig getifaddr en0
  ```
  Set `EXPO_PUBLIC_SERVER_URL=http://192.168.x.x:3000`
- Phone and Mac must be on the same Wi‑Fi

### Port already in use

- Server defaults to **3000**, web to **3001** (see `packages/infra/alchemy.run.ts` and `apps/web/vite.config.ts`)
- Kill the other process or change ports in those configs

### Type errors after pulling changes

```bash
bun install
bun run check-types
```

---

## What to build next (roadmap)

This starter includes auth and example routes. Planned product phases:

1. **Unified feed** — one scroll for all post types; manual text posts first
2. **Photo posts** — uploads via Cloudflare R2
3. **Blog posts** — markdown articles with public URLs
4. **Fitness sync** — Garmin or Strava → activity cards
5. **Books** — reading log + Goodreads CSV import
6. **Social** — friends/followers + per-post privacy

See `ROADMAP.md` when added, or ask in your dev notes for the detailed phase breakdown.

---

## Getting help

- **Better-T-Stack docs:** https://www.better-t-stack.dev/docs
- **Stack builder (what you picked):** https://www.better-t-stack.dev/new
- **TanStack Start:** https://tanstack.com/start
- **Expo:** https://docs.expo.dev
- **Drizzle:** https://orm.drizzle.team/docs/overview
- **Better Auth:** https://www.better-auth.com/docs

When stuck, note **which command you ran**, **the full error**, and **which app** (web / native / server). That makes debugging much faster.

---

## Quick reference card

```bash
# Day-one workflow
bun install
# fill in apps/server/.env, apps/web/.env, apps/native/.env
bun run db:push
bun run dev

# Web → http://localhost:3001
# API → http://localhost:3000
```

You are not supposed to understand the whole stack on day one. Start the dev servers, click around, break things locally, and change one file at a time.
