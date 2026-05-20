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
  Travel: "Peter Greenberg",
  Crypto: "David Yaffe-Bellany",
  Business: "Andrew Ross Sorkin",
  "Real Estate": "Natalie Wong",
  Lifestyle: "Natalie Wong",
  Sport: "Noma Nazish",
  Entertainment: "Ramona Shelburne",
  International: "Yaroslav Trofimov",
  Health: "Dr. Sanjay Gupta",
  "Middle East": "Kashmir Hill",
};

export const categoryPath = (category: string) => category.toLowerCase().replaceAll(" ", "-");
