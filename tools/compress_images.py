"""Make web-sized copies of a page's oversized images, keeping the same filenames.

Usage: python3 compress_images.py <page-url> OUT_DIR [--min-kb 300] [--max-width 1920] [--quality 80]
Loads the page in a phone-sized and a desktop-sized browser, collects every image over --min-kb,
downloads each original once, writes a resized/recompressed copy with the same name and format
to OUT_DIR/optimized/, keeps the original in OUT_DIR/original/, and writes OUT_DIR/report.csv with
before/after sizes. Nothing on the live site is touched; the client (or Claude with access)
uploads the optimized files.
"""
import argparse
import csv
import io
import subprocess
import json
import sys
from pathlib import Path
from urllib.parse import urlparse, unquote

import requests
from PIL import Image, ImageOps

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"}

COLLECT = r"""
const { chromium } = require('playwright');
(async () => {
  const [url, minBytes] = [process.argv[1], Number(process.argv[2])];
  const found = new Map();
  const b = await chromium.launch();
  for (const vp of [{ width: 390, height: 844, isMobile: true }, { width: 1440, height: 900, isMobile: false }]) {
    const p = await b.newPage({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile });
    p.on('response', async (r) => {
      if (r.request().resourceType() !== 'image') return;
      try { const n = Number((await r.allHeaders())['content-length'] || 0); if (n >= minBytes) found.set(r.url(), n); } catch (_) {}
    });
    await p.goto(url, { waitUntil: 'load', timeout: 60000 });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } });
    await p.waitForTimeout(1500);
    await p.close();
  }
  await b.close();
  console.log(JSON.stringify([...found.entries()]));
})();
"""


def collect(url, min_kb):
    out = subprocess.run(["node", "-e", COLLECT, url, str(min_kb * 1024)], capture_output=True, text=True, timeout=300)
    if out.returncode:
        sys.exit(out.stderr)
    return json.loads(out.stdout.strip().splitlines()[-1])


ORIENT = {2: [Image.Transpose.FLIP_LEFT_RIGHT], 3: [Image.Transpose.ROTATE_180], 4: [Image.Transpose.FLIP_TOP_BOTTOM],
          5: [Image.Transpose.TRANSPOSE], 6: [Image.Transpose.ROTATE_270], 7: [Image.Transpose.TRANSVERSE],
          8: [Image.Transpose.ROTATE_90]}


def upright(img):
    try:
        tag = img.getexif().get(274, 1)
    except Exception:
        return img
    for op in ORIENT.get(tag, []):
        img = img.transpose(op)
    return img


def optimize(data, name, max_width, quality):
    """Re-encode in the format the filename promises, so the file drops straight back in.

    Sites often serve PNGs under .jpg names; writing a real JPEG fixes that too.
    """
    img = Image.open(io.BytesIO(data))
    if img.format == "GIF" and getattr(img, "is_animated", False):
        return None, "animated GIF"  # needs a video/WebP decision with the client; report only
    try:
        img = ImageOps.exif_transpose(img)
    except (ValueError, TypeError, OSError):
        # Corrupt EXIF (common on phone photos) breaks exif_transpose, but browsers still honour the
        # orientation tag, so apply it by hand or the copy shows up rotated.
        img = upright(img)
    if img.width > max_width:
        img = img.resize((max_width, round(img.height * max_width / img.width)), Image.LANCZOS)
    ext = Path(name).suffix.lower()
    buf = io.BytesIO()
    if ext == ".png":
        # 256-colour palette keeps transparency and is usually 60-80% smaller for logos and graphics.
        img.convert("RGBA").quantize(256, method=Image.Quantize.FASTOCTREE).save(buf, "PNG", optimize=True)
        fmt = "PNG"
    elif ext == ".webp":
        img.save(buf, "WEBP", quality=quality, method=6)
        fmt = "WEBP"
    else:
        img.convert("RGB").save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
        fmt = "JPEG"
    return buf.getvalue(), fmt


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("out")
    ap.add_argument("--min-kb", type=int, default=300)
    ap.add_argument("--max-width", type=int, default=1600)
    ap.add_argument("--quality", type=int, default=75)
    a = ap.parse_args()
    out = Path(a.out)
    (out / "original").mkdir(parents=True, exist_ok=True)
    (out / "optimized").mkdir(parents=True, exist_ok=True)
    rows = []
    names = set()
    for src, _ in collect(a.url, a.min_kb):
        name = unquote(Path(urlparse(src).path).name) or "image"
        if name in names:
            continue
        names.add(name)
        data = requests.get(src, headers=UA, timeout=60).content
        (out / "original" / name).write_bytes(data)
        new, fmt = optimize(data, name, a.max_width, a.quality)
        if new is None or len(new) >= len(data):
            rows.append([name, src, len(data) // 1024, "", "", f"kept original ({fmt})"])
            continue
        (out / "optimized" / name).write_bytes(new)
        w, h = Image.open(io.BytesIO(new)).size
        rows.append([name, src, len(data) // 1024, len(new) // 1024, f"{w}x{h}", f"{100 - 100 * len(new) // len(data)}% smaller"])
    with open(out / "report.csv", "w", newline="") as f:
        csv.writer(f).writerows([["file", "source", "before_kb", "after_kb", "size", "note"], *rows])
    before = sum(r[2] for r in rows)
    after = sum(r[3] if r[3] != "" else r[2] for r in rows)
    print(f"{len(rows)} images: {before} KB -> {after} KB")


if __name__ == "__main__":
    main()
