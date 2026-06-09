# Deployment guide

Deploy the web app and API to **Cloudflare Workers** (via [Alchemy](https://alchemy.run)) with **Supabase Postgres** and **GitHub Actions** for production + PR previews.

## Architecture

| Component | Where it runs |
|-----------|----------------|
| Web (`apps/web`) | Cloudflare Worker (TanStack Start SSR) |
| API (`apps/server`) | Cloudflare Worker (Hono + oRPC + Better Auth) |
| Database | Supabase Postgres (external) |
| Mobile (`apps/native`) | Expo — not deployed to Cloudflare |

## One-time setup

### 1. Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. **Project Settings → Database → Connection string**
3. Copy the **Transaction pooler** URI (port `6543`).
4. Save it as `DATABASE_URL`.

**Recommended:** Create a second Supabase project for PR previews and save its pooler URI as `DATABASE_URL_STAGING`.

Apply schema locally once:

```bash
cp apps/server/.env.example apps/server/.env
# Edit DATABASE_URL in apps/server/.env

bun run db:migrate
```

### 2. Cloudflare

1. Sign in at [dash.cloudflare.com](https://dash.cloudflare.com).
2. Copy your **Account ID** (Workers & Pages sidebar).
3. Create an **API token** with Workers edit permissions ([Alchemy Cloudflare auth guide](https://alchemy.run/guides/cloudflare-auth/)).
4. Note your **workers.dev subdomain** (e.g. `your-account.workers.dev`). Use **`.your-account.workers.dev`** (leading dot) for `WORKERS_DEV_SUBDOMAIN`.

### 3. Generate secrets

```bash
openssl rand -base64 32   # ALCHEMY_PASSWORD
openssl rand -base64 32   # BETTER_AUTH_SECRET
```

### 4. Local infra env

```bash
cp packages/infra/.env.example packages/infra/.env
```

Fill in:

- `ALCHEMY_PASSWORD`
- `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_EMAIL`
- `DATABASE_URL`, `BETTER_AUTH_SECRET`
- `WORKERS_DEV_SUBDOMAIN` (e.g. `.your-account.workers.dev`)

Local dev URLs (leave as-is for `bun run dev`):

```env
CORS_ORIGIN=http://localhost:3001
BETTER_AUTH_URL=http://localhost:3000
```

### 5. Bootstrap Alchemy remote state (required before CI)

GitHub Actions needs `CloudflareStateStore`. Run a **local** deploy once:

```bash
cd packages/infra
bun run deploy --stage prod
```

This creates the `alchemy-state-service` Worker. Copy the **`ALCHEMY_STATE_TOKEN`** it prints (or find it in the Alchemy output / Cloudflare dashboard) into GitHub secrets.

### 6. GitHub repository secrets

**Settings → Secrets and variables → Actions:**

| Secret | Required | Notes |
|--------|----------|-------|
| `CLOUDFLARE_API_TOKEN` | Yes | Workers deploy |
| `CLOUDFLARE_ACCOUNT_ID` | Yes | |
| `CLOUDFLARE_EMAIL` | Yes | If your token type needs it |
| `ALCHEMY_PASSWORD` | Yes | Same value as local `packages/infra/.env` |
| `ALCHEMY_STATE_TOKEN` | Yes | From bootstrap deploy (step 5) |
| `DATABASE_URL` | Yes | Supabase prod pooler URI |
| `BETTER_AUTH_SECRET` | Yes | |
| `WORKERS_DEV_SUBDOMAIN` | Yes | e.g. `.your-account.workers.dev` |
| `DATABASE_URL_STAGING` | Recommended | Separate Supabase for PR previews |
| `CORS_ORIGIN` | Optional | Local default; prod uses workers.dev suffix matching |

After the first deploy, note the printed URLs:

```
Web    -> https://...
Server -> https://...
```

## CI/CD behavior

| Event | Stage | Action |
|-------|-------|--------|
| Push to `main` | `prod` | Migrate DB → deploy Workers |
| Open/update PR | `pr-{number}` | Migrate staging DB → deploy preview Workers → comment on PR |
| Close PR | `pr-{number}` | Destroy preview Workers |

Workflows:

- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — deploy + preview cleanup
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — typecheck + Biome on PRs

## Manual deploy

```bash
# Production
bun run deploy --stage prod

# Preview (same as CI)
cd packages/infra && bun run deploy --stage pr-42
```

## Environment matrix

| Stage | Database | Mock feed |
|-------|----------|-----------|
| `prod` | `DATABASE_URL` | Off (Alchemy bindings) |
| `pr-N` | `DATABASE_URL_STAGING` or `DATABASE_URL` | Off |
| Local | `.env` files | On by default in `.env.example` |

## Verification

After `prod` deploy:

1. Web Worker URL → `/feed` loads
2. `/login` → register → session persists (needs `WORKERS_DEV_SUBDOMAIN` set correctly)
3. Server Worker `/` → `OK`
4. Open a test PR → preview comment with URLs; close PR → preview destroyed

## Troubleshooting

### `DATABASE_URL is required` during deploy

Set `DATABASE_URL` in `packages/infra/.env` or pass it in the environment.

### `ALCHEMY_STATE_TOKEN` missing

Run the bootstrap deploy locally (step 5) before enabling GitHub Actions.

### Login works locally but not on workers.dev

- Set `WORKERS_DEV_SUBDOMAIN` to `.your-account.workers.dev` (leading dot).
- Web and API must be on the same workers.dev account subdomain.

### CORS errors

- Ensure `WORKERS_DEV_SUBDOMAIN` matches your Cloudflare account.
- For local dev, `CORS_ORIGIN` must be `http://localhost:3001`.

### PR previews mutate production data

Add `DATABASE_URL_STAGING` pointing at a separate Supabase project.

### `db:migrate` fails in CI

- Confirm `DATABASE_URL` secret uses the **pooler** URI (port 6543).
- Ensure the Supabase project is not paused.

## What you need to provide

This repo cannot create cloud resources for you. Before CI will succeed, you must supply:

1. Supabase `DATABASE_URL` (+ optional staging)
2. Cloudflare API token + account ID
3. `ALCHEMY_PASSWORD` and `BETTER_AUTH_SECRET`
4. `WORKERS_DEV_SUBDOMAIN` from your Cloudflare account
5. One local bootstrap deploy to obtain `ALCHEMY_STATE_TOKEN`
