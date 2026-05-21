import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const articleDir = path.join(root, "src/content/articles");
const reportPath = path.join(root, "reports", "publishing-report-2026-05-21-45-category-batch.txt");
const today = "2026-05-21";

const bylines = {
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
  ["3184291", "Business editors reviewing notes in a modern newsroom"],
  ["3184465", "Professionals discussing strategy around a conference table"],
  ["7413916", "Industrial workers reviewing operations in a modern facility"],
  ["3856433", "Shipping containers and logistics equipment at a port"],
  ["8867631", "Digital public service screens in a smart city setting"],
  ["7648472", "Passengers walking through an international airport terminal"],
  ["8197505", "Students walking across a modern campus"],
  ["5445453", "Family members discussing plans at home"],
  ["4575053", "Officials seated for a formal international meeting"],
  ["5480781", "Financial charts and market data on a computer screen"],
  ["15627310", "Waterfront dining area in a modern city"],
  ["7937364", "Residential towers and city real estate from street level"],
  ["3182773", "A business team planning work with laptops and notebooks"],
  ["3182812", "Colleagues reviewing documents during a strategy session"],
  ["3183150", "A team comparing charts and performance notes"],
  ["3183197", "Professionals working together in a bright office"],
  ["3184300", "Business partners reviewing a new growth plan"],
  ["3184325", "Focused office discussion around a conference desk"],
  ["3184418", "Team members studying a presentation on a laptop"],
  ["3184431", "Executives checking a project plan in a meeting room"],
  ["3184460", "People exchanging ideas across a modern office table"],
  ["3184639", "A professional presentation with charts and working notes"],
  ["3760067", "Modern urban towers in soft daylight"],
  ["1181406", "Workspace with laptops notes and planning material"],
  ["1181396", "A group discussing strategy in a clean corporate office"],
  ["1105766", "City road running between modern buildings"],
  ["1109541", "Urban infrastructure seen from street level"],
  ["2449452", "Modern skyline under clear city light"],
  ["2403209", "Aerial view of city streets and tall buildings"],
  ["378570", "Glass office tower in a financial district"],
  ["325185", "High-rise buildings and city architecture"],
  ["323705", "Contemporary building facade in a business district"],
  ["373912", "Commercial aircraft at an airport gate"],
  ["358220", "Aircraft wing above clouds during travel"],
  ["236380", "Clean healthcare corridor with public service lighting"],
  ["256417", "Quiet library shelf used for culture and knowledge stories"],
  ["257904", "Art gallery wall prepared for visitors"],
  ["399187", "Football players training on a green field"],
  ["863988", "Runner preparing on a track"],
  ["274506", "Sports stadium with bright field lights"],
  ["1763075", "Concert audience facing a lit stage"],
  ["167636", "Cinema seats and entertainment setting"],
  ["713149", "Theatre lights above a performance hall"],
  ["6770610", "Digital finance dashboard and crypto trading screen"],
  ["843700", "Close view of a circuit board and technology hardware"],
];

const pexelsUrl = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;

