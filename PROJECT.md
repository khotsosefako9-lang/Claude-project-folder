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
| Gmail (owner's account) | ⚠️ needs re-auth | Even when connected it can only **create drafts**, not send. |
| Google Drive / Calendar / Canva | available | Not needed yet. |
| Overpass (OpenStreetMap) API | ❌ | Connection reset from this sandbox. |
| TLS certificate checks | ❌ unreliable | The sandbox egress proxy re-signs TLS. Never report a cert expiry seen from here. |
| Sending email / marketplace messaging | ❌ | No authorised sending channel yet. |
| Receiving payment | ❌ | No payment channel yet. |

## Where records live
This GitHub repo is **public**, so it holds only tools, the offer, the ledger and this checkpoint.
Prospect data, outreach drafts and reports on named businesses are kept out of git (`private/`, gitignored)
and backed up to the owner's private Google Drive folder "Revenue project - private records":
- Folder: https://drive.google.com/drive/folders/1RcguJb0NTTpHTQf2yG2l1tAECtyzFvS5
- Prospect log (Sheet): https://docs.google.com/spreadsheets/d/17aCP-j6pKGvn5zvKui9TPoYjufEjaya6XFYySGN2rzE/edit
- Outreach drafts + report notes (Doc): https://docs.google.com/document/d/1tUt5omSJb18qs7jZlKhUh5VY-hzhTjO4cVSNsxXl-kY/edit
Keep the Drive copies current. A new container won't have `private/`, so rebuild it from Drive.

## Authorised accounts
- **Sending identity: NOT YET DESIGNATED.** Nothing has been sent.
- **Payment channel: NOT YET SET UP.**

## Research summary (why this offer)
- Bounties (Algora etc.): saturated by automated hunters. A public scanner filtered out 57 of 201 bounties as "bounty-farm" repos. Ranked low.
- Open boards: the HN "Freelancer? Seeking freelancer?" threads for Sept and Oct 2026 contain ~45 SEEKING WORK posts and **0** SEEKING FREELANCER posts. Supply far exceeds demand.
- Small-business websites: 20 real sites audited. **4 (20%) had a serious, hand-verified, customer-facing problem**: 2 sites completely down (WordPress critical error; 503 + certificate mismatch), 2 with broken service links / broken mobile layout. The buyer can see the problem before paying.
- Market prices: Fiverr critical-error gigs from ~$15–85; agencies ~$129–499 per incident.

## Current offer
See `offer.md`. Primary: **Website Fix Sprint ($149)** and **Site Down Rescue ($129)**, pay after verified fix.
Backup: spreadsheet cleanup ($75/$150) for warm introductions.
Samples: two one-page PDF reports on real prospects in `private/samples/`. Notes to regenerate them are in the Drive Doc.

## Funnel (update with every touch)
| Audited | Qualified | Messages sent | Replies | Agreed jobs | Delivered | Collected |
|---|---|---|---|---|---|---|
| 20 | 4 | 0 | 0 | 0 | 0 | $0 |

## Active jobs, deadlines, commitments
None.

## Experiments
| # | Hypothesis | Change | Window | Result |
|---|---|---|---|---|
| E1 | Specific, verified problem + free one-page report + pay-after-fix gets ≥10% replies | First 10–20 messages | 7 days after send | pending (blocked on sending channel) |

## Tools
- `tools/audit.js <url> [out.json]`: read-only mobile audit (status, broken internal links, overflow, page weight, alt text, axe WCAG A/AA, emails found).
- `tools/batch.py urls.txt OUT_DIR`: runs audits and prints qualifying issues. Always hand-verify "down" and 404 results with a browser-like request before outreach.
- `tools/report.js audit.json notes.json out.pdf`: one-page PDF report from hand-verified notes.
- Setup: `cd tools && npm install` (axe-core 4.14.0, MPL-2.0); Playwright is preinstalled.

## Blocked on (owner)
1. Which account sends outreach (and whether calls are an option for site-down prospects).
2. A payment channel the owner can receive with (e.g. PayPal or Wise invoice) and their country.
3. Name and postal address for email footers.

## Next executable actions
1. While blocked: audit 40–60 more small-business sites (Clay, one search at a time; web search), hand-verify, add qualified ones to the Prospect log with a report each. Re-check P001/P002 are still down before any contact.
2. Once a sending account is named: send P003/P004 plus new qualified prospects (max ~15/day), log each touch, follow up once after 5 business days.
3. On a yes: confirm scope and acceptance in writing → get access (Recovery Mode link / temporary user) → fix → re-run audit as proof → invoice → record payment with evidence.

## Resume instruction
Read this file, then the Drive Prospect log and drafts Doc (or `private/` if present) and `ledger.csv`. Check for owner answers to "Blocked on".
Continue from "Next executable actions". Never record revenue without payment evidence.
