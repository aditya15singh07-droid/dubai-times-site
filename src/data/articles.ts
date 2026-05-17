export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  image: string;
  imageAlt: string;
  tags: string[];
  body: string[];
};

export const categories = [
  "Dubai",
  "UAE",
  "Business",
  "Real Estate",
  "Travel",
  "Lifestyle",
  "Technology",
  "World",
];

export const articles: Article[] = [
  {
    slug: "dubai-real-estate-confidence-2026",
    title: "Dubai Real Estate Confidence Holds As New Districts Draw Buyers",
    description:
      "Developers and brokers are watching fresh demand across emerging Dubai districts as buyers compare lifestyle, transport, and long-term value.",
    category: "Real Estate",
    author: "Dubai Times Real Estate Desk",
    date: "2026-05-17",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Dubai skyline seen from the water at sunset",
    tags: ["Dubai", "Property", "Investment"],
    body: [
      "Dubai's property market continues to show steady interest from end users and investors, with newer districts competing on connectivity, amenities, and community planning.",
      "Market watchers say buyers are becoming more selective. Price, handover timelines, developer track record, and access to schools, offices, and transport links are increasingly shaping decisions.",
      "The next phase for the sector will depend on how supply is absorbed and whether rental yields remain attractive compared with other global cities.",
    ],
  },
  {
    slug: "uae-business-travel-demand-rises",
    title: "Business Travel Demand Rises As Dubai Events Calendar Expands",
    description:
      "Hotels, airlines, and conference venues are preparing for a busy season as Dubai's event economy continues to support business travel.",
    category: "Business",
    author: "Dubai Times Business Desk",
    date: "2026-05-17",
    image:
      "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Modern airport terminal with travelers walking through the concourse",
    tags: ["Travel", "Business", "Events"],
    body: [
      "Dubai's business travel market is being supported by exhibitions, investor meetings, and corporate events that continue to draw regional and international visitors.",
      "Hospitality operators are using the events calendar to plan staffing, pricing, and marketing campaigns, while airlines are watching premium cabin demand closely.",
      "The trend reinforces Dubai's position as a regional meeting point for finance, trade, technology, and tourism.",
    ],
  },
  {
    slug: "dubai-digital-services-residents",
    title: "Digital Services Become Central To Daily Life For Dubai Residents",
    description:
      "Public and private platforms are reshaping how Dubai residents manage payments, transport, property services, and appointments.",
    category: "Technology",
    author: "Dubai Times Technology Desk",
    date: "2026-05-17",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Person using a smartphone with digital interface lights",
    tags: ["Dubai", "Technology", "Services"],
    body: [
      "Digital services are becoming a normal part of daily life in Dubai, from bill payments and government paperwork to transport planning and home services.",
      "The strongest platforms are reducing friction for residents by combining clear identity checks, fast payments, and reliable status updates.",
      "For Dubai Times, this beat will be important because technology coverage touches residents, businesses, startups, and public services at the same time.",
    ],
  },
  {
    slug: "dubai-waterfront-dining-tourism",
    title: "Waterfront Dining Remains A Strong Pull For Dubai Visitors",
    description:
      "Restaurants near beaches, marinas, and landmark districts continue to benefit from Dubai's tourism appeal and outdoor lifestyle.",
    category: "Lifestyle",
    author: "Dubai Times Lifestyle Desk",
    date: "2026-05-17",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Restaurant table beside water with city lights in the background",
    tags: ["Dining", "Tourism", "Lifestyle"],
    body: [
      "Waterfront dining remains one of Dubai's most reliable tourism draws, combining skyline views, beach access, and late-evening footfall.",
      "Operators are balancing premium menus with casual formats as residents and visitors look for places that feel polished but not overly formal.",
      "The category is also closely linked to hotel performance, destination marketing, and the city's broader leisure economy.",
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(category: string) {
  return articles.filter(
    (article) => article.category.toLowerCase() === category.toLowerCase(),
  );
}
