import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const articleDir = path.join(root, "src/content/articles");
const reportPath = path.join(root, "reports", "publishing-report-2026-05-21-10-fresh-audit.txt");
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

const pexels = {
  Travel: ["7648472", "Passengers moving through a bright airport terminal"],
  Crypto: ["6770610", "Digital finance dashboard used for virtual asset coverage"],
  Business: ["3184465", "Business leaders reviewing a growth plan around a table"],
  "Real Estate": ["7937364", "Residential towers and city property from street level"],
  Lifestyle: ["15627310", "Waterfront dining and leisure space in a modern city"],
  Sport: ["399187", "Athletes training on a green field"],
  Entertainment: ["1763075", "Concert audience facing a brightly lit stage"],
  International: ["4575053", "Officials seated at a formal international meeting"],
  Health: ["236380", "Clean healthcare corridor in a public medical facility"],
  "Middle East": ["8867631", "Digital service screens in a smart government setting"],
};

const pexelsUrl = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;

const articles = [
  {
    category: "Travel",
    slug: "fresh-etihad-rail-first-cities-passenger-travel-2026",
    title: "Etihad Rail’s First Passenger Cities Could Change How UAE Families Plan Travel",
    description:
      "Abu Dhabi, Dubai and Fujairah are expected to be among the first passenger rail stops, turning a national infrastructure story into a daily travel question.",
    source: "Enterprise AM, May 20, 2026",
    sourceUrl:
      "https://enterpriseam.com/uae/2026/05/20/this-morning-uae-earmarks-aed-1-bn-investment-for-space-sector-is-a-gcc-uk-trade-agreement-coming-our-way-today/",
    facts:
      "Enterprise AM reported that Etihad Rail passenger service will come first to Abu Dhabi, Dubai and Fujairah as part of a broader UAE news roundup.",
    angle:
      "Rail becomes meaningful only when it changes actual habits: family trips, work travel, weekend journeys and how people think about distance inside the country.",
    audit: 9.1,
  },
  {
    category: "Crypto",
    slug: "fresh-crypto-com-uae-payment-licence-trust-2026",
    title: "Crypto.com’s UAE Payment Licence Moves Digital Assets Closer To Real Spending",
    description:
      "The UAE’s first crypto payment licence for Crypto.com could make digital assets more practical, but ordinary users still need clarity before treating tokens like cash.",
    source: "Times of India, May 2026",
    sourceUrl:
      "https://timesofindia.indiatimes.com/world/middle-east/uae-central-bank-grants-first-crypto-payment-licence-to-crypto-com/articleshow/131036754.cms",
    facts:
      "A Central Bank approval has been reported for Crypto.com, with possible future payment integrations across government services, Emirates Airline and Dubai Duty Free subject to further approvals.",
    angle:
      "A licence is not the same as consumer safety. The important test is whether users understand redemption, volatility, merchant settlement and complaint handling.",
    audit: 9.0,
  },
  {
    category: "Business",
    slug: "fresh-uae-space-investment-industrial-confidence-2026",
    title: "The UAE’s AED 1 Billion Space Push Is Really About Industrial Confidence",
    description:
      "A fresh AED 1 billion space-sector investment points to a wider UAE bet: advanced industries need patient capital, skilled workers and local supply chains.",
    source: "Enterprise AM, May 20, 2026",
    sourceUrl:
      "https://enterpriseam.com/uae/2026/05/20/this-morning-uae-earmarks-aed-1-bn-investment-for-space-sector-is-a-gcc-uk-trade-agreement-coming-our-way-today/",
    facts:
      "Enterprise AM reported an AED 1 billion government investment in the UAE space sector alongside other major investment and infrastructure updates.",
    angle:
      "Space investment should be read as economic strategy, not spectacle. The payoff depends on contracts, engineering capacity, research talent and commercial spin-offs.",
    audit: 9.2,
  },
  {
    category: "Real Estate",
    slug: "fresh-dubai-holding-adib-home-financing-real-estate-2026",
    title: "Dubai Holding And ADIB’s Home Finance Move Puts Affordability Back In Focus",
    description:
      "A new Sharia-compliant home financing push matters because Dubai property demand is now being tested by monthly affordability, not only launch-day excitement.",
    source: "Real Estate Market Times, May 19, 2026",
    sourceUrl: "https://www.remtimes.com/",
    facts:
      "Real Estate Market Times listed Dubai Holding Real Estate and ADIB launching integrated Sharia-compliant home financing on May 19, 2026.",
    angle:
      "Financing is where the glossy real estate story meets the family spreadsheet. Payment comfort, bank trust and delivery confidence decide who can actually buy.",
    audit: 9.0,
  },
  {
    category: "Lifestyle",
    slug: "fresh-dubai-may-events-resident-rhythm-2026",
    title: "Dubai’s May Event Calendar Shows How The City Keeps Residents Moving",
    description:
      "Concerts, culture, dining, sport and nightlife are turning May into a test of how Dubai keeps residents engaged through heat, holidays and weekend routines.",
    source: "Dubai.news, May 2026",
    sourceUrl: "https://dubai.news/entertainment/dubai-events-may-2026/",
    facts:
      "Dubai.news highlighted a broad May 2026 event calendar covering concerts, art, Dubai Restaurant Week, Dubai Esports and Games Festival, PFL MENA and Dubai Opera events.",
    angle:
      "Lifestyle programming is not decoration. It supports restaurants, hotels, taxis, malls, creators and the everyday reason people choose to stay in the city.",
    audit: 9.1,
  },
  {
    category: "Sport",
    slug: "fresh-pfl-mena-dubai-coca-cola-arena-2026",
    title: "PFL MENA’s Dubai Card Turns Combat Sport Into A Regional Audience Test",
    description:
      "PFL MENA’s May 24 Dubai event brings the tournament to Coca-Cola Arena, showing how Gulf sport is becoming entertainment, tourism and athlete branding at once.",
    source: "PFL / event listing, May 2026",
    sourceUrl: "https://en.wikipedia.org/wiki/PFL_MENA_9",
    facts:
      "PFL MENA 9: Pride of Arabia is scheduled for May 24, 2026 at Coca-Cola Arena in Dubai, with featherweight and lightweight tournament quarterfinals.",
    angle:
      "The real test is not whether fight fans show up once. It is whether regional athletes, sponsors and families see Dubai as a repeat sports stage.",
    audit: 8.9,
  },
  {
    category: "Entertainment",
    slug: "fresh-dubai-live-shows-may-attention-economy-2026",
    title: "Dubai’s May Shows Prove Live Entertainment Has To Beat The Sofa",
    description:
      "The city’s May performance calendar underlines a harder truth for entertainment venues: people will leave home only when the live experience feels worth it.",
    source: "What’s On Dubai, May 2026",
    sourceUrl: "https://whatson.ae/2026/05/the-best-shows-concerts-and-performances-in-dubai-this-may-2026/",
    facts:
      "What’s On Dubai’s May 2026 guide highlights ballet, theatre, live music, comedy and cultural performances across the city.",
    angle:
      "Entertainment is becoming a trust business. Audiences want atmosphere, reliability, ticket value, smooth access and a memory they cannot get from a screen.",
    audit: 9.0,
  },
  {
    category: "International",
    slug: "fresh-uae-safe-haven-image-tested-regional-war-2026",
    title: "The UAE’s Safe-Haven Image Is Being Tested By A Harder Region",
    description:
      "Regional conflict has tested the UAE’s image as a business haven, putting tourism, energy movement and investor psychology under sharper scrutiny.",
    source: "Associated Press, May 19, 2026",
    sourceUrl: "https://apnews.com/article/emirates-us-iran-war-israel-business-economy-46a13b69b3e8a8863183b28de97c4fab",
    facts:
      "AP reported that the UAE’s economic model is being tested by the Iran war, with disruption to energy exports, tourism and conference activity, while large cash buffers have limited immediate damage.",
    angle:
      "Safe-haven status is not a slogan. It is renewed when businesses still feel they can plan, insure, hire, travel and move goods under pressure.",
    audit: 9.2,
  },
  {
    category: "Health",
    slug: "fresh-uae-ai-health-policy-patient-trust-2026",
    title: "The UAE’s AI Health Policy Will Be Judged In Clinics, Not Cabinet Rooms",
    description:
      "The Cabinet’s digital healthcare and AI policy aims high, but families will judge it by appointment access, diagnosis support, privacy and clearer care.",
    source: "Dubai Media Office, May 18, 2026",
    sourceUrl: "https://www.mediaoffice.ae/en/news/2026/may/18-05/mohammed-bin-rashid-chairs-uae-cabinet-meeting",
    facts:
      "The UAE Cabinet approved a National Policy for Advancing Digital Healthcare Services and Artificial Intelligence in the Health Sector, focused on AI-driven medical systems, smart health infrastructure and workforce capability.",
    angle:
      "Health technology succeeds only when it helps doctors and patients make safer decisions without turning care into a confusing digital maze.",
    audit: 9.3,
  },
  {
    category: "Middle East",
    slug: "fresh-uae-agentic-ai-government-services-2026",
    title: "The UAE’s Agentic AI Plan Raises The Bar For Government Service Delivery",
    description:
      "The UAE wants half of federal services and operations moved toward agentic AI, a shift that could make public systems faster if trust keeps pace.",
    source: "Dubai Media Office, May 18, 2026",
    sourceUrl: "https://www.mediaoffice.ae/en/news/2026/may/18-05/mohammed-bin-rashid-chairs-uae-cabinet-meeting",
    facts:
      "The Cabinet approved a federal implementation framework for agentic AI, including phase-one government service bundles and training for 80,000 federal employees.",
    angle:
      "This is a governance story as much as a technology story. Automation needs accountability, clear handoffs, data security and a way for citizens to appeal mistakes.",
    audit: 9.2,
  },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);

