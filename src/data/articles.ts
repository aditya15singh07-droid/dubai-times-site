export const categories = [
  "Travel",
  "Crypto",
  "Business",
  "Real Estate",
  "Lifestyle",
  "Sport",
  "Entertainment",
  "International",
  "Health",
  "Middle East",
];

export const reportersByCategory = {
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

export const categoryPath = (category: string) => category.toLowerCase().replaceAll(" ", "-");
