import fs from "node:fs";
import path from "node:path";

const articlesDir = path.resolve("src/content/articles");

const additions = {
  "dubai-digital-services-residents.md": {
    heading: "Trust Is The Real Product",
    text: "The next battle will be trust. Residents will use digital services happily only if they believe their data is safe, the process is clear and support is available when something breaks.\n\nThat is where Dubai must be careful. Speed is powerful, but speed without explanation can frustrate people. A good city platform should feel like a helpful officer, not a locked door with a password.\n\nFor Indian professionals moving to Dubai, this can shape the first impression. If rent, documents, payments and transport feel simple in the first month, the city starts feeling like home much faster."
  },
  "dubai-real-estate-confidence-2026.md": {
    heading: "The New Buyer Wants Proof",
    text: "The new Dubai buyer is not as easy to impress as before. Many have already seen multiple launches, payment plans and promises. They now ask sharper questions.\n\nWho is building it? What has the developer delivered before? How far is the metro or main road? Will the community work for families, or only for brochures? What happens when thousands of similar units are handed over?\n\nThese questions are healthy. They make the market more serious. They also protect buyers from treating property like a quick bet when it should be a carefully studied decision."
  },
  "dubai-waterfront-dining-tourism.md": {
    heading: "The View Is Only The Opening Offer",
    text: "A waterfront view can fill tables once. It cannot protect a restaurant forever. Dubai diners have too many choices, and visitors quickly compare service, price and atmosphere.\n\nThe best venues understand this. They use the view as the invitation, then rely on hospitality to create memory. That includes pacing, staff training, food consistency and the feeling that the bill made sense.\n\nFor small suppliers and workers, strong venues create steady demand. For the city, they turn geography into experience. That is why dining remains part of Dubai's tourism engine."
  },
  "uae-business-travel-demand-rises.md": {
    heading: "The Trip That Starts A Bigger Commitment",
    text: "Many business relationships with Dubai begin with a short trip. A founder attends a conference, meets a banker, visits a free zone and starts imagining a regional base.\n\nThat is the hidden power of business travel. It converts curiosity into meetings, and meetings into decisions. Hotels and airlines benefit first, but the deeper value sits in investment, hiring and market entry.\n\nFor Indian companies, Dubai often feels like the first international step that is still manageable. The city must protect that ease if it wants corporate travel to keep feeding the wider economy."
  }
};

const topUps = {
  "dubai-export-support-manufacturers-d33-2026.md": "The best outcome would be boring in the best possible way: more shipments, fewer payment scares and manufacturers talking about new markets with confidence.",
  "dubai-museum-of-digital-art-difc-2026.md": "If MODA gets this right, it can give young creators a serious local stage and give visitors a reason to see Dubai as more than malls, hotels and beaches.",
  "dubai-retail-gaming-lifestyle-calendar-2026.md": "The winners will be retailers and venues that understand community, not just discounts. Gaming audiences can spot lazy marketing very quickly.",
  "dubai-tourism-record-year-momentum-2026.md": "That is why the next phase is about depth, not only volume. More visitors are useful, but happier repeat visitors are much more powerful.",
  "dubai-uae-israel-discreet-diplomacy-2026.md": "For businesses, this careful signalling reduces uncertainty. Markets may not love complexity, but they respect governments that communicate clearly.",
  "khor-al-mamzar-beach-dubai-lifestyle-economy-2026.md": "The best sign will be ordinary use: families returning, runners building routines and small operators finding steady demand beyond weekends.",
  "rta-al-khaleej-tunnel-shindagha-corridor-2026.md": "In a city built on movement, minutes saved are not small. They become productivity, comfort and stronger confidence in the districts connected by the road.",
  "uae-industrial-platform-investment-2026.md": "The opportunity is not only for large factories. Smaller firms can grow around them as suppliers, service providers and specialist contractors.",
  "uae-security-posture-regional-tensions-2026.md": "That is the standard residents will judge in the end: not how strong the statement sounded, but how calmly tomorrow arrived."
};

for (const [file, addition] of Object.entries(additions)) {
  const full = path.join(articlesDir, file);
  const raw = fs.readFileSync(full, "utf8");
  if (raw.includes(`## ${addition.heading}`)) continue;
  fs.writeFileSync(full, `${raw.trim()}\n\n## ${addition.heading}\n\n${addition.text}\n`);
}

for (const [file, sentence] of Object.entries(topUps)) {
  const full = path.join(articlesDir, file);
  const raw = fs.readFileSync(full, "utf8");
  if (raw.includes(sentence)) continue;
  const updated = raw.replace(/\n\n(Source[s]?: .+)$/m, `\n\n${sentence}\n\n$1`);
  fs.writeFileSync(full, updated);
}
