"""List audited domains with a likely customer-facing defect, from audit.js JSON files (hand-verify before any claim).
Usage: python3 defect_candidates.py raw_dir [raw_dir ...] > candidates.tsv   (prints "domain<TAB>reasons")
Counts: internal links answering 404/410/5xx, images of 1 MB or more, homepage 5xx."""
import glob
import json
import sys
from urllib.parse import urlparse


def reasons(d):
    out = []
    if isinstance(d.get("status"), int) and d["status"] >= 500:
        out.append(f"homepage {d['status']}")
    host = urlparse(d.get("finalUrl") or d.get("url") or "").hostname or ""
    dead = [b for b in d.get("brokenLinks", []) if isinstance(b.get("status"), int)
            and (b["status"] in (404, 410) or b["status"] >= 500) and host.replace("www.", "") in (b.get("href") or "")]
    if dead:
        out.append(f"{len(dead)} broken internal link(s)")
    big = [i for i in d.get("largeImages", []) if i.get("kb", 0) >= 1000]
    if big:
        out.append(f"{len(big)} image(s) >= 1 MB (largest {max(i['kb'] for i in big)} KB)")
    return out


for folder in sys.argv[1:]:
    for f in sorted(glob.glob(f"{folder}/*.json")):
        try:
            d = json.load(open(f))
        except ValueError:
            continue
        r = reasons(d)
        if r:
            print(f"{f.split('/')[-1][:-5]}\t{'; '.join(r)}")
