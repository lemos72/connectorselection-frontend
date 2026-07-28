// -----------------------------------------------------------------------------
// Strapi API client
// -----------------------------------------------------------------------------
// All data fetching for the site goes through here. Because the site is a STATIC
// export, these functions run at BUILD TIME (in Node, on your PC), not in the
// visitor's browser. The visitor just gets pre-rendered HTML.
// -----------------------------------------------------------------------------

export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.connectorselection.com';

const API = `${STRAPI_URL}/api`;

// Low-level fetch wrapper. Throws on non-OK so a bad build fails loudly
// instead of silently shipping empty pages.
async function fetchAPI(path, { revalidate = 60 } = {}) {
  const url = `${API}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    // During `next build`, this controls caching; harmless for static export.
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(
      `Strapi request failed: ${res.status} ${res.statusText} for ${url}`
    );
  }
  return res.json();
}

// Turn a Strapi media object (or relative path) into an absolute URL.
// Strapi returns image URLs like "/uploads/foo.jpg" — we prepend the host.
export function mediaURL(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path}`;
}

// Pick a reasonably-sized image from a Strapi media object.
// Strapi auto-generates thumbnail/small/medium/large formats.
export function imageFrom(media, preferred = 'medium') {
  if (!media) return null;
  const fmt = media.formats || {};
  const chosen =
    fmt[preferred]?.url ||
    fmt.medium?.url ||
    fmt.small?.url ||
    media.url ||
    null;
  return {
    url: mediaURL(chosen),
    alt: media.alternativeText || '',
    width: (fmt[preferred] || media).width || null,
    height: (fmt[preferred] || media).height || null,
  };
}

// -----------------------------------------------------------------------------
// Content fetchers
// -----------------------------------------------------------------------------
// NOTE ON FIELD NAMES: your Strapi returns Category.Name (capital N) but
// Author.name (lowercase n). We normalize where it matters in components.

export async function getArticles() {
  const data = await fetchAPI(
    '/articles?populate=*&sort=published_date:desc&pagination[pageSize]=100'
  );
  return data.data || [];
}

export async function getArticleBySlug(slug) {
  const data = await fetchAPI(
    `/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  return (data.data && data.data[0]) || null;
}

export async function getCategories() {
  const data = await fetchAPI('/categories?populate=*&sort=Name:asc');
  return data.data || [];
}

export async function getCategoryBySlug(slug) {
  const data = await fetchAPI(
    `/categories?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  return (data.data && data.data[0]) || null;
}

export async function getArticlesByCategorySlug(slug) {
  const data = await fetchAPI(
    `/articles?filters[category][slug][$eq]=${encodeURIComponent(
      slug
    )}&populate=*&sort=published_date:desc`
  );
  return data.data || [];
}

export async function getBlogPosts() {
  const data = await fetchAPI(
    '/blog-posts?populate=*&sort=published_date:desc&pagination[pageSize]=100'
  );
  return data.data || [];
}

export async function getBlogPostBySlug(slug) {
  const data = await fetchAPI(
    `/blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  return (data.data && data.data[0]) || null;
}

export async function getProductIntroductions() {
  const data = await fetchAPI(
    '/product-introductions?populate=*&pagination[pageSize]=100'
  );
  return data.data || [];
}

export async function getProductIntroBySlug(slug) {
  const data = await fetchAPI(
    `/product-introductions?filters[slug][$eq]=${encodeURIComponent(
      slug
    )}&populate=*`
  );
  return (data.data && data.data[0]) || null;
}
export async function getNewsItems() {
     const data = await fetchAPI(
       '/news-items?sort=publishedAt_source:desc&pagination[pageSize]=100'
     );
     return data.data || [];
   }

   export async function getNewsItemsByCategory(category) {
     const data = await fetchAPI(
       `/news-items?filters[category][$eq]=${encodeURIComponent(
         category
       )}&sort=publishedAt_source:desc`
     );
     return data.data || [];
   }