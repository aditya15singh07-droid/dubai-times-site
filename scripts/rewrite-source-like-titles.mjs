import fs from "node:fs";
import path from "node:path";

const articleDir = path.join(process.cwd(), "src/content/articles");
const targetPrefixes = [/^latest-/, /^more-2026-/, /^more25-/, /^cleanurl-test-/];

const titleCaseSmallWords = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "of", "on", "or", "the", "to", "with"]);

function getFrontmatterValue(text, key) {
  return (text.match(new RegExp(`^${key}:\\s*"?(.+?)"?\\s*$`, "m")) || [])[1] || "";
}

function escapeYaml(value = "") {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function replaceFrontmatterValue(text, key, value) {
  const line = `${key}: "${escapeYaml(value)}"`;
  const pattern = new RegExp(`^${key}:\\s*.+$`, "m");
  return pattern.test(text) ? text.replace(pattern, line) : text.replace(/^---\n/, `---\n${line}\n`);
}

function titleCase(value = "") {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && titleCaseSmallWords.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/\bUae\b/g, "UAE")
    .replace(/\bAi\b/g, "AI")
    .replace(/\bVat\b/g, "VAT")
    .replace(/\bVar[aA]\b/g, "VARA")
    .replace(/\bRta\b/g, "RTA")
    .replace(/\bDhs\b/g, "Dhs")
    .replace(/\bDh\b/g, "Dh")
    .replace(/\bUsd\b/g, "USD")
    .replace(/\bBtc\b/g, "BTC")
    .replace(/\bUs\b/g, "US");
}

function keywordSubject(value = "") {
  const lower = value.toLowerCase();
  if (/salik/.test(lower) && /vat|toll|gate/.test(lower)) return "Salik’s 5% VAT Shift";
  if (/parking|parkin/.test(lower) && /vat|fee/.test(lower)) return "Dubai Parking’s VAT Shift";
  if (/kraken/.test(lower) && /vara|license|approval|regulator/.test(lower)) return "Kraken’s VARA Approval";
  if (/pepeto|dogecoin|bnb/.test(lower)) return "Speculative Crypto Tokens";
  if (/dubai world trade centre|world trade centre/.test(lower)) return "Dubai World Trade Centre’s Event Calendar";
  if (/airport readiness|airports? to handle|hajj travel|peak travel|eid.*travel|flight disruption|flights? cancelled/.test(lower)) {
    return "Dubai’s Peak Travel Rush";
  }
  if (/emirates nbd|luxury residential|property group|financing.*portfolio/.test(lower)) {
    return "Dubai’s Luxury Property Financing";
  }
  if (/flexible.*diversified economy|prospering economic model|economic model/.test(lower)) {
    return "The UAE’s Diversified Economy";
  }
  if (/korean brands/.test(lower)) return "Korean Brands’ Middle East Challenge";
  if (/financial hub/.test(lower)) return "Dubai’s Financial Hub Image";
  if (/obesity|healthcare system|health leaders|clinic|mental health/.test(lower)) return "The UAE’s Health Trust Test";
  if (/labour accommodation|salaries|worker/.test(lower)) return "UAE Worker Welfare Rules";
  if (/eid.*sharjah|weekend events|culinary|lifestyle events|primark|mall/.test(lower)) return "Dubai’s Weekend Spending Shift";
  if (/basketball|pfl|football|sports council|furjan/.test(lower)) return "Dubai’s Growing Sports Audience";
  if (/antiquities|archaeological|culture|artist|festival|film|musical|concert/.test(lower)) return "Dubai’s Culture Economy";
  if (/gold rate|commodities|oil|stock|market/.test(lower)) return "Gulf Market Volatility";
  if (/strait of hormuz|iran|regional|oman trade|supply chain/.test(lower)) return "Gulf Trade Resilience";
  return "";
}

