import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const articleDir = path.join(root, "src/content/articles");
const feedDir = "/tmp/dubai-time-feeds-2026-05-20";
const targetCount = 37;
const reportPath = "/tmp/dubai-time-37-batch-report.json";

const trustedSource = /Gulf News|Khaleej Times|Gulf Business|Economy Middle East|ZAWYA|Arabian Business|Emirates 24\|7|Time Out Dubai|Gulf Daily News|gulf-latest|The National|Reuters|Xinhua|Airport Industry-News|DD India|Business Standard|Consultancy-me|Breaking Travel News|TradingView|ACCESS Newswire|MSN|intlbm|vocal\.media|allsopp/i;
const uaeRelevant = /dubai|uae|emirate|abu dhabi|sharjah|fujairah|ras al khaimah|etihad|emirates|hamdan|mohammed bin rashid|sheikh|gulf|dfm|adnoc|dewa|rta|flydubai|air arabia|majid al futtaim|jebel ali/i;
const highRisk = /war|drone|missile|nuclear|killed|attack|gunman|shooting|flotilla|ebola|conflict|dead|strike|troops|gaza|iran|catastrophic/i;

const pexelsImages = [
  ["https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Business editors reviewing a developing story in a modern office."],
  ["https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Professionals discussing market updates around a meeting table."],
  ["https://images.pexels.com/photos/7413916/pexels-photo-7413916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Engineers reviewing industrial operations in a modern facility."],
  ["https://images.pexels.com/photos/3856433/pexels-photo-3856433.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Shipping containers and logistics infrastructure at a commercial port."],
  ["https://images.pexels.com/photos/8867631/pexels-photo-8867631.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Digital public service screens used in a smart city setting."],
  ["https://images.pexels.com/photos/7648472/pexels-photo-7648472.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Passengers walking through a bright international airport terminal."],
  ["https://images.pexels.com/photos/8197505/pexels-photo-8197505.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Students crossing a modern university campus."],
  ["https://images.pexels.com/photos/5445453/pexels-photo-5445453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A family discussing plans at home in warm evening light."],
  ["https://images.pexels.com/photos/4575053/pexels-photo-4575053.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Officials seated for a formal international meeting."],
  ["https://images.pexels.com/photos/5480781/pexels-photo-5480781.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Financial charts displayed on a market analyst's computer."],
  ["https://images.pexels.com/photos/15627310/pexels-photo-15627310.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Waterfront dining and hospitality space in a modern city."],
  ["https://images.pexels.com/photos/7937364/pexels-photo-7937364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Residential towers seen from a city street."],
  ["https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A business team planning work on laptops and notebooks."],
  ["https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Colleagues reviewing documents during a strategy session."],
  ["https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A team comparing charts and performance notes."],
  ["https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Professionals working together in a bright office."],
  ["https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Business partners reviewing a new growth plan."],
  ["https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A focused office discussion around a conference desk."],
  ["https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Team members studying a presentation on a laptop."],
  ["https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Executives checking a project plan in a meeting room."],
  ["https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "People exchanging ideas across a modern office table."],
  ["https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A professional presentation with charts and working notes."],
  ["https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Modern urban towers photographed in soft daylight."],
  ["https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A workspace with laptops, notes and business planning material."],
  ["https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A group discussing strategy in a clean corporate office."],
  ["https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A city road running between modern buildings."],
  ["https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Urban infrastructure seen from street level."],
  ["https://images.pexels.com/photos/2449452/pexels-photo-2449452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A modern skyline under clear city light."],
  ["https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "Aerial view of city streets and tall buildings."],
  ["https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A glass office tower in a financial district."],
  ["https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "High-rise buildings and city architecture."],
  ["https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A contemporary building facade in a business district."],
  ["https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A commercial aircraft at an airport gate."],
  ["https://images.pexels.com/photos/358220/pexels-photo-358220.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "An aircraft wing above clouds during travel."],
  ["https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A healthcare corridor with clean public service lighting."],
  ["https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "A quiet library shelf used for culture and knowledge stories."],
  ["https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "An art gallery wall prepared for visitors."],
];

const report = {
  date: "2026-05-20",
  requested: targetCount,
  published: [],
  skipped: [],
  sources: [],
};

const decode = (value = "") =>
  value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
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
    .replace(/\s+\|\s+.*$/g, "")
    .replace(/^VIDEO:\s*/i, "")
    .trim();

const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 82);

const yaml = (value = "") => `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;

function getTag(block, tag) {
  return decode(block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] || "");
}

function getSource(block, fallback) {
  return decode(block.match(/<source[^>]*>([\s\S]*?)<\/source>/i)?.[1] || "") || fallback;
}

function getMedia(block) {
  return (
    block.match(/<media:content[^>]+url="([^"]+)"/i)?.[1] ||
    block.match(/<enclosure[^>]+url="([^"]+)"/i)?.[1] ||
    ""
  );
}

async function existingArticleData() {
  const files = await fs.readdir(articleDir);
  const slugs = new Set();
  const titles = new Set();
  for (const file of files.filter((name) => name.endsWith(".md"))) {
    slugs.add(file.replace(/\.md$/, ""));
    const text = await fs.readFile(path.join(articleDir, file), "utf8");
    const title = text.match(/^title:\s*"?(.+?)"?\s*$/m)?.[1] || "";
    titles.add(slugify(title.replace(/:\s*(What It Means Now|Dubai Time Briefing|What UAE Readers Should Watch).*$/i, "")));
  }
  return { slugs, titles };
}

function categoryFor(title, source) {
  const text = `${title} ${source}`.toLowerCase();
  if (/real estate|property|landlord|tenant|home|freehold|mortgaged|development|community|broker|villa|rental/.test(text)) return "Real Estate";
  if (/\bweather\b|\bheat\b|\brain\b|\bwind\b|\bpassport\b|\bpolice\b|\bfine\b|\bhealthcare\b|\bslaughterhouse\b|public service|bureaucracy/.test(text)) return "UAE";
  if (/rail|metro|flight|airline|airport|travel|tourism|hotel|staycation|passenger|flydubai/.test(text)) return "Travel";
  if (/\bai\b|artificial intelligence|technology|digital|blockchain|\bdata\b|cyber|agentic|software|iphone|smart security|security systems/.test(text)) return "Technology";
  if (/business|trade|economy|market|investment|bank|stocks|campaign|furniture|workspace|capital|price index|imf|macroeconomic/.test(text)) return "Business";
  if (/archive|blooms|family|culture|library|memories/.test(text)) return "Lifestyle";
  return /dubai|sharjah|abu dhabi|uae/.test(text) ? "UAE" : "World";
}

function expertLens(category) {
  const lenses = {
    Dubai: "Mona Kattan",
    UAE: "Karen Young",
    Business: "Gary Vaynerchuk",
    "Real Estate": "Ryan Serhant",
    Travel: "Drew Binsky",
    Lifestyle: "Chiara Ferragni",
    Technology: "Marques Brownlee",
    World: "Fareed Zakaria",
  };
  return lenses[category] || lenses.UAE;
}

function formatDate(pubDate) {
  const date = Number.isNaN(Date.parse(pubDate)) ? new Date("2026-05-20T08:00:00+04:00") : new Date(pubDate);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatTime(pubDate, index) {
  const date = Number.isNaN(Date.parse(pubDate)) ? new Date(Date.UTC(2026, 4, 20, 4, index)) : new Date(pubDate);
  return `${new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)} GST`;
}

function makeDescription(title, category) {
  const short = title.length > 118 ? `${title.slice(0, 115).replace(/\s+\S*$/, "")}...` : title;
  const lines = {
    Business: `${short} signals another turn in how capital, customers and confidence are moving across the UAE.`,
    "Real Estate": `${short} adds a fresh marker to Dubai's property cycle, where demand, pricing and trust all move together.`,
    Travel: `${short} matters for passengers, operators and the wider visitor economy that keeps Dubai moving.`,
    Technology: `${short} shows how quickly AI, digital services and data rules are entering everyday UAE decisions.`,
    Lifestyle: `${short} captures the softer side of city growth, where culture, families and spending habits meet.`,
    UAE: `${short} could affect residents directly, from public services and safety to daily planning across the Emirates.`,
    World: `${short} carries local relevance because global shifts quickly reach UAE trade, travel and confidence.`,
  };
  return lines[category] || lines.UAE;
}

function makeBody(item, category) {
  const cleanTitle = item.title;
  const sourceName = item.source || "source feed";
  const sourceLine = item.link ? `The original source item is available via [${sourceName}](${item.link}).` : `The item was carried by ${sourceName}.`;

  return `The headline sounds like one more update in a fast news cycle. It is more useful to read it as a signal.

${cleanTitle}.

For Dubai and the wider UAE, stories like this rarely sit in one neat box. A property headline can affect family budgets. A travel update can change hotel demand. A technology announcement can reshape how a public service feels at the counter. A market story can reach a small business owner before it reaches a boardroom.

That is why this update deserves a little patience.

## What Happened

According to ${sourceName}, the latest development centres on ${cleanTitle.toLowerCase()}.

The detail may look narrow at first glance. But Dubai often turns narrow developments into larger operating signals. When a new service launches, residents ask whether it saves time. When a company expands, investors ask whether demand is still strong. When a transport or travel update lands, families ask whether their plans become easier or more uncertain.

That practical reading is the useful one here.

## Why It Matters Now

The timing matters because the UAE is moving through a busy stretch.

Residents are watching weather, school calendars, Eid planning, rent pressure, flight schedules and public service changes. Businesses are watching consumer spending, logistics, hiring and the cost of growth. Investors are watching whether Dubai can keep its premium story while still making daily life efficient.

This headline enters that wider mood.

If the story is about business, the question is simple: does it show real demand or only a loud announcement?

If it is about property, the question becomes sharper: does it help end users, or only make the market look busier?

If it is about travel or transport, the judgement comes from ordinary people. Did the journey become smoother? Did information arrive on time? Did the system reduce stress?

Dubai's best stories usually pass that practical test.

## The Dubai Lens

The useful perspective here is simple: do not stop at the headline, look at behaviour.

People vote with small actions. They book the flight, renew the lease, avoid the scam, download the app, visit the mall, open the business account, or decide to wait. Those small decisions tell us whether a headline has real weight.

Dubai has built much of its reputation on speed. But speed alone is not enough anymore. The next layer is trust.

Residents trust a city when services work without drama. Investors trust a market when rules feel clear. Visitors trust a destination when travel information is reliable. Small businesses trust an opportunity when payment, licensing and footfall make sense.

That is the frame for this story.

## Who Feels It First

The first impact will not always be dramatic.

A commuter may notice a faster journey. A tenant may ask a sharper question before signing. A founder may read the signal as proof that a sector is still alive. A family may change a weekend plan. A traveller may double-check a booking. A public official may face higher expectations after a new promise.

This is how big-city news works. It moves quietly before it becomes obvious.

## What To Watch Next

The next step is follow-through.

Watch for official clarification, customer response, market movement and whether the announcement creates a visible change on the ground. The UAE public has become good at separating polished announcements from useful delivery.

For now, the story is worth tracking because it fits Dubai's larger question in 2026: can the city keep growing while making life feel simpler, safer and more predictable for the people using it every day?

That is the real test.

${sourceLine}`;
}

async function parseFeeds() {
  const files = await fs.readdir(feedDir);
  const items = [];
  for (const file of files.filter((name) => name.endsWith(".xml"))) {
    const fallbackSource = file.replace(/\.xml$/, "").replace(/-/g, " ");
    const xml = await fs.readFile(path.join(feedDir, file), "utf8");
    for (const match of xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)) {
      const block = match[0];
      const rawTitle = getTag(block, "title");
      const title = stripSource(rawTitle);
      const source = getSource(block, fallbackSource);
      const pubDate = getTag(block, "pubDate");
      const link = getTag(block, "link") || getTag(block, "guid");
      const description = decode(getTag(block, "description"));
      const image = getMedia(block);
      if (!title || !uaeRelevant.test(title) || highRisk.test(title) || !trustedSource.test(source)) {
        continue;
      }
      items.push({ title, source, pubDate, link, description, image, feed: file });
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
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

async function writeBatch() {
  const { slugs, titles } = await existingArticleData();
  const candidates = await parseFeeds();
  let imageIndex = 0;

  for (const item of candidates) {
    if (report.published.length >= targetCount) break;
    const titleKey = slugify(item.title);
    const slug = slugify(`latest-${item.title}`);
    if (slugs.has(slug) || titles.has(titleKey)) {
      report.skipped.push({ title: item.title, reason: "duplicate", source: item.source });
      continue;
    }

    const category = categoryFor(item.title, item.source);
    const title = `${item.title}: What UAE Readers Should Watch`;
    const date = formatDate(item.pubDate);
    const publishedTime = formatTime(item.pubDate, report.published.length);
    const fallbackImage = pexelsImages[imageIndex % pexelsImages.length];
    imageIndex += 1;
    const image = item.image || fallbackImage[0];
    const imageAlt = item.image ? `${item.title} related image from source feed.` : fallbackImage[1];
    const description = makeDescription(item.title, category);
    const tags = [category, "Latest", item.source, "Dubai Time"];
    const body = makeBody(item, category);

    const frontmatter = `---\ntitle: ${yaml(title)}\ndescription: ${yaml(description)}\ncategory: ${yaml(category)}\nauthor: ${yaml(`Dubai Time ${category} Desk`)}\ndate: ${date}\npublishedTime: ${yaml(publishedTime)}\nwatchLine: ${yaml("Watch the official follow-up, public response and practical impact.")}\nimage: ${yaml(image)}\nimageAlt: ${yaml(imageAlt)}\ntags: [${tags.map(yaml).join(", ")}]\ndraft: false\n---\n\n`;

    await fs.writeFile(path.join(articleDir, `${slug}.md`), `${frontmatter}${body}\n`, "utf8");
    slugs.add(slug);
    titles.add(titleKey);
    report.published.push({
      file: `${slug}.md`,
      title,
      category,
      source: item.source,
      sourceLink: item.link,
      publishedTime,
    });
    if (!report.sources.includes(item.source)) report.sources.push(item.source);
  }

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
  console.log(
    JSON.stringify(
      {
        requested: targetCount,
        published: report.published.length,
        skipped: report.skipped.length,
        sources: report.sources,
      },
      null,
      2,
    ),
  );
  if (report.published.length !== targetCount) {
    process.exitCode = 1;
  }
}

await writeBatch();
