import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("src/content/articles");

const rewrites = {
  "al-sheraa-dewa-sustainability-headquarters-2026.md": {
    intro: [
      "A government office usually does not make people stop and look twice.",
      "Al Shera'a is different, because Dubai is using it to make a point. The city is saying that the next serious building is not only tall or shiny. It has to work smarter, waste less and make daily life inside it better.",
      "Sheikh Mohammed bin Rashid Al Maktoum has inaugurated DEWA's new headquarters in Al Jaddaf. The official description is ambitious: the world's tallest, largest and smartest net-positive government building.",
      "Put simply, the building is meant to produce more clean energy than it uses. That is a big claim, and it deserves to be watched after the opening photographs fade."
    ],
    note: "The sensible way to judge Al Shera'a is not by the launch language. Judge it after a year of use: energy performance, employee comfort, visitor experience and whether other public buildings borrow from it."
  },
  "dewa-transmission-grid-expansion-2025-2028.md": {
    intro: [
      "Dubai's skyline gets the attention. The electricity grid does the hard work.",
      "That may sound plain, but anyone who has lived in a fast-growing city knows the truth. Growth feels impressive only when the basics keep pace. Power, water, roads and cooling decide whether the promise works at home, at work and in a hotel room.",
      "DEWA says it commissioned eight 132kV substations and two 400kV substations in 2025. It also has more than AED8.5 billion in transmission projects under construction through 2028.",
      "This is not just an engineering update. It is Dubai preparing the wiring before more people, offices, hotels, factories and data-heavy businesses plug in."
    ],
    note: "For Indian companies looking at Dubai, this is the sort of detail worth noticing. Reliable power is not glamorous, but it decides whether expansion feels calm or risky."
  },
  "dubai-blockchain-week-web3-ecosystem-2026.md": {
    intro: [
      "Crypto events used to sell excitement. Dubai now has to sell something harder: trust.",
      "MENA Blockchain Week arrives in that mood. The noise around Web3 has not disappeared, but the serious money is asking better questions. Who is regulated? Who has real customers? Who can survive when token prices stop doing the marketing?",
      "The Dubai event is scheduled from 18 to 24 May, with organisers describing it as a city-wide programme of more than 40 events and over 5,000 attendees.",
      "The crowd matters less than the follow-through. A conference can fill a week. A credible ecosystem has to fill offices, payrolls and compliance files."
    ],
    note: "The useful signal will come after the panels end. Watch for licences, enterprise pilots and founders who choose Dubai as a base rather than a backdrop."
  },
  "dubai-digital-services-residents.md": {
    intro: [
      "The best city technology is the kind you stop noticing.",
      "A payment goes through. A renewal is done. A complaint is tracked. A resident gets an answer without taking half a day off work. That is when digital government and private platforms start feeling useful.",
      "Dubai's digital services story sits exactly there. It is not only about apps. It is about how much daily friction the city can remove for residents, families, workers and small businesses.",
      "For Indian readers, the comparison is familiar. UPI did not win because it sounded futuristic. It won because it made a daily task ridiculously simple."
    ],
    note: "The next level is not another app icon. It is trust, support and connection between services, so people do not feel lost when one step goes wrong."
  },
  "dubai-economic-incentives-liquidity-2026.md": {
    intro: [
      "Business confidence often sounds grand in speeches. In real life, it is usually about cash flow.",
      "Can a hotel pay staff on time? Can a trader clear goods without extra pressure? Can a small company delay one cost long enough to protect five jobs? These are the questions hidden inside incentive packages.",
      "Dubai's latest AED1 billion support measures have brought liquidity, government fees, customs grace periods and hospitality support back into focus.",
      "The package is not being sold as panic relief. It looks more like a pressure valve for an economy that depends on movement."
    ],
    note: "The numbers to watch are practical: licences, hiring, hotel occupancy, trade flows and whether smaller operators sound less nervous by the next quarter."
  },
  "dubai-export-support-manufacturers-d33-2026.md": {
    intro: [
      "A manufacturer does not become global just because the product is good.",
      "The company also needs buyers, finance, shipping support, insurance and the confidence that payment will actually arrive. Ask any Indian exporter and you will hear the same story over tea.",
      "Dubai's export support deals are aimed at that less glamorous but very real problem. The agreements focus on finance, export credit protection and logistics for manufacturers trying to sell abroad.",
      "The announcement came during Make it in the Emirates 2026, which makes the message clear: the UAE wants more than trade routes. It wants stronger production and export muscle."
    ],
    note: "The proof will not be in the signing ceremony. It will be in repeat orders, safer payments and smaller manufacturers entering markets they once avoided."
  },
  "dubai-holding-emaar-stake-market-signal-2026.md": {
    intro: [
      "In real estate, confidence has a smell. Buyers notice it before they admit it.",
      "They look at the developer name, the handover record, the master plan and the people standing behind the company. That is why Dubai Holding's larger position in Emaar is more than a financial transaction.",
      "Dubai Holding has completed its acquisition of a 22.27% equity stake from the Investment Corporation of Dubai. Its total Emaar shareholding now stands at 29.73%, making it the largest shareholder.",
      "For Dubai's property market, the move says that big local institutions still see long-term value in the city's lifestyle and real estate engine."
    ],
    note: "The market will still judge Emaar through launches, pricing and delivery. Big backing helps, but trust is finally earned at handover."
  },
  "dubai-museum-of-digital-art-difc-2026.md": {
    intro: [
      "A museum in DIFC is never only about art.",
      "It also speaks to money, tourism, collectors, young creators and the way Dubai wants to be seen by the world. That is what makes the Museum of Digital Art worth watching.",
      "Sheikha Latifa bint Mohammed bin Rashid Al Maktoum has launched MODA, planned for the DIFC Zabeel District expansion.",
      "The museum is being positioned as the region's first dedicated to digital art and new technologies. The promise is big. The real test will be whether it becomes a living cultural address, not just a photo stop."
    ],
    note: "The museum will need strong programming, local talent and reasons to return. Screens alone will not build credibility."
  },
  "dubai-property-sales-april-resilience-2026.md": {
    intro: [
      "Dubai property has a habit of annoying its doubters.",
      "Just when people expect the market to tire, another month of large transaction numbers arrives. April's sales value kept that conversation alive, but the headline number is only the start.",
      "The more useful question is who is buying, what they are buying and whether the demand is broad enough to stay healthy.",
      "For Indian buyers watching Dubai from Mumbai, Delhi, Bengaluru or Pune, this distinction matters. A hot market is not automatically a smart purchase."
    ],
    note: "The sensible buyer will study rental depth, service charges, developer quality and future supply. Excitement is not a due diligence strategy."
  },
  "dubai-real-estate-confidence-2026.md": {
    intro: [
      "Confidence in property is easy to claim on a billboard.",
      "It is harder to prove after people move in. That is when traffic, maintenance, schools, shops, noise and community management begin to matter more than the launch brochure.",
      "Dubai's real estate confidence story is now entering that more mature phase. Buyers are still active, but many are sharper than before.",
      "They are asking better questions. What is the developer's record? Who will live here? Will the area work on a weekday morning, not only in a render?"
    ],
    note: "The communities that win from here will feel complete. Not perfect, but usable, lived-in and easy to recommend."
  },
  "dubai-retail-gaming-lifestyle-calendar-2026.md": {
    intro: [
      "A packed events calendar looks like entertainment. In Dubai, it is also a business model.",
      "Gaming events, retail campaigns, Eid demand and lifestyle programming all do the same job in different ways. They give people a reason to leave home, spend time and open their wallets.",
      "Dubai's May calendar shows how the city turns leisure into economic activity. The trick is not only to attract tourists. It is to keep residents interested too.",
      "Indian readers have seen this with cricket weekends, shopping festivals and concert seasons. When the calendar is strong, the city moves differently."
    ],
    note: "The danger is fatigue. Events must feel fresh and useful, not like noise stacked on more noise."
  },
  "dubai-tourism-record-year-momentum-2026.md": {
    intro: [
      "Visitor records sound like airport numbers until you follow the money.",
      "A tourist lands, takes a taxi, checks into a hotel, eats out, shops, books an attraction and maybe starts thinking about property. That is why Dubai treats tourism as an economic machine, not a side business.",
      "Dubai entered 2026 after another record year for international visitors. The city also crossed a symbolic December milestone, welcoming more than 2 million visitors in one month for the first time.",
      "For Indians, none of this feels surprising. Dubai is close, familiar, safe, aspirational and easy to plan for a short break."
    ],
    note: "The next challenge is not only more visitors. It is better repeat visits, fair pricing and a city experience that still feels smooth when the crowds are high."
  },
  "dubai-uae-israel-discreet-diplomacy-2026.md": {
    intro: [
      "Diplomacy often lives in careful wording. One denial, one phrase, one official line can do a lot of work.",
      "That is the situation around UAE-Israel ties after claims and denials about sensitive contacts during regional tensions.",
      "The UAE denied reports of a Netanyahu visit and stressed that relations with Israel are conducted publicly under the Abraham Accords, not through non-transparent arrangements.",
      "The message matters because the region is tense. Governments need flexibility, but they also need to control what the public record says."
    ],
    note: "For business and residents, clear official language reduces uncertainty. In the Gulf, calm wording can be part of stability."
  },
  "dubai-waterfront-dining-tourism.md": {
    intro: [
      "A Dubai dinner with a view can become a travel memory faster than a museum ticket.",
      "That is why waterfront dining matters. It sells food, yes, but also skyline, weather, service and the feeling of being in the city at the right moment.",
      "Restaurants near beaches, marinas and landmark districts continue to benefit from Dubai's visitor economy and outdoor lifestyle.",
      "Indian travellers know this instinctively. One good evening by the water can justify the cab ride, the bill and the Instagram post."
    ],
    note: "The view brings people in once. Service, value and identity decide whether they come back."
  },
  "jebel-ali-port-dubai-trade-engine-2026.md": {
    intro: [
      "Dubai's most important economic story is not always the one with the best photograph.",
      "Sometimes it is a container moving on time. A ship docking without drama. A trader getting stock before cash flow tightens. That is Jebel Ali Port's world.",
      "Sheikh Hamdan bin Mohammed bin Rashid Al Maktoum reviewed operations and key developments at Jebel Ali Port, putting attention back on the infrastructure behind Dubai's trade engine.",
      "For families, this may sound distant. For businesses, especially Indian exporters and importers, it is very close to the pocket."
    ],
    note: "A port does not need to be glamorous to be powerful. Jebel Ali's job is to keep Dubai useful, and that usefulness is the city's real advantage."
  },
  "khor-al-mamzar-beach-dubai-lifestyle-economy-2026.md": {
    intro: [
      "A beach opening sounds simple until you see what a good public space can do.",
      "Families get a weekend plan. Fitness users get a routine. Small food operators get footfall. Nearby communities get a reason to feel more complete.",
      "Dubai Municipality has opened Khor Al Mamzar Beach as the first phase of the wider Al Mamzar Beaches development.",
      "The project adds a larger swimming shoreline, a 24-hour night beach and a stronger mix of sports, fitness and food options."
    ],
    note: "The beach will prove itself through ordinary use: families returning, runners building habits and businesses seeing steady demand after the opening week."
  },
  "rta-al-khaleej-tunnel-shindagha-corridor-2026.md": {
    intro: [
      "A tunnel changes more than traffic. It changes how people feel about a district.",
      "If a route becomes faster, an area can suddenly feel closer, more useful and more investable. That is why the Al Khaleej Street Tunnel matters for Deira and nearby waterfront districts.",
      "Dubai's RTA says the 1,650-metre tunnel project has reached 80% completion. It forms part of the wider Al Shindagha Corridor upgrade.",
      "For anyone who has lost hours in Indian city traffic, the value is obvious. Time saved is life returned."
    ],
    note: "The real verdict will come at peak hour. If journeys become predictable, the corridor will create value beyond the road itself."
  },
  "uae-agentic-ai-government-services-2026.md": {
    intro: [
      "AI becomes useful when it stops showing off and starts doing boring work properly.",
      "That is the promise behind the UAE's move to bring agentic AI into federal government services.",
      "A chatbot can answer a question. Agentic AI is meant to help move a task forward. It can guide, check, suggest and sometimes complete parts of a process.",
      "For residents, the hope is simple: fewer repeated forms, fewer confusing steps and less time spent wondering what went wrong."
    ],
    note: "The standard should remain human. AI can help, but people still need clear responsibility, appeal routes and a real person when the system gets stuck."
  },
  "uae-business-travel-demand-rises.md": {
    intro: [
      "Business travel is not as glamorous as luxury tourism, but it can be more useful to a city.",
      "A delegate fills a hotel room, books meetings, eats out, visits offices and sometimes turns a short trip into a licence, investment or hiring plan.",
      "Dubai's events calendar continues to support business travel demand across hotels, airlines and conference venues.",
      "For Indian companies, Dubai remains a practical meeting point: close enough for a quick trip, global enough for serious conversations."
    ],
    note: "The city has to protect value. If work trips feel easy and fairly priced, they can keep turning into bigger commitments."
  },
  "uae-industrial-platform-investment-2026.md": {
    intro: [
      "Industrial policy becomes real only when machines run and people get hired.",
      "Until then, it is mostly stage lighting, speeches and good intentions. The UAE is trying to move the conversation from ambition to factory-floor proof.",
      "Make it in the Emirates 2026 closed its largest edition with more visitors, more exhibitors and a long list of agreements across offtakes, investments, finance and industrial support.",
      "The numbers are large, but the simple question is smaller: will these commitments become production?"
    ],
    note: "Watch factories, supplier contracts, hiring and exports. Exhibition success is useful only if it travels beyond the hall."
  },
  "uae-security-posture-regional-tensions-2026.md": {
    intro: [
      "Security news in the Gulf is never only about defence.",
      "It also touches flights, ports, schools, offices, insurance, investment and the quiet confidence families need to carry on with normal life.",
      "The UAE has taken a firmer public line after condemning renewed Iranian missile and drone attacks targeting civilian sites and facilities.",
      "The language matters because the country usually works hard to pair firm security messaging with calm daily operations."
    ],
    note: "For residents, the strongest reassurance is not a dramatic sentence. It is the next normal morning."
  }
};