function cleanSubject(value = "") {
  return value
    .replace(/^(Dubai|UAE|Middle East|Crypto|Business|Travel)\s+(news|update):\s*/i, "")
    .replace(/^(Dubai|UAE)\s+(business|travel|real estate|crypto|health|sport|entertainment)\s+/i, "")
    .replace(/\bupdate\b/gi, "")
    .replace(/^New\s+/i, "")
    .replace(/^Latest\s+/i, "")
    .replace(/^Local Report Highlights\s+/i, "")
    .replace(/\s*[-–—]\s*(What It Means Now|What UAE Readers Should Watch).*$/i, "")
    .replace(/\s*:\s*What It Means Now.*$/i, "")
    .replace(/\s*:\s*What UAE Readers Should Watch.*$/i, "")
    .replace(/\bwhat it means now\b/gi, "")
    .replace(/\bwhat uae readers should watch\b/gi, "")
    .replace(/\ball you need to know\b/gi, "")
    .replace(/\b5\s+vat\b/gi, "5% VAT")
    .replace(/\s+/g, " ")
    .trim();
}

function subjectFromFile(file) {
  return file
    .replace(/\.md$/, "")
    .replace(/^(latest-2026-05-22-|latest-|more-2026-05-22-|more25-2026-05-22-|cleanurl-test-2026-05-22-)/, "")
    .replace(/-/g, " ");
}

function shortSubject(title = "", file = "") {
  const raw = `${subjectFromFile(file)} ${title}`;
  const keyword = keywordSubject(raw);
  if (keyword) return keyword;
  const seed = cleanSubject(subjectFromFile(file) || title);
  const words = seed.split(/\s+/).filter(Boolean);
  const shortened = words.slice(0, 8).join(" ");
  return titleCase(shortened || "This Dubai Shift");
}

function headlineFor(title, category, file) {
  const subject = shortSubject(title, file);
  const lower = `${title} ${subjectFromFile(file)}`.toLowerCase();

  if (/salik|parking|toll|metro|rta|commute|road/.test(lower)) {
    return `What ${subject} Means For The Daily Cost Of Moving Around Dubai`;
  }
  if (/kraken|vara|crypto|bitcoin|blockchain|token|bnb|pepeto|digital asset|web3/.test(lower)) {
    return `Why ${subject} Matters To Dubai’s Trust-First Crypto Push`;
  }
  if (/property|real estate|residential|villa|tenant|rent|landlord|developer|housing|home/.test(lower)) {
    return `What ${subject} Reveals About Dubai Property’s Next Serious Test`;
  }
  if (/obesity|clinic|health|hospital|medical|pharma|patient|disease|wellbeing|mental/.test(lower)) {
    return `Why ${subject} Is Becoming A Daily Trust Test For UAE Healthcare`;
  }
  if (/ai|artificial intelligence|digital|technology|platform|app|data|cyber|e-invoicing/.test(lower)) {
    return `What ${subject} Says About Dubai’s Push From Speed To Trust`;
  }
  if (/gold|oil|market|bank|finance|economy|investment|business|trade|sebi|fund|capital/.test(lower)) {
    return `What ${subject} Signals About UAE Business Confidence Now`;
  }
  if (/airport|flight|airline|emirates airline|etihad airways|flydubai|hajj|eid|tourism|travel/.test(lower)) {
    return `Why ${subject} Is Really A Test Of Dubai’s Travel Discipline`;
  }
  if (/sport|basketball|football|club|cup|pfl|athlete|league/.test(lower)) {
    return `Why ${subject} Is Bigger Than One Result For Dubai Sport`;
  }
  if (/concert|artist|music|film|cinema|festival|entertainment|theatre|chicago|primark|mall|food|restaurant/.test(lower)) {
    return `What ${subject} Says About Dubai’s Weekend Attention Economy`;
  }
  if (/iran|hormuz|saudi|oman|qatar|regional|middle east|security|diplomacy/.test(lower)) {
    return `Why ${subject} Matters To The UAE’s Stability Story`;
  }

  const templates = {
    Travel: `Why ${subject} Is Really About Trust In UAE Travel`,
    Crypto: `Why ${subject} Matters To Dubai’s Regulated Crypto Future`,
    Business: `What ${subject} Signals About The UAE Economy Now`,
    "Real Estate": `What ${subject} Reveals About Dubai Property Demand`,
    Lifestyle: `What ${subject} Says About Everyday Life In The UAE`,
    Sport: `Why ${subject} Matters Beyond The Scoreboard`,
    Entertainment: `What ${subject} Means For Dubai’s Live Culture Push`,
    International: `Why ${subject} Matters To UAE Readers Now`,
    Health: `What ${subject} Means For Patients And Families In The UAE`,
    "Middle East": `Why ${subject} Matters Across The Gulf Now`,
  };

  return templates[category] || `Why ${subject} Matters To Dubai Readers Now`;
}

