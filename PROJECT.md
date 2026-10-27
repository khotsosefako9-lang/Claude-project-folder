# Revenue project: record and checkpoint

## Mission and target
Earn **US$650 collected net revenue** (after platform fees, direct costs and refunds; before
personal income tax) through legitimate, delivered work. Only money received and withdrawable counts.
No spending, debt, ads, paid leads, trading or speculative schemes without the owner's specific approval.

## Current balance (update every change; evidence in `ledger.csv`)
| Collected net | Deposits held (undelivered) | Outstanding invoices | Refunds |
|---|---|---|---|
| **$0.00 / $650** | $0.00 | $0.00 | $0.00 |

## Verified capabilities (2026-10-27)
| Capability | Status | Notes |
|---|---|---|
| Web search / fetch | ✅ | Reddit blocks automated access, so it isn't used. |
| Headless Chromium + Playwright, axe-core | ✅ | Powers `tools/audit.js`. |
| Python, Node, pandoc, LibreOffice | ✅ | Office/PDF deliverables possible. |
| GitHub (khotsosefako9-lang) | ✅ | Scoped to this repo only. |
| Clay (Personal Workspace) | ✅ | Company search; skews to LinkedIn-listed firms; rate-limited (1 search at a time). |
| Indeed | ✅ | Employment listings only; not useful for gigs. |
| Gmail (owner's account) | ⚠️ designated, but connector needs re-auth (checked 2026-10-27 after owner's answer) | Can only **create drafts**; the owner reviews and clicks send. |
| Google Drive / Calendar / Canva | available | Not needed yet. |
| Overpass (OpenStreetMap) API | ❌ | Connection reset from this sandbox. |
| TLS certificate checks | ❌ unreliable | The sandbox egress proxy re-signs TLS. Never report a cert expiry seen from here. |
| Sending email | ⚠️ | Owner's Gmail designated 2026-10-27: Claude creates drafts, owner sends. Waiting on connector re-auth. |
| Receiving payment | ✅ designated | Owner's PayPal Business account (address in the private Drive doc). Invoice in USD. |

## Where records live
This GitHub repo is **public**, so it holds only tools, the offer, the ledger and this checkpoint.
Prospect data, outreach drafts and reports on named businesses are kept out of git (`private/`, gitignored)
and backed up to the owner's private Google Drive folder "Revenue project - private records":
- Folder: https://drive.google.com/drive/folders/1RcguJb0NTTpHTQf2yG2l1tAECtyzFvS5
- Prospect log (Sheet, current): https://docs.google.com/spreadsheets/d/1ZdsAXokNszo-6KR1ONScEitwufnXdyIOqU3dnMl-2zo/edit
- READY TO SEND emails (Doc): https://docs.google.com/document/d/1amvRKohVIy-WIg_1i9sJjaK_u2QYctvCgbOgPOmLodQ/edit
- Outreach drafts + report notes (Doc): https://docs.google.com/document/d/1tUt5omSJb18qs7jZlKhUh5VY-hzhTjO4cVSNsxXl-kY/edit
Keep the Drive copies current. A new container won't have `private/`, so rebuild it from Drive.

## Authorised accounts
- **Sending identity:** the owner's Gmail (designated 2026-10-27). Claude writes drafts; the owner sends. Nothing has been sent yet.
- **Payment channel:** the owner's PayPal Business account, USD invoices (designated 2026-10-27).
- **Sender details:** owner's name and postal address (South Africa) for email footers are in the private Drive doc, not in this public repo.
- PayPal fees (South Africa): published schedule shows **4.90% + fixed fee** for receiving. Assume 4.9% + $0.30 until the first real transaction shows the exact fixed fee. A $149 invoice ≈ $141.40 net; $129 ≈ $122.40 net. ZAR conversion happens at withdrawal; record the rate and date in `ledger.csv`.

