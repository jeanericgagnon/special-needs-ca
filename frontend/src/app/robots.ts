import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';
  
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/benefits',
        '/benefits/*',
        '/counties',
        '/counties/*',
        '/advocates',
        '/forms',
        '/forms/*'
      ],
      disallow: [
        '/dashboard',
        '/dashboard/*',
        '/login',
        '/register',
        '/api/*',
        '/_next/*'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
