import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://california-navigator.org';
  
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/benefits/*/*',
        '/login',
        '/register'
      ],
      disallow: [
        '/dashboard',
        '/dashboard/*',
        '/api/*',
        '/_next/*'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
