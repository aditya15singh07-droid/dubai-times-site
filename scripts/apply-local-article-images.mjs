import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const imagesDir = path.join(root, "public", "images");
const articlesDir = path.join(root, "src", "content", "articles");

fs.mkdirSync(imagesDir, { recursive: true });

const assets = {
  Dubai: {
    file: "dubai-times-dubai.svg",
    title: "Dubai",
    subtitle: "City Desk",
    colors: ["#f4f0e8", "#0f766e", "#111827"],
  },
  UAE: {
    file: "dubai-times-uae.svg",
    title: "UAE",
    subtitle: "National Desk",
    colors: ["#f8fafc", "#0f766e", "#9f1239"],
  },
  Business: {
    file: "dubai-times-business.svg",
    title: "Business",
    subtitle: "Markets & Trade",
    colors: ["#fef3c7", "#111827", "#b45309"],
  },
  "Real Estate": {
    file: "dubai-times-real-estate.svg",
    title: "Real Estate",
    subtitle: "Property Watch",
    colors: ["#ecfeff", "#155e75", "#0f172a"],
  },
  Travel: {
    file: "dubai-times-travel.svg",
    title: "Travel",
    subtitle: "Aviation & Tourism",
    colors: ["#eff6ff", "#1d4ed8", "#0f172a"],
  },
  Lifestyle: {
    file: "dubai-times-lifestyle.svg",
    title: "Lifestyle",
    subtitle: "Culture & City Life",
    colors: ["#fff7ed", "#be123c", "#111827"],
  },
  Technology: {
    file: "dubai-times-technology.svg",
    title: "Technology",
    subtitle: "AI & Digital",
    colors: ["#f0fdf4", "#047857", "#111827"],
  },
  World: {
    file: "dubai-times-world.svg",
    title: "World",
    subtitle: "Region & Diplomacy",
    colors: ["#f8fafc", "#334155", "#0f766e"],
  },
};

function svg({ title, subtitle, colors }) {
  const [bg, primary, ink] = colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="840" viewBox="0 0 1400 840" role="img" aria-label="Dubai Times ${title} image">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0v72" fill="none" stroke="${primary}" stroke-opacity=".12" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="1400" height="840" fill="url(#g)"/>
  <rect width="1400" height="840" fill="url(#grid)"/>
  <path d="M0 658 C220 560 362 745 575 642 C781 542 894 430 1115 501 C1242 542 1325 610 1400 575 V840 H0 Z" fill="${primary}" opacity=".12"/>
  <path d="M160 655 H1240" stroke="${primary}" stroke-width="6" stroke-linecap="round" opacity=".55"/>
  <path d="M275 610 L355 460 L438 610 Z M482 610 L600 365 L720 610 Z M760 610 L850 430 L940 610 Z" fill="${primary}" opacity=".18"/>
  <rect x="108" y="96" width="1184" height="648" rx="34" fill="#ffffff" fill-opacity=".72" stroke="${primary}" stroke-opacity=".22" stroke-width="2"/>
  <text x="150" y="182" fill="${primary}" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="700" letter-spacing="4">DUBAI TIMES</text>
  <text x="150" y="390" fill="${ink}" font-family="Georgia, 'Times New Roman', serif" font-size="112" font-weight="700">${title}</text>
  <text x="154" y="466" fill="${primary}" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700">${subtitle}</text>
  <text x="154" y="545" fill="${ink}" opacity=".72" font-family="Arial, Helvetica, sans-serif" font-size="28">Source-linked reporting for Dubai, the UAE and the region</text>
  <circle cx="1140" cy="190" r="74" fill="${primary}" opacity=".14"/>
  <circle cx="1140" cy="190" r="42" fill="${primary}" opacity=".28"/>
</svg>
`;
}

for (const data of Object.values(assets)) {
  fs.writeFileSync(path.join(imagesDir, data.file), svg(data));
}

for (const file of fs.readdirSync(articlesDir).filter((name) => name.endsWith(".md"))) {
  const full = path.join(articlesDir, file);
  let raw = fs.readFileSync(full, "utf8");
  const category = raw.match(/^category: "([^"]+)"/m)?.[1] ?? "Dubai";
  const asset = assets[category] ?? assets.Dubai;
  raw = raw.replace(/^image: ".*"$/m, `image: "/images/${asset.file}"`);
  raw = raw.replace(/^imageAlt: ".*"$/m, `imageAlt: "Dubai Times ${asset.title} editorial image"`);
  fs.writeFileSync(full, raw);
}
