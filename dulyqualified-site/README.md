# Duly Qualified website

Marketing site for [Duly Qualified](https://dulyqualified.co.za), started from the MotionSites
"Guardnet" template (`.claude/skills/motionsites/pro-prompts/guardnet-landing.md`) and redesigned
around a black, ember-lit, HUD-framed look.

**Stack:** React 18, Vite, TypeScript, Tailwind CSS 3, Framer Motion, lucide-react, React Router.
Fonts (Readex Pro, Doto, Space Mono) are installed locally via `@fontsource`, so no Google Fonts requests.

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

## Design

Inspired by cinematic hero work (ember horizon with the product rising out of it, Nothing-style HUD
framing, type that interacts with objects, a curved carousel). Everything is drawn in code: the ember
horizon and sparks, the 1,060-dot market map (scroll-driven), the falling tender references and the
floating certificates. No videos or remote media, so the page loads nothing from other websites.

## Notes

- **Book-a-call form** opens WhatsApp (or email) with the details pre-filled; nothing is stored.
- **Hosting:** it's a single-page app. `public/_redirects` (Netlify) and `vercel.json` (Vercel)
  route `/sample` and `/privacy` to `index.html`.
- **Artifact preview:** `npm run build:artifact` writes one self-contained HTML file to `dist-artifact/`.