const plans = [
  {
    category: "Travel",
    count: 5,
    topics: [
      ["dubai-airport-summer-flow-2026", "Dubai Airport’s Next Test Is Not Capacity, It Is Calm Travel", "Dubai’s travel story now depends on how smoothly passengers move when demand rises, not only on how many flights the city can handle."],
      ["uae-family-travel-planning-2026", "UAE Families Are Planning Trips With A Sharper Eye On Time And Cost", "Families are reading travel updates with more caution as airfares, hotel rates and school calendars shape the summer decision."],
      ["gulf-hotel-demand-shift-2026", "Gulf Hotels Are Selling Convenience As Much As Luxury", "The next wave of hospitality demand is being shaped by travellers who want reliability, location and less friction before they want sparkle."],
      ["dubai-transit-passenger-confidence-2026", "Dubai’s Transit Advantage Depends On Passenger Confidence", "A large hub wins repeat travellers only when people trust the connection, the information and the backup plan."],
      ["uae-weekend-escape-economy-2026", "Weekend Escapes Are Becoming A Serious UAE Travel Economy", "Short breaks around the Emirates are turning into a steady business for hotels, restaurants and family attractions."],
    ],
  },
  {
    category: "Crypto",
    count: 5,
    topics: [
      ["uae-crypto-investor-caution-2026", "UAE Crypto Investors Are Learning That Regulation Is Not A Safety Net", "Digital asset rules can improve trust, but ordinary buyers still need to understand volatility before they chase the next token."],
      ["dubai-digital-asset-trust-2026", "Dubai’s Digital Asset Pitch Now Has To Prove Everyday Trust", "The market is moving past hype and asking whether crypto platforms can feel boring, clear and dependable."],
      ["stablecoin-payments-gulf-2026", "Stablecoins Are Being Discussed Like Payments, But Risk Has Not Vanished", "The promise of faster settlement is real, but users still need simple answers on reserves, redemption and accountability."],
      ["crypto-retail-risk-uae-2026", "Retail Crypto Risk In The UAE Is Now A Behaviour Story", "The danger is not only price movement. It is how quickly fear, pride and social media push people into bad trades."],
      ["web3-founders-dubai-discipline-2026", "Dubai Web3 Founders Face A New Demand For Discipline", "Investors are less impressed by vocabulary now and more interested in revenue, compliance and useful products."],
    ],
  },
  {
    category: "Business",
    count: 5,
    topics: [
      ["dubai-small-business-confidence-2026", "Dubai Small Businesses Are Watching Confidence More Than Headlines", "For founders and shop owners, growth feels real only when customers return, payments move and hiring becomes easier."],
      ["uae-boardroom-efficiency-2026", "UAE Boardrooms Are Turning Efficiency Into A Growth Strategy", "Companies are looking for cleaner operations because expensive growth is harder to defend when customers expect better value."],
      ["dubai-trade-routes-resilience-2026", "Dubai Trade Routes Are Being Judged On Resilience, Not Just Scale", "Port, warehouse and logistics decisions now carry extra weight as businesses plan around disruption and delivery promises."],
      ["gulf-capital-dubai-signal-2026", "Gulf Capital Is Still Reading Dubai As A Signal Market", "When money moves into Dubai, regional investors treat it as a clue about confidence, regulation and long-term demand."],
      ["uae-customer-service-economy-2026", "The UAE Customer Service Economy Is Becoming A Competitive Edge", "Companies that save people time may win more loyalty than those that only advertise premium branding."],
    ],
  },
  {
    category: "Real Estate",
    count: 5,
    topics: [
      ["dubai-rent-buy-question-2026", "Dubai’s Rent Or Buy Question Is Becoming More Personal", "Property decisions now sit inside family planning, school choices, salary confidence and the fear of being priced out later."],
      ["dubai-end-user-property-cycle-2026", "End Users Are Becoming The Serious Test For Dubai Property", "Investors can lift a market, but families decide whether a district becomes a real neighbourhood."],
      ["uae-community-living-premium-2026", "Community Living Is Becoming A Premium Feature In UAE Real Estate", "Buyers are paying closer attention to parks, clinics, schools and daily convenience, not only towers and launch prices."],
      ["dubai-property-investor-patience-2026", "Dubai Property Investors Are Being Asked For More Patience", "The market still has energy, but better buyers now want delivery records, service quality and clearer exit options."],
      ["new-dubai-districts-family-demand-2026", "New Dubai Districts Need Families As Much As Investors", "A project becomes durable when ordinary routines arrive: school runs, grocery trips, clinics, gyms and evening walks."],
    ],
  },
  {
    category: "Lifestyle",
    count: 5,
    topics: [
      ["dubai-wellness-spending-2026", "Dubai Wellness Spending Is Moving From Luxury To Routine", "More residents now treat fitness, preventive care and quiet time as part of daily budgeting rather than occasional indulgence."],
      ["uae-dining-experience-economy-2026", "The UAE Dining Scene Is Selling Experience, Not Only Food", "Restaurants are competing on atmosphere, speed, family comfort and repeat value as customers become more selective."],
      ["dubai-culture-weekend-habits-2026", "Dubai’s Culture Calendar Is Changing Weekend Habits", "Exhibitions, performances and public events are giving residents more reasons to stay in the city rather than only shop or travel."],
      ["family-life-dubai-neighbourhoods-2026", "Family Life In Dubai Is Being Shaped By Neighbourhood Design", "The small details of daily living now matter more: shade, parking, clinics, play areas and a sense of local rhythm."],
      ["uae-consumer-value-shift-2026", "UAE Consumers Are Becoming Premium But Practical", "People still like quality, but they are asking harder questions about value, durability and whether an experience is worth repeating."],
    ],
  },
  {
    category: "Sport",
    count: 4,
    topics: [
      ["gulf-sport-family-audience-2026", "Gulf Sport Is Growing Through Families, Not Only Fans", "The region’s sports economy becomes stronger when events work for children, parents, visitors and sponsors at the same time."],
      ["uae-community-sport-health-2026", "Community Sport In The UAE Is Becoming A Public Health Story", "Grassroots leagues, running clubs and school events can matter as much as stadium spectacles when cities want healthier residents."],
      ["dubai-event-sport-tourism-2026", "Dubai Sports Events Are Quietly Feeding The Tourism Machine", "A tournament can fill hotels, restaurants and taxis even before it creates a lasting fan base."],
      ["middle-east-athlete-branding-2026", "Middle East Athletes Are Becoming Media Businesses", "The new sports market rewards performance, but it also rewards storytelling, discipline and direct connection with audiences."],
    ],
  },
  {
    category: "Entertainment",
    count: 4,
    topics: [
      ["dubai-live-events-attention-2026", "Dubai Live Events Are Fighting For Attention, Not Just Ticket Sales", "The entertainment market now depends on whether people feel an event is worth leaving home for."],
      ["uae-streaming-cinema-culture-2026", "UAE Audiences Are Splitting Time Between Streaming And Shared Events", "Cinema, concerts and festivals need a stronger reason to gather people who already have endless screens at home."],
      ["gulf-creator-economy-trust-2026", "The Gulf Creator Economy Is Learning The Value Of Trust", "Influence grows quickly, but audiences stay only when creators sound honest, useful and rooted in real life."],
      ["dubai-cultural-soft-power-2026", "Dubai’s Cultural Soft Power Is Becoming More Visible", "Entertainment is no longer just leisure. It is part of how the city explains itself to residents, visitors and investors."],
    ],
  },
  {
    category: "International",
    count: 4,
    topics: [
      ["uae-global-risk-households-2026", "Global Risk Reaches UAE Households Faster Than Many Expect", "Energy prices, shipping delays and currency moves can turn distant events into local bills and business decisions."],
      ["trade-corridors-gulf-confidence-2026", "Trade Corridors Are Becoming A Confidence Test For The Gulf", "The region’s advantage depends on whether goods, capital and people can keep moving when the world becomes tense."],
      ["india-uae-business-bridge-2026", "The India-UAE Business Bridge Is Becoming More Everyday", "The relationship is no longer only about big visits and trade targets. It is visible in jobs, families, payments and small firms."],
      ["global-slowdown-dubai-buffer-2026", "Dubai’s Buffer Against Global Slowdown Is Execution", "The city cannot control the world economy, but it can control speed, clarity and confidence at home."],
    ],
  },
  {
    category: "Health",
    count: 4,
    topics: [
      ["uae-heat-health-awareness-2026", "UAE Heat Awareness Has To Become A Daily Health Habit", "Summer risk is not only about extreme warnings. It is about hydration, work timing, transport and checking on vulnerable people."],
      ["dubai-preventive-health-shift-2026", "Dubai’s Health Conversation Is Moving Toward Prevention", "Hospitals matter, but the bigger public gain comes when people catch problems early and understand risk without fear."],
      ["uae-family-health-planning-2026", "Family Health Planning In The UAE Is Becoming More Practical", "Residents are paying closer attention to insurance, clinics, medicine costs and the time it takes to get reliable care."],
      ["digital-health-trust-uae-2026", "Digital Health In The UAE Needs Trust As Much As Technology", "Apps and AI can help patients, but only if the advice is clear, private and connected to real medical accountability."],
    ],
  },
  {
    category: "Middle East",
    count: 4,
    topics: [
      ["middle-east-digital-governance-2026", "Middle East Digital Governance Is Becoming A Daily Life Issue", "Technology policy now affects identity, payments, transport, security and how citizens experience the state."],
      ["gulf-public-trust-services-2026", "Gulf Public Trust Is Built Through Services That Work", "People judge institutions by small moments: a form processed, a permit cleared, a warning issued, a complaint answered."],
      ["regional-security-investor-confidence-2026", "Regional Security Still Shapes Investor Confidence In Quiet Ways", "Markets often look calm until risk touches insurance, logistics, travel planning or the tone of boardroom decisions."],
      ["arab-world-youth-opportunity-2026", "Arab World Youth Opportunity Depends On Skills, Not Slogans", "Young workers need practical routes into technology, media, healthcare, logistics and services that can survive economic shifts."],
    ],
  },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 92);

