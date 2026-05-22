import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const siteUrl = "https://dubai-time.com";
const publicationName = "Dubai Time";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const articleTimestamp = (entry: any) => {
  const [hour = "00", minute = "00"] = String(entry.data.publishedTime || "").match(/\d{2}/g) || [];
  const date = new Date(entry.data.date);
  date.setHours(Number(hour), Number(minute), 0, 0);
  return date.getTime();
};

export const GET: APIRoute = async () => {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const articles = (await getCollection("articles", ({ data }) => !data.draft))
    .filter((article) => articleTimestamp(article) >= cutoff)
    .sort((a, b) => articleTimestamp(b) - articleTimestamp(a))
    .slice(0, 1000);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles
  .map(
    (article) => `  <url>
    <loc>${escapeXml(`${siteUrl}/articles/${article.id}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(publicationName)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(articleTimestamp(article)).toISOString()}</news:publication_date>
      <news:title>${escapeXml(article.data.title)}</news:title>
      <news:keywords>${escapeXml([article.data.category, ...article.data.tags].join(", "))}</news:keywords>
    </news:news>
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
