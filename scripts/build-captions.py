#!/usr/bin/env python3
"""Build a HyperFrames captions composition from a script and a word-timed transcript.

usage: build-captions.py SCRIPT.txt TRANSCRIPT.json OUT.html [--skip-last-paragraph]

SCRIPT.txt       the exact script (paragraphs separated by blank lines); its spelling is shown.
TRANSCRIPT.json  `npx hyperframes transcribe` output: [{"text","start","end"}, ...]
Words are aligned by sequence matching, so transcription mistakes ("Tabbo" for "Thabo") keep
the script's spelling and take the matched word's time; unmatched words are interpolated.
Also prints paragraph start/end times as JSON for timing scenes.
"""
import json, re, sys, difflib

def norm(w):
    return re.sub(r"[^a-z0-9]", "", w.lower())

def main():
    script_p, trans_p, out_p = sys.argv[1:4]
    skip_last = "--skip-last-paragraph" in sys.argv
    paras = [p.split() for p in re.split(r"\n\s*\n", open(script_p).read().strip()) if p.strip()]
    words = [(w, pi) for pi, p in enumerate(paras) for w in p]
    tr = json.load(open(trans_p))
    tr = tr.get("words", tr) if isinstance(tr, dict) else tr
    tr = [t for t in tr if norm(t.get("text", t.get("word", "")))]
    a = [norm(w) for w, _ in words]
    b = [norm(t.get("text", t.get("word", ""))) for t in tr]
    times = [None] * len(words)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        tag, i1, i2, j1, j2 = blk
        if tag in ("equal", "replace") and i2 - i1 and j2 - j1:
            # spread the matched transcript span across the script span
            s, e = tr[j1]["start"], tr[j2 - 1]["end"]
            n = i2 - i1
            for k in range(n):
                times[i1 + k] = (s + (e - s) * k / n, s + (e - s) * (k + 1) / n)
    # interpolate any gaps
    for i in range(len(times)):
        if times[i] is None:
            prev = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), 0.0)
            nxt = next((times[j][0] for j in range(i + 1, len(times)) if times[j]), prev + 0.4)
            times[i] = (prev, max(prev + 0.05, nxt))
    # paragraph windows
    pw = {}
    for (w, pi), (s, e) in zip(words, times):
        pw.setdefault(pi, [s, e]); pw[pi][1] = e
    print(json.dumps({"paragraphs": [[round(v[0], 2), round(v[1], 2)] for _, v in sorted(pw.items())],
                      "words": [[w, round(s, 2), round(e, 2)] for (w, _), (s, e) in zip(words, times)]}))
    # groups: 3-5 words, break at sentence end, a 150 ms pause, or 5 words
    groups, cur = [], []
    last_p = len(paras) - 1
    for i, ((w, pi), (s, e)) in enumerate(zip(words, times)):
        if skip_last and pi == last_p:
            break
        cur.append((w, s, e))
        nxt_gap = (times[i + 1][0] - e) if i + 1 < len(times) else 1
        end_sentence = w.endswith((".", "?", "!", ":"))
        if len(cur) >= 5 or end_sentence or (nxt_gap >= 0.15 and len(cur) >= 3) or (i + 1 < len(words) and words[i + 1][1] != pi):
            groups.append(cur); cur = []
    if cur: groups.append(cur)
    items = []
    for gi, g in enumerate(groups):
        start = max(0.1, g[0][1] - 0.05)
        nxt = groups[gi + 1][0][1] - 0.05 if gi + 1 < len(groups) else g[-1][2] + 0.6
        end = min(max(g[-1][2] + 0.25, start + 0.6), nxt)
        text = " ".join(w for w, _, _ in g)
        items.append((gi, round(start, 2), round(end - start, 2), text))
    html = ["<html>", "<template>", "  <style>",
            "    #root { position: absolute; inset: 0; }",
            "    .cap { position: absolute; left: 0; width: 1080px; top: 1196px; text-align: center; }",
            "    .cap span { display: inline-block; max-width: 900px; padding: 14px 30px; background: rgba(242,241,236,.92);",
            "      font-family: Inter, sans-serif; font-weight: 700; font-size: 58px; line-height: 1.15; color: #14213D; }",
            "  </style>",
            '  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">']
    for gi, s, d, t in items:
        t = t.replace("&", "&amp;").replace("<", "&lt;")
        html.append(f'    <div id="cap{gi}" class="cap clip" data-start="{s}" data-duration="{d}"><span>{t}</span></div>')
    html += ["  </div>", "  <script>", "    const tl = gsap.timeline({ paused: true });"]
    for gi, s, d, t in items:
        html.append(f'    tl.fromTo("#cap{gi} span", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.08, ease: "power2.out" }}, {s});')
    html += ['    window.__timelines["captions"] = tl;', "  </script>", "</template>", "</html>", ""]
    open(out_p, "w").write("\n".join(html))

if __name__ == "__main__":
    main()
