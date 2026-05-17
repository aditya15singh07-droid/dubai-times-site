import fs from "node:fs";
import path from "node:path";

const articlesDir = path.resolve("src/content/articles");

const topUps = {
  "dubai-digital-services-residents.md": "The real opportunity is to make the complicated parts of city life feel boring. When renewals, payments and complaints become simple, residents spend less energy on administration and more on work, family and community.",
  "dubai-real-estate-confidence-2026.md": "For developers, this means the easy brochure era is ending. Communities must prove that they can work on a normal Tuesday morning, not only look attractive in a launch video.",
  "dubai-waterfront-dining-tourism.md": "There is also a resident angle here. Tourists may discover a place, but residents keep it alive through repeat visits, birthdays, client dinners and late evening plans after work.",
  "uae-business-travel-demand-rises.md": "The strongest business cities make serious trips feel easy. That means airport reliability, hotel choice, meeting spaces, transport, restaurants and enough after-hours energy to turn a work visit into a relationship.",
  "dubai-real-estate-confidence-2026.md#2": "That is why confidence should be measured after people move in. Real demand shows up in renewals, school runs, community retail and residents recommending the area to friends.",
  "dubai-waterfront-dining-tourism.md#2": "The next strong brands will not only chase tourists. They will build loyal local audiences who return when the weather, menu and service all feel worth the journey.",
  "uae-business-travel-demand-rises.md#2": "If Dubai keeps that journey smooth, a two-day work trip can become a licence application, a property search, a hiring plan or a long-term regional strategy.",
  "dubai-waterfront-dining-tourism.md#3": "In hospitality, that repeat habit is gold because it keeps teams employed, suppliers busy and the destination visible even after peak tourist weeks pass.",
  "uae-business-travel-demand-rises.md#3": "That is valuable."
};

for (const [key, sentence] of Object.entries(topUps)) {
  const file = key.split("#")[0];
  const full = path.join(articlesDir, file);
  const raw = fs.readFileSync(full, "utf8");
  if (raw.includes(sentence)) continue;
  fs.writeFileSync(full, `${raw.trim()}\n\n${sentence}\n`);
}
