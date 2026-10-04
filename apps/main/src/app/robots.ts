import type { MetadataRoute } from 'next';

/* The public site is indexable; the prototype apps (zones) are not. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: ['/', '/launch', '/login'], disallow: ['/coordinator', '/admin', '/buyer', '/driver', '/farmer'] }] };
}
