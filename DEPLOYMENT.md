# Dubai Times Deployment Checklist

This is the practical path to move Dubai Times from this Mac to a cloud setup.

## 1. GitHub

Create a GitHub repository:

```text
dubai-times-site
```

Recommended visibility:

```text
Private while building, public later if desired.
```

Push this local project to GitHub:

```bash
git remote add origin git@github.com:YOUR_USERNAME/dubai-times-site.git
git branch -M main
git push -u origin main
```

## 2. Cloudflare Pages

In Cloudflare:

```text
Workers & Pages -> Create application -> Pages -> Connect to Git
```

Select:

```text
dubai-times-site
```

Build settings:

```text
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Node.js version: 26
```

After deployment, Cloudflare gives a temporary URL such as:

```text
https://dubai-times-site.pages.dev
```

Later, connect your custom domain.

Recommended first public URL:

```text
https://dubai-times-site.pages.dev
```

Custom domain options:

```text
dubaitimes.ae
dubaitimes.media
dubaitimesnews.com
```

You must own the domain before Cloudflare can attach it. If you do not own one yet, keep the free `pages.dev` URL live first.

## 3. Supabase

Create a Supabase project:

```text
dubai-times
```

Supabase will be used by the future private engine, not by the public website at first.

Planned tables:

```text
runs
sources
fetched_urls
story_clusters
published_articles
article_images
errors
source_health
```

Keep these values ready for the future engine:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
```

Do not commit those values into GitHub.

## 4. Future Engine

Create a second private repository later:

```text
dubai-times-engine
```

The engine will:

```text
fetch sources
deduplicate stories
rewrite articles
download images
write article files into dubai-times-site
commit and push changes
trigger Cloudflare deploys
record activity in Supabase
```

## 5. GitHub Secrets For The Future Engine

When the engine exists, add secrets in:

```text
GitHub repo -> Settings -> Secrets and variables -> Actions
```

Expected secrets:

```text
OPENAI_API_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
PEXELS_API_KEY
SITE_REPO_DEPLOY_KEY
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```