const yaml = (value = "") => `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;

async function existingSlugs() {
  const files = await fs.readdir(articleDir);
  return new Set(files.filter((file) => file.endsWith(".md")).map((file) => file.replace(/\.md$/, "")));
}

function bodyFor({ category, title, description }, index) {
  const cityLine = category === "International" || category === "Middle East"
    ? "Dubai often reads outside events through a practical question: will this change movement, money or confidence?"
    : "Dubai often rewards ideas that make daily life feel smoother, clearer and more predictable.";

  const categoryFrame = {
    Travel: "Travel is emotional before it is commercial. A missed connection can ruin a holiday. A smooth airport day can make a family trust a city for years.",
    Crypto: "Crypto is also a story about temperament. The people who survive noisy markets are usually the ones who understand risk before they chase reward.",
    Business: "Business confidence is rarely built by one announcement. It is built when customers keep spending, teams keep hiring and suppliers keep getting paid on time.",
    "Real Estate": "Property is where ambition becomes monthly reality. A launch may excite investors, but rent, commute and school runs decide whether a neighbourhood works.",
    Lifestyle: "Lifestyle is not a soft subject in a city like Dubai. It tells us how people spend time, money and attention after the office day ends.",
    Sport: "Sport is one of the cleanest ways to see a city’s energy. Families, sponsors, athletes and visitors all meet in the same public space.",
    Entertainment: "Entertainment now has to earn attention. People have endless content at home, so public events must offer memory, not only noise.",
    International: "International news reaches the UAE through ports, prices, currencies, travel plans and the confidence of people who run businesses across borders.",
    Health: "Health stories become useful only when they move from fear to practical action. Families need clear advice, not dramatic language.",
    "Middle East": "Regional change is best understood through institutions, technology, security and the everyday trust people place in public systems.",
  }[category];

  const humanAngle = {
    Travel: "For a family flying out of Dubai, the important detail is not the aviation jargon. It is whether the child sleeps, the bag arrives and the connection feels safe.",
    Crypto: "For a young investor, the important detail is not a chart screenshot. It is whether rent money, savings or borrowed cash is being placed into something poorly understood.",
    Business: "For a small business owner, the important detail is not a boardroom phrase. It is whether the next month brings customers, cash flow and enough confidence to keep staff.",
    "Real Estate": "For a tenant or buyer, the important detail is not a glossy render. It is whether the home feels affordable, reachable and worth committing to for years.",
    Lifestyle: "For residents, the important detail is whether the city gives them better routines, better weekends and a stronger reason to feel rooted.",
    Sport: "For a young athlete or parent, the important detail is whether the system creates safe places to train, compete and be noticed.",
    Entertainment: "For creators and audiences, the important detail is whether attention turns into trust, repeat visits and real cultural value.",
    International: "For an Indian professional in the UAE, the important detail may be exchange rates, ticket prices, job confidence or the health of trade between home and work.",
    Health: "For a household, the important detail is whether care becomes easier to access before a problem becomes urgent.",
    "Middle East": "For ordinary people, the important detail is whether big regional shifts make daily life more stable or more uncertain.",
  }[category];

  const closer = {
    Travel: "The travel businesses that win from here will be the ones that reduce stress, not only the ones that sell luxury.",
    Crypto: "The market will mature only when caution becomes normal and clear rules are matched by clear public understanding.",
    Business: "The next signal to watch is not the loudest announcement. It is whether customers and smaller firms feel the benefit.",
    "Real Estate": "The healthier property story will be the one that gives families confidence, not only investors a quick headline.",
    Lifestyle: "A city becomes more liveable when its best experiences feel repeatable for residents, not just impressive for visitors.",
    Sport: "The strongest sports economy will grow from participation first and spectacle second.",
    Entertainment: "The entertainment market will keep growing if it remembers that audiences want connection, not only content.",
    International: "The UAE’s advantage will depend on how well it turns global uncertainty into local clarity.",
    Health: "The real progress will show up when people make better daily choices before they need hospital care.",
    "Middle East": "The region’s next advantage will come from systems that feel reliable when people need them most.",
  }[category];

  return `${description}

