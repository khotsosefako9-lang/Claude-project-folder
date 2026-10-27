// Turn an audit JSON (from audit.js) plus hand-verified notes into a one-page PDF report.
// Usage: node report.js audit.json notes.json out.pdf
// notes.json: { "business": "...", "findings": [{ "title": "...", "why": "...", "fix": "..." }], "screenshot": "path.png" }
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function html(audit, notes) {
  const shot = notes.screenshot && fs.existsSync(notes.screenshot)
    ? `<img class="shot" src="data:image/png;base64,${fs.readFileSync(notes.screenshot).toString('base64')}">` : '';
  const rows = notes.findings.map((f, i) => `
    <div class="f"><h3>${i + 1}. ${esc(f.title)}</h3>
    <p><b>Why it matters:</b> ${esc(f.why)}</p><p><b>Fix:</b> ${esc(f.fix)}</p></div>`).join('');
  const checked = new Date(audit.checkedAt).toISOString().slice(0, 10);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    body{font:12px/1.45 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1d2433;margin:28px}
    h1{font-size:20px;margin:0 0 2px}h3{font-size:13px;margin:0 0 4px}
    .sub{color:#5b6475;margin-bottom:14px}.wrap{display:flex;gap:20px}
    .left{flex:1}.shot{width:200px;border:1px solid #d5d9e0;border-radius:6px}
    .f{border-left:3px solid #c0392b;padding:6px 10px;margin:0 0 10px;background:#fafbfc}
    .f p{margin:2px 0}.note{margin-top:14px;color:#5b6475;font-size:10.5px;border-top:1px solid #e3e6eb;padding-top:8px}
  </style></head><body>
    <h1>Website check: ${esc(notes.business)}</h1>
    <div class="sub">${esc(audit.finalUrl || audit.url)} · checked ${checked} on a phone-sized screen (390px)</div>
    <div class="wrap"><div class="left">${rows}</div>${shot}</div>
    <div class="note">Independent, unsolicited check of public pages only. Nothing was logged into, submitted or changed.
    Findings were confirmed by hand after an automated scan (Playwright + axe-core).</div>
  </body></html>`;
}

async function main() {
  const [auditPath, notesPath, outPath] = process.argv.slice(2);
  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
  if (notes.screenshot && !path.isAbsolute(notes.screenshot)) notes.screenshot = path.join(path.dirname(notesPath), notes.screenshot);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html(audit, notes), { waitUntil: 'load' });
  await page.pdf({ path: outPath, format: 'Letter', printBackground: true, margin: { top: '0.3in', bottom: '0.3in' } });
  await browser.close();
}

main();
