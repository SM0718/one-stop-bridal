import { useEffect } from 'react';

interface MetaOptions {
  title: string;
  description?: string;
  /** Path only, e.g. /collections/bridal — combined with the canonical origin */
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  /** Structured data injected as JSON-LD */
  jsonLd?: Record<string, unknown> | null;
  noIndex?: boolean;
}

const SITE_NAME = 'One Stop Bridal';
const ORIGIN = 'https://onestopbridal.example';

function setMeta(attr: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setLink(rel: string, href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Per-page metadata. A dependency-free equivalent of a head manager: sets the
 * title, description, canonical, OpenGraph tags and optional JSON-LD, and
 * cleans the JSON-LD up on unmount.
 */
export function useDocumentMeta({
  title,
  description,
  canonicalPath,
  image,
  type = 'website',
  jsonLd = null,
  noIndex = false,
}: MetaOptions): void {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', SITE_NAME);

    const canonical = `${ORIGIN}${canonicalPath ?? '/'}`;
    setLink('canonical', canonical);
    setMeta('property', 'og:url', canonical);

    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
      setMeta('name', 'twitter:card', 'summary_large_image');
    }

    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    if (!jsonLd) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    script.dataset.pageSchema = 'true';
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [title, description, canonicalPath, image, type, jsonLd, noIndex]);
}

/** Shared schema helpers so page components stay readable. */
export const schema = {
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: ORIGIN,
    description:
      'A wedding marketplace and planning platform for weddings across faiths and cultures.',
  }),
  breadcrumbs: (items: { name: string; href: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${ORIGIN}${item.href}`,
    })),
  }),
  product: (input: {
    name: string;
    description: string;
    code: string;
    retailer: string;
    price: number | null;
    currency: string;
    image?: string;
    available: boolean;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    sku: input.code,
    brand: { '@type': 'Brand', name: input.retailer },
    ...(input.image ? { image: input.image } : {}),
    ...(input.price !== null
      ? {
          offers: {
            '@type': 'Offer',
            price: input.price,
            priceCurrency: input.currency,
            availability: input.available
              ? 'https://schema.org/InStock'
              : 'https://schema.org/PreOrder',
          },
        }
      : {}),
  }),
  article: (input: { title: string; description: string; author: string; published: string }) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    author: { '@type': 'Person', name: input.author },
    datePublished: input.published,
  }),
};
