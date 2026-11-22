import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = 'Suplementos Top Recoleta | Proteínas, Creatinas y Nutrición Deportiva CABA';
const DEFAULT_DESC = 'Tienda oficial de suplementos deportivos en Recoleta, CABA. Retirá en el día en Gimnasio Top Shape (Pres. José E. Uriburu 1163) o pedí con envío a todo el país. Star Nutrition, ENA Sport, Optimum Nutrition. 10% OFF transferencia.';
const BASE_URL = 'https://suplementos-top.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  jsonLd,
}) => {
  const fullTitle = title ? `${title} | Suplementos Top Recoleta` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESC;
  const fullCanonical = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : BASE_URL;
  const image = ogImage || DEFAULT_IMAGE;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attribute: string, key: string, content: string) => {
      let elem = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!elem) {
        elem = document.createElement('meta');
        elem.setAttribute(attribute, key);
        document.head.appendChild(elem);
      }
      elem.setAttribute('content', content);
    };

    // 3. Update Standard & OG Meta Tags
    setMetaTag('name', 'description', metaDescription);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', metaDescription);
    setMetaTag('property', 'og:url', fullCanonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', image);
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', metaDescription);
    setMetaTag('name', 'twitter:image', image);

    // 4. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonical);

    // 5. Inject Dynamic JSON-LD if provided
    let dynamicJsonLdScript = document.getElementById('dynamic-jsonld-schema');
    if (jsonLd) {
      if (!dynamicJsonLdScript) {
        dynamicJsonLdScript = document.createElement('script');
        dynamicJsonLdScript.id = 'dynamic-jsonld-schema';
        dynamicJsonLdScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(dynamicJsonLdScript);
      }
      dynamicJsonLdScript.textContent = JSON.stringify(jsonLd);
    } else if (dynamicJsonLdScript) {
      dynamicJsonLdScript.remove();
    }

    return () => {
      // Cleanup dynamic JSON-LD on unmount
      const scriptToRemove = document.getElementById('dynamic-jsonld-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [fullTitle, metaDescription, fullCanonical, image, ogType, jsonLd]);

  return null;
};
export default SEO;