function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function fallbackHeadlineFor(title, category, file) {
  const seed = cleanSubject(subjectFromFile(file) || title);
  const subject = titleCase(seed.split(/\s+/).filter(Boolean).slice(0, 9).join(" "));
  return `Why ${subject} Deserves A Closer Dubai Time Read`;
}

function descriptionFor(title, category) {
  const audiences = {
    Travel: "passengers, hotels, airlines and families planning movement across the UAE",
    Crypto: "investors, founders and regulators watching digital finance mature in Dubai",
    Business: "operators, investors and small firms reading the UAE economy beyond the headline numbers",
    "Real Estate": "buyers, tenants, developers and families trying to read Dubai property clearly",
    Lifestyle: "residents, retailers and families tracking how daily life is changing in the Emirates",
    Sport: "clubs, fans, sponsors and families following the UAE’s growing sports economy",
    Entertainment: "artists, venues, visitors and residents watching Dubai’s attention economy",
    International: "UAE readers, exporters, travellers and investors exposed to global shifts",
    Health: "patients, families, doctors and employers who feel health decisions in real life",
    "Middle East": "residents, businesses and policy watchers reading the Gulf’s next move",
  };
  return `${title} looks at what changes on the ground for ${audiences[category] || "UAE readers"}.`;
}

function rewriteBody(text, oldTitle, newTitle) {
  const escapedOld = oldTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text
    .replace(
      new RegExp(`The latest development centres on ${escapedOld}\\.?`, "gi"),
      "The real story sits in what this changes for people who use the system every day.",
    )
    .replace(
      new RegExp(`${escapedOld} matters for [^.]+\\.`, "gi"),
      `${newTitle} is worth reading through the practical impact, not only the announcement.`,
    )
    .replace(
      /^.+? is worth reading through the practical impact, not only the announcement\.$/gm,
      `${newTitle} is worth reading through the practical impact, not only the announcement.`,
    )
    .replace(
      /^[^\n.]{8,220}\s+(matters for|shows how|signals|adds|captures how|underlines how|carries local relevance)[^\n.]+\.$/gim,
      `${newTitle} is worth reading through the practical impact, not only the announcement.`,
    );
}

let updated = 0;
const seenNewTitles = new Set();

for (const file of fs.readdirSync(articleDir).filter((name) => name.endsWith(".md"))) {
  if (!targetPrefixes.some((prefix) => prefix.test(file))) continue;

  const fullPath = path.join(articleDir, file);
  const original = fs.readFileSync(fullPath, "utf8");
  const oldTitle = getFrontmatterValue(original, "title");
  const category = getFrontmatterValue(original, "category");
  let newTitle = headlineFor(oldTitle, category, file);
  if (seenNewTitles.has(slugify(newTitle))) {
    newTitle = fallbackHeadlineFor(oldTitle, category, file);
  }
  seenNewTitles.add(slugify(newTitle));
  const newDescription = descriptionFor(newTitle, category);

  if (!oldTitle || oldTitle === newTitle) continue;

  let next = replaceFrontmatterValue(original, "title", newTitle);
  next = replaceFrontmatterValue(next, "description", newDescription);
  next = replaceFrontmatterValue(next, "imageAlt", `${category || "Dubai Time"} visual for ${newTitle}`);
  next = rewriteBody(next, oldTitle, newTitle);

  fs.writeFileSync(fullPath, next);
  updated += 1;
}

console.log(`Rewrote ${updated} source-like article titles.`);
