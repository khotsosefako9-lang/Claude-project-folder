"""List member websites from a chamber-of-commerce directory page (GrowthZone/ChamberMaster style).

Usage: python3 chamber.py <category-or-list-url> [more urls...] > urls.txt
Fetches the listing, follows each /list/member/ profile politely (one request per ~0.7 s),
and prints "website<TAB>business name" for members that publish a website.
Directories that answer 403 are skipped: that is bot protection and is not worked around.
"""
import re
import sys
import time
import html
import urllib.parse

import requests

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"}
MEMBER = re.compile(r'href="((?:https?://[^"]+)?/list/member/[^"#?]+)"')
WEBSITE = [
    re.compile(r'class="[^"]*gz-card-website[^"]*"[^>]*>\s*<a[^>]*href="([^"]+)"'),
    re.compile(r'href="(https?://[^"]+)"[^>]*>\s*(?:<[^>]+>\s*)*Visit Website', re.I),
    re.compile(r'itemprop="url"[^>]*href="(https?://[^"]+)"'),
]


def members(list_url):
    r = requests.get(list_url, headers=UA, timeout=30)
    if r.status_code == 403:
        print(f"# skipped (403): {list_url}", file=sys.stderr)
        return []
    return sorted({urllib.parse.urljoin(list_url, m) for m in MEMBER.findall(r.text)})


def website(profile_url):
    page = requests.get(profile_url, headers=UA, timeout=30).text
    name = re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S)
    for pat in WEBSITE:
        m = pat.search(page)
        if m:
            return m.group(1).strip(), html.unescape(re.sub("<[^>]+>", "", name.group(1)).strip()) if name else ""
    return None, None


def main():
    seen = set()
    for list_url in sys.argv[1:]:
        for prof in members(list_url):
            try:
                site, name = website(prof)
            except requests.RequestException:
                continue
            if site and site not in seen:
                seen.add(site)
                print(f"{site}\t{name}")
                sys.stdout.flush()
            time.sleep(0.7)


if __name__ == "__main__":
    main()
