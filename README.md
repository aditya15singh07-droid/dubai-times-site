# Dubai Time Site

Dubai Time is an Astro static news website for Dubai, UAE business, real estate, travel, lifestyle, technology, and regional coverage.

This repository is the public website layer. The future private automation engine will publish articles into this repo as files, then Cloudflare Pages will build and deploy the live site.

## Tech Stack

- Astro
- TypeScript
- Static HTML output
- GitHub for source control
- Cloudflare Pages for hosting

## Project Structure

```text
/
├── public/
│   └── favicon files
├── src/
│   ├── data/
│   │   └── articles.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       ├── index.astro
│       ├── about.astro
│       ├── articles/[slug].astro
│       └── category/[category].astro
├── astro.config.mjs
├── package.json
└── package-lock.json
```

## Local Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Cloudflare Pages Settings

Use these settings when connecting this repo to Cloudflare Pages:

```text
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Node.js version: 26
```

## Deployment Flow

1. Push this repo to GitHub.
2. Connect the GitHub repo to Cloudflare Pages.
3. Cloudflare builds the site from `npm run build`.
4. Cloudflare serves the generated `dist` folder.
5. Later, the Dubai Time engine will commit new articles into this repo.
6. Each commit will trigger a fresh Cloudflare deployment.

## Future Engine Integration

The private `dubai-times-engine` repo should write generated articles and images into this website repo.

Publishing paths:

```text
src/content/articles/
public/images/articles/
```

Article files are Markdown with frontmatter. The automation engine should create one `.md` file per article in `src/content/articles/`.

Required frontmatter:

```yaml
title: "Article title"
description: "SEO description"
category: "Business"
author: "Dubai Time Business Desk"
date: 2026-05-17
image: "/images/articles/example.jpg"
imageAlt: "Descriptive image alt text"
tags: ["Dubai", "Business"]
draft: false
```