## Research summary (why this offer)
- Bounties (Algora etc.): saturated by automated hunters. A public scanner filtered out 57 of 201 bounties as "bounty-farm" repos. Ranked low.
- Open boards: the HN "Freelancer? Seeking freelancer?" threads for Sept and Oct 2026 contain ~45 SEEKING WORK posts and **0** SEEKING FREELANCER posts. Supply far exceeds demand.
- Batch 3 (25 more sites): 3 more broken-link/phone-link problems, 1 site fully missing ("SITE NOT FOUND"), 1 store with no page title. Hit rate stays around 20%, but only about half of qualified prospects publish an email.
- Small-business websites: first 20 real sites audited. **4 (20%) had a serious, hand-verified, customer-facing problem**: 2 sites completely down (WordPress critical error; 503 + certificate mismatch), 2 with broken service links / broken mobile layout. The buyer can see the problem before paying.
- Market prices: Fiverr critical-error gigs from ~$15–85; agencies ~$129–499 per incident.

## Current offer
See `offer.md`. Primary: **Website Fix Sprint ($149)** and **Site Down Rescue ($129)**, pay after verified fix.
Backup: spreadsheet cleanup ($75/$150) for warm introductions.
Samples: two one-page PDF reports on real prospects in `private/samples/`. Notes to regenerate them are in the Drive Doc.

## Funnel (update with every touch)
| Audited | Qualified | Messages sent | Replies | Agreed jobs | Delivered | Collected |
|---|---|---|---|---|---|---|
| 45 | 10 (5 with a published email, ready to send) | 0 | 0 | 0 | 0 | $0 |

## Active jobs, deadlines, commitments
None.

## Experiments
| # | Hypothesis | Change | Window | Result |
|---|---|---|---|---|
| E1 | Specific, verified problem + free one-page report + pay-after-fix gets ≥10% replies | First 10–20 messages | 7 days after send | pending (blocked on sending channel) |

## Tools
- `tools/audit.js <url> [out.json]`: read-only mobile audit (status, broken internal links, overflow, page weight, alt text, axe WCAG A/AA, emails found).
- `tools/batch.py urls.txt OUT_DIR`: runs audits, prints qualifying issues and the emails the business publishes (homepage + contact page). Always hand-verify "down" and 404 results with a browser-like request before outreach.
- `tools/report.js audit.json notes.json out.pdf`: one-page PDF report from hand-verified notes.
- Setup: `cd tools && npm install` (axe-core 4.14.0, MPL-2.0); Playwright is preinstalled.

## Blocked on (owner)
1. **Gmail connector re-auth** in claude.ai connector settings (it reports "needs you to sign in again").
2. Optional: whether the owner will phone the two site-down prospects (they publish no email).

## Next executable actions
0. Owner reconnects Gmail, or sends the 5 emails from the READY TO SEND doc by hand. Log send dates; follow up after 5 business days.
1. Keep the pipeline full: audit 40–60 more small-business sites (Clay, one search at a time; web search), hand-verify, add qualified ones to the Prospect log with a report each. Re-check P001/P002 are still down before any contact.
2. Once Gmail is re-authorised: create drafts for P003/P004 plus new qualified prospects (max ~15/day), log each touch, follow up once after 5 business days.
3. On a yes: confirm scope and acceptance in writing → get access (Recovery Mode link / temporary user) → fix → re-run audit as proof → invoice → record payment with evidence.

## Scheduled progress check
Daily at 17:43 UTC, wakes this same session (scheduled task `trig_01XejNcutWdwGkNUbMcGt7Um`, created 2026-10-27, first run 2026-10-28).
It can only do what a normal session can: research, audit, update records, and send through channels the owner has designated.
It disables itself after 3 blocked days with no change.

## Resume instruction
Read this file, then the Drive Prospect log and drafts Doc (or `private/` if present) and `ledger.csv`. Check for owner answers to "Blocked on".
Continue from "Next executable actions". Never record revenue without payment evidence.
