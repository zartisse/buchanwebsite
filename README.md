# John Buchan Homes — Dynamic Website

React + Vite + TypeScript marketing site with a Supabase-backed CMS.

## Structure

- **Front office** — public site at `/`
- **Back office** — authenticated admin at `/admin/*`

## Quick Start (local)

```bash
cd "dynamic website"
npm install
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Without Supabase credentials, the app runs in **demo mode** with seeded sample data.

## Supabase Setup (required for admin CMS)

### 1. Create project & env vars

1. Create a project at [supabase.com](https://supabase.com)
2. Copy project URL and anon key into `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Run migrations (SQL Editor)

Run in order in **Supabase → SQL Editor**:

| File | Purpose |
|------|---------|
| [`supabase/migrations/001_schema.sql`](supabase/migrations/001_schema.sql) | Core tables, RLS, media bucket |
| [`supabase/migrations/002_site_pages.sql`](supabase/migrations/002_site_pages.sql) | Marketing pages CMS |
| [`supabase/apply_cms_migrations.sql`](supabase/apply_cms_migrations.sql) | Hub pages, Coming Soon, featured posts, portfolio type (003–006) |

If you already applied 001–002, run only `apply_cms_migrations.sql`.

### 3. Seed content (optional)

| File | Purpose |
|------|---------|
| [`supabase/seed.sql`](supabase/seed.sql) | Sample properties & blog posts |
| [`supabase/seed_site_pages.sql`](supabase/seed_site_pages.sql) | Marketing page content |
| [`supabase/seed_hub_pages.sql`](supabase/seed_hub_pages.sql) | All 17 hub/IA pages |
| [`supabase/seed_new_pages.sql`](supabase/seed_new_pages.sql) | FAQ, Warranty, Awards |

Regenerate hub seed after IA changes: `npx tsx scripts/generate-hub-seed.ts`

### 4. Create admin user

- Open [`supabase/seed_admin.sql`](supabase/seed_admin.sql), set `admin_email` and `admin_password`, run in SQL Editor  
- Or use **Authentication → Users → Add user** in the Supabase dashboard  
- Ensure the user's `profiles.role` is `admin`

### 5. Bootstrap (recommended)

```bash
npx tsx scripts/bootstrap-cms.ts
```

This signs in as admin, seeds all 17 hub pages into `site_pages`, and verifies connectivity. Hub pages use the existing `site_pages` table (same schema; no separate `hub_pages` migration required).

Optional in `.env.local`:
- `SUPABASE_ADMIN_EMAIL` / `SUPABASE_ADMIN_PASSWORD` — defaults to `admin@buchan.com`
- `SUPABASE_DB_PASSWORD` — auto-applies SQL migrations if set (from Supabase → Settings → Database)

### 6. Verify

```bash
npx tsx scripts/verify-supabase.ts
```

Sign in at `/admin/login`.

## Deployment

### GitHub Pages (auto-deploy from `main`)

1. In GitHub repo **Settings → Secrets and variables → Actions**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. **Settings → Pages → Build and deployment → Source:** GitHub Actions
3. Push to `main` — workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys to  
   `https://zartisse.github.io/buchanwebsite/`

Local dev uses `/` base path (`npm run dev`). Production build uses `/buchanwebsite/`.

### Vercel or Netlify

Both platforms work with this Vite SPA.

### Vercel

1. Import [github.com/zartisse/buchanwebsite](https://github.com/zartisse/buchanwebsite)
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables (Production + Preview):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy — [`vercel.json`](vercel.json) handles client-side routing

### Netlify

1. Connect the GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Same env vars as above
5. [`public/_redirects`](public/_redirects) handles legacy URL redirects + SPA fallback

After deploy, confirm `/admin/login` loads and saves persist (check Supabase tables).

## Admin — what you can edit

| Area | Path |
|------|------|
| Homepage (all sections) | `/admin/pages/home` |
| Hub pages (17 IA routes) | `/admin/hub-pages` |
| Properties + Featured Work | `/admin/properties` |
| Blog posts | `/admin/posts` |
| About, Services, Process, Awards, etc. | `/admin/pages` |
| Contact submissions | `/admin/submissions` |

**Featured Work on homepage** comes from Properties marked **Featured** (with featured order), not from the home page editor.

## Scripts

```bash
npm run dev                              # Development server
npm run build                            # Production build
npm run preview                          # Preview production build
npx tsx scripts/bootstrap-cms.ts           # Seed hub pages + verify (recommended)
npx tsx scripts/verify-supabase.ts       # Check DB tables & storage
npx tsx scripts/generate-hub-seed.ts     # Regenerate hub_pages seed SQL
```

## Tech Stack

- Vite + React 19 + TypeScript
- React Router v7
- Supabase (Auth, PostgreSQL, Storage)
- CSS Modules + design tokens
- react-helmet-async for SEO
