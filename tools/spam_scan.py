"""Find injected SEO spam (casino, pharma, loan, essay links) on site homepages, from public pages only.
Usage: python3 spam_scan.py domains.txt > spam.csv
Reports how many outbound links point to spam-keyword domains. Hand-verify (view source, rendered position) before any claim.
Known false positives: vet clinics' own pharmacy stores (*.pharmacy), mortgage partners ("loan"), "specialists" (contains "cialis")."""
import csv
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse

import requests

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"}
SPAM = re.compile(r"casino|slot|poker|betting|viagra|cialis|pharma|payday|loan|essay|escort|porn", re.I)


def check(domain):
    try:
        r = requests.get(f"https://{domain}/", headers=UA, timeout=20)
    except requests.RequestException:
        return None
    own = (urlparse(r.url).hostname or domain).replace("www.", "")
    hosts = [urlparse(h).hostname or "" for h in re.findall(r'href="(https?://[^"]+)"', r.text)]
    bad = sorted({h for h in hosts if h and own not in h and SPAM.search(h)})
    return [domain, len(bad), " ".join(bad[:5])] if bad else None


def main():
    domains = [d.strip() for d in open(sys.argv[1]) if d.strip()]
    with ThreadPoolExecutor(8) as ex:
        rows = [r for r in ex.map(check, domains) if r]
    w = csv.writer(sys.stdout)
    w.writerow(["domain", "spam_hosts", "examples"])
    w.writerows(sorted(rows, key=lambda r: -r[1]))


if __name__ == "__main__":
    main()
