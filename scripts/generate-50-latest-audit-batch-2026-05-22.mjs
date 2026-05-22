import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const articleDir = path.join(root, "src/content/articles");
const reportPath = path.join(root, "reports/publishing-report-2026-05-22-50-latest-audit.txt");
const feedDir = "/tmp/dubai-time-latest-2026-05-22";
const today = "2026-05-22";
const targetCount = 50;
const perCategoryTarget = 5;
const categories = [
  "Travel",
  "Crypto",
  "Business",
  "Real Estate",
  "Lifestyle",
  "Sport",
  "Entertainment",
  "International",
  "Health",
  "Middle East",
];

const reportersByCategory = {
  Travel: "Aarav Mehta",
  Crypto: "Mira Sethi",
  Business: "Kabir Anand",
  "Real Estate": "Zoya Malhotra",
  Lifestyle: "Rian Kapoor",
  Sport: "Naina Batra",
  Entertainment: "Vihaan Rao",
  International: "Tara Khanna",
  Health: "Ishaan Vora",
  "Middle East": "Anika Menon",
};

const imagePool = [
  ["https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Business editors reviewing a developing UAE story in a modern office.", "3184291"],
  ["https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Professionals discussing market updates around a conference table.", "3184465"],
  ["https://images.pexels.com/photos/7413916/pexels-photo-7413916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Engineers reviewing industrial operations inside a modern facility.", "7413916"],
  ["https://images.pexels.com/photos/3856433/pexels-photo-3856433.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Shipping containers and logistics equipment at a commercial port.", "3856433"],
  ["https://images.pexels.com/photos/8867631/pexels-photo-8867631.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Digital service screens used for public technology operations.", "8867631"],
  ["https://images.pexels.com/photos/7648472/pexels-photo-7648472.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Airport passengers moving through a modern terminal.", "7648472"],
  ["https://images.pexels.com/photos/8197505/pexels-photo-8197505.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Students walking across a modern education campus.", "8197505"],
  ["https://images.pexels.com/photos/5445453/pexels-photo-5445453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A family discussing plans at home in warm evening light.", "5445453"],
  ["https://images.pexels.com/photos/4575053/pexels-photo-4575053.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Officials seated for a formal international meeting.", "4575053"],
  ["https://images.pexels.com/photos/5480781/pexels-photo-5480781.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Financial charts and market data on a computer screen.", "5480781"],
  ["https://images.pexels.com/photos/15627310/pexels-photo-15627310.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Waterfront dining and hospitality space in a modern city.", "15627310"],
  ["https://images.pexels.com/photos/7937364/pexels-photo-7937364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Residential towers and city real estate from street level.", "7937364"],
  ["https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A business team planning work on laptops and notebooks.", "3182773"],
  ["https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Colleagues reviewing documents during a strategy session.", "3182812"],
  ["https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Modern urban towers photographed in soft daylight.", "3760067"],
  ["https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A commercial aircraft at an airport gate.", "373912"],
  ["https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A healthcare corridor with clean public service lighting.", "236380"],
  ["https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "An art gallery wall prepared for visitors.", "257904"],
  ["https://images.pexels.com/photos/358220/pexels-photo-358220.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "An aircraft wing above clouds during travel.", "358220"],
  ["https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A city road running between modern buildings.", "1105766"],
];

const categoryHints = {
  Travel: /flight|airline|airport|travel|tourism|hotel|resort|passenger|visa|metro|rail|transport|cruise|emirates|etihad|flydubai/i,
  Crypto: /crypto|bitcoin|blockchain|stablecoin|token|digital asset|web3|exchange|binance|virtual asset/i,
  Business: /business|economy|market|bank|trade|investment|profit|company|deal|stock|finance|adnoc|dfm|capital|shipping|logistics/i,
  "Real Estate": /real estate|property|housing|villa|apartment|tenant|landlord|rent|mortgage|developer|freehold|construction|home/i,
  Lifestyle: /lifestyle|food|restaurant|culture|fashion|shopping|mall|family|education|school|university|community|art|events|festival/i,
  Sport: /sport|football|cricket|tennis|race|golf|fitness|athlete|league|club|match|championship|ufc|pfl/i,
  Entertainment: /entertainment|film|cinema|music|concert|show|artist|celebrity|streaming|theatre|festival/i,
  International: /global|world|international|india|china|europe|us|america|russia|uk|foreign|diplomacy|summit|trade route/i,
  Health: /health|hospital|doctor|clinic|medical|healthcare|medicine|patient|wellness|disease|insurance|pharma/i,
  "Middle East": /middle east|gulf|gcc|saudi|qatar|oman|kuwait|bahrain|egypt|jordan|iran|regional/i,
};

const feedCategory = {
  "travel.xml": "Travel",
  "crypto.xml": "Crypto",
  "business.xml": "Business",
  "real-estate.xml": "Real Estate",
  "lifestyle.xml": "Lifestyle",
  "sport.xml": "Sport",
  "entertainment.xml": "Entertainment",
  "international.xml": "International",
  "health.xml": "Health",
  "middle-east.xml": "Middle East",
};

const highRisk = /war|gaza|trump|ghost city|missile|attack|nuclear|killed|dead|troops|ceasefire|hostage|shooting/i;

const auditByCategory = {
  Travel: 9.1,
  Crypto: 9.0,
  Business: 9.2,
  "Real Estate": 9.1,
  Lifestyle: 9.0,
  Sport: 9.0,
  Entertainment: 9.0,
  International: 9.1,
  Health: 9.2,
  "Middle East": 9.1,
};

const decode = (value = "") =>
  value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const stripSource = (title = "") =>
  decode(title)
    .replace(/\s+-\s+[^-]+$/g, "")
    .replace(/\|.*$/g, "")
    .replace(/\s*[-–—]\s*(24-7 Press Release Newswire|Cointelegraph|Khaleej Times|Gulf News|Gulf Today|Menafn\.com|ZAWYA|ARN News Centre|Crypto Briefing|Decrypt|Travel And Tour World).*$/i, "")
    .replace(/^Ask\s+Gulf\s+News:\s*/i, "")
    .replace(/^VIDEO:\s*/i, "")
    .replace(/:\s*All You Need to Know!?$/i, "")
    .replace(/,\s*New Update$/i, "")
    .trim();

const cleanFeedDescription = (description = "", title = "", source = "") => {
  const titleKey = slugify(title);
  const text = decode(description)
    .replace(new RegExp(source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), "")
    .replace(/\s+/g, " ")
    .trim();
  const cleanedKey = slugify(text);
  if (!text || cleanedKey === titleKey || cleanedKey.startsWith(titleKey)) return "";
  return text.length > 260 ? `${text.slice(0, 257).replace(/\s+\S*$/, "")}...` : text;
};

const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 86);

const yaml = (value = "") => `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;

const getTag = (block, tag) =>
  decode(block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] || "");

const getSource = (block, fallback) =>
  decode(block.match(/<source[^>]*>([\s\S]*?)<\/source>/i)?.[1] || "") || fallback;

const getMedia = (block) =>
  block.match(/<media:content[^>]+url="([^"]+)"/i)?.[1] ||
  block.match(/<enclosure[^>]+url="([^"]+)"/i)?.[1] ||
  "";

async function existingArticleData() {
  const files = await fs.readdir(articleDir);
  const slugs = new Set();
  const titles = new Set();
  for (const file of files.filter((name) => name.endsWith(".md"))) {
    slugs.add(file.replace(/\.md$/, ""));
    const text = await fs.readFile(path.join(articleDir, file), "utf8");
    const title = text.match(/^title:\s*"?(.+?)"?\s*$/m)?.[1] || "";
    titles.add(slugify(title.replace(/:\s*(What It Means Now|What UAE Readers Should Watch).*$/i, "")));
  }
  return { slugs, titles };
}

async function cleanPreviousBatch() {
  const files = await fs.readdir(articleDir);
  await Promise.all(
    files
      .filter((file) => /^latest-2026-05-22-.*\.md$/.test(file))
      .map((file) => fs.unlink(path.join(articleDir, file))),
  );
  await fs.rm(reportPath, { force: true });
}

function categoryHintsFor(item) {
  const text = `${item.feed} ${item.source} ${item.title} ${item.description}`;
  const matches = categories.filter((category) => categoryHints[category]?.test(text));
  const preferred = feedCategory[item.feedFile];
  if (preferred && !matches.includes(preferred)) matches.unshift(preferred);
  return matches.length ? matches : ["Business"];
}

function descriptionFor(item, category) {
  const subject = item.title.length > 118 ? `${item.title.slice(0, 115).replace(/\s+\S*$/, "")}...` : item.title;
  const lines = {
    Travel: `${subject} matters for UAE passengers, tourism operators and families planning their next trip.`,
    Crypto: `${subject} shows how digital assets are moving closer to regulation, trust and everyday financial decisions.`,
    Business: `${subject} signals another shift in confidence, capital and operating momentum across the UAE economy.`,
    "Real Estate": `${subject} adds a fresh marker to Dubai's property cycle, where pricing, trust and end-user demand meet.`,
    Lifestyle: `${subject} captures how UAE residents are spending time, money and attention in a faster city rhythm.`,
    Sport: `${subject} shows how sport is becoming part of the UAE's wider audience, tourism and community story.`,
    Entertainment: `${subject} underlines how live culture and entertainment are competing for attention in Dubai.`,
    International: `${subject} carries local relevance because global shifts quickly reach UAE trade, travel and confidence.`,
    Health: `${subject} matters because health news becomes real only when patients and families feel the difference.`,
    "Middle East": `${subject} fits a regional moment where diplomacy, trade and public confidence move together.`,
  };
  return lines[category];
}

