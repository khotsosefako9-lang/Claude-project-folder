"""Detect Shopify stores and check customer-facing store problems from public pages only.

Usage: python3 shopify_check.py domains.txt > shopify.csv
Uses Shopify's public /products.json (no login) plus a few public pages. Flags:
  password   storefront shows the password page (store closed to buyers)
  soldout    share of products with no available variant
  policies   refund/shipping policy pages missing (/policies/...)
  title      homepage <title> missing
"""
import csv
import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor

import requests

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"}


def get(url):
    try:
        return requests.get(url, headers=UA, timeout=20, allow_redirects=True)
    except requests.RequestException:
        return None


def check(domain):
    base = f"https://{domain}"
    home = get(base + "/")
    if home is None or "cdn.shopify.com" not in home.text and "Shopify.theme" not in home.text:
        return None
    row = {"domain": domain, "password": "/password" in home.url, "products": "", "soldout_pct": "",
           "refund_policy": "", "shipping_policy": "", "has_title": bool(re.search(r"<title[^>]*>\s*\S", home.text[:200000], re.I)),
           "emails": " ".join(sorted(set(e.lower() for e in re.findall(r"[\w.+-]+@[\w-]+\.[a-z]{2,}", home.text)
                                        if not re.search(r"example|sentry|shopify|wixpress|\.png|\.jpg", e, re.I)))[:120])}
    pj = get(base + "/products.json?limit=250")
    if pj is not None and pj.status_code == 200:
        try:
            prods = pj.json().get("products", [])
            row["products"] = len(prods)
            if prods:
                sold = sum(1 for p in prods if not any(v.get("available") for v in p.get("variants", [])))
                row["soldout_pct"] = round(100 * sold / len(prods))
        except ValueError:
            pass
    for key, path in (("refund_policy", "/policies/refund-policy"), ("shipping_policy", "/policies/shipping-policy")):
        r = get(base + path)
        row[key] = r.status_code if r is not None else "err"
    return row


def main():
    domains = [d.strip() for d in open(sys.argv[1]) if d.strip()]
    with ThreadPoolExecutor(10) as ex:
        rows = [r for r in ex.map(check, domains) if r]
    w = csv.DictWriter(sys.stdout, fieldnames=["domain", "password", "products", "soldout_pct", "refund_policy",
                                               "shipping_policy", "has_title", "emails"])
    w.writeheader()
    w.writerows(rows)


if __name__ == "__main__":
    main()
