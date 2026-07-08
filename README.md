# connectorselection.com — Frontend

Static Next.js site for connectorselection.com. Pulls content from the Strapi
API at build time and exports a fully static site (HTML/CSS/JS) that you deploy
to AWS S3 + CloudFront.

## Prerequisites

- Node.js 18.18+ (you have Node 22 — good)
- The Strapi API reachable at `https://api.connectorselection.com` with the
  content types set to public read access.

## Setup (first time)

From this folder, in PowerShell:

```powershell
npm install
```

This downloads dependencies into `node_modules` (a few hundred MB — normal).

## Run the dev server (preview locally)

```powershell
npm run dev
```

Then open http://localhost:3000 in your browser. The site pulls live content
from your Strapi API. Edit files and the page hot-reloads.

## Build the static site (for deployment)

```powershell
npm run build
```

This generates the static site into the `out/` folder. Everything in `out/`
is what you upload to S3. No Node server is needed to serve it.

## Configuration

The API base URL is set in `.env.local`:

```
NEXT_PUBLIC_STRAPI_URL=https://api.connectorselection.com
```

Change it there if the API address ever changes.

## Project structure

```
app/
  layout.jsx            Root layout (header, footer, fonts)
  page.jsx              Homepage
  globals.css           Design tokens + all styles
  articles/            Article list + [slug] detail
  categories/          Category list + [slug] detail
  blog/                Blog list + [slug] detail
  products/            Product list + [slug] detail
  not-found.jsx        404 page
components/
  Header.jsx, Footer.jsx, ArticleCard.jsx
  BlocksRenderer.jsx   Renders Strapi rich-text "blocks" -> HTML
lib/
  strapi.js            All API fetching + image URL helpers
```

## Notes

- Content is fetched at BUILD time. After you publish new content in Strapi,
  re-run `npm run build` and re-upload `out/` to see it live. (Later we can
  automate this with a webhook + CI.)
- Images are served directly from Strapi
  (`https://api.connectorselection.com/uploads/...`).
- Field-name quirk handled in code: categories use `Name` (capital N),
  authors use `name` (lowercase). The components account for both.
