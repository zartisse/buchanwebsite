# Deploy the live site

## Local admin (works now)

```bash
npm run dev
```

Open **http://localhost:5173/admin/login**

- Email: `admin@buchan.com`
- Password: `BuchanAdmin2026!` (change after first login)

Run once if hub pages are empty:

```bash
npm run cms:bootstrap
```

---

## Option A — GitHub Pages (recommended)

### One-time GitHub setup (~2 minutes)

1. Open **https://github.com/zartisse/buchanwebsite/settings/pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Go to **Settings → Secrets and variables → Actions → New repository secret**:
   - `VITE_SUPABASE_URL` — copy from your `.env.local`
   - `VITE_SUPABASE_ANON_KEY` — copy from your `.env.local`
4. Go to **Actions** tab → run **Deploy to GitHub Pages** (or push to `main`)

Live URL: **https://zartisse.github.io/buchanwebsite/**  
Admin: **https://zartisse.github.io/buchanwebsite/admin/login**

> If the repo is **private**, GitHub Pages may stay 404 unless you have GitHub Pro or make the repo public.

### Manual deploy (no Actions setup)

From the project folder, with `.env.local` configured:

```bash
npm run deploy:gh-pages
```

Then in GitHub **Settings → Pages → Source**, choose branch **`gh-pages`** / **`/(root)`**.

---

## Option B — Vercel or Netlify

1. Import **zartisse/buchanwebsite**
2. Build command: `npm run build:local`
3. Output directory: `dist`
4. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy — no `/buchanwebsite/` base path needed on custom domains

---

## Verify deployment

```bash
npm run cms:check-live
```

Checks local dev server and GitHub Pages URL status.
