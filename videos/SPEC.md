# SPEC — Duly Qualified "The paper trail" (series of 3)

GOAL:    a Port Elizabeth small-business owner watching on WhatsApp Status thinks "that's happened
         to me" and taps through to dulyqualified.co.za to see this month's sample.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps, one project per video (videos/01-tender,
         videos/02-technicality, videos/03-cameras).
TIME:    the voiceover is the clock; each video = voice length + 2.5 s end-card hold
         (≈ 37–40 s ≈ 1110–1200 frames). No music bed (no licensed source on this account);
         voice only, -16 LUFS.

LOOK:    ground  Warm ivory #F2F1EC with 3% paper fibre noise (SVG feTurbulence, static), no gradient.
         ink     Primary navy #14213D: every word, rule and outline.
         accent  Signature red #C8372D, only on: the loss (strike-through, stamp, expired date) and the
                 Q's tail on the end card. Never on the solution side.
         paper   Documents are white #FFFFFF cards, 0 radius, 2 px navy/12% border, shadow
                 0 18px 40px rgba(20,33,61,.18); each sits 1–3° off square like paper on a desk.
         phone   WhatsApp-style chat: 760 px wide device, 56 px radius, navy bezel 18 px; bubbles
                 #FFFFFF (incoming) on #E7E3D8 chat ground; no WhatsApp logo or green.
         type    Display: Outfit 800, 104–150 px, tracking -2%, max 5 words a line.
                 Body/document: Inter 400/700, 34–44 px; nothing read under 30 px.
         safe    Words only inside y 168–1330; captions sit at y 1180–1320, nothing else there.
OBJECTS: duty roster (12 guard rows), tender notice (RFB header, service, period, closing date),
         month calendar, bid cover page, outcome letter in an envelope, COIDA letter of good standing
         with "valid until", document checklist, shopping-centre front with cameras and gate readers,
         DQ monthly sample page (DQ monogram header, list rows with dates), phone with a reminder.
         All names and businesses fictional; no real department, tender number or company.
MOTION:  enter  expo.out 0.5–0.7 s (paper lands with 1 overshoot-free settle);
         move   power2.inOut 0.6–0.9 s (camera pushes, pulls, slides between papers);
         exit   power3.in 0.3–0.4 s;
         stamp  scale 1.6 → 1 in 0.14 s power4.out + 6 px frame shake 0.12 s, once per video.
         Hand-off between shots = the next paper slides in over / out from under the current one
         (object-to-object chain); one hero move per shot; landed text holds dead still.
SHOTS:   anchored to the voice's paragraph starts (word times from the transcript):
         1 hook (0–P1+1.8 s): the loss already on screen at frame 0.
         2 world (P1): who they are — one object, filling ≥ 60% of frame height.
         3 the miss (P2): the item that cost them, close-up; red appears here only.
         4 wider (P3): the same miss repeating across the Bay/metro — calendar or skyline.
         5 reveal + proof (P4): "Duly Qualified" lands, the sample page builds row by row on the words.
         6 end card (P5 → end): monogram carried in, D then Q, red tail last; URL; hold ≥ 2.5 s.
CAPTIONS: 3–5 word groups, Inter 700 56–64 px navy on a 92% ivory plate, centred, y ≈ 1250;
         one group at a time, never repeats on-screen copy word for word as a title.
BANNED:  dark navy void as ground; glow/particles; serif display, mono caps labels, pill chips;
         three cards in a row; fade-and-slide-up on everything; text moving while read;
         logo docked in a corner; WhatsApp branding; real company/department names.
QA:      t=0 (hook reads without sound), each paragraph start +1 s, the stamp/strike frame,
         the sample-page full frame, last frame (end card complete).
