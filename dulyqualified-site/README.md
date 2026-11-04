# Duly Qualified website

Marketing site for [Duly Qualified](https://dulyqualified.co.za), built from the MotionSites
"Guardnet" template (`.claude/skills/motionsites/pro-prompts/guardnet-landing.md`), adapted to the
business: black cinematic layout, oversized type, looping video backgrounds and an ember gradient accent.

**Stack:** React 18, Vite, TypeScript, Tailwind CSS 3, Framer Motion, lucide-react, React Router.
The font (Readex Pro) is installed locally via `@fontsource`, so no Google Fonts requests.

## Pages

| Route | Contents |
|---|---|
| `/` | Hero, how it works (with pilot funnel), every month (4 deliverables), tenders & compliance, who it's for, sample teaser, pricing, FAQ, book a call |
| `/sample` | Interactive sample report: the twenty (filter + tracker), three briefs (copy message), tenders, compliance folder, next month, sources |
| `/privacy` | Privacy policy |

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Edit content

All copy, prices, FAQs and contact details are in `src/data/site.ts`; the sample report is in
`src/data/sample.ts`. Layout code doesn't need to change for copy edits.

## Before going live

- **Videos:** the three background videos are hot-linked from the template's CDN (`videos` in
  `src/data/site.ts`). Host your own copies (e.g. in `public/videos/`) and update the URLs.
- **Privacy wording:** the original privacy page says the site loads nothing from other websites.
  That stays false until the videos are self-hosted, so the line was dropped from `/privacy`.
  Restore it once they are.
- **Book-a-call form** opens WhatsApp (or email) with the details pre-filled; nothing is stored.
- **Hosting:** it's a single-page app. `public/_redirects` (Netlify) and `vercel.json` (Vercel)
  route `/sample` and `/privacy` to `index.html`.
