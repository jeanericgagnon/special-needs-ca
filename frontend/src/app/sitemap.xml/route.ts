import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemaps/static.xml</loc>
    <lastmod>2026-05-31</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemaps/counties.xml</loc>
    <lastmod>2026-05-31</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemaps/districts.xml</loc>
    <lastmod>2026-06-21</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemaps/cities.xml</loc>
    <lastmod>2026-06-21</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
