import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const articlesDir = path.join(root, "src/content/articles");
const prefix = process.env.BATCH_PREFIX || "middle-east-2026-05-23";

const authors = [
  "Aarav Mehta",
  "Rian Kapoor",
  "Kabir Sethi",
  "Vihaan Rao",
  "Nikhil Verma",
  "Arjun Malhotra",
  "Dev Khanna",
  "Ishaan Roy",
  "Reyan Shah",
  "Zayan Mirza",
];

const titleEndings = {
  Business: [
    "Tests The Gulf's Next Business Mood",
    "Puts Regional Deal-Making Back In Focus",
    "Shows How Gulf Capital Is Moving Now",
  ],
  Crypto: [
    "Puts Digital Finance Trust Back On The Table",
    "Shows Crypto's Gulf Reality Check",
    "Tests The Region's New Money Rules",
  ],
  Entertainment: [
    "Shows How Gulf Audiences Are Spending Their Time",
    "Turns Culture Into A Serious Regional Business",
    "Puts The Gulf's Attention Economy On Display",
  ],
  Health: [
    "Brings Patient Trust Back Into Focus",
    "Shows Why Gulf Healthcare Is Becoming More Personal",
    "Turns A Medical Update Into A Family Question",
  ],
  International: [
    "Raises The Stakes For Middle East Readers",
    "Shows How Global Pressure Reaches The Gulf",
    "Adds A New Turn To The Regional Story",
  ],
  Lifestyle: [
    "Shows How Gulf Living Is Changing",
    "Turns Daily Life Into A Bigger Regional Signal",
    "Puts Family Choices Back At The Centre",
  ],
  "Middle East": [
    "Raises The Stakes Across A Nervous Region",
    "Shows Why Gulf Stability Still Matters",
    "Puts Regional Resilience Back In Focus",
  ],
  "Real Estate": [
    "Shows Where Gulf Property Demand Is Heading",
    "Puts Homebuyers And Investors In The Same Frame",
    "Tests The Region's Luxury Property Story",
  ],
  Sport: [
    "Shows Why Gulf Sport Is Becoming Serious Business",
    "Turns A Match Calendar Into A Regional Signal",
    "Puts Fans And Sponsors In The Same Story",
  ],
  Travel: [
    "Turns Into A Travel Test For The Gulf",
    "Shows How Regional Journeys Are Changing",
    "Puts Passenger Confidence Back In Focus",
  ],
};

const lens = {
  Business: "boardrooms, small firms, hiring plans and the confidence of people who take real financial risk",
  Crypto: "investors, regulators, founders and ordinary savers trying to separate useful finance from noise",
  Entertainment: "artists, venues, families and the growing fight for people's free time",
  Health: "patients, doctors, insurers and families who need healthcare to feel clear and dependable",
  International: "diplomats, traders, migrant workers and families who feel distant decisions very quickly",
  Lifestyle: "families, young professionals, retailers and residents measuring quality of life in practical ways",
  "Middle East": "governments, exporters, travellers and households living with a region that moves fast",
  "Real Estate": "homebuyers, tenants, developers and investors watching whether demand is real or only loud",
  Sport: "fans, clubs, sponsors and cities learning that sport is now an economic platform",
  Travel: "passengers, hotels, airlines, tour operators and families planning around time, cost and certainty",
};

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("Missing frontmatter");
  const fields = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!pair) continue;
    fields[pair[1]] = pair[2].replace(/^"(.*)"$/, "$1");
  }
  return { fields, body: match[2] };
}

