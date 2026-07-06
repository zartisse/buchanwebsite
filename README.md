# John Buchan Homes — Dynamic Website

React + Vite + TypeScript marketing site with a Supabase-backed CMS.

## Structure

- **Front office** — public site at `/` (14 pages)
- **Back office** — authenticated admin at `/admin/*`

## Quick Start

```bash
cd "dynamic website"
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) for the public site.

Without Supabase credentials, the app runs in **demo mode** with seeded sample data.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key into `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the schema migrations in the Supabase SQL editor:
   - [`supabase/migrations/001_schema.sql`](supabase/migrations/001_schema.sql)
   - [`supabase/migrations/002_site_pages.sql`](supabase/migrations/002_site_pages.sql)
4. Optionally seed sample content:
   - [`supabase/seed.sql`](supabase/seed.sql)
   - [`supabase/seed_site_pages.sql`](supabase/seed_site_pages.sql)
   - [`supabase/seed_new_pages.sql`](supabase/seed_new_pages.sql) (FAQ, Warranty, Awards)
5. Create an admin user (SQL — if the Auth dashboard is unavailable):
   - Open [`supabase/seed_admin.sql`](supabase/seed_admin.sql), set `admin_email` and `admin_password`, then run it in the SQL editor
   - Or use **Authentication → Users → Add user** in the Supabase dashboard
6. Sign in at `/admin/login`

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/about`, `/services`, `/build`, `/design`, `/remodel` | Company & services |
| `/process`, `/neighborhoods`, `/testimonials` | Process & social proof |
| `/portfolio`, `/portfolio/:slug` | Portfolio (dynamic) |
| `/blog`, `/blog/:slug` | Blog (dynamic) |
| `/contact` | Contact form |
| `/faq` | Frequently asked questions |
| `/warranty` | Warranty & aftercare |
| `/awards` | Awards, press & credentials |
| `/admin` | Dashboard |
| `/admin/posts` | Blog CRUD |
| `/admin/properties` | Portfolio CRUD |
| `/admin/pages` | Marketing pages CRUD |
| `/admin/pages/:slug` | Edit individual page |
| `/admin/submissions` | Inquiry inbox |

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Tech Stack

- Vite + React 18 + TypeScript
- React Router v7
- Supabase (Auth, PostgreSQL, Storage)
- CSS Modules + design tokens
- react-helmet-async for SEO
