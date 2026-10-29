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
| Gmail (owner's account) | ✅ sending | Owner (2026-10-27): **Claude sends and does everything; owner steps in only where a human is needed.** Cap ~15 cold emails/day; send by `draftId` after re-verifying the issue. |
| Google Drive / Calendar / Canva | available | Not needed yet. |
| Overpass (OpenStreetMap) API | ❌ | Connection reset from this sandbox. |
| TLS certificate checks | ❌ unreliable | The sandbox egress proxy re-signs TLS. Never report a cert expiry seen from here. |
| Sending email | ✅ | 6 sent 2026-10-27 (P003, P011, P012, P013, P014, P020). Log: private/outreach/sent_log.csv |
| Receiving payment | ✅ designated | Owner's PayPal Business account (address in the private Drive doc). Invoice in USD. |

## Where records live
This GitHub repo is **public**, so it holds only tools, the offer, the ledger and this checkpoint.
Prospect data, outreach drafts and reports on named businesses are kept out of git (`private/`, gitignored)
and backed up to the owner's private Google Drive folder "Revenue project - private records":
- Folder: https://drive.google.com/drive/folders/1RcguJb0NTTpHTQf2yG2l1tAECtyzFvS5
- Prospect log (Sheet, current): https://docs.google.com/spreadsheets/d/1ZdsAXokNszo-6KR1ONScEitwufnXdyIOqU3dnMl-2zo/edit
- Sent log (Sheet, current): https://docs.google.com/spreadsheets/d/1Afe1vlt8gqneikIHggT81hUpdJhKsTV7Kjz6fvz2Ahw/edit
- Reply templates + do-not-contact (Doc): https://docs.google.com/document/d/1mwhHWHEmGxgjZ4FjLybq8PAe6E0jvJX2Sbezt-c6AMk/edit
- READY TO SEND emails (Doc, first batch, all sent): https://docs.google.com/document/d/1amvRKohVIy-WIg_1i9sJjaK_u2QYctvCgbOgPOmLodQ/edit
- Outreach drafts + report notes (Doc): https://docs.google.com/document/d/1tUt5omSJb18qs7jZlKhUh5VY-hzhTjO4cVSNsxXl-kY/edit
Keep the Drive copies current. A new container won't have `private/`, so rebuild it from Drive.

## Authorised accounts
- **No phone calls** unless a client asks for one (owner, 2026-10-27). Prospects with no published email are parked, not called.
- **Sending identity:** the owner's Gmail. Claude sends directly (owner instruction 2026-10-27). Escalate only custom commitments, contracts, payment or identity steps, and anything outside the offer.
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
| ~1,830 | 40 owners + 2 builders | 27 (25 owner + 2 builder) + 1 correction | 0 | 0 | 0 | $0 |

## Active jobs, deadlines, commitments
None.

## Experiments
| # | Hypothesis | Change | Window | Result |
|---|---|---|---|---|
| E1 | Specific, verified problem + pay-after-fix gets ≥10% replies | First 10–20 messages | 7 days after each send | running: 6 sent 2026-10-27 |

## Other activity on the same Gmail (found 2026-10-28)
The owner's Gmail also carries other outreach that this project did not send: a spreadsheet/CSV-preparation pitch
to SA bookkeepers and Shopify agencies (5 sent 2026-10-27/28, one declined), and a separate "DulyQualified" business
(info@dulyqualified.co.za alias) emailing security and cleaning firms. Before every send, check
`private/outreach/do_not_contact.csv` and search Gmail `to:<address>` so no business gets two pitches.

## PayPal status
Account live (owner screenshot 2026-10-28: balance US$0.00, payment links working). PayPal's in-app "Link a bank" offers
only a U.S. bank form. Do NOT use it: the account is South African (setup email cnac=ZA). SA withdrawals go through
FNB's PayPal service: a free FNB Online Banking profile (works for non-FNB banks after FICA documents) → Forex → PayPal Services
→ Link PayPal Profile → Withdraw from PayPal (USD amount, BoP code per withdrawal, transactional ZA account only).
Owner checked 2026-10-28: no hold, review or limitation notice. Display name "DulyQualified" can't be changed, so every payment message carries the line "The PayPal page will show my business name, DulyQualified. That's me, Khotso Sefako." (private/outreach/reply_templates.md).
Owner step: owner will set this up once the first payment arrives (2026-10-28). On the first PayPal payment-received email,
remind the owner to (1) set up the FNB PayPal link and (2) confirm PayPal Settings shows country = South Africa. Record the ZAR amount and rate at each withdrawal in ledger.csv.

## Payment links (2026-10-28)
The owner created three fixed-price PayPal payment links ($49 Quick Fix, $129 Site Down Rescue, $149 Fix Sprint, USD, no
quantity/shipping). Each was checked by rendering it. They're stored in private/outreach/payment_links.md and the Drive folder,
not in this repo. No human step per sale now: after the client confirms the fix, Claude sends the matching link.
PayPal business display name is "DulyQualified", so payment messages say so. Bank account not yet linked (needed to withdraw).

## Payment collection note
No PayPal connector is available, so Claude cannot create PayPal invoices. Two options when a client is ready to pay:
(a) the client pays via PayPal "Send" to the owner's PayPal email as goods & services (no owner action needed); or
(b) the owner sends a PayPal invoice (one human step). Offer (a) first. Confirm receipt from the PayPal notification email in Gmail before recording revenue.

## Experiment log: AI SEO angle (2026-10-28)
Hypothesis: small-business sites often block AI assistants or lack LocalBusiness schema, which would be a new reason to reach out.
Test: `tools/ai_access.py` over all 326 audited domains (293 reachable).
Result: only 7 block any AI crawler (2 are expired or parked domains; 3 block training-only bots, not search bots). 196/293 (67%)
have no LocalBusiness-type JSON-LD. Decision: no standalone AI-SEO pitch. Both checks become optional Fix Sprint add-ons (offer.md).
Side finding: expired Squarespace sites (2 found: Custom Craft Remodeling, J. Thompson Builders) serve `Disallow: /` and a
"Website Expired" page. Both have no published email, so they're parked.

## Cold-email changes (2026-10-28, cold-email skill)
- Follow-ups: max 2, in-thread, each adds one new free thing (compressed copy of their own biggest image, or exact DIY fix
  steps); the second is a 1-2-3 breakup that is honoured. Plan and timing: private/outreach/followups.md.
- New first touches: 2–4 word lowercase subjects, ~80–110 words, interest-based question CTA, price in one line.

## Council decision (2026-10-28) and builder pilot
LLM Council (5 advisors, anonymous peer review, chairman; transcript in private/council/): **keep the channel, change the buyer.**
Lead yield to owners is ~3% of audited sites, and owners lack logins and distrust strangers, so sell to the web designers/agencies
credited in site footers (white-label, private heads-up, pay after check). Keep the 14 owner threads with plain-language,
no-login follow-ups. Drop: the schema upsell, "warm network", HN, bounties. Review deadline: **first payment by 2026-11-11**. Owner goal (set 2026-10-28): **US$650 collected by 2026-11-18**.
Checked after the council: 70/326 sites credit someone; 28 link to a real builder (24 builders), mostly 1 audited site each, so
the method is to start from the builder's portfolio. Pilot (3 builders, 58 portfolio sites): 2 builders qualified (≥2 client
sites with verified defects). Sent 2 builder heads-ups (Marketing Main Street: 4 sites; JBZign: 2 sites). Client sites of pitched
builders are on do-not-contact (white-label promise). Template: private/outreach/builder_template.md.
Pipeline method: `tools/chamber.py` → footer credits → builder portfolio → `tools/batch.py` → verify → builder email.

