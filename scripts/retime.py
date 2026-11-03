#!/usr/bin/env python3
"""Retime a Duly Qualified video to its voiceover.

usage: retime.py VIDEO_DIR [SCRIPT.txt]   (01-tender, 02-technicality or 03-cameras)

Reads VIDEO_DIR/assets/transcript.json (word times) and the script, then rewrites:
  - each scene's `const T = {...}` anchors (scene-local seconds),
  - index.html layer timings (via build-root.py),
  - the character's acting (via make-cast.py).
Anchors are written as words: ("closed", 1, +0.0) = the 1st "closed" after the previous anchor.
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
vdir = os.path.abspath(sys.argv[1]); name = os.path.basename(vdir)
# word times in the script's own spelling (aligned by build-captions.py, which also rewrites the captions)
_script = sys.argv[2] if len(sys.argv) > 2 else f"/tmp/claude-0/tts/out/{name}.txt"
_aligned = json.loads(subprocess.run([sys.executable, f"{HERE}/build-captions.py", _script, f"{vdir}/assets/transcript.json",
                                      f"{vdir}/compositions/captions.html", "--skip-last-paragraph"], check=True, capture_output=True, text=True).stdout)
W = [dict(text=w, start=s, end=e) for w, s, e in _aligned["words"]]
PARAS = [round(a, 2) for a, b in _aligned["paragraphs"]]
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
END = W[-1]["end"]

def at(word, after=0.0, edge="start"):
    """time of the first word whose text starts with `word` at or after `after`"""
    for w in W:
        if w["start"] >= after - 0.05 and norm(w["text"]).startswith(norm(word)):
            return round(w[edge], 2)
    raise SystemExit(f"{name}: word '{word}' not found after {after}")

def para_starts():
    return PARAS

def set_T(scene, T):
    p = f"{vdir}/compositions/{scene}.html"; s = open(p).read()
    body = ", ".join(f"{k}: {round(v, 2)}" for k, v in T.items())
    s2, n = re.subn(r"const T = \{[^}]*\};", "const T = { " + body + " };", s, count=1)
    assert n == 1, (scene, "no T"); open(p, "w").write(s2)

def run(*a): subprocess.run([sys.executable, *a], check=True)

P = para_starts()
print(name, "paragraph starts", P, "end", END)

if name == "01-tender":
    s1, s2, s3, s4, s5 = P[:5]
    closed = at("closed", s2); never = at("never", closed)
    type_at = round(closed + 0.65, 2); type_dur = 1.55
    set_T("desk", dict(phoneOut=round(at("firm") + 0.4, 2), guards=at("twelve"), clients=at("good", at("guards")), busy=at("always"),
                       monday=s2, contract=at("two"), office=at("government"), closed=closed, neverSaw=max(never, round(type_at + type_dur, 2)), end=s3))
    set_T("month", dict(opens=at("open", s3) - s3, every=at("every", s3) - s3, closes=at("close", s3) - s3 + 1.2,
                        busy=at("busy", s3) - s3, end=s4 - s3))
    set_T("sample", dict(page=at("finds", s4) - s4, tenders=at("tenders", s4) - s4, dates=at("closing", s4) - s4, twenty=at("twenty", s4) - s4))
    endc = s5; total = round(END + 2.5, 2)
    layers = [["office", 0, endc], ["desk", 0, s3], ["month", s3, round(s4 - s3, 2)], ["sample", s4, round(endc - s4, 2)],
              ["cast", 0, endc], ["front", 0, endc], ["type", type_at, type_dur], ["endcard", endc, round(total - endc, 2)],
              ["captions", 0, total, "captions"]]
    title = "The tender we never saw"
    t = lambda x: round(x, 2)
    A = {"box": [10, 700, 530], "enter": 0, "duration": endc,
         "moods": [[0, "sad", 6], [t(at("firm") + 0.4), "smile", 0], [t(s2 + 0.05), "neutral", 6], [t(closed + 0.05), "shock", 3],
                   [t(type_at + type_dur), "sad", -6], [t(s3 + 0.2), "neutral", -6], [t(at("easy", s3)), "sad", -3],
                   [t(s4 + 0.1), "smile", 0], [t(at("twenty", s4)), "delight", -3]],
         "poses": [[0, "phone"], [t(at("firm") + 0.3), "none"], [t(at("good", at("guards"))), "thumb"], [t(at("always") + 0.6), "none"],
                   [t(s2 + 0.05), "phone"], [t(at("two") + 0.1), "none"], [t(at("government")), "point"], [t(closed - 0.3), "none"],
                   [t(closed + 0.15), "despair"], [t(type_at + type_dur + 0.9), "none"], [t(at("you", at("finds", s4))), "fist"],
                   [t(at("every", s4) + 0.6), "none"], [t(at("businesses", s4)), "thumb"]],
         "nods": [t(at("twelve") + 0.1), t(at("always") + 0.1), t(at("tenders", s4))],
         "jumps": [t(at("twenty", s4))], "slumps": [t(type_at + type_dur)],
         "moves": [[t(s4 - 0.3), 520, 1.0, 70]]}
    who, pre = "thabo", "th"
    # room: clock runs until the reveal; parallax drifts on the two whips
    p = f"{vdir}/compositions/office.html"; s = open(p).read()
    s = re.sub(r'duration: [\d.]+, ease: "power1.in" \}, 0\);\n    tl.fromTo\("#o-hour"', f'duration: {s4}, ease: "power1.in" }}, 0);\n    tl.fromTo("#o-hour"', s)
    s = re.sub(r'(\{ rotation: 40 \+ 270, svgOrigin: "75 75", duration: )[\d.]+', rf'\g<1>{s4}', s)
    s = re.sub(r'(\{ x: -24, duration: 0.6, ease: "power2.inOut" \}, )[\d.]+', rf'\g<1>{t(s3 - 0.2)}', s)
    s = re.sub(r'(\{ x: -48, duration: 0.6, ease: "power2.inOut" \}, )[\d.]+', rf'\g<1>{t(s4 - 0.2)}', s)
    open(p, "w").write(s)

elif name == "02-technicality":
    s1, s2, s3, s4, s5 = P[0], P[1], P[3] if len(P) > 6 else P[2], None, None
    s2 = at("then"); disq = at("disqualified"); s3 = at("her", disq); s4 = at("duly", s3); s5 = at("see", s4)
    type_at = round(disq + 0.35, 2); type_dur = 1.95
    set_T("bid", dict(lift=1.0, week=at("week") - 0.3, price=at("price") - 0.15, refs=at("references") - 0.1, letter=s2, disq=disq, end=s3))
    set_T("coida", dict(expired=at("expired", s3) - s3, before=at("weeks", s3) - s3, oneDoc=at("one", s3) - s3,
                        gone=at("gone", s3) - s3, end=s4 - s3))
    set_T("checklist", dict(page=at("keeps", s4) - s4, rows=at("checklist", s4) - s4, remind=at("reminds", s4) - s4,
                            ready=at("you", at("opens", s4)) - s4))
    endc = round(max(s5, at("ready", s4) + 1.8), 2); total = round(END + 2.5, 2)
    layers = [["office", 0, endc], ["bid", 0, s3], ["coida", s3, round(s4 - s3, 2)], ["checklist", s4, round(endc - s4, 2)],
              ["cast", 0, endc], ["front", 0, endc], ["type", type_at, type_dur], ["endcard", endc, round(total - endc, 2)],
              ["captions", 0, total, "captions"]]
    title = "Disqualified on a technicality"
    t = lambda x: round(x, 2)
    A = {"box": [10, 700, 530], "enter": 0, "duration": endc,
         "moods": [[0, "sad", 4], [1.1, "smile", 0], [t(s2 + 0.05), "neutral", 5], [t(disq + 0.05), "shock", 3],
                   [t(type_at + type_dur), "sad", -4], [t(at("expired", s3)), "sad", -3], [t(at("gone", s3)), "sad", -8],
                   [t(s4 + 0.1), "smile", 0], [t(at("reminds", s4)), "smile", -2], [t(at("ready", s4)), "delight", -3]],
         "poses": [[0, "despair"], [1.0, "none"], [t(at("week")), "point"], [t(at("office") + 0.3), "none"], [t(at("price") - 0.1), "thumb"],
                   [t(at("references") + 0.9), "none"], [t(s2 + 0.05), "point"], [t(disq - 0.7), "none"], [t(disq + 0.1), "despair"],
                   [t(type_at + type_dur + 0.4), "none"], [t(at("reminds", s4)), "phone"], [t(at("opens", s4) - 0.3), "none"],
                   [t(at("ready", s4) + 0.3), "fist"]],
         "nods": [t(at("price")), t(at("references")), t(at("so", s4))],
         "jumps": [t(at("ready", s4))], "slumps": [t(at("one", s3))],
         "moves": [[t(s4 - 0.3), 520, 1.0, 70]]}
    who, pre = "nomsa", "nm"
    p = f"{vdir}/compositions/office.html"; s = open(p).read()
    s = re.sub(r'(\{ x: -24, duration: 0.6, ease: "power2.inOut" \}, )[\d.]+', rf'\g<1>{t(s3 - 0.2)}', s)
    s = re.sub(r'(\{ x: -48, duration: 0.6, ease: "power2.inOut" \}, )[\d.]+', rf'\g<1>{t(s4 - 0.2)}', s)
    open(p, "w").write(s)

elif name == "03-cameras":
    s2 = at("driving"); s3 = at("new", s2 + 3); s4 = at("duly", s3); s5 = at("see", s4)
    another = at("another", s2); job = at("job", another)
    type_at = round(job + 0.15, 2); type_dur = 1.6
    set_T("site", dict(cardIn=1.2, driving=s2, corners=at("cameras", s2), gates=at("gate", s2), another=another,
                       never=max(at("never", another), round(type_at + type_dur, 2)), end=s3))
    set_T("metro", dict(rise=at("buildings", s3) - s3 - 0.1, fitted=at("security", s3) - s3, end=s4 - s3))
    set_T("sites", dict(page=at("finds", s4) - s4, rows=at("sites", s4) - s4, contact=at("contact", s4) - s4, msg=at("first", s4) - s4))
    endc = round(max(s5 + 1.1, at("ready", s4) + 3.2), 2); total = round(END + 2.5, 2)
    layers = [["office", 0, endc], ["site", 0, s3], ["metro", s3, round(s4 - s3, 2)], ["sites", s4, round(endc - s4, 2)],
              ["cast", 0, endc], ["front", 0, endc], ["type", type_at, type_dur], ["endcard", endc, round(total - endc, 2)],
              ["captions", 0, total, "captions"]]
    title = "Someone else’s cameras"
    t = lambda x: round(x, 2)
    A = {"box": [10, 700, 530], "enter": 0, "duration": endc,
         "moods": [[0, "sad", 6], [1.3, "smile", 0], [t(s2 + 0.05), "neutral", 6], [t(another + 0.05), "shock", 5],
                   [t(type_at + type_dur), "sad", -8], [t(s3 + 0.2), "neutral", 0], [t(at("security", s3)), "neutral", 4],
                   [t(s4 + 0.1), "smile", 0], [t(at("first", s4)), "delight", -3]],
         "poses": [[0, "despair"], [1.2, "none"], [t(at("cctv")), "thumb"], [t(at("bay") + 0.5), "none"], [t(at("shopping", s2)), "point"],
                   [t(at("cameras", s2)), "none"], [t(another + 0.1), "despair"], [t(type_at + type_dur + 1.0), "none"],
                   [t(at("security", s3)), "point"], [t(s4 - 0.8), "none"], [t(at("contact", s4)), "thumb"], [t(at("first", s4)), "fist"]],
         "nods": [t(at("cctv") + 0.3), t(at("corner", s2)), t(at("entrance", s2))],
         "jumps": [t(at("first", s4))], "slumps": [t(type_at + type_dur)],
         "moves": [[t(s4 - 0.3), 520, 1.0, 110]]}
    who, pre = "sipho", "sp"
    p = f"{vdir}/compositions/office.html"; s = open(p).read()
    s = re.sub(r'(\{ x: -20, duration: 0.6, ease: "power2.inOut" \}, )[\d.]+', rf'\g<1>{t(s3 - 0.2)}', s)
    s = re.sub(r'(\{ x: -60, duration: 0.6, ease: "power2.inOut" \}, )[\d.]+', rf'\g<1>{t(s3 - 0.2)}', s)
    s = re.sub(r'(\{ x: -40, duration: 0.6, ease: "power2.inOut" \}, )[\d.]+', rf'\g<1>{t(s4 - 0.2)}', s)
    s = re.sub(r'(\{ x: 600, duration: 0.9, ease: "power2.in" \}, )[\d.]+', rf'\g<1>{t(s4 - 0.2)}', s)
    open(p, "w").write(s)
    p = f"{vdir}/compositions/front.html"; s = open(p).read()
    s = re.sub(r'(duration: 3.2, ease: "power1.inOut" \}, )[\d.]+', rf'\g<1>{s2}', s); open(p, "w").write(s)

# blinks every ~3 s, skipping big reactions
A["blinks"] = [round(x + 0.7, 2) for x in range(1, int(A["duration"]), 3)]
cfg = {"title": title, "total": total, "layers": layers}
json.dump(cfg, open(f"/tmp/claude-0/{name}_root.json", "w")); json.dump(A, open(f"/tmp/claude-0/{name}_acting.json", "w"))
run(f"{HERE}/build-root.py", vdir, f"/tmp/claude-0/{name}_root.json")
run(f"{HERE}/make-cast.py", who, pre, f"{vdir}/compositions/cast.html", f"/tmp/claude-0/{name}_acting.json")
print(json.dumps(layers))
