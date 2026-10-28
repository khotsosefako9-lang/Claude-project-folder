"""Check whether a site lets AI search assistants read it, and whether it describes itself in structured data.

Usage: python3 ai_access.py domains.txt > ai_access.csv
For each domain: which AI crawlers robots.txt blocks from the homepage, plus the schema.org types in the
homepage's JSON-LD (LocalBusiness and its subtypes are what assistants use for "near me" answers).
Only robots.txt and the homepage are fetched.
"""
import csv
import json
import re
import sys
import urllib.robotparser
from concurrent.futures import ThreadPoolExecutor

import requests

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"}
# Search-and-cite crawlers (blocking these stops the assistant citing the site) and training-only ones.
CITE_BOTS = ["OAI-SearchBot", "ChatGPT-User", "GPTBot", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Bingbot"]
TRAIN_ONLY = ["CCBot", "anthropic-ai"]
LD = re.compile(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', re.S | re.I)


def ld_types(html):
    types = set()

    def walk(node):
        if isinstance(node, dict):
            t = node.get("@type")
            for x in (t if isinstance(t, list) else [t]):
                if isinstance(x, str):
                    types.add(x)
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    for block in LD.findall(html):
        try:
            walk(json.loads(block.strip()))
        except ValueError:
            continue
    return sorted(types)


def check(domain):
    base = f"https://{domain}"
    row = {"domain": domain, "robots_status": "", "blocked_cite_bots": "", "blocked_train_only": "", "jsonld_types": "", "error": ""}
    try:
        r = requests.get(base + "/robots.txt", headers=UA, timeout=20)
        row["robots_status"] = r.status_code
        if r.status_code == 200 and "html" not in r.headers.get("content-type", ""):
            rp = urllib.robotparser.RobotFileParser()
            rp.parse(r.text.splitlines())
            row["blocked_cite_bots"] = " ".join(b for b in CITE_BOTS if not rp.can_fetch(b, base + "/"))
            row["blocked_train_only"] = " ".join(b for b in TRAIN_ONLY if not rp.can_fetch(b, base + "/"))
        home = requests.get(base + "/", headers=UA, timeout=25)
        row["jsonld_types"] = " ".join(ld_types(home.text))
    except requests.RequestException as e:
        row["error"] = type(e).__name__
    return row


def main():
    domains = [d.strip() for d in open(sys.argv[1]) if d.strip()]
    with ThreadPoolExecutor(8) as ex:
        rows = list(ex.map(check, domains))
    w = csv.DictWriter(sys.stdout, fieldnames=list(rows[0]))
    w.writeheader()
    w.writerows(rows)


if __name__ == "__main__":
    main()
