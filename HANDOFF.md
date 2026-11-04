# Handoff — Duly Qualified WhatsApp videos

Branch: `claude/great-thompson-m39ba1`. Skills: `/hyperframes` (read first).

## Done
- **Video 1 (`videos/01-tender`) is the approved direction** (reference-level motion): word-synced
  kinetic type (`scripts/kinetic.py` + `plan/kinetic.json`), scenes `compositions/s1–s5.html`,
  user's character as Thabo (`assets/thabo/*.png`, from `videos/characters/thabo/sheet-user.png`),
  fonts Hanken Grotesk + Newsreader italic (`assets/fonts/`), voice `assets/voice.mp3`
  (Higgsfield text2speech_v2, variant elevenlabs, preset "Grady" id e2a2d2e6-9ed2-59cd-82af-feaa27f8a678,
  one continuous take per script, emotion tags only at mood changes), music `assets/music-bed.mp3`
  (ElevenLabs Music v2.5 via Higgsfield, 118 BPM; bed -15 dB, dip at the loss, lift at the reveal).
  Draft render: `renders/01-tender-v6.mp4` (not committed). Awaiting the user's feedback on it.
- Real product copy from dulyqualified.co.za (monthly folder: Leads / Tenders / Compliance / Bids;
  "Guarding services for a regional office, 24 months"; compliance "Renew in 12 days").

## Next
1. Get the user's feedback on video 1 v6.
2. Videos 2 (`02-technicality`, Nomsa) and 3 (`03-cameras`, Sipho) still use the old style:
   rebuild them like video 1. Nomsa's sheet: `videos/characters/nomsa/sheet-user.png`.
   Sipho's sheet: ask the user (or generate in the same style from the Thabo sheet).
3. Poses: Higgsfield `gpt_image_2_5`, quality medium, 1k, background transparent, aspect 2:3,
   the sheet uploaded as `image_references` (~0.5 credits each). Crop tight, put in `assets/<name>/`.
4. Voices for 2 and 3 already exist as single Grady takes (`assets/voice.mp3`, `assets/transcript.json`);
   word times via `scripts/build-captions.py <script.txt> assets/transcript.json /dev/null`.
   Script texts: `videos/SCRIPTS.md` (Port Elizabeth, not Gqeberha).
5. Reuse `videos/01-tender/assets/music-bed.mp3` (re-mix the dip/lift to each video's timings).

## Working notes
- Check: `npx --yes hyperframes@0.9.8 check --json`; render: `... render --quality looks --workers 3 -o renders/<name>.mp4`.
- Remaining check warnings in video 1 are deliberate (fast word-synced phrases, rolling reels).
- Higgsfield credits left: ~110. User approves spends; quote costs first.
