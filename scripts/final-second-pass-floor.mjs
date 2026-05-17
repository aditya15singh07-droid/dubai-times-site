import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("src/content/articles");

const topups = {
  "dubai-blockchain-week-web3-ecosystem-2026.md": "One more thing is worth saying plainly. Web3 will not win trust through louder events. It will win when users know where their money sits, who supervises the company and what happens if something breaks. Dubai's job is to make that serious version of the industry feel possible.",
  "dubai-digital-services-residents.md": "The small-business angle is just as important. A founder or shop owner does not want to spend the best part of a morning on routine paperwork. If Dubai can make those tasks faster, it gives business owners more time for customers, staff and sales. That is real economic value.",
  "dubai-economic-incentives-liquidity-2026.md": "The package will also test communication. Relief works best when people understand it quickly. If businesses need consultants just to decode the benefit, some of the value is lost. Simple access and clear rules will decide how widely the support is actually felt.",
  "dubai-export-support-manufacturers-d33-2026.md": "For Dubai, the export story also supports the D33 agenda. The city wants to double down on trade and build deeper economic capacity. Helping manufacturers sell abroad gives that plan a more grounded shape, because exports create proof that local companies can compete outside the home market.",
  "dubai-holding-emaar-stake-market-signal-2026.md": "There is still a caution. A strong shareholder does not make every project a good buy. Investors should still compare price, rent, service charges and future supply. The deal strengthens confidence, but it does not remove the need for homework.",
  "dubai-museum-of-digital-art-difc-2026.md": "Parents may also see value here. A strong digital art museum can make technology feel creative instead of intimidating. For students, it can show that coding, design and storytelling are not separate worlds. That is useful in a city trying to attract future-facing talent.",
  "dubai-property-sales-april-resilience-2026.md": "Brokers will feel this shift first. In a fast market, almost every listing gets attention. In a smarter market, weak stock sits longer and better-located homes move faster. That difference will tell us more than the headline sales value alone.",
  "dubai-real-estate-confidence-2026.md": "For tenants, this matters too. A strong ownership market can still be painful if rents move too quickly. The healthiest property story is one where buyers, landlords and residents all see enough value to stay engaged without feeling trapped.",
  "dubai-retail-gaming-lifestyle-calendar-2026.md": "For parents, gaming events can also change the meaning of a mall visit. It is no longer only shopping and food courts. It can become a place where children, creators and brands meet. That gives retail spaces a better chance of staying relevant.",
  "dubai-tourism-record-year-momentum-2026.md": "Hotel staff are a useful way to read the market. When tourism is strong, their shifts, tips, rosters and career prospects change. A record year is not only a number at DET. It is also felt at reception desks, kitchens, housekeeping teams and tour counters.",
  "dubai-uae-israel-discreet-diplomacy-2026.md": "Indian readers will recognise the balancing act. Countries often maintain relationships that are strategically useful but politically sensitive. The skill lies in keeping channels open without making the public feel that important decisions are being made in the shadows.",
  "dubai-waterfront-dining-tourism.md": "For visitors on a budget, the category still has to be careful. Premium does not mean careless pricing. A city wins repeat dining when people feel the experience was worth it, whether they paid for a luxury table or a casual meal by the water.",
  "khor-al-mamzar-beach-dubai-lifestyle-economy-2026.md": "The night beach is especially interesting. Dubai's climate makes evening life important for much of the year. A safe, well-lit beach can stretch public life beyond sunset and give families a practical alternative to indoor leisure.",
  "rta-al-khaleej-tunnel-shindagha-corridor-2026.md": "For shopkeepers, clinics and restaurants in the catchment, the tunnel may matter in small but real ways. Easier access can bring a customer who previously avoided the route. Over time, those little decisions can change local business confidence.",
  "uae-business-travel-demand-rises.md": "Airlines will watch the same pattern. Premium cabins, flexible tickets and short business stays can be profitable when the city keeps pulling decision-makers in. That is why a strong events calendar matters beyond the exhibition hall.",
  "uae-industrial-platform-investment-2026.md": "Food security adds another layer. When countries can produce more of what they need, they become less exposed to outside shocks. That does not mean shutting the door on trade. It means having more options when global supply chains misbehave.",
  "uae-security-posture-regional-tensions-2026.md": "For employers, this stability question affects planning. Companies can handle risk when they understand it. What they need from the state is calm communication, visible readiness and the confidence that normal operations will continue as far as possible."
};

function countWords(body) {
  return body.replace(/^Source[s]?:.*$/gm, "").split(/\s+/).filter(Boolean).length;
}

for (const [file, text] of Object.entries(topups)) {
  const full = path.join(dir, file);
  const raw = fs.readFileSync(full, "utf8");
  const body = raw.split("---").slice(2).join("---").trim();
  if (countWords(body) >= 800 || raw.includes(text)) continue;
  const updated = raw.match(/\n\nSource[s]?: .+$/m)
    ? raw.replace(/\n\n(Source[s]?: .+)$/m, `\n\n${text}\n\n$1`)
    : `${raw.trim()}\n\n${text}\n`;
  fs.writeFileSync(full, updated);
}
