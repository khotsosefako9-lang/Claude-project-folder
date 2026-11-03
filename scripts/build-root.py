#!/usr/bin/env python3
"""Write a video's index.html from a small JSON layout.

usage: build-root.py VIDEO_DIR CONFIG.json
CONFIG: {"title": "...", "total": 40.35,
         "layers": [["office", 0, 34.28], ["desk", 0, 16.71], ..., ["captions", 0, 40.35, "captions"]]}
Layers are stacked in the order given (first = back); the last value, if "captions", marks the
captions track. The voice is assets/voice.mp3 from 0.
"""
import json, sys
d, cfg = sys.argv[1], json.load(open(sys.argv[2]))
total = cfg["total"]
head = f'''<!doctype html>
<html lang="en" data-resolution="portrait"
  data-composition-variables='[{{"id":"ivory","type":"color","label":"Ground (warm ivory)","default":"#F2F1EC"}},{{"id":"navy","type":"color","label":"Ink (primary navy)","default":"#14213D"}},{{"id":"red","type":"color","label":"Accent (signature red)","default":"#C8372D"}}]'>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Duly Qualified — {cfg["title"]}</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      :root {{ --ivory: #F2F1EC; --navy: #14213D; --red: #C8372D; }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: 1080px; height: 1920px; overflow: hidden; background: var(--ivory); }}
      #ground {{ position: absolute; inset: 0; background-color: var(--ivory);
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 .08  0 0 0 0 .13  0 0 0 0 .24  0 0 0 .05 0'/></filter><rect width='400' height='400' filter='url(%23n)'/></svg>"); }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="1080" data-height="1920">
      <div id="ground" class="clip" data-start="0" data-duration="{total}" data-track-index="0" data-track-kind="graphics" style="z-index:1"></div>
'''
body = ""
for z, layer in enumerate(cfg["layers"], start=2):
    i, s, dur = layer[:3]
    kind = layer[3] if len(layer) > 3 else "graphics"
    track = {"captions": 9}.get(kind, 1 + (z % 6))
    body += f'''      <div id="{i}" data-composition-id="{i}" data-composition-src="compositions/{i}.html"
        data-start="{s}" data-duration="{dur}" data-track-index="{track}" data-track-kind="{kind}"
        data-width="1080" data-height="1920" style="z-index:{z}"></div>
'''
tail = f'''      <audio id="voice" class="clip" src="assets/voice.mp3" data-start="0" data-track-index="10" data-volume="1"></audio>
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
'''
open(f"{d}/index.html", "w").write(head + body + tail)
print("wrote", f"{d}/index.html", len(cfg["layers"]), "layers")
