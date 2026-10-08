import { mediaURL } from './strapi';

// -----------------------------------------------------------------------------
// Responsive image helper (new file — lib/strapi.js is untouched).
// -----------------------------------------------------------------------------
// Strapi auto-generates small (500w), medium (750w) and large (1000w) copies of
// every upload. This returns a src plus a srcSet listing those copies, so the
// browser downloads the smallest one that still looks sharp on the visitor's
// screen instead of one fixed size. Works with a static export (plain <img>).
export function imageSet(media, preferred = 'medium') {
  if (!media) return null;
  const fmt = media.formats || {};

  const sized = ['small', 'medium', 'large']
    .map((k) => fmt[k])
    .filter((f) => f && f.url && f.width);

  const main = fmt[preferred] || fmt.medium || fmt.small || media;
  if (!main || !main.url) return null;

  return {
    src: mediaURL(main.url),
    srcSet:
      sized.length > 1
        ? sized.map((f) => `${mediaURL(f.url)} ${f.width}w`).join(', ')
        : undefined,
    width: main.width || undefined,
    height: main.height || undefined,
    alt: media.alternativeText || '',
  };
}
