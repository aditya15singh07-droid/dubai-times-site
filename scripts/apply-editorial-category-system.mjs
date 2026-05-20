import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const articleDir = path.join(root, "src/content/articles");
const reporterByCategory = {
  Travel: "Peter Greenberg",
  Crypto: "David Yaffe-Bellany",
  Business: "Andrew Ross Sorkin",
  "Real Estate": "Natalie Wong",
  Lifestyle: "Natalie Wong",
  Sport: "Noma Nazish",
  Entertainment: "Ramona Shelburne",
  International: "Yaroslav Trofimov",
  Health: "Dr. Sanjay Gupta",
  "Middle East": "Kashmir Hill",
};

const yaml = (value = "") => `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;

function frontmatterValue(text, key) {
  return text.match(new RegExp(`^${key}:\\s*"?(.+?)"?\\s*$`, "m"))?.[1]?.trim() || "";
}

function categoryFor(text) {
  const haystack = text.toLowerCase();
  if (/\bcrypto\b|bitcoin|btc|blockchain|web3|token|stablecoin|digital asset/.test(haystack)) return "Crypto";
  if (/health|hospital|clinic|medical|doctor|pharma|medlab|disease|wellness|neuro|surgery|healthcare/.test(haystack)) return "Health";
  if (/sport|football|al-ain-fc|al ain fc|fc title|match|league|tournament|stadium|athlete|cricket|tennis/.test(haystack)) return "Sport";
  if (/entertainment|film|cinema|music|festival|artist|gallery|art-dubai|art dubai|concert|celebrity|museum-of-digital-art/.test(haystack)) return "Entertainment";
  if (/travel|tourism|hotel|airport|flight|airline|passenger|rail|metro|emirates-network|emirates-group|etihad|flydubai|terminal|station|bus-shelter|bus-station|taxi/.test(haystack)) return "Travel";
  if (/real estate|property|villa|apartment|landlord|tenant|rent|rental|home|housing|mortgage|freehold|developer|tower|community/.test(haystack)) return "Real Estate";
  if (/fashion|lifestyle|family|culture|food|dining|retail|eid|shopping|memories|library|waterfront|beach|mall|blooms/.test(haystack)) return "Lifestyle";
  if (/world|international|global|iran|israel|russia|ukraine|korea|india|europe|italy|netherlands|imf|oil supply|markets retreat/.test(haystack)) return "International";
  if (/business|economy|market|bank|trade|investment|stock|profit|revenue|adnoc|dewa|dfm|capital|finance|sme|company|deal|ipo|chamber|dmcc|jafza|customs|logistics|industrial|cleantech|holding|commercial|export|incentive|liquidity/.test(haystack)) return "Business";
  return "Middle East";
}

function cleanBody(body) {
  return body
    .replace(/^Source:\s*\[[^\]]+\]\([^)]+\)\s*$/gim, "")
    .replace(/^Source:\s*.+$/gim, "")
    .replace(/^The National reported on [^\\n]+? that /gim, "The latest report says ")
    .replace(/^The National reported [^\\n]+? that /gim, "The latest report says ")
    .replace(/^According to the official announcement,\s*/gim, "")
    .replace(/^According to [^,\n]+,\s*/gim, "")
    .replace(/^The original source item is available via \[[^\]]+\]\([^)]+\)\.\s*$/gim, "")
    .replace(/^The source item is available at \[[^\]]+\]\([^)]+\)\.\s*$/gim, "")
    .replace(/^The source item was carried by .+?\.\s*$/gim, "")
    .replace(/^The item was carried by .+?\.\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanTags(category) {
  return `["${category}", "Dubai Time"]`;
}

const files = (await fs.readdir(articleDir)).filter((file) => file.endsWith(".md"));
const summary = [];

for (const file of files) {
  const filePath = path.join(articleDir, file);
  const original = await fs.readFile(filePath, "utf8");
  const match = original.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) continue;

  const [, fm, body] = match;
  const title = frontmatterValue(fm, "title");
  const description = frontmatterValue(fm, "description");
  const nextCategory = categoryFor(`${file}\n${title}\n${description}`);
  const nextAuthor = reporterByCategory[nextCategory];

  let nextFm = fm
    .replace(/^category:\s*.*$/m, `category: ${yaml(nextCategory)}`)
    .replace(/^author:\s*.*$/m, `author: ${yaml(nextAuthor)}`)
    .replace(/^tags:\s*\[[^\n]*\]$/m, `tags: ${cleanTags(nextCategory)}`);

  if (!/^tags:/m.test(nextFm)) {
    nextFm += `\ntags: ${cleanTags(nextCategory)}`;
  }

  const nextBody = cleanBody(body);
  const next = `---\n${nextFm}\n---\n\n${nextBody}\n`;
  if (next !== original) {
    await fs.writeFile(filePath, next, "utf8");
    summary.push({ file, category: nextCategory, author: nextAuthor });
  }
}

console.log(JSON.stringify({ updated: summary.length, summary: summary.slice(0, 20) }, null, 2));
