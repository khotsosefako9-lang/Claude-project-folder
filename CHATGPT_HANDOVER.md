# Duly Qualified — WhatsApp ad videos: handover

A self-contained brief for picking up this project in another assistant.

## 1. The project

Three short vertical ads (1080×1920, 30 fps, about 40–46 s) for **Duly Qualified**
(dulyqualified.co.za), a Gqeberha/Port Elizabeth service for firms that win work through
contracts. Each month it delivers one folder with:
- **Leads:** 20 qualified local businesses, each with a reason to call and a first message written.
- **Tenders:** public tenders matched to the client, with closing dates and briefing sessions.
- **Compliance:** a checklist of every document a tender asks for, with expiry reminders.
- **Bids:** bid packs prepared for signing.

The ads go out as WhatsApp follow-ups and Status posts, and are often watched muted.

**Code and assets:** GitHub `khotsosefako9-lang/Claude-project-folder`, branch
`claude/great-thompson-m39ba1`. The videos are built with **HyperFrames**, an HTML/GSAP-to-video
framework (`npx hyperframes@0.9.8 check | render | snapshot`).

## 2. Brand

- **Colours:** navy `#14213D` (main ink), warm ivory `#F2F1EC` (ground), signature red
  `#C8372D` (rationed: the loss moment, accent words, the Q's tail).
- **Type (from the website):** Hanken Grotesk, weight 800, for headlines. Newsreader italic in red for
  single accent words, e.g. "Qualified leads. *Qualified* to bid."
- **Logo:** the DQ monogram (navy D and Q, red diagonal tail). Files are in `videos/brand/`,
  including transparent and split-layer versions.
- **Real site copy you can use:**
  - "Most firms lose tenders on paperwork, not price."
  - The pilot funnel: 368 businesses found → 201 tested → 27 checked by hand → 12 ready to contact
    (a Gqeberha design studio, October 2026).
  - Compliance folder example: "PSIRA letter of good standing: Renew in 12 days",
    "COIDA letter of good standing: Missing".
  - Tender example: "Guarding services for a regional office, 24 months".

## 3. Scripts (final; say "Port Elizabeth", not "Gqeberha")

**1. The tender we never saw (Thabo, security firm)**
> Thabo runs a guarding firm in Port Elizabeth. Twelve guards, good clients, always busy.
> On Monday, another owner mentions a two-year guarding contract for a government office in the city. It closed on Friday. Thabo never saw it.
> Tenders like this open and close across the Bay every month, and they're easy to miss when you're busy running jobs.
> Duly Qualified finds them for you. Every month: the tenders you can quote on, with closing dates, and twenty local businesses likely to need guarding.
> See this month's sample at dulyqualified.co.za.

**2. Disqualified on a technicality (Nomsa, cleaning company)**
> Nomsa's cleaning company spent a week on a tender for a Port Elizabeth office. Good price. Good references.
> Then the letter came. Disqualified.
> Her COIDA letter of good standing had expired two weeks before closing. One document, and a three-year contract was gone.
> Duly Qualified keeps a checklist of every document a bid asks for, and reminds you before anything expires. So when the right tender opens, you're ready.
> See a sample at dulyqualified.co.za.

**3. Someone else's cameras (Sipho, CCTV installer)**
> Sipho installs CCTV and access control in the Bay.
> Driving home, he passes a brand-new shopping centre. Cameras on every corner. Gate access at every entrance. Another installer got that job, and Sipho never knew it was coming.
> New buildings go up across the metro every year, and each one needs security systems fitted.
> Duly Qualified finds those sites before they open, with who to contact and a first message ready.
> See this month's installer sample at dulyqualified.co.za.

All names are fictional, and nothing claims to be a real client. Example dates and numbers on screen are
labelled as samples.

## 4. What the client wants (learned the hard way)

- **Motion level:** match a reference ad for an AI marketing tool. The screen *is* the voice: every
  phrase appears as big kinetic type, word by word, with UI elements morphing, slot-machine lists,
  counters ticking over bar charts, card collages flying in, colour floods, whip-pans and a beat
  every 0.5–1.5 s, all over a music bed. Use the reference's grammar, not its pink and purple look.
- **Characters:** proper 3D animated-film-style characters from the client's own character sheets.
  Never flat or hand-drawn. Sheets: `videos/characters/thabo/sheet-user.png` (a young man in a black suit
  with a crest tie) and `videos/characters/nomsa/sheet-user.png` (a young woman with long braids in a
  white halter maxi dress). **Sipho's sheet is still needed from the client.**
- **Voice:** rejected so far: the client's own phone recording (echoey), cloned versions of it
  (walkie-talkie sound), Seed-engine presets (monotone), "Dylan" (accent).
  **Approved:** Higgsfield `text2speech_v2`, variant `elevenlabs`, preset voice **"Grady"**
  (id `e2a2d2e6-9ed2-59cd-82af-feaa27f8a678`), with **each whole script generated as one take**. Separate
  paragraph takes sounded inconsistent. Put emotion tags only where the mood changes, e.g. `[sighs]` before
  the loss line and `[excited]` before "Duly Qualified …". Don't put a tag on the opening line, because
  that made it sound robotic.
- **Pacing:** not rushed. About 0.9 s pauses between paragraphs, 40–46 s total.

## 5. Current state

- **Video 1 (`videos/01-tender`), draft v6, is the template.** It's awaiting client feedback.
  - **Character:** Thabo in seven poses (phone, proud, shock, slump, point, celebrate, showphone), generated from the
    sheet as transparent PNGs in `assets/thabo/`.
  - **Kinetic type:** `scripts/kinetic.py` reads word timings and a phrase plan (`plan/kinetic.json`: word
    ranges, a style per phrase from blur/slam/mask/type/hero, size, y position, accent words) and writes the type layer.
  - **Scenes** (`compositions/s1–s5.html`):
    - **s1 intro:** guard badges, client cards and a week of shifts filling up.
    - **s2 tender:** a chat types out and morphs into the tender card; a closing-date reel spins to Friday,
      which gets struck through and stamped CLOSED; a navy flood leaves Thabo slumped in a spotlight.
    - **s3 the Bay:** the coastline draws itself, tenders open and get stamped CLOSED, a month roller turns,
      and cards stream past while Thabo stares at his phone.
    - **s4 reveal:** the monogram builds; a phone shows the real report (20 leads, 3 tenders, 2 papers to renew,
      1 bid pack); a slot-machine list scrolls Leads, Tenders, Compliance, Bids; a counter hits 20 over bars;
      Thabo leaps.
    - **s5 end:** the URL types into a search bar and the monogram lands.
  - **Audio:** voice `assets/voice.mp3`; music `assets/music-bed.mp3`, an original ElevenLabs Music v2.5
    instrumental at 118 BPM. The bed sits 15 dB down, dips about 8 dB more during the loss and lifts at the reveal.
- **Videos 2 and 3** still use an older, simpler style and need rebuilding like video 1. Their Grady
  voiceovers and word timings are already in `assets/voice.mp3` and `assets/transcript.json`.

## 6. Plan for videos 2 and 3 (same grammar as video 1)

**Video 2 (Nomsa):**
- hook with her proud pose
- on "spent a week", a calendar of seven days flips past
- "Good price. Good references." ticks two boxes with pops
- "Then the letter came": an envelope slides in and the letter opens
- "Disqualified.": a full-screen slam with a red stamp and shake, and Nomsa's shock pose
- the COIDA letter card, with "Valid until" struck in red
- a two-week red gap on a timeline before "Tender closed"
- "One document": one card spotlit, and the 3-year contract card shatters or slides away while she slumps
- reveal: the monogram, then the real compliance folder from the site
  (CIPC, CSD, Tax PIN, B-BBEE "In place"; PSIRA "Renew in 12 days"; COIDA "Missing")
- a reminder notification drops in on "reminds you"
- every row ticks green-to-navy on "you're ready", and she celebrates
- end: the URL types into a search bar

**Video 3 (Sipho):**
- hook with Sipho and his bakkie
- "Driving home": road lines whip past
- the shopping centre builds itself block by block
- cameras snap onto every corner on "Cameras on every corner"
- gate readers pop on "Gate access"
- "Another installer got that job": a red tag and a full-screen slam of "SOMEONE ELSE'S JOB.", with Sipho in shock
- "every year": a skyline of new buildings rises, and a camera lands on each
- reveal: a phone report of new sites ("Under construction / Fitting out / Plans approved") with
  "who to contact" chips and a first WhatsApp message typing out
- end: the URL and monogram

## 7. How the assets were made (to reproduce)

- **Poses:** Higgsfield `gpt_image_2_5`, quality medium, resolution 1k, `background: transparent`,
  aspect 2:3, with the character sheet uploaded as `image_references`, about 0.5 credits each. Prompt pattern:
  "The exact same original character from the reference character sheet, identical face, hair and outfit.
  Full body, [pose and expression]. Same 3D Pixar-style render and lighting, transparent background,
  single character only, no text."
- **Music prompt:** "Upbeat modern pop-electronic instrumental for a short punchy social media
  product ad. Bright plucky synths, crisp claps and punchy kick, warm bass, optimistic and confident,
  118 BPM … No vocals." 48 s, instrumental, about 7 credits.
- **Voice:** one take per script, as in section 4. If you use word timings, align them to the script text.
- **Credits:** about 110 Higgsfield credits remain. The client approves spending, so quote the cost first.

## 8. Open questions for the client

1. Feedback on video 1, draft v6.
2. Sipho's character sheet.
3. Final render quality and delivery format (MP4, 1080×1920) once all three are approved.
