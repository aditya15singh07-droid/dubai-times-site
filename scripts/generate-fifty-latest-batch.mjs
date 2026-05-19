import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const articleDir = path.join(root, "src/content/articles");
const stagedDir =
  "/Users/aditya/Documents/Codex/2026-05-17/files-mentioned-by-the-user-2026/dubai-times-engine/outputs/staged-articles-2026-05-19";
const feedDir = "/tmp/dubai-time-feeds";
const today = "2026-05-19";
const targetCount = 50;

const batchReport = {
  copiedStaged: [],
  generatedFromFeeds: [],
  skipped: [],
};

const pexelsImages = [
  ["https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Business leaders reviewing documents during a newsroom-style briefing.", "3184291"],
  ["https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Professionals discussing strategy around a conference table.", "3184465"],
  ["https://images.pexels.com/photos/7413916/pexels-photo-7413916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Industrial workers reviewing operations inside a modern facility.", "7413916"],
  ["https://images.pexels.com/photos/3856433/pexels-photo-3856433.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Shipping containers and logistics equipment at a commercial port.", "3856433"],
  ["https://images.pexels.com/photos/8867631/pexels-photo-8867631.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Digital service screens used for public technology operations.", "8867631"],
  ["https://images.pexels.com/photos/7648472/pexels-photo-7648472.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Airport passengers moving through a modern terminal.", "7648472"],
  ["https://images.pexels.com/photos/8197505/pexels-photo-8197505.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Students walking across a university campus.", "8197505"],
  ["https://images.pexels.com/photos/5445453/pexels-photo-5445453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Family members sharing a quiet moment at home.", "5445453"],
  ["https://images.pexels.com/photos/4575053/pexels-photo-4575053.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Officials in a formal international meeting.", "4575053"],
  ["https://images.pexels.com/photos/5480781/pexels-photo-5480781.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Financial charts and market data on a computer screen.", "5480781"],
  ["https://images.pexels.com/photos/15627310/pexels-photo-15627310.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Waterfront dining area in a modern city.", "15627310"],
  ["https://images.pexels.com/photos/7937364/pexels-photo-7937364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Residential towers and city real estate from street level.", "7937364"],
];

const decode = (value = "") =>
  value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 78);