function split(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("bad frontmatter");
  return { frontmatter: match[1], body: match[2].trim() };
}

function sourceLine(body) {
  return body.match(/^Sources?: .+$/m)?.[0] ?? "";
}

function removeIntro(body) {
  const idx = body.search(/^## /m);
  return idx >= 0 ? body.slice(idx).trim() : body.trim();
}

function soften(text) {
  const variants = [
    ["That is why", "So"],
    ["That matters because", "It matters because"],
    ["The next test", "The real test"],
    ["ordinary people", "people outside the boardroom"],
    ["In reality,", "In plain English,"],
    ["The useful way to read it", "The sharper way to read it"],
    ["The real proof", "Proof will come"],
    ["This is important because", "This is important for a simple reason:"],
    ["The strongest signal", "The clearest signal"],
    ["The next phase", "What comes next"]
  ];
  let out = text;
  for (const [from, to] of variants) out = out.split(from).join(to);
  return out
    .replaceAll("—", ", ")
    .replace(/\n{3,}/g, "\n\n");
}

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const cfg = rewrites[file];
  if (!cfg) continue;
  const full = path.join(dir, file);
  const { frontmatter, body } = split(fs.readFileSync(full, "utf8"));
  const source = sourceLine(body);
  let main = removeIntro(body).replace(/^Sources?: .+$/m, "").trim();
  main = soften(main);

  const noteBlock = `## The Line To Remember\n\n${cfg.note}`;
  const next = `---\n${frontmatter}\n---\n\n${cfg.intro.join("\n\n")}\n\n${main}\n\n${noteBlock}\n\n${source}\n`;
  fs.writeFileSync(full, next);
}