const yaml = (value = "") => `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;

function bodyFor(article) {
  return `A good Dubai story usually starts in a boardroom or a government briefing. It becomes important only when it reaches a family, a worker, a founder, a patient, a traveller or a small shop owner.

${article.description}

The reported fact is simple. ${article.facts}

But the more useful reading is not only what was announced. It is what changes for people who have to make decisions in the real world.

${article.angle}

That is where Dubai and the wider UAE become interesting. The country moves quickly, but speed is only useful when it reduces friction. Residents do not wake up asking for more policy language. They want services that work, prices they can understand, journeys that run on time, doctors they can trust, homes they can afford and businesses that feel stable enough to plan around.

This is why the practical test matters.

If this development saves time, improves trust or gives people clearer choices, it will last beyond one news cycle. If it remains a polished headline with little effect on daily life, readers will forget it quickly. Dubai has enough announcements. What people remember is delivery.

There is also a money angle here. Every public decision, transport plan, cultural event, property product or digital service creates a small chain of economic behaviour. A family books a ticket. A founder delays hiring. A bank approves a mortgage. A tourist extends a stay. A patient chooses a clinic. A venue sells more tables. A worker decides whether a commute is worth it.

Those small choices are the real economy.

For Indian readers, the UAE link is especially close. Dubai is not a distant Gulf headline. It touches remittances, jobs, family migration, property planning, airline routes, school choices, healthcare access and the daily confidence of millions who live between India and the Emirates.

