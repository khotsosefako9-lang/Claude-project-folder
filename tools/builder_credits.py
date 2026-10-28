"""Find web-designer/agency footer credits on site homepages. Usage: python3 builder_credits.py domains.txt > credits.csv"""
import re,sys,csv,html,requests
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse
UA={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36"}
PAT=re.compile(r'(?:website|web\s*site|site|web\s*design|designed|developed|built|created|powered|managed|marketing)\s*(?:design\s*)?(?:&amp;|and|\s)*(?:by|:)\s*(?:<[^>]+>\s*)*([^<]{2,60})',re.I)
PLATFORM=re.compile(r'wordpress|wix|squarespace|godaddy|shopify|weebly|duda|elementor|divi|astra|theme|hostinger|jimdo|webflow|yola|google|cloudflare|wp engine|bluehost|generatepress|kadence|oceanwp|avada|genesis',re.I)
def check(dom):
    try:
        r=requests.get(f"https://{dom}/",headers=UA,timeout=25); s=r.text
    except Exception: return None
    foot=s[-25000:]
    out=[]
    for m in PAT.finditer(foot):
        name=html.unescape(m.group(1)).strip(" .|-–©")
        if len(name)<3 or PLATFORM.search(name): continue
        # nearest external link after the credit
        tail=foot[m.start():m.start()+600]
        links=[h for h in re.findall(r'href="(https?://[^"]+)"',tail) if dom not in h and not re.search(r'facebook|instagram|twitter|linkedin|youtube|google|wordpress|wix|godaddy|shopify|squarespace|x\.com|tiktok|yelp|bbb\.org',h)]
        out.append((name[:50],links[0] if links else ''))
    return (dom,out[:2]) if out else None
doms=[d.strip() for d in open(sys.argv[1]) if d.strip()]
with ThreadPoolExecutor(10) as ex:
    res=[r for r in ex.map(check,doms) if r]
w=csv.writer(sys.stdout); w.writerow(['domain','credit','builder_link'])
for dom,items in res:
    for n,l in items: w.writerow([dom,n,l])
