// Bundle the dashboard into ONE self-contained HTML file (for artifacts / sharing / hosting anywhere).
// Usage: node scripts/build-single.mjs   →   dist/motion-generator.html
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const r = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
let html = r("dashboard/index.html");
const inlineJs = (src) => `<script>\n${r(src).replace(/<\/script/gi, "<\\/script")}\n</script>`;
html = html.replace('<link rel="stylesheet" href="app.css" />', `<style>\n${r("dashboard/app.css")}\n</style>`);
for (const [tag, file] of [
  ['<script src="../data/styles.js"></script>', "data/styles.js"],
  ['<script src="../data/elements.js"></script>', "data/elements.js"],
  ['<script src="previews.js"></script>', "dashboard/previews.js"],
  ['<script src="markdown.js"></script>', "dashboard/markdown.js"],
  ['<script src="app.js"></script>', "dashboard/app.js"],
]) {
  if (!html.includes(tag)) throw new Error("tag not found: " + tag);
  html = html.replace(tag, () => inlineJs(file));
}
mkdirSync(new URL("../dist/", import.meta.url), { recursive: true });
writeFileSync(new URL("../dist/motion-generator.html", import.meta.url), html);
console.log(`dist/motion-generator.html written (${(html.length / 1024).toFixed(0)} KB)`);
