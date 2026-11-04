# Duly Qualified HQ (business dashboard)

One place to run Duly Qualified: outreach, the new-client pipeline, clients and monthly delivery,
money, tasks and callbacks, tenders, and the playbook (message templates, review flags, do-not-contact
list, website actions).

Published as a private claude.ai Artifact. Records live in the Artifact's own database (`db`
capability), readable and writable only by the owner and editors. The page source contains no records.

- **Imported from:** "DulyQualified Outreach Master - 28 Oct 2026" and "DulyQualified New Client
  Campaign - 2 Nov to 2 Dec 2026" (Google Drive), on 4 Nov 2026.
- **Stack:** React 18, TypeScript, Tailwind, Vite. `npm run build` writes one self-contained file,
  `dist/dq-hq.html`, which is what gets published.
- **Local preview:** put a seed file at `src/dev/seed.json` (`{ collection: { id: record } }`) and run
  `npm run dev`. It's kept in memory and never bundled into the build.

Collections: `firms`, `pipeline`, `buyers`, `clients`, `deliveries`, `invoices`, `expenses`, `tasks`,
`tenders`, `templates`, `exclusions`, `flags`, `seo`, and `meta/business` (goals, prices, rules).