## Council 2 (2026-10-28): Shopify, ecommerce, digital products
Question from the owner: add Shopify/ecommerce or digital products? Verdict (5 advisors, 5 peer reviews, report in private/council/):
**no Shopify line** (19/849 audited local businesses are Shopify, defects mild, crowded inboxes), **no digital products** (no
audience or traffic within 20 days). Keep website fixes; put a finished fix in every email. Builders: send every qualified one,
but the reviewers' "count first" check was right. `tools/defect_candidates.py` over 666 saved audits found 145 machine-flagged
sites, 60 with footer credits; builders with 2+ candidate sites: Marketing Main Street 10 (already contacted, FU can add 6),
Berry Digital 3 and Amplimark 2 (only ~1 MB images, too weak), Project7 2 (slider-arrow "404s" are false; 1 real), Farmboy 2
and Blue Compass 2 (5 MB images, but mid-size agencies with in-house devs and no published email, forms only). Net: ~0 new
builder emails; owner outreach stays the volume engine.
Money rules from the review: fixed links only, paid at acceptance, nothing on payment terms (agencies pay 15-30 days late);
bigger jobs = several link payments. PayPal hold: owner checked, none (2026-10-28).
Last new first-touch email 2026-11-08. Checkpoint 2026-11-06: no payment by then means tell the owner $650 is very unlikely.

