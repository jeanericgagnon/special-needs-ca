import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://california-navigator.org';
  
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/benefits',
        '/benefits/*',
        '/counties',
        '/counties/*',
        '/advocates'
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
