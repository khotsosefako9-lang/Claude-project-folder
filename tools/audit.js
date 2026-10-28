// Read-only public website audit for a single homepage (plus a light internal link check).
// Usage: node audit.js https://example.com [out.json]
// Makes only normal GET requests a visitor's browser would make; no forms are submitted.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

async function checkLinks(ctx, links) {
  const results = [];
  for (const href of links) {
    try {
      const r = await ctx.request.get(href, { timeout: 15000, maxRedirects: 5, failOnStatusCode: false });
      // 401/403/406/429 are usually bot protection, not a broken page a visitor would see.
      if ([404, 410].includes(r.status()) || r.status() >= 500) results.push({ href, status: r.status() });
    } catch (e) {
      results.push({ href, status: 'error', error: e.message.split('\n')[0] });
    }
  }
  return results;
}

async function audit(url) {
  const out = { url, checkedAt: new Date().toISOString() };
  const u = new URL(url);
  // No certificate check: this sandbox's egress proxy re-signs TLS, so expiry dates seen here are not the site's.
  out.https = u.protocol === 'https:';

  const browser = await chromium.launch();
  try {
    // Mobile viewport: most local-business visitors are on phones.
    // A real phone profile (user agent included): site builders such as Duda pick their phone layout
    // from the user agent, so a desktop UA in a narrow window reports overflow real phones never see.
    const ctx = await browser.newContext({ ...devices['iPhone 13'] });
    const page = await ctx.newPage();
    const consoleErrors = [];
    const failed = [];
    const mixed = [];
    let bytes = 0;
    const big = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
    page.on('requestfailed', (r) => failed.push({ url: r.url().slice(0, 200), err: r.failure() && r.failure().errorText }));
    page.on('response', async (r) => {
      const req = r.request();
      if (u.protocol === 'https:' && r.url().startsWith('http://')) mixed.push(r.url().slice(0, 200));
      if (r.status() >= 400) failed.push({ url: r.url().slice(0, 200), status: r.status() });
      try {
        const len = Number((await r.allHeaders())['content-length'] || 0);
        // Video/audio report the whole file size but browsers stream ranges, so leave them out.
        if (req.resourceType() !== 'media') bytes += len;
        if (req.resourceType() === 'image' && len > 300000) big.push({ url: r.url().slice(0, 200), kb: Math.round(len / 1024) });
      } catch (_) {}
    });

    const t0 = Date.now();
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    out.loadMs = Date.now() - t0;
    out.status = resp && resp.status();
    out.finalUrl = page.url();
    await page.waitForTimeout(1500);

    out.page = await page.evaluate(() => {
      const meta = (n) => { const m = document.querySelector(`meta[name="${n}"]`); return m ? m.content : null; };
      const og = (p) => { const m = document.querySelector(`meta[property="${p}"]`); return m ? m.content : null; };
      const imgs = [...document.images];
      const text = document.body ? document.body.innerText : '';
      const years = [...text.matchAll(/(?:©|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi)].map((m) => Number(m[1]));
      return {
        title: document.title,
        metaDescription: meta('description'),
        viewport: meta('viewport'),
        generator: meta('generator'),
        ogImage: og('og:image'),
        h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()).slice(0, 3),
        images: imgs.length,
        imagesMissingAlt: imgs.filter((i) => !i.hasAttribute('alt')).length,
        horizontalOverflowPx: document.documentElement.scrollWidth - window.innerWidth,
        copyrightYear: years.length ? Math.max(...years) : null,
        telLinks: document.querySelectorAll('a[href^="tel:"]').length,
        forms: document.forms.length,
        wordpress: /wp-content|wp-includes/.test(document.documentElement.outerHTML),
        links: [...document.querySelectorAll('a[href]')].map((a) => a.href),
        emails: [...new Set([...document.querySelectorAll('a[href^="mailto:"]')].map((a) => a.href.slice(7).split('?')[0].toLowerCase())
          .concat((text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || []).map((e) => e.toLowerCase())))].slice(0, 5),
        contactLinks: [...new Set([...document.querySelectorAll('a[href]')].filter((a) => /contact/i.test(a.href + a.innerText)).map((a) => a.href))].slice(0, 3),
      };
    });

    await page.addScriptTag({ content: AXE });
    const axe = await page.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length }));
    });
    out.accessibility = axe;

    const sameHost = [...new Set(out.page.links.filter((h) => {
      try { const x = new URL(h); return x.hostname === new URL(out.finalUrl).hostname && /^https?:$/.test(x.protocol); } catch (_) { return false; }
    }).map((h) => h.split('#')[0]))].slice(0, 30);
    out.linksChecked = sameHost.length;
    out.brokenLinks = await checkLinks(ctx, sameHost);
    delete out.page.links;

    out.consoleErrors = consoleErrors.slice(0, 10);
    out.failedRequests = failed.slice(0, 15);
    out.mixedContent = mixed.slice(0, 10);
    out.transferKB = Math.round(bytes / 1024);
    out.largeImages = big.slice(0, 10);
    await page.screenshot({ path: path.join(path.dirname(process.argv[3] || '.'), `${u.hostname}-mobile.png`) });
  } catch (e) {
    out.error = e.message.split('\n')[0];
  } finally {
    await browser.close();
  }
  return out;
}

if (require.main === module) {
  const url = process.argv[2];
  if (!url) { console.error('usage: node audit.js <url> [out.json]'); process.exit(1); }
  audit(url).then((r) => {
    const s = JSON.stringify(r, null, 2);
    if (process.argv[3]) fs.writeFileSync(process.argv[3], s); else console.log(s);
  });
}
module.exports = { audit };
