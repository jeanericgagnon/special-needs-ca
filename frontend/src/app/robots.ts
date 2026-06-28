import { MetadataRoute } from 'next';
import { CANONICAL_SITE_URL } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = CANONICAL_SITE_URL;
  
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/forms',
        '/sitemap.xml',
        '/sitemaps/static.xml',
        '/sitemaps/counties.xml'
      ],
      disallow: [
        '/dashboard',
        '/dashboard/*',
        '/login',
        '/register',
        '/share',
        '/share/*',
        '/api/*'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
