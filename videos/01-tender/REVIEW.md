# Review — 01 The tender we never saw (draft 2)

Storyline A "The paper trail" (`../STORYLINES.md`), spec `../SPEC.md`.

## Changes from draft 1 (person's feedback: too fast, no characters, voice didn't fit)
- Voice: Higgsfield Seed Audio preset "Grady", normal speed, +5 loudness, one take per paragraph
  with 0.7 s pauses; 43.4 s; -16 LUFS. Video 45.9 s.
- Thabo (illustrated, `scripts/people.py`) acts through the film via `compositions/cast.html`
  (`scripts/make-cast.py`): worried at frame 0, smiles and nods on the roster, shock then sad on
  the CLOSED stamp, head down on "never saw it", smile on "Duly Qualified", delight on "twenty".
- Props moved to the top half at readable sizes; all moves ~1.4x slower.
- Word timings from per-paragraph whisper passes offset by the known paragraph starts.

## Measured vs looked at
- `check`: 0 errors; 1 warning kept: "REQUEST FOR BID" is under 28 px only while the notice grows
  in from the phone (0.9 s).
- Snapshots looked at; sound measured, not heard.

## Weakest shot / next
- The month calendar slips are small at phone width; a push into one week would read better.
