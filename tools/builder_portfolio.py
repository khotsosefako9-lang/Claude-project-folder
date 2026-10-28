"""List client sites linked from builder portfolio pages. Usage: python3 builder_portfolio.py builder1.com builder2.com > portfolios.tsv"""
import re,sys,requests,urllib.parse
UA={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36"}
SKIP=re.compile(r'facebook|instagram|twitter|linkedin|youtube|google|wordpress\.org|wix|godaddy|shopify|squarespace|x\.com|tiktok|yelp|bbb\.org|pinterest|vimeo|apple\.com|cloudflare|gstatic|jquery|w3\.org|schema\.org|gravatar|fonts|cdn|maps|mailchimp|hubspot|calendly|stripe|paypal|amazon|adobe|github|bing|clutch|upcity|designrush|elementor|wpengine|godaddysites',re.I)
for b in sys.argv[1:]:
    base=f"https://{b}/"
    try: h=requests.get(base,headers=UA,timeout=25).text
    except Exception as e: print('#',b,'ERR'); continue
    cand=[urllib.parse.urljoin(base,u) for u in re.findall(r'href="([^"#]+)"',h) if re.search(r'portfolio|our-work|/work|clients|projects|case-stud|showcase|websites',u,re.I)]
    pages=[base]+list(dict.fromkeys(c for c in cand if b in c))[:3]
    sites=set()
    for p in pages:
        try: s=requests.get(p,headers=UA,timeout=25).text
        except Exception: continue
        for u in re.findall(r'href="(https?://[^"]+)"',s):
            d=urllib.parse.urlparse(u).netloc.lower().removeprefix('www.')
            if d and b not in d and not SKIP.search(d) and '.' in d: sites.add(d)
    print('#',b,'pages',len(pages),'external sites',len(sites))
    for d in sorted(sites): print(b+'\t'+d)
