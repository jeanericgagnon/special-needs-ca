import { NextResponse } from 'next/server';
import { CITIES } from '@/lib/cities';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://special-needs-ca.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  const diagnosesSlugs = DIAGNOSES.map(slugifyDiagnosis);
  let xmlUrls = '';

  CITIES.forEach(city => {
    diagnosesSlugs.forEach(diag => {
      xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/${diag}/${city.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
