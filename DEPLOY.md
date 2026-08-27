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
   - `VITE_GOOGLE_REVIEWS_WIDGET_ID` — Elfsight widget ID (optional; see Google Reviews below)
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
   - `VITE_GOOGLE_REVIEWS_WIDGET_ID` (optional; see Google Reviews below)
5. Deploy — no `/buchanwebsite/` base path needed on custom domains

---

## Google Reviews widget (homepage)

The homepage loads live Google Business reviews via [Elfsight](https://elfsight.com/google-reviews-widget/). One-time setup:

1. Create an Elfsight account and add a **Google Reviews** widget.
2. Connect your **Google Business Profile** listing for John Buchan Homes.
3. Choose a **Grid** layout, enable star ratings, and set how many reviews to show (e.g. 6–12).
4. Match widget colors to the site where Elfsight allows (accent tan, dark text).
5. Open the embed code and copy the widget ID from `elfsight-app-XXXXXXXX` → use `XXXXXXXX`.
   - Current production ID: `d11ab275-0cc0-454e-83ee-a58f6f86c252`
6. Add to environment variables:
   - Local: `VITE_GOOGLE_REVIEWS_WIDGET_ID=d11ab275-0cc0-454e-83ee-a58f6f86c252` in `.env.local`
   - Netlify / GitHub Actions: same name and value in site env or repository secrets
7. Redeploy. Until the ID is set, the homepage shows a fallback link to Google Maps reviews.

The Elfsight loader uses `https://elfsightcdn.com/platform.js` (see [`src/lib/reviewWidget.ts`](src/lib/reviewWidget.ts)).

Section eyebrow, title, and fallback Maps URL are editable in **Admin → Pages → Home → Google Reviews**.

---

## Verify deployment

```bash
npm run cms:check-live
```

Checks local dev server and GitHub Pages URL status.
