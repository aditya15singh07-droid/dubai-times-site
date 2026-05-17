import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("src/content/articles");
const more = {
  "dubai-property-sales-april-resilience-2026.md": "The cleanest signal will come from buyer behaviour after the first excitement of a launch. If people keep paying for quality locations and completed communities, the market has depth. If demand gathers only around discounts, the story becomes less convincing.",
  "dubai-real-estate-confidence-2026.md": "For long-term residents, confidence also means not feeling priced out of the city they help run. A healthy market should reward investment while still leaving room for families, professionals and small business owners to build stable lives.",
  "dubai-uae-israel-discreet-diplomacy-2026.md": "This is not a story for quick conclusions. It is a story to track through official wording, regional meetings and whether business channels remain calm while politics stays sensitive.",
  "khor-al-mamzar-beach-dubai-lifestyle-economy-2026.md": "Maintenance will decide the long-term mood. Clean facilities, clear safety systems and steady programming can turn the beach into a weekly habit. Without that care, even a strong opening can lose energy.",
  "rta-al-khaleej-tunnel-shindagha-corridor-2026.md": "The best transport upgrades often disappear into routine. People stop praising them because they simply work. That is exactly the kind of success Dubai should want from this corridor.",
  "uae-business-travel-demand-rises.md": "For Dubai, the best business visitor is not the one who only attends a session and leaves. It is the one who returns with colleagues, signs a lease, hires locally or brings clients back.",
  "uae-industrial-platform-investment-2026.md": "Investors will also watch power, land, labour and regulation. A factory is a long commitment. The easier those basics become, the more believable the industrial story will feel.",
  "uae-security-posture-regional-tensions-2026.md": "That is why communication cannot sound confused. In tense weeks, people listen more closely than usual. A steady official tone helps residents separate real risk from rumour."
};

function words(raw) {
  const body = raw.split("---").slice(2).join("---").trim();
  return body.replace(/^Source[s]?:.*$/gm, "").split(/\s+/).filter(Boolean).length;
}

for (const [file, text] of Object.entries(more)) {
  const full = path.join(dir, file);
  const raw = fs.readFileSync(full, "utf8");
  if (words(raw) >= 800 || raw.includes(text)) continue;
  fs.writeFileSync(full, raw.match(/\n\nSource[s]?: .+$/m) ? raw.replace(/\n\n(Source[s]?: .+)$/m, `\n\n${text}\n\n$1`) : `${raw.trim()}\n\n${text}\n`);
}
