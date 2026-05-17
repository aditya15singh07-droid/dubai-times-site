# Dubai Times Site

Dubai Times is an Astro static news website for Dubai, UAE business, real estate, travel, lifestyle, technology, and regional coverage.

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
5. Later, the Dubai Times engine will commit new articles into this repo.
6. Each commit will trigger a fresh Cloudflare deployment.

## Future Engine Integration

The private `dubai-times-engine` repo should write generated articles and images into this website repo.

Planned publishing paths:

```text
src/content/articles/
public/images/articles/
```

The current version uses `src/data/articles.ts` as a beginner-friendly starter. When the automation engine is ready, move article storage to Astro content collections backed by Markdown files.
