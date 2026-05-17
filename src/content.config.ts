import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    author: z.string(),
    date: z.date(),
    publishedTime: z.string().default("09:00 GST"),
    watchLine: z.string().default("Follow the next official update and market response."),
    image: z.string(),
    imageAlt: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