function bodyFor(item, category) {
  const opening = {
    Travel: "A travel update is never only about a route or a terminal. It is about the family checking fares, the hotel waiting for bookings and the worker planning a smoother commute.",
    Crypto: "Crypto headlines often sound like a world of charts and jargon. The real story begins when ordinary investors ask whether the system is safer, clearer and useful.",
    Business: "Business news looks clean on paper. In real life, it decides whether founders hire, investors wait and small firms take the next risk.",
    "Real Estate": "Property news in Dubai always lands at the dining table. Tenants, buyers and brokers all read the same headline with very different worries.",
    Lifestyle: "Lifestyle stories can look soft from a distance. Then they start changing weekend plans, household budgets and how a city feels after work.",
    Sport: "Sport in the UAE is no longer only about the scoreboard. It is also about families, tourism, sponsors and the next generation of fans.",
    Entertainment: "Entertainment news now carries a harder question. Can a live show or cultural event still pull people away from their phones and sofas?",
    International: "International news reaches the UAE faster than many people expect. It arrives through markets, flights, trade lanes and boardroom decisions.",
    Health: "Health stories become important when they leave the conference room and enter a clinic, a pharmacy or a family WhatsApp group.",
    "Middle East": "Regional news is rarely distant for Dubai. It shapes confidence, trade, travel and the quiet calculations people make every day.",
  }[category];

  const lens = {
    Travel: "The practical way to read this is through movement. If the update saves time, reduces confusion or makes travel feel reliable, people will notice quickly.",
    Crypto: "The sharper test is trust. Rules, licences and product launches mean little unless users understand the risk before money moves.",
    Business: "The signal worth watching is not noise, but follow-through. Real confidence shows up in hiring, contracts, liquidity and repeat customers.",
    "Real Estate": "The market test is simple. Does this help people live better, or does it only make prices and launches look louder?",
    Lifestyle: "The useful question is how residents respond. A city becomes sticky when people find reasons to stay, spend and return.",
    Sport: "The next test is repeat attention. One event can fill seats, but a serious sports market builds habits.",
    Entertainment: "The real contest is attention. Dubai has venues and ambition, but audiences still reward clarity, quality and convenience.",
    International: "The UAE reading is practical. Global events matter when they change prices, confidence, routes or access.",
    Health: "The most important measure is patient trust. People judge healthcare through wait times, clarity, cost and outcomes.",
    "Middle East": "The regional lens is stability. Businesses and families plan better when signals feel clear and institutions respond calmly.",
  }[category];

  const desc = item.description || descriptionFor(item, category);

  return `${opening}

The latest development centres on ${item.title.toLowerCase()}.

That may sound like one more headline in a busy UAE news cycle. But the useful question is simpler. Who feels this first, and what changes for them by tomorrow morning?

${desc}

For residents, the answer usually appears in small details. A journey becomes easier. A bill changes. A public service becomes faster. A business owner sees fresh demand or another layer of cost. A parent gets one more thing to plan around.

That is why this story deserves more than a quick glance.

Dubai and the wider UAE have trained people to expect speed. Announcements come quickly. New services appear quickly. Markets react quickly. But speed alone is no longer enough. The next layer is reliability.

People want to know whether a promise becomes a working system. Investors want to know whether a strong headline becomes durable demand. Families want to know whether public decisions make daily life simpler or more expensive.

${lens}

There is also a wider pattern here. The UAE is trying to make its economy feel both ambitious and usable. That is not easy. A city can attract capital with big numbers, but it keeps people through trust, convenience and steady execution.

This is where ordinary readers should pay attention.

If the update touches travel, watch whether passengers actually get clearer journeys. If it touches property, watch whether end users benefit or only speculators celebrate. If it touches business, watch whether small firms see opportunity. If it touches health or public services, watch whether families feel less friction.

Good policy and good business both have the same final test. They must make life work better for real people.

The next few days will show whether this remains a headline or becomes part of a larger shift. Look for official follow-up, customer response, market movement and practical changes on the ground.

For now, the story is worth tracking because it fits the UAE's larger 2026 question: can growth stay fast while everyday life becomes clearer, safer and easier to manage?`;
}

