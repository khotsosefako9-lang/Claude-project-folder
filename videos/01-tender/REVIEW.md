# Review — 01 The tender we never saw

**Storyline:** A, "The paper trail" (see `../STORYLINES.md`; B "The words that cost you" and
C "One map of the Bay" not built). Spec: `../SPEC.md`.

## Creative calls
- Hook is a flash-forward of the voice's Monday message: frame 0 already reads
  "Did you see the guarding tender? / Closed Friday.", "Friday" struck in red at 0.35 s.
- Chain: phone slides off → Thabo's duty roster (12 guards fill on "Twelve guards", client sites on
  "good clients", every shift on "always busy") → the phone returns on "On Monday" → the message
  grows into the tender notice → strike + the film's one CLOSED stamp on "It closed on Friday" →
  the roster drops back on top and buries it on "Thabo never saw it".
- Month calendar: tenders open and are struck through, then job bars cover the days.
- Reveal: "Duly Qualified" title, then the sample page builds on the words (tenders, closing dates
  underlined, 20 shopfronts counted). Example rows are marked "Illustrative example".
- End card: monogram wiped in navy, red tail drawn last, name, CTA, URL; holds 2.5 s after the voice.
- Captions: script spelling with the transcript's word times (`scripts/build-captions.py`);
  no caption over the end card (the card carries the line).

## Measured vs looked at
- `check`: 0 errors, 0 warnings after fixes. Snapshots + `--review` sheets (beats, seams, phone width) looked at.
- Voice: cloned VoxCPM2 voiceover, -16 LUFS, 32.3 s. Measured, not heard by me.
- No music or sound effects (no licensed source available).

## Fixed in review
- P1 t=13.2 seam desk→month showed an empty ground frame → calendar now enters already visible, scale 1.25 + blur 6 px → 0.
- P1 t=0 thumbnail had "Closed Friday." mid-fade → shown from frame 0.
- P1 sample/checklist pages sat under the captions before sliding in → hidden until they enter.
- P2 hook bubbles enlarged to 54 px; captions no longer leave one-word groups.

## Weakest shot / with more time
- The phone at 4.9–7.4 s has an empty lower half; a second message or a larger crop would fill it.
- Month slips are small at phone width (28 px); a push into one week would read better.
