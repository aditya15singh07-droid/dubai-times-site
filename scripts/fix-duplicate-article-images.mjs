import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const articleDir = path.join(root, "src/content/articles");
const pexelsApiKey = process.env.PEXELS_API_KEY || "";
let pexelsDisabled = !pexelsApiKey;

const fallbackPool = [
  ["1008155", "https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Airport terminal and travel movement for a regional transport story."],
  ["3184291", "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Business team reviewing market updates in a modern office."],
  ["3184465", "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Professionals discussing strategy around a conference table."],
  ["3182773", "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Team working through documents and planning decisions."],
  ["3183197", "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Urban business discussion with documents and laptops."],
  ["3184300", "https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Office workers reviewing business plans."],
  ["3184418", "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Business meeting with hands and documents."],
  ["3184325", "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Professional team discussing a project."],
  ["3182812", "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Colleagues reviewing documents during a planning session."],
  ["3184639", "https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Startup team working together in a bright office."],
  ["3856433", "https://images.pexels.com/photos/3856433/pexels-photo-3856433.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Shipping containers and logistics equipment at a commercial port."],
  ["1105766", "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Modern city road and transport corridor."],
  ["373912", "https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Aircraft at an airport gate for a travel story."],
  ["358220", "https://images.pexels.com/photos/358220/pexels-photo-358220.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Aircraft wing above clouds during regional travel."],
  ["7648472", "https://images.pexels.com/photos/7648472/pexels-photo-7648472.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Passengers moving through a modern airport terminal."],
  ["3846820", "https://images.pexels.com/photos/3846820/pexels-photo-3846820.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Travel planning with passport and journey documents."],
  ["3769138", "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Hotel and hospitality service desk."],
  ["323705", "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Modern residential tower and property skyline."],
  ["7937364", "https://images.pexels.com/photos/7937364/pexels-photo-7937364.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Residential towers and city real estate from street level."],
  ["3760067", "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Modern urban towers photographed in daylight."],
  ["439391", "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "High-rise buildings for real estate coverage."],
  ["534220", "https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "City skyline and commercial buildings."],
  ["5480781", "https://images.pexels.com/photos/5480781/pexels-photo-5480781.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Financial charts and market data on a screen."],
  ["6770610", "https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Digital finance and crypto market workspace."],
  ["7567443", "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Cryptocurrency market screen and digital trading desk."],
  ["730547", "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Financial chart on a digital screen."],
  ["399187", "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Football match and sport audience energy."],
  ["274506", "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Sports field and competitive match atmosphere."],
  ["61143", "https://images.pexels.com/photos/61143/pexels-photo-61143.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Tennis court action for sport coverage."],
  ["163452", "https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Basketball action during a competitive game."],
  ["236380", "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Healthcare corridor with clean public service lighting."],
  ["40568", "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Doctor consulting a patient in a healthcare setting."],
  ["7089401", "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Healthcare worker preparing medical notes."],
  ["1763075", "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Live entertainment crowd at a concert."],
  ["257904", "https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Art gallery prepared for visitors."],
  ["1190297", "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Concert stage lights and entertainment crowd."],
  ["5445453", "https://images.pexels.com/photos/5445453/pexels-photo-5445453.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Family discussing daily plans at home."],
  ["15627310", "https://images.pexels.com/photos/15627310/pexels-photo-15627310.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Waterfront dining and hospitality space in a modern city."],
  ["8197505", "https://images.pexels.com/photos/8197505/pexels-photo-8197505.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Students walking across a modern education campus."],
  ["4575053", "https://images.pexels.com/photos/4575053/pexels-photo-4575053.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Officials seated for a formal international meeting."],
  ["7413916", "https://images.pexels.com/photos/7413916/pexels-photo-7413916.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Engineers reviewing industrial operations inside a modern facility."],
  ["8867631", "https://images.pexels.com/photos/8867631/pexels-photo-8867631.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Digital service screens used for public technology operations."],
  ["1109541", "https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop", "Planning notes and business paperwork on a desk."],
];

const categoryQueries = {
  Travel: ["airport travel", "airplane terminal", "hotel travel", "passport journey"],
  Business: ["business meeting", "finance office", "corporate team", "market report"],
  Crypto: ["cryptocurrency trading", "digital finance", "blockchain technology", "financial charts"],
  "Real Estate": ["modern skyline", "residential tower", "property buildings", "urban architecture"],
  Lifestyle: ["family lifestyle", "city dining", "education campus", "shopping lifestyle"],
  Sport: ["football match", "tennis court", "basketball game", "sports stadium"],
  Entertainment: ["concert crowd", "theatre stage", "art gallery", "cinema audience"],
  International: ["international meeting", "global business", "diplomacy meeting", "world news"],
  Health: ["doctor hospital", "healthcare clinic", "medical team", "patient care"],
  "Middle East": ["modern city skyline", "shipping port", "government meeting", "industrial facility"],
  UAE: ["modern city skyline", "business district", "urban transport", "public services"],
};

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  return { frontmatter: match[1], body: match[2] };
}

function readFrontmatter(text, key) {
  return (text.match(new RegExp(`^${key}:\\s*"?(.+?)"?\\s*$`, "m")) || [])[1] || "";
}

function replaceOrInsertFrontmatter(text, key, value) {
  const parsed = parseFrontmatter(text);
  if (!parsed) return text;
  const escaped = String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
  const line = `${key}: "${escaped}"`;
  const pattern = new RegExp(`^${key}:\\s*.+$`, "m");
  const frontmatter = pattern.test(parsed.frontmatter)
    ? parsed.frontmatter.replace(pattern, line)
    : `${parsed.frontmatter}\n${line}`;
  return `---\n${frontmatter}\n---\n${parsed.body}`;
}

function minutes(text) {
  const value = readFrontmatter(text, "publishedTime");
  const match = value.match(/(\d{1,2}):(\d{2})/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : 0;
}

function pexelsIdFromImage(image = "") {
  return (String(image).match(/images\.pexels\.com\/photos\/(\d+)\//) || [])[1] || "";
}

function imageKey(text) {
  const image = readFrontmatter(text, "image");
  if (!image) return "";
  const pexelsId = readFrontmatter(text, "pexelsId") || pexelsIdFromImage(image);
  return pexelsId ? `pexels:${pexelsId}` : image.replace(/&amp;/g, "&").trim();
}

function titleWords(article) {
  const words = `${article.title} ${article.description} ${article.category}`
    .toLowerCase()
    .match(/[a-z0-9]{4,}/g) || [];
  return words.filter((word) => !new Set(["dubai", "time", "news", "with", "from", "that", "this", "what", "will", "uae", "gulf", "says", "about"]).has(word)).slice(0, 3);
}

const pexelsCache = new Map();

async function searchPexels(query, page = 1) {
  if (pexelsDisabled) return [];
  const cacheKey = `${query}::${page}`;
  if (pexelsCache.has(cacheKey)) return pexelsCache.get(cacheKey);
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("size", "large");
  url.searchParams.set("per_page", "80");
  url.searchParams.set("page", String(page));
  const response = await fetch(url, { headers: { Authorization: pexelsApiKey } });
  if (!response.ok) {
    pexelsDisabled = true;
    return [];
  }
  const data = await response.json();
  const photos = Array.isArray(data.photos) ? data.photos : [];
  pexelsCache.set(cacheKey, photos);
  return photos;
}

function stableSeed(value) {
  return String(value || "dubai-time")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "dubai-time";
}

function seededFallback(article, usedKeys, usedIds, fallbackIndex) {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const seed = stableSeed(`${article.file}-${fallbackIndex}-${attempt}`);
    const id = `dedupe-${seed}`;
    const image = `https://picsum.photos/seed/${seed}/900/600`;
    if (!usedIds.has(id) && !usedKeys.has(image)) {
      return {
        id,
        image,
        alt: `${article.category || "Dubai Time"} visual for ${article.title}`,
      };
    }
  }
  const seed = stableSeed(`${article.file}-${Date.now()}`);
  return {
    id: `dedupe-${seed}`,
    image: `https://picsum.photos/seed/${seed}/900/600`,
    alt: `${article.category || "Dubai Time"} visual for ${article.title}`,
  };
}

async function pickPexelsImage(article, usedKeys, usedIds, fallbackIndex) {
  const queries = [
    ...(categoryQueries[article.category] || []),
    titleWords(article).join(" "),
    "Dubai business city",
    "modern city news",
  ].filter(Boolean);

  for (const query of queries) {
    for (let page = 1; page <= 5; page += 1) {
      const photos = await searchPexels(query, page);
      for (const photo of photos) {
        const id = String(photo.id || "");
        const image = photo.src?.large2x || photo.src?.large || photo.src?.original;
        if (!id || !image || usedIds.has(id) || usedKeys.has(`pexels:${id}`)) continue;
        return {
          id,
          image,
          alt: photo.alt || `${article.category || "Dubai Time"} visual for ${article.title}`,
        };
      }
    }
  }

  for (let offset = 0; offset < fallbackPool.length; offset += 1) {
    const [id, image, alt] = fallbackPool[(fallbackIndex + offset) % fallbackPool.length];
    if (!usedIds.has(id) && !usedKeys.has(`pexels:${id}`)) return { id, image, alt };
  }

  return seededFallback(article, usedKeys, usedIds, fallbackIndex);
}

const files = fs.readdirSync(articleDir).filter((file) => file.endsWith(".md"));
const articles = files.map((file) => {
  const fullPath = path.join(articleDir, file);
  const text = fs.readFileSync(fullPath, "utf8");
  return {
    file,
    fullPath,
    text,
    title: readFrontmatter(text, "title"),
    description: readFrontmatter(text, "description"),
    category: readFrontmatter(text, "category") || "Business",
    date: readFrontmatter(text, "date"),
    key: imageKey(text),
    minutes: minutes(text),
  };
}).sort((a, b) => {
  const dateSort = String(b.date).localeCompare(String(a.date));
  if (dateSort) return dateSort;
  return b.minutes - a.minutes;
});

const usedKeys = new Set();
const usedIds = new Set();
let updated = 0;

for (const [index, article] of articles.entries()) {
  const currentImage = readFrontmatter(article.text, "image");
  const duplicate = article.key && usedKeys.has(article.key);
  const missing = !currentImage;
  const generatedFallback = currentImage.includes("picsum.photos") || readFrontmatter(article.text, "pexelsId").startsWith("dedupe-");

  if (!duplicate && !missing && !generatedFallback) {
    if (article.key) usedKeys.add(article.key);
    const existingId = readFrontmatter(article.text, "pexelsId") || pexelsIdFromImage(readFrontmatter(article.text, "image"));
    if (existingId) usedIds.add(existingId);
    continue;
  }

  const selected = await pickPexelsImage(article, usedKeys, usedIds, index + updated);
  usedKeys.add(selected.id.startsWith("dedupe-") ? selected.image : `pexels:${selected.id}`);
  usedIds.add(selected.id);

  let next = article.text;
  next = replaceOrInsertFrontmatter(next, "image", selected.image);
  next = replaceOrInsertFrontmatter(next, "imageAlt", selected.alt);
  next = replaceOrInsertFrontmatter(next, "pexelsId", selected.id);

  fs.writeFileSync(article.fullPath, next);
  updated += 1;
}

console.log(`Checked ${articles.length} articles.`);
console.log(`Updated ${updated} duplicate or missing article images.`);