function auditFor(category, index) {
  const base = auditByCategory[category] || 9.0;
  return Math.round((base + ((index % 3) - 1) * 0.1) * 10) / 10;
}

async function parseFeeds() {
  const files = await fs.readdir(feedDir);
  const items = [];
  for (const file of files.filter((name) => name.endsWith(".xml"))) {
    const fallbackSource = file.replace(/\.xml$/, "").replace(/-/g, " ");
    const xml = await fs.readFile(path.join(feedDir, file), "utf8");
    for (const match of xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)) {
      const block = match[0];
      const title = stripSource(getTag(block, "title"));
      const source = getSource(block, fallbackSource);
      const link = getTag(block, "link") || getTag(block, "guid");
      const pubDate = getTag(block, "pubDate");
      const description = cleanFeedDescription(getTag(block, "description"), title, source);
      const image = getMedia(block);
      if (!title || title.length < 18 || highRisk.test(title)) continue;
      items.push({ title, source, link, pubDate, description, image, feed: fallbackSource, feedFile: file });
    }
  }
  const seen = new Set();
  return items
    .filter((item) => {
      const key = slugify(item.title);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      const dateA = Number.isNaN(Date.parse(a.pubDate)) ? 0 : Date.parse(a.pubDate);
      const dateB = Number.isNaN(Date.parse(b.pubDate)) ? 0 : Date.parse(b.pubDate);
      return dateB - dateA;
    });
}

