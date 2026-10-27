"""Run audit.js over a list of URLs and print a qualification summary.

Usage: python3 batch.py urls.txt OUT_DIR
A site qualifies as a prospect when it has at least one issue that plausibly costs
the owner customers (broken internal page, layout wider than a phone screen,
very heavy homepage, no tap-to-call link, no meta description).
"""
import json
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urlparse

import requests

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
JUNK = re.compile(r"\.(png|jpe?g|webp|gif|svg)$|sentry|wixpress|example\.com|your@|domain\.com|godaddy", re.I)

HERE = Path(__file__).parent


def run(url, out_dir):
    host = urlparse(url).hostname
    out = out_dir / f"{host}.json"
    if not out.exists():
        subprocess.run(["timeout", "180", "node", str(HERE / "audit.js"), url, str(out)],
                       capture_output=True)
    return json.loads(out.read_text()) if out.exists() else {"url": url, "error": "no output"}


def published_emails(d):
    """Emails the business publishes on its homepage or contact page (no guessing)."""
    found = list((d.get("page") or {}).get("emails") or [])
    for link in ((d.get("page") or {}).get("contactLinks") or [])[:2]:
        try:
            html = requests.get(link, headers={"User-Agent": UA}, timeout=15).text
            found += [e.lower() for e in EMAIL.findall(html)]
        except requests.RequestException:
            pass
    return sorted({e for e in found if not JUNK.search(e)})


def issues(d):
    p = d.get("page") or {}
    found = []
    status = d.get("status")
    if d.get("error") or (status and status >= 500):
        # Verify by hand before outreach: proxy/tunnel failures look the same from here.
        return [("down", f"homepage failed: status={status} error={d.get('error')}")]
    for b in d.get("brokenLinks", []):
        found.append(("high", f"broken link on homepage: {b['href']} ({b['status']})"))
    if (p.get("horizontalOverflowPx") or 0) > 20:
        found.append(("high", f"page is {p['horizontalOverflowPx']}px wider than a phone screen"))
    if not p.get("viewport"):
        found.append(("high", "no mobile viewport tag"))
    if (d.get("transferKB") or 0) > 5000:
        found.append(("med", f"homepage downloads {d['transferKB'] / 1024:.1f} MB"))
    if d.get("largeImages"):
        found.append(("med", f"{len(d['largeImages'])} images over 300 KB (largest {max(i['kb'] for i in d['largeImages'])} KB)"))
    if p and not p.get("telLinks"):
        found.append(("med", "no tap-to-call phone link"))
    if p and not p.get("metaDescription"):
        found.append(("low", "no meta description (Google writes its own snippet)"))
    if p.get("copyrightYear") and p["copyrightYear"] < 2024:
        found.append(("low", f"footer copyright says {p['copyrightYear']}"))
    if d.get("mixedContent"):
        found.append(("med", f"{len(d['mixedContent'])} insecure (http) resources on an https page"))
    a11y = {a["id"]: a["nodes"] for a in d.get("accessibility", [])}
    if a11y:
        found.append(("low", "accessibility errors: " + ", ".join(f"{k}×{v}" for k, v in a11y.items())))
    return found


def main():
    urls = [u.strip() for u in Path(sys.argv[1]).read_text().splitlines() if u.strip() and not u.startswith("#")]
    out_dir = Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(3) as ex:
        results = list(ex.map(lambda u: run(u, out_dir), urls))
    for d in results:
        p = d.get("page") or {}
        iss = issues(d)
        high = sum(1 for s, _ in iss if s == "high")
        print(f"\n== {d['url']}  status={d.get('status')} err={d.get('error')} wp={p.get('wordpress')} "
              f"emails={published_emails(d)} HIGH={high}")
        for sev, msg in iss:
            print(f"   [{sev}] {msg}")


if __name__ == "__main__":
    main()