function escapeYaml(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function titleCase(text) {
  const small = new Set(["and", "or", "the", "of", "in", "to", "for", "with", "as", "on", "at", "by", "from"]);
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && small.has(lower)) return lower;
      if (/^(uae|gcc|mena|us|uk|ai|ipo|vat|wti|ofws|pif|ufc|seha|adib|damac|b2c2|imo|var[a]?)$/i.test(word)) {
        return word.toUpperCase();
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function determineCategory(file, currentCategory) {
  const lower = file.toLowerCase();
  if (/(crypto|bitcoin|dogecoin|fintech|digital-asset|kraken|revolut|b2c2|blockchain)/.test(lower)) return "Crypto";
  if (/(property|real-estate|villas|homeownership|damac|marquee|century-21|residential|asset-management)/.test(lower)) return "Real Estate";
  if (/(health|healthcare|pregnancy|genomics|ebola|medical|hospital|patient|surgical|obesity|compression-knee)/.test(lower)) return "Health";
  if (/(flight|airways|travel|tourism|cruise|hotel|emirates|qatar-tourism|eid|airport|passenger|doha)/.test(lower)) return "Travel";
  if (/(football|ufc|salah|world-cup|sports|playreplay|gulf-cup|fans)/.test(lower)) return "Sport";
  if (/(art|entertainment|festival|date|tinder|yung|culture|music|anniversary-edition)/.test(lower)) return "Entertainment";
  if (/(lifestyle|ice-cream|fashion|living|families|youth|antiquities|archaeolog)/.test(lower)) return "Lifestyle";
  if (/(trade|deal|debt|bond|steel|business|economy|funds|pif|ipo|logistics|exports|capital|investment)/.test(lower)) return "Business";
  if (/(iran|pakistan|hormuz|red-sea|palestine|regional|middle-east|security|diplomacy|army|tehran)/.test(lower)) return "Middle East";
  return currentCategory || "Middle East";
}

function placeHint(file) {
  const lower = file.toLowerCase();
  const places = [
    ["saudi-arabia", "Saudi Arabia"],
    ["qatar", "Qatar"],
    ["kuwait", "Kuwait"],
    ["bahrain", "Bahrain"],
    ["oman", "Oman"],
    ["iran", "Iran"],
    ["egypt", "Egypt"],
    ["uae", "The UAE"],
    ["abu-dhabi", "Abu Dhabi"],
    ["dubai", "Dubai"],
    ["sharjah", "Sharjah"],
    ["gulf", "The Gulf"],
  ];
  return places.find(([needle]) => lower.includes(needle))?.[1] || "The Region";
}

function cleanTopic(file) {
  let text = file
    .replace(new RegExp(`^${prefix}-`), "")
    .replace(/\.md$/, "")
    .replace(/-/g, " ");

  const lower = text.toLowerCase();
  if (lower.includes("23 best things to do")) return "Dubai's Weekend Calendar";
  if (lower.includes("joins") && lower.split(" ").length > 14) return `${placeHint(file)}'s Regional Coordination Push`;
  if (lower.includes("gcc") || lower.includes("gulf cooperation council")) return `${placeHint(file)} Trade Opening`;
  if (lower.includes("hormuz")) return "The Hormuz Shipping Test";
  if (lower.includes("crypto")) return "The Gulf Crypto Trust Test";
  if (lower.includes("kraken")) return "Kraken's Dubai Expansion";
  if (lower.includes("saudi german")) return "Saudi Healthcare Governance";
  if (lower.includes("gold rate") || lower.includes("gold prices")) return "Gold's Gulf Price Signal";
  if (lower.includes("world cup")) return "Saudi Fans And The World Cup Calendar";
  if (lower.includes("qatar tourism")) return "Doha's Tourism Moment";
  if (lower.includes("eid")) return "The Gulf Eid Travel Rush";
  if (lower.includes("dubai investments")) return "Dubai Investments' Market Push";
  if (lower.includes("property") || lower.includes("real estate") || lower.includes("villas")) return "The Gulf Property Demand Shift";
  if (lower.includes("health") || lower.includes("pregnancy") || lower.includes("genomics") || lower.includes("ebola")) return "The Gulf Healthcare Trust Test";
  if (lower.includes("football") || lower.includes("ufc") || lower.includes("salah")) return "The Gulf Sports Calendar";
  if (lower.includes("travel") || lower.includes("airways") || lower.includes("cruise") || lower.includes("flights")) return "The Gulf Travel Confidence Test";

  text = text
    .replace(/\b(2025|2026|today|latest|news|br|nor|tabl|pu|fo|fr|et|ko|mor|res|desig|analysi)\b/gi, " ")
    .replace(/\b(s|t|m)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  text = text.replace(/\b(with|for|to|in|of|and|after|over|against|into|from|amid|as)$/i, "").trim();
  const words = text
    .split(" ")
    .filter(Boolean)
    .slice(0, 8)
    .join(" ")
    .replace(/\b(with|for|to|in|of|and|after|over|against|into|from|amid|as)$/i, "")
    .trim();
  return titleCase(words || "The Middle East Update");
}

function makeTitle(topic, category, index) {
  const endings = titleEndings[category] || titleEndings["Middle East"];
  let ending = endings[index % endings.length];
  if (/test$/i.test(topic) && /^Tests\b/.test(ending)) {
    ending = endings[(index + 1) % endings.length];
  }
  return `${topic}: ${ending}`.replace(/\s+/g, " ").trim();
}

function bodyFor({ title, topic, category }) {
  const categoryLens = lens[category] || lens["Middle East"];
  const lowerTopic = topic.toLowerCase();
  return [
    `A headline can look distant until it reaches a family budget, a travel plan, a hospital queue or a small business counter. That is why ${lowerTopic} deserves a closer read across the Middle East today.`,
    `The story is not only about one announcement. It is about how quickly the region is changing, and how ordinary people are being asked to adjust with it.`,
    `For ${categoryLens}, the practical question is simple. Does this make life clearer, safer, faster or more expensive? That is the question readers should keep in mind.`,
    `The Gulf has become very good at making big moves look normal. New projects arrive quickly. New rules appear quickly. Markets react before people have finished reading the details.`,
    `But speed is only half the story. The real test is whether the change works after the first press release. A strong headline must survive traffic, payment counters, customer service calls and daily routines.`,
    `That is where this update becomes useful. It gives a small window into how the Middle East is trying to balance ambition with trust. Investors want signs of discipline. Families want fewer surprises. Workers want decisions that respect time and income.`,
    `There is also an Indian angle here. Millions of Indians work, invest, travel or do business across the Gulf. When the region shifts, the effect often reaches homes in Kerala, Mumbai, Delhi, Hyderabad and beyond.`,
    `A travel change can affect leave plans. A property move can shape rent expectations. A health decision can change what families expect from care. A business signal can decide whether a young professional feels confident about the next job.`,
    `The smarter way to read ${lowerTopic} is to look beyond the announcement. Watch who benefits first. Watch who pays first. Watch whether the promise reaches the street, the airport, the clinic, the office and the shop floor.`,
    `The Middle East is no longer selling only scale. It is selling reliability. That is a harder product. It needs rules people understand, services that do not collapse under pressure and institutions that communicate plainly.`,
    `For now, ${title.toLowerCase()} is worth tracking because it fits that larger pattern. The region wants growth that feels modern, but residents want growth that feels usable.`,
    `The next few days will show whether this remains a headline or becomes part of daily life. That, finally, is the only test that matters for people who live, work and build their future here.`,
  ].join("\n\n");
}

const files = fs
  .readdirSync(articlesDir)
  .filter((file) => file.startsWith(`${prefix}-`) && file.endsWith(".md"))
  .sort();

let count = 0;
const seenTitles = new Map();
for (const [index, file] of files.entries()) {
  const fullPath = path.join(articlesDir, file);
  const original = fs.readFileSync(fullPath, "utf8");
  const { fields } = parseFrontmatter(original);
  const category = determineCategory(file, fields.category);
  const topic = cleanTopic(file);
  let title = makeTitle(topic, category, index);
  const duplicateCount = seenTitles.get(title) || 0;
  if (duplicateCount > 0) {
    title = `${title} In ${placeHint(file)}`;
  }
  const secondDuplicateCount = seenTitles.get(title) || 0;
  if (secondDuplicateCount > 0) {
    title = `${title}, Update ${secondDuplicateCount + 1}`;
  }
  seenTitles.set(title, (seenTitles.get(title) || 0) + 1);
  const description = `${title} explains what changes for residents, businesses, travellers and families across the Middle East.`;
  const author = authors[index % authors.length];
  const body = bodyFor({ title, topic, category });

  const tags = [category, "Latest", "Dubai Time", "Middle East"];
  const frontmatter = [
    "---",
    `title: ${escapeYaml(title)}`,
    `description: ${escapeYaml(description)}`,
    `category: ${escapeYaml(category)}`,
    `author: ${escapeYaml(author)}`,
    `date: ${fields.date || "2026-05-23"}`,
    `publishedTime: ${escapeYaml(fields.publishedTime || "09:00 GST")}`,
    `watchLine: ${escapeYaml("Watch the official follow-up, market reaction and everyday impact.")}`,
    `image: ${escapeYaml(fields.image)}`,
    `imageAlt: ${escapeYaml(`${category} visual for ${title}`)}`,
    `tags: ${JSON.stringify(tags)}`,
    `draft: ${fields.draft || "false"}`,
    fields.pexelsId ? `pexelsId: ${escapeYaml(fields.pexelsId)}` : null,
    "---",
    "",
    body,
    "",
  ]
    .filter(Boolean)
    .join("\n");

  fs.writeFileSync(fullPath, frontmatter);
  count += 1;
}

console.log(`Polished ${count} Middle East batch articles.`);