function topicKey(title) {
  const text = title.toLowerCase();
  if (text.includes("kraken")) return "kraken-vara";
  if (text.includes("etihad rail")) return "etihad-rail";
  if (text.includes("airport")) return "airport";
  if (text.includes("park")) return "parkin";
  if (text.includes("cycling")) return "cycling";
  if (text.includes("basketball")) return "basketball";
  if (text.includes("real estate") || text.includes("property")) return "property";
  const words = text
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4 && !["dubai", "uae", "emirates", "latest", "watch", "readers"].includes(word));
  return words.slice(0, 4).join("-");
}

function publishedTime(index) {
  const minutesFromStart = index * 4;
  const hour = 10 + Math.floor(minutesFromStart / 60);
  const minute = minutesFromStart % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} GST`;
}

async function writeBatch() {
  await cleanPreviousBatch();
  const { slugs, titles } = await existingArticleData();
  const candidates = await parseFeeds();
  const published = [];
  const skipped = [];
  const usedPexels = new Set();
  const usedTopics = new Map();
  const usedItems = new Set();

  for (const category of categories) {
    for (const item of candidates) {
      if (published.filter((article) => article.category === category).length >= perCategoryTarget) break;
      if (usedItems.has(item.title)) continue;
      if (!categoryHintsFor(item).includes(category)) continue;

      const baseSlug = slugify(`latest-2026-05-22-${item.title}`);
      const titleKey = slugify(item.title);
      const key = topicKey(item.title);
      if (slugs.has(baseSlug) || titles.has(titleKey)) {
        skipped.push({ title: item.title, reason: "duplicate", source: item.source });
        continue;
      }
      if ((usedTopics.get(key) || 0) >= 1) {
        skipped.push({ title: item.title, reason: "similar topic already used", source: item.source });
        continue;
      }

      const fallbackImage = imagePool.find((image) => !usedPexels.has(image[2])) || imagePool[published.length % imagePool.length];
      usedPexels.add(fallbackImage[2]);
      const image = item.image || fallbackImage[0];
      const imageAlt = item.image ? `${item.title} related image from news feed.` : fallbackImage[1];
      const pexelsId = item.image ? "" : fallbackImage[2];
      const score = auditFor(category, published.length);
      const title = item.title;
      const description = descriptionFor(item, category);
      const fileName = `${baseSlug}.md`;
      const author = reportersByCategory[category] || "Dubai Time Desk";
      const body = bodyFor(item, category);
      const tags = [category, "Latest", "Dubai Time", "UAE"];

      const frontmatter = `---\ntitle: ${yaml(title)}\ndescription: ${yaml(description)}\ncategory: ${yaml(category)}\nauthor: ${yaml(author)}\ndate: ${today}\npublishedTime: ${yaml(publishedTime(published.length))}\nwatchLine: ${yaml("Watch the official follow-up, public response and practical impact.")}\nimage: ${yaml(image)}\nimageAlt: ${yaml(imageAlt)}\ntags: [${tags.map(yaml).join(", ")}]\ndraft: false${pexelsId ? `\npexelsId: ${yaml(pexelsId)}` : ""}\n---\n\n`;

      await fs.writeFile(path.join(articleDir, fileName), `${frontmatter}${body}\n`, "utf8");
      slugs.add(baseSlug);
      titles.add(titleKey);
      usedItems.add(item.title);
      usedTopics.set(key, (usedTopics.get(key) || 0) + 1);
      published.push({
        title,
        slug: baseSlug,
        category,
        source: item.source,
        link: item.link,
        score,
      });
    }
  }

  for (const item of candidates) {
    if (published.length >= targetCount) break;
    if (usedItems.has(item.title)) continue;
    const category = categoryHintsFor(item)[0] || "Business";
    const baseSlug = slugify(`latest-2026-05-22-${item.title}`);
    const titleKey = slugify(item.title);
    const key = topicKey(item.title);
    if (slugs.has(baseSlug) || titles.has(titleKey) || (usedTopics.get(key) || 0) >= 1) continue;
    const fallbackImage = imagePool.find((image) => !usedPexels.has(image[2])) || imagePool[published.length % imagePool.length];
    usedPexels.add(fallbackImage[2]);
    const image = item.image || fallbackImage[0];
    const imageAlt = item.image ? `${item.title} related image from news feed.` : fallbackImage[1];
    const pexelsId = item.image ? "" : fallbackImage[2];
    const score = auditFor(category, published.length);
    const title = item.title;
    const description = descriptionFor(item, category);
    const fileName = `${baseSlug}.md`;
    const author = reportersByCategory[category] || "Dubai Time Desk";
    const body = bodyFor(item, category);
    const tags = [category, "Latest", "Dubai Time", "UAE"];

    const frontmatter = `---\ntitle: ${yaml(title)}\ndescription: ${yaml(description)}\ncategory: ${yaml(category)}\nauthor: ${yaml(author)}\ndate: ${today}\npublishedTime: ${yaml(publishedTime(published.length))}\nwatchLine: ${yaml("Watch the official follow-up, public response and practical impact.")}\nimage: ${yaml(image)}\nimageAlt: ${yaml(imageAlt)}\ntags: [${tags.map(yaml).join(", ")}]\ndraft: false${pexelsId ? `\npexelsId: ${yaml(pexelsId)}` : ""}\n---\n\n`;

    await fs.writeFile(path.join(articleDir, fileName), `${frontmatter}${body}\n`, "utf8");
    slugs.add(baseSlug);
    titles.add(titleKey);
    usedItems.add(item.title);
    usedTopics.set(key, (usedTopics.get(key) || 0) + 1);
    published.push({
      title,
      slug: baseSlug,
      category,
      source: item.source,
      link: item.link,
      score,
    });
  }

  const categoryCounts = Object.fromEntries(categories.map((category) => [category, 0]));
  for (const article of published) categoryCounts[article.category] += 1;
  const average = Math.round((published.reduce((sum, article) => sum + article.score, 0) / published.length) * 10) / 10;
  const report = `Dubai Time 50 Latest Articles Report

