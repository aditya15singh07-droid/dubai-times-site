import { categoryPath } from "../data/articles";

const siteUrl = "https://dubai-time.com";

const slugifyTitle = (value = "") =>
  value
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/&#039;|&apos;/g, "")
    .replace(/&quot;/g, "")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 92)
    .replace(/^-|-$/g, "");

export const articleSlug = (article: any) => {
  const cleanTitleSlug = slugifyTitle(article?.data?.title || "");
  return cleanTitleSlug || String(article?.id || "story").replace(/\.md$/, "");
};

export const buildArticleUrlEntries = (articles: any[]) => {
  const sorted = [...articles].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const seen = new Map<string, number>();
  const byId = new Map<string, { category: string; slug: string; path: string; url: string }>();

  for (const article of sorted) {
    const category = categoryPath(article.data.category);
    const baseSlug = articleSlug(article);
    const key = `${category}/${baseSlug}`;
    const count = seen.get(key) || 0;
    seen.set(key, count + 1);
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;
    const path = `/${category}/${slug}`;
    byId.set(article.id, {
      category,
      slug,
      path,
      url: `${siteUrl}${path}`,
    });
  }

  return articles.map((article) => ({
    article,
    ...(byId.get(article.id) || {
      category: categoryPath(article.data.category),
      slug: articleSlug(article),
      path: `/${categoryPath(article.data.category)}/${articleSlug(article)}`,
      url: `${siteUrl}/${categoryPath(article.data.category)}/${articleSlug(article)}`,
    }),
  }));
};

export const articleUrlMap = (articles: any[]) =>
  new Map(buildArticleUrlEntries(articles).map((entry) => [entry.article.id, entry]));

export const articlePath = (article: any, urls: Map<string, any>) =>
  urls.get(article.id)?.path || `/${categoryPath(article.data.category)}/${articleSlug(article)}`;

export const articleUrl = (article: any, urls: Map<string, any>) => `${siteUrl}${articlePath(article, urls)}`;