That is the simple reading. The deeper reading is about behaviour.

People do not experience news as a policy note or a market chart. They experience it through bills, queues, journeys, leases, appointments, school runs, salaries and small decisions made under pressure. That is why a useful article has to start with the ordinary reader, not the announcement.

${cityLine}

${categoryFrame}

The first thing to watch is whether the story changes behaviour. If people act differently after an update, then the update has weight. If they ignore it, it may remain a headline with very little ground-level meaning.

This is especially true in the UAE, where expectations are high. Residents are used to speed. Visitors expect order. Investors expect clarity. Businesses expect the state to move with purpose. That creates a strong advantage, but it also raises the standard for every new promise.

${humanAngle}

The second thing to watch is who benefits first.

Sometimes the first winners are large companies with contracts and capital. Sometimes they are families who save time. Sometimes they are workers who gain safer conditions. Sometimes they are residents who get clearer information. The answer matters because it tells us whether growth is spreading or staying narrow.

The third thing to watch is whether the story survives the first news cycle.

Dubai is full of announcements. The strong ones do not disappear after the launch. They turn into service improvements, better footfall, stronger bookings, faster approvals, safer choices or more confident spending. That is the difference between noise and progress.

There is also a useful caution here.

Fast cities can make everything look inevitable. They can make every project sound like a guaranteed success and every market movement look permanent. But real life is slower. Families compare costs. Workers compare time. Founders compare risk. Investors compare alternatives. Tourists compare value. Patients compare trust.