## Mistakes and fixes
- 2026-10-28: the audit used a desktop user agent in a phone-sized window. Duda sites served their tablet layout, so 6 sites
  showed a false "378px wider than the screen". One false claim was emailed (Elite Auto Experts); a correction and apology
  was sent the same day and that prospect is closed. Fix: `tools/audit.js` now uses Playwright's iPhone 13 device
  profile. Rule: confirm any mobile-layout claim on two real device profiles (iPhone 13 + Pixel 7) and a screenshot before sending.
- 2026-10-28: compress_images.py crashed on corrupt phone EXIF, and the first fallback dropped the rotation tag (photos came out
  sideways or upside down). Fix: orientation is applied by hand when exif_transpose fails. Rule: eyeball one output per job.
- 2026-10-28: palette PNGs without dithering posterized photo skies (caught by eyeballing Westside's banner before sending). Fix: Floyd-Steinberg dithering in compress_images.py; for fully opaque photo PNGs send a JPEG copy instead.
- Server errors (5xx) seen during audits can be transient or bot protection. 2026-10-28: 3 of 3 Norfolk "many broken links" sites were rate limiting from the audit's rapid link checks (all 200 when re-requested 3 s apart). Rule: re-request twice and confirm from an independent fetch.

## Prospecting notes
- Chamber of commerce directories (GrowthZone `/list/ql/...`, `/list/category/...`) are the best free source so far: local, owner-run, website listed. Some answer 403, so skip those.
- Small-city chambers yield better than metro contractor lists: Norfolk NE (members.norfolkareachamber.com/list/ql/...) gave ~12 usable of 287 (4%); Des Moines contractor categories gave ~3 of 152. Kearney+Hastings NE ~3-7 of 421; Dubuque IA ~2 strong + 6 heavy-image of 303.
- Clay yields ~25% usable US local businesses per page and costs ~10k tokens/page. Its semantic `products_and_services` filter returns many foreign or non-local firms.
- Exclude video-heavy pages (HLS segments) from "heavy page" pitches; that's a design choice, not a defect.
- Parked domains (redirect to /lander or `?ch=1&js=`) mean the domain was lost. Not a quick-fix job.

## Tools
- `tools/audit.js <url> [out.json]`: read-only mobile audit (status, broken internal links, overflow, page weight, alt text, axe WCAG A/AA, emails found).
- `tools/batch.py urls.txt OUT_DIR`: runs audits, prints qualifying issues and the emails the business publishes (homepage + contact page). Always hand-verify "down" and 404 results with a browser-like request before outreach.
- `tools/report.js audit.json notes.json out.pdf`: one-page PDF report from hand-verified notes.
- `tools/chamber.py <directory-url>...`: lists member websites from GrowthZone/ChamberMaster chamber directories (skips 403s).
- `tools/defect_candidates.py raw_dir...`: machine-flags saved audits (broken internal links, 1 MB+ images, 5xx). Hand-verify before any claim.
- `tools/spam_scan.py domains.txt`: finds outbound links to casino/pharma/essay domains (injected SEO spam). 1 real hit in 1,527 homepages (2026-10-28).
- `tools/compress_images.py <page-url> OUT_DIR`: delivery tool. Same-name web-sized copies of every image over 300 KB plus a before/after report.csv. Tested on a prospect's public images: 17 images, 20.0 MB -> 5.0 MB; an 8 MB PNG-named-.jpg -> 457 KB. Palette PNGs show light dithering on photos; for paid jobs also offer JPEG/WebP conversion.
- Setup: `cd tools && npm install` (axe-core 4.14.0, MPL-2.0); Playwright is preinstalled.

## Blocked on (owner)


## Next executable actions
00. 2026-10-29: send the 7 drafts listed in private/outreach/send_2026-10-29.md after same-day re-checks. Cap 10-15 first touches/day.
0. Prepared follow-ups: private/outreach/fu1_batch1.md (send Fri 10-30) and fu1_batch2.md (send Mon 11-02), already written; re-verify and regenerate attachments on the day.
0b. On each check: read replies to the sent threads (Gmail search `newer_than:2d -in:sent` plus each threadId) and answer within scope. Follow-ups per private/outreach/followups.md: batch 1 FU1 **Fri 2026-10-30**, batch 2 FU1 **Mon 2026-11-02**, final notes 11-05 / 11-10. Stop on any no; record bounces.
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