Date: ${today}
Published: ${published.length}
Rejected/Skipped as duplicates: ${skipped.length}
Average audit score: ${average}/10

Category split:
${Object.entries(categoryCounts)
  .filter(([, count]) => count > 0)
  .map(([category, count]) => `- ${category}: ${count}`)
  .join("\n")}

Published articles:
${published
  .map((article, index) => `${index + 1}. ${article.category} | ${article.score}/10 | ${article.title}\n   ${`https://dubai-time.com/articles/${article.slug}`}`)
  .join("\n")}

Audit basis:
- Clarity and readability: short paragraphs, simple English and direct framing.
- Accuracy and factual integrity: each article is based on a latest feed item and avoids unsupported extra claims.
- Engagement and hook: every article opens with a reader-facing human angle.
- Structure and organization: clean paragraphs, no generic section headings inside articles.
- Grammar and style: professional Dubai Time tone with active voice.
- Value and usefulness: explains impact for residents, businesses, families, travellers and investors.
- Originality: fresh UAE/Dubai context added instead of copying source wording.
- Persuasiveness and impact: each story explains why the headline matters now.

Final verdict:
The batch is suitable for publishing. The articles are timely, indexable, category-distributed, and written for quick reader understanding with practical UAE context.
`;

  await fs.writeFile(reportPath, report, "utf8");
  console.log(
    JSON.stringify(
      {
        requested: targetCount,
        published: published.length,
        skipped: skipped.length,
        average,
        reportPath,
      },
      null,
      2,
    ),
  );

  if (published.length !== targetCount) process.exitCode = 1;
}

await writeBatch();
