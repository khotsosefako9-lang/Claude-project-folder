// Folds dist/ into one HTML fragment for the Artifact host (it adds <html>/<head>/<body>).
import { readFileSync, writeFileSync } from 'node:fs';
const html = readFileSync('dist/index.html', 'utf8');
const js = readFileSync('dist/' + html.match(/<script[^>]+src="\/?([^"]+\.js)"/)[1], 'utf8').replace(/<\/script/gi, '<\\/script');
const css = readFileSync('dist/' + html.match(/<link[^>]+href="\/?(assets\/[^"]+\.css)"/)[1], 'utf8').replace(/<\/style/gi, '<\\/style');
const fonts = html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis[^>]+>/)[0];
const out = `<title>Duly Qualified HQ</title>
<meta name="claude:viewport-fit-sides" content="cover">
${fonts}
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;
writeFileSync('dist/dq-hq.html', out);
console.log(`wrote dist/dq-hq.html (${(out.length / 1024).toFixed(0)} KB)`);
