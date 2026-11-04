# Website fixes — November 2026

All code changes are already in this folder. Originals of every changed file are backed up in
`outputs/website-backup-before-fixes-2026-11-03` (same folder structure).

## What changed

| # | Issue | Fix |
|---|---|---|
| 1 | Any signed-in account had full admin rights | Database now only allows accounts with role `admin` (migration 012). The admin UI shows "no access" to anyone else. The knowledge-base function checks the role too. |
| 2 | Nobody was notified about new leads | New function `notify-submission` emails every form to **mischellem@buchan.com** (reply goes straight to the client). Optional HubSpot form sync. |
| 3 | No tracking | Google Tag Manager `GTM-W8ZCL9F` on every page, plus `virtual_page_view` and `generate_lead` events. |
| 4 | Chat could run up the OpenAI bill | Limit is now per visitor IP (40/hour), questions capped at 1,000 characters, history trimmed. |
| 5 | Colors off-brand | Exact palette: Buchan Green #213B31, Buchan Gold #B88A4B, Warm White #F7F5F0, Architectural Stone #D6D0C5, Soft Charcoal #2F3430. Template purple removed. |
| 6 | Fonts off-brand | Montserrat everywhere (brand body font). Codec Pro / Aileron slots ready in `src/styles/fonts.css` once you have the licensed files. |
| 7 | "Seattle Eastside" | Now "Bellevue and the Greater Eastside" in code, seeds, chat, and live CMS content (migration 013). |
| 8 | 1960 vs 1961 | 1961 everywhere; removed from the home hero/marquee so it is not repeated. |
| 9 | Unverified claims | "4,000+ homes built" and "Three generations" removed. Sample "Harmon Family" testimonial replaced with a real review. |
| 10 | Contact email | Footer and lead emails use mischellem@buchan.com. |
| 11 | Logos | Official full-color logo on light, official all-white logo on dark (were redrawn/recolored versions). |
| 12 | Search / sharing | Fixed doubled page titles, added canonical + link-preview tags and image, `robots.txt`, `sitemap.xml`, alt text on content images. |
| 13 | Admin password in GitHub | Removed from DEPLOY.md, seed and scripts. **Still change the password** (it is in GitHub history). |
| 14 | Fake sample leads | Migration 014 deletes only the invented 555-number test leads. |

## Go-live steps (in order)

1. **Turn off public sign-ups:** Supabase → Authentication → Sign In / Providers → turn off "Allow new users to sign up".
2. **Apply the database fixes and deploy the functions** (Terminal, in this folder):
   ```
   npm run deploy:fixes
   ```
   Migration 012 prints a list of accounts and roles at the end. Only people listed as `admin` can use the admin.
   `admin@buchan.com` and `mischellem@buchan.com` (if she has an account) are set to admin.
3. **Email notifications:** create a free account at resend.com, verify the buchan.com domain (or use their test sender
   first), create an API key, then Supabase → Edge Functions → Secrets → add `RESEND_API_KEY`.
   Optional: `NOTIFY_FROM` (e.g. `Buchan Website <website@buchan.com>`), `NOTIFY_TO` (extra recipients, comma-separated),
   `HUBSPOT_PORTAL_ID` + `HUBSPOT_FORM_GUID` to also push leads into HubSpot.
4. **Change the admin password:** Supabase → Authentication → Users → admin@buchan.com → reset password.
5. **Publish the site:** `npm run build`, then upload the `dist` folder in Netlify (Deploys → drag and drop),
   or push to GitHub if the Netlify site is connected to the repo.
6. **GTM:** in Tag Manager, add a GA4 page_view on Custom Event `virtual_page_view` and a Google Ads / GA4 conversion on
   Custom Event `generate_lead`. Publish the container.
7. **Test:** submit the contact form once and confirm the email arrives and the lead shows in Admin → Submissions.

## Still needs content (cannot be fixed in code)

- Placeholder architecture images (`/assets/ph-arch-1…4`) are used as fallbacks when a CMS page has no image
  (About, Services, Process, Warranty, Awards, Testimonials, Blog posts without photos). Upload real project photos in the admin.
- When the site moves to buchan.com, update the domain in `public/robots.txt`, `public/sitemap.xml` and the `og:image` line in `index.html`.
