#!/usr/bin/env python3
"""Kinetic type layer: every spoken phrase becomes big type, each word landing as it is said.

usage: kinetic.py WORDS.json PLAN.json OUT.html
WORDS.json  build-captions.py output ({"words": [[text, start, end], ...]}).
PLAN.json   {"groups": [{"w": [first, last], "style": "blur|slam|mask|type|hero", "size": 110,
                         "y": 300, "color": "navy|ivory", "acc": [word indices], "hold": 0.0,
                         "align": "center|left", "x": 60, "end": optional seconds}, ...]}
Accent words are set in Newsreader italic, signature red. A group ends where the next one
starts (or at "end"), leaving with a short blur-out.
"""
import json, sys, html

words = json.load(open(sys.argv[1]))["words"]
plan = json.load(open(sys.argv[2]))["groups"]
out = sys.argv[3]
COL = {"navy": "#14213D", "ivory": "#F2F1EC", "red": "#C8372D"}

items, js = [], []
prev_end = 0.0
for gi, g in enumerate(plan):
    a, b = g["w"]
    ws = words[a:b + 1]
    start = round(max(0.02, ws[0][1] - 0.12, prev_end + 0.01), 3)
    nxt = plan[gi + 1] if gi + 1 < len(plan) else None
    end = g.get("end") or (round(words[nxt["w"][0]][1] - 0.14, 3) if nxt else round(ws[-1][2] + 1.2, 3))
    # never run into the next phrase; hold at least a beat after the last word starts
    end = max(end, ws[-1][1] + 0.25)
    if nxt: end = min(end, round(words[nxt["w"][0]][1] - 0.04, 3))
    prev_end = end
    dur = round(end - start, 3)
    size, y, color = g.get("size", 110), g.get("y", 300), COL[g.get("color", "navy")]
    align = g.get("align", "center"); x = g.get("x", 60)
    acc = set(g.get("acc", []))
    spans = []
    for k, (t, s, e) in enumerate(ws):
        idx = a + k
        txt = html.escape(t)
        cls = "kw acc" if idx in acc else "kw"
        if g["style"] in ("type", "hero"):
            inner = "".join(f'<span class="ch">{c if c != " " else "&nbsp;"}</span>' for c in t)
            spans.append(f'<span class="{cls}" id="k{gi}w{k}">{inner}</span>')
        elif g["style"] == "mask":
            spans.append(f'<span class="mk"><span class="{cls}" id="k{gi}w{k}">{txt}</span></span>')
        else:
            spans.append(f'<span class="{cls}" id="k{gi}w{k}">{txt}</span>')
    left = 0 if align == "center" else x
    width = 1080 if align == "center" else 1080 - x - 60
    items.append(
        f'    <div id="k{gi}" class="kg clip" data-start="{start}" data-duration="{dur}" '
        f'style="top:{y}px; left:{left}px; width:{width}px; text-align:{align}; font-size:{size}px; color:{color};">'
        f'<div class="kin" id="k{gi}in">{" ".join(spans)}</div></div>')
    # per-style entrances, each word on its own spoken time (scene-local == film time here)
    st = g["style"]
    if st == "slam":
        js.append(f'tl.fromTo("#k{gi}in", {{ scale: 1.45, opacity: 0, filter: "blur(12px)" }}, {{ scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power4.out" }}, {start + 0.1});')
        js.append(f'tl.fromTo("#k{gi}in", {{ x: 0 }}, {{ keyframes: {{ x: [0, -9, 7, -4, 0] }}, duration: 0.16, ease: "none" }}, {start + 0.3});')
    for k, (t, s, e) in enumerate(ws):
        s = round(max(start + 0.02, s - 0.06), 3)
        sel = f"#k{gi}w{k}"
        if st == "blur":
            js.append(f'tl.fromTo("{sel}", {{ opacity: 0, y: 26, filter: "blur(10px)" }}, {{ opacity: 1, y: 0, filter: "blur(0px)", duration: 0.24, ease: "expo.out" }}, {s});')
        elif st == "mask":
            js.append(f'tl.fromTo("{sel}", {{ yPercent: 110 }}, {{ yPercent: 0, duration: 0.32, ease: "expo.out" }}, {s});')
        elif st == "type":
            n = max(1, len(t)); step = min(0.05, max(0.02, (e - s) / n))
            js.append(f'tl.fromTo("{sel} .ch", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.01, stagger: {step:.3f}, ease: "none" }}, {s});')
        elif st == "hero":
            js.append(f'tl.fromTo("{sel} .ch", {{ opacity: 0, yPercent: 60, rotation: 8, filter: "blur(8px)" }}, {{ opacity: 1, yPercent: 0, rotation: 0, filter: "blur(0px)", duration: 0.42, stagger: 0.045, ease: "back.out(2)" }}, {s});')
        if (a + k) in acc and st != "hero":
            js.append(f'tl.fromTo("{sel}", {{ scale: 1.35 }}, {{ scale: 1, duration: 0.45, ease: "back.out(2.4)" }}, {s});')
    # exit: blur out and lift
    js.append(f'tl.to("#k{gi}in", {{ opacity: 0, y: -30, filter: "blur(10px)", duration: 0.14, ease: "power2.in" }}, {round(end - 0.15, 3)});')

JS = "\n    ".join(js)
ITEMS = "\n".join(items)
doc = f'''<html>
<template>
  <style>
    #root {{ position: absolute; inset: 0; }}
    @font-face {{ font-family: 'Hanken Grotesk'; font-style: normal; font-weight: 100 900; src: url('assets/fonts/HankenGrotesk.woff2') format('woff2'); }}
    @font-face {{ font-family: 'Newsreader'; font-style: italic; font-weight: 200 800; src: url('assets/fonts/Newsreader-italic.woff2') format('woff2'); }}
    .kg {{ position: absolute; font-family: 'Hanken Grotesk', sans-serif; font-weight: 800; line-height: 1.02; letter-spacing: -0.035em; }}
    .kin {{ display: block; }}
    .kw {{ display: inline-block; white-space: nowrap; transform-origin: 50% 70%; }}
    .acc {{ font-family: 'Newsreader', serif; font-style: italic; font-weight: 500; color: #C8372D; letter-spacing: -0.01em; font-size: 1.08em; }}
    .mk {{ display: inline-block; overflow: hidden; vertical-align: bottom; padding: 0 0.04em 0.08em; }}
    .ch {{ display: inline-block; }}
  </style>
  <div id="root" data-composition-id="kinetic" data-width="1080" data-height="1920">
{ITEMS}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {JS}
    window.__timelines["kinetic"] = tl;
  </script>
</template>
</html>
'''
open(out, "w").write(doc)
print("wrote", out, len(plan), "groups")
