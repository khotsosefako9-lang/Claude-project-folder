#!/usr/bin/env python3
"""Flat illustrated people for the Duly Qualified videos, as inline SVG.

usage: people.py NAME PREFIX        prints the <svg> for one character
       NAME is one of: thabo, nomsa, sipho, sizwe

Each character is a half-length figure on a 600 x 760 viewBox with named parts so a scene's
GSAP timeline can act it:
  #P-body   torso (breath)        #P-head   head group (nod, tilt, take)
  #P-eyes   both eyes (blink)     #P-bl / #P-br   brows (worry = inner ends up)
  #P-m-smile / -neutral / -sad / -open   mouth states (one visible at a time)
  #P-arm    raised forearm + hand (hidden unless a scene shows it)
Colours: navy #14213D ink, ivory #F2F1EC, warm neutrals; red is never used on people.
"""
import sys

NAVY, IVORY, SAND = "#14213D", "#F2F1EC", "#E7E3D8"

PEOPLE = {
    # skin, hair colour, top colour, collar colour, hair style, extra
    "thabo": dict(skin="#7A4A2A", shade="#64391F", hair="#1B1410", top=NAVY, collar=IVORY, style="short", beard=True, extra="lapel"),
    "nomsa": dict(skin="#8B5530", shade="#71421F", hair="#17110D", top="#5B6F8F", collar=IVORY, style="bun", beard=False, extra="earrings"),
    "sipho": dict(skin="#6A3F24", shade="#55311A", hair="#17110D", top="#3E4A5E", collar=SAND, style="cap", beard=False, extra="vest"),
    "sizwe": dict(skin="#9A6038", shade="#7E4B2A", hair="#201812", top="#4A5568", collar=IVORY, style="short", beard=False, extra="none"),
}


def svg(name, p):
    c = PEOPLE[name]
    sk, sh, hr, top, col = c["skin"], c["shade"], c["hair"], c["top"], c["collar"]
    hair = ""
    if c["style"] == "short":
        hair = (f'<path d="M193 236 C190 150 240 112 300 112 C362 112 410 150 407 236 C398 196 372 172 300 170 C230 172 202 196 193 236Z" fill="{hr}"/>')
    elif c["style"] == "bun":
        hair = (f'<circle cx="300" cy="104" r="52" fill="{hr}"/>'
                f'<path d="M188 250 C182 150 236 120 300 120 C366 120 418 150 412 250 C402 200 376 168 300 166 C226 168 198 200 188 250Z" fill="{hr}"/>')
    elif c["style"] == "cap":
        hair = (f'<path d="M196 214 C196 146 244 116 300 116 C358 116 404 146 404 214Z" fill="{NAVY}"/>'
                f'<path d="M300 200 C350 198 420 204 452 222 C430 232 380 228 300 222Z" fill="{NAVY}"/>'
                f'<rect x="282" y="140" width="36" height="22" rx="4" fill="{IVORY}"/>')
    beard = (f'<path d="M212 300 C222 372 262 398 300 398 C338 398 378 372 388 300 C376 352 344 372 300 372 C256 372 224 352 212 300Z" fill="{hr}" opacity=".9"/>'
             if c["beard"] else "")
    extra = ""
    if c["extra"] == "lapel":
        extra = (f'<path d="M248 440 L300 530 L352 440 L332 432 L300 490 L268 432Z" fill="{col}"/>'
                 f'<path d="M300 490 L292 518 L300 610 L308 518Z" fill="#C9C6BC"/>'
                 f'<path d="M228 438 L300 570 L250 760 L150 760 L170 480Z" fill="#0E1830"/>'
                 f'<path d="M372 438 L300 570 L350 760 L450 760 L430 480Z" fill="#0E1830"/>')
    elif c["extra"] == "earrings":
        extra = (f'<circle cx="196" cy="316" r="10" fill="#D9A441"/><circle cx="404" cy="316" r="10" fill="#D9A441"/>'
                 f'<path d="M248 436 C270 474 330 474 352 436 L340 432 C322 458 278 458 260 432Z" fill="{col}"/>')
    elif c["extra"] == "vest":
        extra = (f'<path d="M178 500 L246 440 L266 760 L150 760Z" fill="#D9A441"/>'
                 f'<path d="M422 500 L354 440 L334 760 L450 760Z" fill="#D9A441"/>'
                 f'<rect x="178" y="620" width="96" height="14" fill="{IVORY}"/><rect x="326" y="620" width="96" height="14" fill="{IVORY}"/>'
                 f'<path d="M258 434 L300 486 L342 434Z" fill="{col}"/>')
    else:
        extra = f'<path d="M258 434 L300 486 L342 434Z" fill="{col}"/>'
    return f'''<svg id="{p}" class="person" viewBox="0 0 600 760" xmlns="http://www.w3.org/2000/svg" aria-label="{name}">
  <g id="{p}-body">
    <path d="M70 760 C76 580 140 470 226 440 C254 430 346 430 374 440 C460 470 524 580 530 760Z" fill="{top}"/>
    {extra}
    <path id="{p}-arm" d="M420 760 C430 660 452 600 470 560 L520 470 C530 452 560 456 556 480 L536 560 C520 620 500 690 492 760Z" fill="{top}" opacity="0"/>
  </g>
  <rect x="256" y="370" width="88" height="80" rx="30" fill="{sh}"/>
  <g id="{p}-head">
    <ellipse cx="196" cy="272" rx="22" ry="34" fill="{sh}"/>
    <ellipse cx="404" cy="272" rx="22" ry="34" fill="{sh}"/>
    <ellipse cx="300" cy="262" rx="108" ry="132" fill="{sk}"/>
    {hair}
    {beard}
    <g id="{p}-eyes">
      <ellipse cx="262" cy="262" rx="11" ry="14" fill="{NAVY}"/>
      <ellipse cx="338" cy="262" rx="11" ry="14" fill="{NAVY}"/>
      <circle cx="266" cy="257" r="3.5" fill="{IVORY}"/><circle cx="342" cy="257" r="3.5" fill="{IVORY}"/>
    </g>
    <path id="{p}-bl" d="M236 226 C248 216 270 214 284 220" fill="none" stroke="{hr}" stroke-width="9" stroke-linecap="round"/>
    <path id="{p}-br" d="M316 220 C330 214 352 216 364 226" fill="none" stroke="{hr}" stroke-width="9" stroke-linecap="round"/>
    <path d="M300 270 C294 296 290 306 298 312 C304 314 310 312 312 308" fill="none" stroke="{sh}" stroke-width="6" stroke-linecap="round"/>
    <path id="{p}-m-smile" d="M262 336 C278 356 322 356 338 336" fill="none" stroke="{NAVY}" stroke-width="8" stroke-linecap="round"/>
    <path id="{p}-m-neutral" d="M270 344 C286 348 314 348 330 344" fill="none" stroke="{NAVY}" stroke-width="8" stroke-linecap="round" opacity="0"/>
    <path id="{p}-m-sad" d="M266 354 C282 338 318 338 334 354" fill="none" stroke="{NAVY}" stroke-width="8" stroke-linecap="round" opacity="0"/>
    <path id="{p}-m-open" d="M260 334 C276 372 324 372 340 334 Z" fill="{NAVY}" opacity="0"/>
  </g>
</svg>'''


if __name__ == "__main__":
    print(svg(sys.argv[1], sys.argv[2]))