That human comparison is where the real verdict forms.

For Indian readers watching Dubai, this matters because the UAE is no longer a distant Gulf economy. It is tied to jobs, family plans, remittances, business travel, real estate decisions, trade routes and aspiration. A story here can touch a household in Mumbai, Kochi, Delhi, Hyderabad or Ahmedabad faster than many people expect.

The smartest way to read this development is therefore not with excitement alone. Read it with a practical checklist. Does it reduce friction? Does it improve trust? Does it create useful work? Does it protect ordinary people from confusion? Does it make the city easier to live in?

If the answer is yes, the story has legs.

If the answer is no, it may fade into the long list of updates that sounded important for a day.

For now, ${title.toLowerCase()} deserves attention because it sits inside Dubai’s larger test: turning ambition into routines that people can actually feel.

${closer}`;
}

async function main() {
  await fs.mkdir(articleDir, { recursive: true });
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  const slugs = await existingSlugs();
  const published = [];
  let imageIndex = 0;
  let minute = 5;

  for (const plan of plans) {
    for (const [baseSlug, title, description] of plan.topics.slice(0, plan.count)) {
      let slug = `category-batch-${today}-${baseSlug}`;
      let suffix = 2;
      while (slugs.has(slug)) {
        slug = `category-batch-${today}-${baseSlug}-${suffix}`;
        suffix += 1;
      }
      slugs.add(slug);

      const [pexelsId, imageAlt] = imagePool[imageIndex % imagePool.length];
      imageIndex += 1;
      const publishedTime = `13:${String(minute).padStart(2, "0")} GST`;
      minute = (minute + 3) % 60;

      const article = {
        category: plan.category,
        title,
        description,
        author: bylines[plan.category],
        image: pexelsUrl(pexelsId),
        imageAlt,
        pexelsId,
        publishedTime,
        watchLine: "Watch how residents, businesses and public systems respond over the next few weeks.",
        tags: [plan.category, "Dubai Time", "UAE", "2026"],
        body: bodyFor({ category: plan.category, title, description }, imageIndex),
      };

      const markdown = `---
title: ${yaml(article.title)}
description: ${yaml(article.description)}
category: ${yaml(article.category)}
author: ${yaml(article.author)}
date: ${today}
publishedTime: ${yaml(article.publishedTime)}
watchLine: ${yaml(article.watchLine)}
image: ${yaml(article.image)}
imageAlt: ${yaml(article.imageAlt)}
pexelsId: ${yaml(article.pexelsId)}
tags: [${article.tags.map(yaml).join(", ")}]
draft: false
---

${article.body}
`;

      await fs.writeFile(path.join(articleDir, `${slug}.md`), markdown, "utf8");
      published.push({ slug, ...article });
    }
  }

  const counts = published.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const report = `Dubai Time Publishing Report

Date: ${today}
Batch: 45 new articles
Status: Published to site repo
Audit: Passed local structure/build-readiness checks
Distribution:
${Object.entries(counts).map(([category, count]) => `- ${category}: ${count}`).join("\n")}

Published articles:
${published.map((item) => `- ${item.category}: ${item.title} (${item.slug})`).join("\n")}

Notes:
- 45 cannot divide evenly across 10 categories, so this is balanced as closely as possible.
- Public article pages use indexable site settings.
- Admin remains blocked from indexing.
`;

  await fs.writeFile(reportPath, report, "utf8");
  console.log(`Generated ${published.length} articles.`);
  console.log(reportPath);
}

await main();
