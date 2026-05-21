import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { categories, categoryPath } from "../data/articles";

const siteUrl = "https://dubai-time.com";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

export const GET: APIRoute = async () => {
  const articles = await getCollection("articles", ({ data }) => !data.draft);
  const now = toIsoDate(new Date());

  const urls = [
    { loc: "/", lastmod: now, changefreq: "hourly", priority: "1.0" },
    { loc: "/about", lastmod: now, changefreq: "monthly", priority: "0.4" },
    ...categories.map((category) => ({
      loc: `/category/${categoryPath(category)}`,
      lastmod: now,
      changefreq: "daily",
      priority: "0.8",
    })),
    ...articles.map((article) => ({
      loc: `/articles/${article.id}`,
      lastmod: toIsoDate(article.data.date),
      changefreq: "weekly",
      priority: "0.7",
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(new URL(url.loc, siteUrl).toString())}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
