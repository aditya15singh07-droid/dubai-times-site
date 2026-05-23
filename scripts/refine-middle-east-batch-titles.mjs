import fs from "node:fs";
import path from "node:path";

const articleDir = path.join(process.cwd(), "src/content/articles");
const prefix = process.env.BATCH_PREFIX || "middle-east-2026-05-23";

const smallWords = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "of", "on", "or", "the", "to", "with"]);

function yamlEscape(value = "") {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function frontmatterValue(text, key) {
  return (text.match(new RegExp(`^${key}:\\s*"?(.+?)"?\\s*$`, "m")) || [])[1] || "";
}

function replaceFrontmatter(text, key, value) {
  const line = `${key}: "${yamlEscape(value)}"`;
  return text.replace(new RegExp(`^${key}:\\s*.+$`, "m"), line);
}

function titleCase(value = "") {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => {
      if (index > 0 && smallWords.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/\bUae\b/g, "UAE")
    .replace(/\bGcc\b/g, "GCC")
    .replace(/\bUk\b/g, "UK")
    .replace(/\bUs\b/g, "US")
    .replace(/\bAi\b/g, "AI")
    .replace(/\bVat\b/g, "VAT")
    .replace(/\bVara\b/g, "VARA")
    .replace(/\bPif\b/g, "PIF")
    .replace(/\bQ[0-9]\b/gi, (match) => match.toUpperCase());
}

function slugSubject(file) {
  const raw = file
    .replace(/\.md$/, "")
    .replace(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-`), "")
    .replace(/-/g, " ")
    .replace(/\b20[0-9]{2}\b/g, "")
    .replace(/\bq[1-4]\b/gi, "")
    .replace(/\bbr\b/gi, "")
    .replace(/\bjoins?\b/gi, "")
    .replace(/\bovertakes?\b/gi, "")
    .replace(/\band more\b/gi, "")
    .replace(/\bas regional\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const countryMatches = raw.match(/\b(uae|dubai|saudi arabia|saudi|qatar|kuwait|oman|bahrain|egypt|jordan|iran|iraq|palestine|israel|morocco|italy|spain|japan|south korea|india|uk|us)\b/gi) || [];
  if (countryMatches.length >= 4) {
    return raw
      .replace(/\b(uae|dubai|saudi arabia|saudi|qatar|kuwait|oman|bahrain|egypt|jordan|iran|iraq|palestine|israel|morocco|italy|spain|japan|south korea|india|uk|us)\b(,?\s*)?/gi, "")
      .replace(/\s+/g, " ")
      .trim() || "Gulf Regional Shift";
  }
  return raw;
}

function compactSubject(file, fallback = "Regional Change") {
  const subject = slugSubject(file)
    .replace(/^(update|news|latest|why|what|how)\s+/i, "")
    .replace(/\b(all you need to know|your complete|guide to|check out)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const words = subject.split(/\s+/).filter(Boolean).slice(0, 8);
  if (words.length < 3) return fallback;
  return titleCase(words.join(" ") || fallback);
}

function numberedSignal(title, count) {
  const labels = ["Second", "Third", "Fourth", "Fifth", "Sixth"];
  return `${title}: ${labels[count - 1] || `Signal ${count + 1}`}`;
}

function refinedTitle(file, category) {
  const lower = file.toLowerCase();

  if (/gcc|gulf.*trade|trade-deal|uk-secures|britain-secures|channel-islands/.test(lower)) {
    return "What The GCC Trade Deal Means For Business Confidence Across The Gulf";
  }
  if (/hormuz|shipping|ships|red-sea|cruise-disruptions|anchor/.test(lower)) {
    return "Why Shipping Pressure Still Shapes The Gulf's Business Mood";
  }
  if (/airways|airline|airport|flight|travel-alert|tourism|doha|cruise|visitor|pilgrim|hajj|eid/.test(lower)) {
    return `Why ${compactSubject(file, "Gulf Travel")} Is Now A Test Of Regional Travel Trust`;
  }
  if (/crypto|bitcoin|dogecoin|digital-asset|fintech|kraken|vara|debit-card/.test(lower)) {
    return `What ${compactSubject(file, "Digital Finance")} Says About The Middle East's Finance Trust Test`;
  }
  if (/property|damac|homeownership|villa|apartment|rent|realty|estate|mortgage|buyer|developer/.test(lower)) {
    return `What ${compactSubject(file, "Property Demand")} Reveals About The Gulf Property Cycle`;
  }
  if (/hospital|health|healthcare|medical|pregnancy|genomics|ebola|patient|german-health|seha/.test(lower)) {
    return `What ${compactSubject(file, "Healthcare Access")} Means For Patients And Families In The Region`;
  }
  if (/football|ufc|fight|cup|sports|playreplay|salah|fans|match/.test(lower)) {
    return `Why ${compactSubject(file, "Regional Sport")} Matters Beyond The Scoreboard`;
  }
  if (/art|film|music|concert|festival|fashion|tinder|yung|launchpad|weekend|things-to-do|entertainment/.test(lower)) {
    return `What ${compactSubject(file, "Culture Spending")} Says About The Region's Attention Economy`;
  }
  if (/oil|energy|carbon|steel|debt|bond|fund|pif|investment|bank|economy|market|trade|starship|spacex/.test(lower)) {
    return `What ${compactSubject(file, "Capital Flows")} Signals About Middle East Business Confidence`;
  }
  if (/diplomacy|foreign|minister|peace|tehran|rubio|quad|government|security|regional/.test(lower)) {
    return `Why ${compactSubject(file, "Regional Diplomacy")} Matters To Middle East Readers Now`;
  }

  const templates = {
    Travel: `Why ${compactSubject(file, "Gulf Travel")} Is Now A Test Of Regional Travel Trust`,
    Crypto: `What ${compactSubject(file, "Digital Finance")} Says About The Middle East's Finance Trust Test`,
    Business: `What ${compactSubject(file, "Capital Flows")} Signals About Middle East Business Confidence`,
    "Real Estate": `What ${compactSubject(file, "Property Demand")} Reveals About The Gulf Property Cycle`,
    Lifestyle: `What ${compactSubject(file, "Daily Life")} Says About Everyday Life Across The Gulf`,
    Sport: `Why ${compactSubject(file, "Regional Sport")} Matters Beyond The Scoreboard`,
    Entertainment: `What ${compactSubject(file, "Live Culture")} Means For The Region's Attention Economy`,
    International: `Why ${compactSubject(file, "Global Risk")} Matters To Middle East Readers Now`,
    Health: `What ${compactSubject(file, "Healthcare Access")} Means For Patients And Families In The Region`,
    "Middle East": `Why ${compactSubject(file, "Regional Change")} Matters Across The Middle East Now`,
  };

  return templates[category] || `Why ${compactSubject(file)} Matters Across The Middle East Now`;
}

function refinedDescription(title, category) {
  const audiences = {
    Travel: "passengers, hotels, airports and families moving across the region",
    Crypto: "investors, founders and regulators watching digital finance mature",
    Business: "operators, investors and small firms reading the regional economy",
    "Real Estate": "buyers, tenants, developers and families trying to read property demand",
    Lifestyle: "residents, retailers and families tracking how daily life is changing",
    Sport: "clubs, fans, sponsors and families following the region's sports economy",
    Entertainment: "artists, venues, visitors and residents watching the attention economy",
    International: "exporters, travellers, investors and readers exposed to global shifts",
    Health: "patients, families, doctors and employers who feel health decisions in real life",
    "Middle East": "residents, businesses and policy watchers reading the region's next move",
  };
  return `${title} looks at what changes on the ground for ${audiences[category] || "regional readers"}.`;
}

let updated = 0;
const seen = new Map();

for (const file of fs.readdirSync(articleDir).filter((name) => name.startsWith(`${prefix}-`) && name.endsWith(".md"))) {
  const fullPath = path.join(articleDir, file);
  const original = fs.readFileSync(fullPath, "utf8");
  const category = frontmatterValue(original, "category") || "Middle East";
  let title = refinedTitle(file, category);
  const key = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const count = seen.get(key) || 0;
  seen.set(key, count + 1);
  if (count > 0) title = numberedSignal(title, count);

  let next = replaceFrontmatter(original, "title", title);
  next = replaceFrontmatter(next, "description", refinedDescription(title, category));
  next = replaceFrontmatter(next, "imageAlt", `${category} visual for ${title}`);
  next = next.replace(
    /^The latest development centres on .+\.$/m,
    `The latest development centres on ${title.toLowerCase()}.`,
  );

  fs.writeFileSync(fullPath, next);
  updated += 1;
}

console.log(`Refined ${updated} Middle East batch titles.`);
