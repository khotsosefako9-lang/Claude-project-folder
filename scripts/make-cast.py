#!/usr/bin/env python3
"""Write a HyperFrames "cast" scene: one illustrated person who acts through the film.

usage: make-cast.py NAME PREFIX OUT.html ACTING.json
ACTING.json: {
  "box":   [x, y, w],                       # where the person stands (px); height = w * 760/600
  "enter": 0.0,                              # seconds the person is already on screen from
  "exit":  [t, "down"],                      # leaves by sliding down at t (optional)
  "moods": [[t, "sad"|"smile"|"neutral"|"shock"|"delight", tilt_deg], ...],
  "moves": [[t, x_offset_px, duration], ...] # slides along the floor (optional)
  "blinks": [t, ...],
  "nods": [t, ...],
  "duration": total seconds
}
Moods change through a take: a small dip (anticipation), the new face, then a settle.
"""
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
import people

name, p, out, acting = sys.argv[1:5]
A = json.load(open(acting))
x, y, w = A["box"]; h = round(w * 760 / 600)
svg = people.svg(name, p)

html = f'''<html>
<template>
  <style>
    #root {{ position: absolute; inset: 0; }}
    #{p}-wrap {{ position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; }}
    #{p}-wrap svg {{ width: 100%; height: 100%; display: block; overflow: visible; }}
    #{p}-head {{ transform-box: fill-box; transform-origin: 50% 90%; }}
    #{p}-body {{ transform-box: fill-box; transform-origin: 50% 100%; }}
    #{p}-eyes {{ transform-box: fill-box; transform-origin: 50% 50%; }}
    #{p}-bl {{ transform-box: fill-box; transform-origin: 100% 50%; }}
    #{p}-br {{ transform-box: fill-box; transform-origin: 0% 50%; }}
  </style>
  <div id="root" data-composition-id="cast" data-width="1080" data-height="1920">
    <div id="{p}-wrap" data-layout-allow-overflow data-layout-ignore>
{svg}
    </div>
  </div>
  <script>
    const A = {json.dumps(A)};
    const P = "{p}";
    const tl = gsap.timeline({{ paused: true }});
    const MOUTH = {{ smile: "smile", neutral: "neutral", sad: "sad", shock: "open", delight: "open" }};
    const BROW = {{ smile: [0, 0], neutral: [0, 0], sad: [14, 0], shock: [10, -10], delight: [-4, -12] }};
    const q = (s) => `#${{P}}-${{s}}`;
    // start state
    tl.set(["smile","neutral","sad","open"].map(k => q("m-" + k)), {{ opacity: 0 }}, 0);
    const m0 = A.moods[0];
    tl.set(q("m-" + MOUTH[m0[1]]), {{ opacity: 1 }}, 0);
    tl.set(q("bl"), {{ rotation: BROW[m0[1]][0], y: BROW[m0[1]][1] }}, 0);
    tl.set(q("br"), {{ rotation: -BROW[m0[1]][0], y: BROW[m0[1]][1] }}, 0);
    tl.set(q("head"), {{ rotation: m0[2] || 0, y: 0 }}, 0);
    // entrance: rises into frame unless already there at frame 0
    if (A.enter > 0) tl.fromTo(`#${{P}}-wrap`, {{ y: 760 }}, {{ y: 0, duration: 0.9, ease: "expo.out" }}, A.enter);
    // moods, each through a take
    A.moods.slice(1).forEach(([t, mood, tilt]) => {{
      tl.to(q("head"), {{ y: 8, duration: 0.14, ease: "power2.in" }}, t - 0.14);
      tl.to(q("head"), {{ y: 0, rotation: tilt || 0, duration: 0.5, ease: "back.out(2.2)" }}, t);
      ["smile","neutral","sad","open"].forEach(k => tl.to(q("m-" + k), {{ opacity: k === MOUTH[mood] ? 1 : 0, duration: 0.08, ease: "none" }}, t));
      tl.to(q("bl"), {{ rotation: BROW[mood][0], y: BROW[mood][1], duration: 0.3, ease: "power2.out" }}, t - 0.04);
      tl.to(q("br"), {{ rotation: -BROW[mood][0], y: BROW[mood][1], duration: 0.3, ease: "power2.out" }}, t);
      tl.fromTo(q("body"), {{ scaleY: 1 }}, {{ keyframes: {{ scaleY: [1, 0.975, 1.012, 1] }}, duration: 0.55, ease: "power1.inOut", immediateRender: false }}, t - 0.1);
    }});
    // nods (head leads, body follows a beat later, by less)
    (A.nods || []).forEach(t => {{
      tl.to(q("head"), {{ keyframes: {{ y: [0, 10, 0, 7, 0] }}, duration: 0.7, ease: "power1.inOut" }}, t);
    }});
    // blinks
    (A.blinks || []).forEach(t => {{
      tl.to(q("eyes"), {{ scaleY: 0.1, duration: 0.06, ease: "power2.in" }}, t);
      tl.to(q("eyes"), {{ scaleY: 1, duration: 0.09, ease: "power2.out" }}, t + 0.06);
    }});
    // slides along the floor
    (A.moves || []).forEach(([t, dx, d, dy]) => tl.to(`#${{P}}-wrap`, {{ x: dx, y: dy || 0, duration: d, ease: "power2.inOut" }}, t));
    // breath: a slow, finite rise and fall of the shoulders
    const breaths = Math.floor(A.duration / 1.8);
    tl.fromTo(q("body"), {{ y: 0 }}, {{ y: -5, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: breaths }}, 0);
    if (A.exit) tl.to(`#${{P}}-wrap`, {{ y: 900, duration: 0.6, ease: "power3.in" }}, A.exit[0]);
    window.__timelines["cast"] = tl;
  </script>
</template>
</html>
'''
open(out, "w").write(html)
print("wrote", out)