const yaml = (value = "") => `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;

function getTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return decode(match?.[1] || "");
}

function getMedia(block) {
  const media = block.match(/<media:content[^>]+url="([^"]+)"/i)?.[1];
  const enclosure = block.match(/<enclosure[^>]+url="([^"]+)"/i)?.[1];
  return media || enclosure || "";
}

async function existingSlugs() {
  const files = await fs.readdir(articleDir);
  return new Set(files.filter((file) => file.endsWith(".md")).map((file) => file.replace(/\.md$/, "")));
}

function categoryFor(source, title, description) {
  const text = `${source} ${title} ${description}`.toLowerCase();
  if (/business|market|bank|econom|trade|stock|profit|invest|company|firm|deal/.test(text)) return "Business";
  if (/flight|airline|airport|travel|hotel|tourism|passenger/.test(text)) return "Travel";
  if (/property|real estate|housing|villa|apartment|construction/.test(text)) return "Real Estate";
  if (/tech|ai|digital|cyber|app|data|robot/.test(text)) return "Technology";
  if (/film|art|music|fashion|health|food|school|lifestyle|culture/.test(text)) return "Lifestyle";
  if (/dubai|sharjah|abu dhabi|uae|emirates/.test(text)) return "UAE";
  return "World";
}

function introFor(category) {
  const intros = {
    Business: "Markets move on confidence first and numbers second.",
    Travel: "Travel news is never only about aircraft, hotels or terminals.",
    "Real Estate": "Property stories rarely stay inside the property market.",
    Technology: "Technology becomes important when it stops being a demonstration and enters daily life.",
    Lifestyle: "Lifestyle news often looks soft until it starts changing how people spend time and money.",
    UAE: "In the UAE, public decisions often move quickly from announcement to daily routine.",
    World: "World news can feel distant until it changes the decisions made closer to home.",
  };
  return intros[category] || intros.World;
}

function makeArticle(item, index) {
  const category = categoryFor(item.source, item.title, item.description);
  const image = item.image || pexelsImages[index % pexelsImages.length][0];
  const imageAlt = item.image ? `${item.title} related news image from source feed.` : pexelsImages[index % pexelsImages.length][1];
  const pexelsId = item.image ? "" : pexelsImages[index % pexelsImages.length][2];
  const time = `${String(13 + Math.floor(index / 4)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")} GST`;
  const cleanTitle = item.title.replace(/\s+/g, " ").trim();
  const sourceSentence = item.link ? `The source item is available at [${item.source}](${item.link}).` : `The source item was carried by ${item.source}.`;
  const description =
    item.description.length > 170
      ? `${item.description.slice(0, 167).replace(/\s+\S*$/, "")}...`
      : item.description || `The latest report focuses on ${cleanTitle.toLowerCase()}.`;
  const title = `${cleanTitle}: What It Means Now`;
  const slug = slugify(`latest-${cleanTitle}`);
  const tags = [category, "Latest", item.source.replace(/\s+RSS$/i, ""), "Dubai Time"].slice(0, 4);

  const body = `${introFor(category)}

The latest development is this: ${cleanTitle}.

That headline may look straightforward, but the wider meaning depends on who feels the effect first. A policy change, a market shift, a travel update or an international move rarely remains abstract for long. It reaches commuters, families, founders, workers, investors and small businesses through small practical changes.

${description}

## The Immediate Signal

The first signal is timing.

News moves fastest when there is pressure behind it. That pressure may come from markets, diplomacy, public services, safety, travel demand or consumer behaviour. In this case, the report points to a story that deserves to be read beyond the headline.

For Dubai and the UAE audience, the question is not only what happened. The sharper question is what changes next.

If the story is commercial, people will watch costs, confidence and investment appetite. If it is public-service related, residents will judge the effect through speed, access and convenience. If it is international, the local relevance may appear through trade, travel, energy, security or market mood.

That is how a single item enters daily life.

## Why Readers Should Care

The most useful way to read this story is through consequences.

Does it change how institutions plan? Does it change how families spend? Does it affect business confidence? Does it make travel easier or harder? Does it push public agencies to act faster? Does it change the way companies talk to customers?

Those questions matter because good news coverage should not stop at the event.

For a resident, the real value lies in knowing whether the issue may affect a commute, a job, a bill, a trip, an investment or a public service. For a business owner, the value lies in knowing whether the operating environment is becoming easier, more expensive or more uncertain.

This is why context matters.

## The Dubai And UAE Lens

Dubai and the wider UAE usually read news through execution.

Announcements are common. What matters is whether they move into systems, services, contracts, hiring, infrastructure or public behaviour. A city can announce ambition quickly. It earns trust by making that ambition work on the ground.

That is the frame worth applying here.

If the story touches growth, the next test is delivery. If it touches safety, the next test is enforcement. If it touches trade or travel, the next test is reliability. If it touches technology, the next test is whether people actually use it without confusion.

The UAE's advantage has often been speed. Its challenge is making speed feel stable.

## The Human Angle

Behind every headline there is a person making a small decision.

A parent checks whether a public service is easier. A worker decides whether a commute is worth it. A trader waits to see if goods arrive on time. A student wonders whether a new opportunity is real. A founder asks if the market is still confident enough to hire.

That is why even a high-level story needs a human reading.

People do not experience news as policy language. They experience it as time saved, money spent, risk avoided, a call returned, a queue shortened or a plan delayed.

## What To Watch Next

The next stage will decide whether this remains a passing headline or becomes part of a larger pattern.

Readers should watch for follow-up action, official clarification, business response and any visible change in public behaviour. The first report tells us what happened. The next response tells us whether it matters.

For now, the story deserves attention because it sits inside a larger UAE pattern: fast decisions, high expectations and a public that increasingly judges announcements by practical results.

${sourceSentence}`;

  return {
    fileName: `${slug}.md`,
    title,
    slug,
    category,
    author: `Dubai Time ${category} Desk`,
    description,
    time,
    image,
    imageAlt,
    pexelsId,
    tags,
    body,
    source: item.source,
    link: item.link,
  };
}

async function parseFeeds() {
  const files = await fs.readdir(feedDir);
  const items = [];
  for (const file of files.filter((name) => name.endsWith(".xml"))) {
    const source = file
      .replace(/\.xml$/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    const xml = await fs.readFile(path.join(feedDir, file), "utf8");
    const blocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
    for (const block of blocks) {
      const title = getTag(block, "title");
      if (!title) continue;
      const description = getTag(block, "description");
      const link = getTag(block, "link") || getTag(block, "guid");
      const pubDate = getTag(block, "pubDate");
      const image = getMedia(block);
      items.push({ title, description, link, pubDate, image, source });
    }
  }
  const seen = new Set();
  return items.filter((item) => {
    const key = slugify(item.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function copyStaged(slugs) {
  const files = await fs.readdir(stagedDir).catch(() => []);
  for (const file of files.filter((name) => name.endsWith(".md"))) {
    if (batchReport.copiedStaged.length >= 16) break;
    const slug = file.replace(/\.md$/, "");
    if (slugs.has(slug)) {
      batchReport.skipped.push(`${file}: already live`);
      continue;
    }
    const source = path.join(stagedDir, file);
    const target = path.join(articleDir, file);
    const text = await fs.readFile(source, "utf8");
    await fs.writeFile(target, text, "utf8");
    slugs.add(slug);
    batchReport.copiedStaged.push(file);
  }
}

async function writeGenerated(slugs) {
  const feedItems = await parseFeeds();
  let index = 0;
  for (const item of feedItems) {
    const currentCount = batchReport.copiedStaged.length + batchReport.generatedFromFeeds.length;
    if (currentCount >= targetCount) break;
    const article = makeArticle(item, index);
    index += 1;
    if (slugs.has(article.slug)) {
      batchReport.skipped.push(`${article.fileName}: already live`);
      continue;
    }
    const frontmatter = `---
title: ${yaml(article.title)}
description: ${yaml(article.description)}
category: ${yaml(article.category)}
author: ${yaml(article.author)}
date: ${today}
publishedTime: ${yaml(article.time)}
watchLine: ${yaml("Watch the next official update, market response and public impact.")}
image: ${yaml(article.image)}
imageAlt: ${yaml(article.imageAlt)}
tags: [${article.tags.map(yaml).join(", ")}]
draft: false${article.pexelsId ? `\npexelsId: ${yaml(article.pexelsId)}` : ""}
---

`;
    await fs.writeFile(path.join(articleDir, article.fileName), `${frontmatter}${article.body}\n`, "utf8");
    slugs.add(article.slug);
    batchReport.generatedFromFeeds.push({
      file: article.fileName,
      title: article.title,
      category: article.category,
      source: article.source,
      link: article.link,
    });
  }
}

const slugs = await existingSlugs();
await copyStaged(slugs);
await writeGenerated(slugs);
await fs.writeFile(
  "/tmp/dubai-time-50-batch-report.json",
  JSON.stringify(batchReport, null, 2),
  "utf8",
);

console.log(JSON.stringify({
  copiedStaged: batchReport.copiedStaged.length,
  generatedFromFeeds: batchReport.generatedFromFeeds.length,
  totalAdded: batchReport.copiedStaged.length + batchReport.generatedFromFeeds.length,
  skipped: batchReport.skipped.length,
}, null, 2));
