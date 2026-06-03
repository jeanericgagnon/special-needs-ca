import { NextResponse } from 'next/server';
import { SEO_CLUSTERS } from '@/lib/seo-data';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://special-needs-ca.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: '/', changefreq: 'monthly', priority: '1.0', lastmod: today },
    { loc: '/login', changefreq: 'yearly', priority: '0.3', lastmod: today },
    { loc: '/register', changefreq: 'yearly', priority: '0.5', lastmod: today }
  ];

  const xmlUrls = staticUrls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  // Add the 12 dynamic SEO cluster pages
  const clusterUrls = Object.values(SEO_CLUSTERS).map(cluster => `  <url>
    <loc>${baseUrl}/${cluster.category}/${cluster.slug}</loc>
    <lastmod>${cluster.lastReviewedDate || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
${clusterUrls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}

