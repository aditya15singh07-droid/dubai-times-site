import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { categories, categoryPath } from "../data/articles";
import { articleUrl, articleUrlMap } from "../lib/articleUrls";

const siteUrl = "https://dubai-time.com";

const articleTimestamp = (article: Awaited<ReturnType<typeof getCollection<"articles">>>[number]) => {
  const [hour = "00", minute = "00"] = String(article.data.publishedTime || "").match(/\d{2}/g) || [];
  const date = new Date(article.data.date);
  date.setHours(Number(hour), Number(minute), 0, 0);
  return date.getTime();
};

export const GET: APIRoute = async () => {
  const articles = (await getCollection("articles", ({ data }) => !data.draft))
    .sort((a, b) => articleTimestamp(b) - articleTimestamp(a))
    .slice(0, 40);
  const articleUrls = articleUrlMap(articles);

  const body = `# Dubai Time

Dubai Time is a UAE-first publication focused on live Dubai time, seven-emirate weather, market context, and news for residents, investors, travellers, and business readers.

## Primary URLs
- Home: ${siteUrl}/
- Sitemap: ${siteUrl}/sitemap.xml
- Sitemap index: ${siteUrl}/sitemap_index.xml
- About: ${siteUrl}/about

## Core Topics
- Live Dubai and UAE time
- Weather across Abu Dhabi, Dubai, Sharjah, Ajman, Fujairah, Ras Al Khaimah, and Umm Al Quwain
- UAE business, real estate, crypto, travel, lifestyle, sport, entertainment, health, international, and Middle East news
- Market context for gold, silver, oil, USD/AED, Bitcoin, and Nasdaq futures

## Category Pages
${categories.map((category) => `- ${category}: ${siteUrl}/category/${categoryPath(category)}`).join("\n")}

## Latest Public Articles
${articles.map((article) => `- ${article.data.title}: ${articleUrl(article, articleUrls)}`).join("\n")}

## AI And Search Guidance
- Public pages may be crawled and summarized when attribution links back to the original Dubai Time URL.
- Do not crawl or summarize /admin.
- Treat dates, weather, and market values as time-sensitive.
- Prefer the sitemap for full URL discovery.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