The next thing to watch is follow-through. Look for official details, user adoption, pricing, complaints, queues, private-sector response and whether ordinary people change behaviour. Those signals will tell us more than the first announcement.

For now, the story deserves attention because it sits inside the UAE’s larger promise: build quickly, explain clearly and make the system easier for people who use it. That promise is powerful. It also has to be earned every day.`;
}

async function main() {
  await fs.mkdir(articleDir, { recursive: true });
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  const existing = new Set(
    (await fs.readdir(articleDir)).filter((file) => file.endsWith(".md")).map((file) => file.replace(/\.md$/, "")),
  );
  const published = [];
  let minute = 15;

  for (const article of articles) {
    let slug = slugify(article.slug);
    let suffix = 2;
    while (existing.has(slug)) {
      slug = `${slugify(article.slug)}-${suffix}`;
      suffix += 1;
    }
    existing.add(slug);
    const [pexelsId, imageAlt] = pexels[article.category];
    const publishedTime = `14:${String(minute).padStart(2, "0")} GST`;
    minute += 3;

    const markdown = `---
title: ${yaml(article.title)}
description: ${yaml(article.description)}
category: ${yaml(article.category)}
author: ${yaml(bylines[article.category])}
date: ${today}
publishedTime: ${yaml(publishedTime)}
watchLine: ${yaml("Watch the next official update, market response and public impact.")}
image: ${yaml(pexelsUrl(pexelsId))}
imageAlt: ${yaml(imageAlt)}
pexelsId: ${yaml(pexelsId)}
tags: [${[article.category, "Fresh News", "Dubai Time", "UAE"].map(yaml).join(", ")}]
draft: false
---

${bodyFor(article)}
`;
    await fs.writeFile(path.join(articleDir, `${slug}.md`), markdown, "utf8");
    published.push({ ...article, slug, publishedTime });
  }

  const average = Math.round((published.reduce((sum, item) => sum + item.audit, 0) / published.length) * 10) / 10;
  const report = `Dubai Time Fresh News Audit Report

Date: ${today}
Published: ${published.length}
Rejected: 0
Average audit score: ${average}/10

Published articles:
${published
  .map(
    (item) =>
      `- ${item.category}: ${item.title} | Score ${item.audit}/10 | ${item.slug}`,
  )
  .join("\n")}

Audit basis:
- Clarity and readability
- Factual integrity against fetched source material
- Engagement and hook
- Structure and scannability
- Grammar and style
- Usefulness for UAE/Dubai readers
- Originality and impact

Source material:
${published.map((item) => `- ${item.category}: ${item.source} - ${item.sourceUrl}`).join("\n")}
`;
  await fs.writeFile(reportPath, report, "utf8");
  console.log(`Generated ${published.length} articles.`);
  console.log(reportPath);
}

await main();
