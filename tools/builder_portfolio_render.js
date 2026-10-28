// Find client websites in a web designer's portfolio by rendering it (many portfolios are JS-built or link via case studies).
// Usage: node builder_portfolio_render.js builder1.com builder2.com ... > portfolios.tsv   (prints "builder<TAB>client-domain")
// Visits the homepage, up to 4 portfolio/work pages, and up to 12 case-study pages one level deeper; collects outbound links.
const { chromium } = require('playwright');

const SKIP = /facebook|instagram|twitter|linkedin|youtube|google|wordpress\.org|wix\.com|godaddy|shopify|squarespace|x\.com|tiktok|yelp|bbb\.org|pinterest|vimeo|apple\.com|cloudflare|gstatic|jquery|w3\.org|schema\.org|gravatar|fonts|cdn|maps|mailchimp|hubspot|calendly|stripe|paypal|amazon|adobe|github|bing|clutch|upcity|designrush|elementor|wpengine|typekit|gmpg|dsmpartnership|chamber|microsoft|zoom|vercel|netlify|webflow\.com|wpbeginner|w3c|creativecommons|bit\.ly|goo\.gl|addtoany|sharethis|expertise\.com|bark\.com|thumbtack|angi|houzz/i;
const PORTFOLIO = /portfolio|our-work|\/work\b|\/work\/|clients|projects|case-stud|showcase|websites|recent-work/i;

(async () => {
  const b = await chromium.launch();
  for (const builder of process.argv.slice(2)) {
    const ctx = await b.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' });
    const page = await ctx.newPage();
    const own = (h) => { try { return new URL(h).hostname.replace(/^www\./, '').endsWith(builder); } catch (_) { return false; } };
    const found = new Set();
    const visit = async (url) => {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(1500);
        return await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.href));
      } catch (_) { return []; }
    };
    const collect = (links) => {
      for (const h of links) {
        try {
          const d = new URL(h).hostname.toLowerCase().replace(/^www\./, '');
          if (d && d.includes('.') && !own(h) && !SKIP.test(d)) found.add(d);
        } catch (_) {}
      }
    };
    const home = await visit(`https://${builder}/`);
    collect(home);
    const portfolioPages = [...new Set(home.filter((h) => own(h) && PORTFOLIO.test(h)))].slice(0, 4);
    for (const p of portfolioPages) {
      const links = await visit(p);
      collect(links);
      const deeper = [...new Set(links.filter((h) => own(h) && h !== p && h.startsWith(p.replace(/\/$/, '')) && h.length > p.length + 3))].slice(0, 12);
      for (const d of deeper) collect(await visit(d));
    }
    console.error(`# ${builder}: ${portfolioPages.length} portfolio pages, ${found.size} client domains`);
    for (const d of [...found].sort()) console.log(`${builder}\t${d}`);
    await ctx.close();
  }
  await b.close();
})();
