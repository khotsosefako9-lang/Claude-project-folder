// Folds dist-artifact/ into one HTML fragment (the Artifact host adds <html>/<head>/<body>).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'dist-artifact';
const html = readFileSync(join(dir, 'index.html'), 'utf8');
const jsPath = html.match(/<script[^>]+src="\/?([^"]+\.js)"/)[1];
const cssPath = html.match(/<link[^>]+href="\/?([^"]+\.css)"/)[1];
const js = readFileSync(join(dir, jsPath), 'utf8').replace(/<\/script/gi, '<\\/script');
const css = readFileSync(join(dir, cssPath), 'utf8').replace(/<\/style/gi, '<\\/style');

const out = `<title>Duly Qualified</title>
<meta name="description" content="20 qualified prospects every month, plus the government tenders you can win, with your compliance papers in order.">
<style>:root{color-scheme:light}html,body{background:#ECEBE6}${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;
writeFileSync(join(dir, 'duly-qualified.html'), out);
console.log(`wrote ${dir}/duly-qualified.html (${(out.length / 1024).toFixed(0)} KB)`);
