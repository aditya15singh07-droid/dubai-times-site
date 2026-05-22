import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const articleDir = path.join(root, "src/content/articles");
const scriptDir = path.join(root, "scripts");

const targetCount = Number(process.env.DEDUPE_IMAGE_COUNT || 82);

function readFiles(dir, filter) {
  return fs
    .readdirSync(dir)
    .filter(filter)
    .map((file) => ({
      file,
      text: fs.readFileSync(path.join(dir, file), "utf8"),
    }));
}

function getFrontmatterValue(text, key) {
  return (text.match(new RegExp(`^${key}:\\s*"?(.+?)"?\\s*$`, "m")) || [])[1] || "";
}

function publishedMinutes(text) {
  const time = getFrontmatterValue(text, "publishedTime");
  const match = String(time).match(/(\d{1,2}):(\d{2})/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : 0;
}

function collectPexelsPool() {
  const texts = [
    ...readFiles(articleDir, (file) => file.endsWith(".md")),
    ...readFiles(scriptDir, (file) => file.endsWith(".mjs")),
  ].map(({ text }) => text);

  const urls = new Map();
  for (const text of texts) {
    for (const match of text.matchAll(/https:\/\/images\.pexels\.com\/photos\/(\d+)\/[^"\n\s)]+/g)) {
      if (!urls.has(match[1])) urls.set(match[1], match[0].replace(/&amp;/g, "&"));
    }
  }

  return [...urls.entries()].map(([id, url]) => ({ id, url }));
}

function replaceOrInsertFrontmatter(text, key, value) {
  const line = `${key}: "${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
  const pattern = new RegExp(`^${key}:\\s*.+$`, "m");
  if (pattern.test(text)) return text.replace(pattern, line);
  return text.replace(/^---\n/, `---\n${line}\n`);
}

const articles = readFiles(articleDir, (file) => file.endsWith(".md"))
  .map(({ file, text }) => ({
    file,
    text,
    title: getFrontmatterValue(text, "title"),
    category: getFrontmatterValue(text, "category"),
    date: getFrontmatterValue(text, "date"),
    minutes: publishedMinutes(text),
  }))
  .sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.minutes - a.minutes);

const imagePool = collectPexelsPool();
const selected = articles.slice(0, Math.min(targetCount, imagePool.length));

for (const [index, article] of selected.entries()) {
  const image = imagePool[index];
  const alt = `${article.category || "Dubai Time"} visual for ${article.title}`;
  let next = replaceOrInsertFrontmatter(article.text, "image", image.url);
  next = replaceOrInsertFrontmatter(next, "imageAlt", alt);
  next = replaceOrInsertFrontmatter(next, "pexelsId", image.id);
  fs.writeFileSync(path.join(articleDir, article.file), next);
}

console.log(`Updated ${selected.length} latest articles with unique Pexels images.`);
