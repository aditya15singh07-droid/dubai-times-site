import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { articleUrl, articleUrlMap } from "../lib/articleUrls";

const siteUrl = "https://dubai-time.com";

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
  const articles = (await getCollection("articles", ({ data }) => !data.draft))
    .sort((a, b) => articleTimestamp(b) - articleTimestamp(a))
    .slice(0, 80);
  const articleUrls = articleUrlMap(articles);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dubai Time</title>
    <link>${siteUrl}/</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Live Dubai time, UAE weather, markets and latest UAE-focused news.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${articles
  .map((article) => {
    const url = articleUrl(article, articleUrls);
    return `    <item>
      <title>${escapeXml(article.data.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(article.data.description)}</description>
      <category>${escapeXml(article.data.category)}</category>
      <pubDate>${new Date(articleTimestamp(article)).toUTCString()}</pubDate>
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
