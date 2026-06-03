import { NextResponse } from 'next/server';
import { getCounties, County } from '@/lib/db';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://special-needs-ca.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  let counties: County[] = [];
  try {
    counties = getCounties();
  } catch {
    console.error('Failed to load counties for sitemap:');
    counties = [
      { id: 'los-angeles', name: 'Los Angeles', website: '' },
      { id: 'orange', name: 'Orange', website: '' }
    ];
  }

  const diagnosesSlugs = DIAGNOSES.map(slugifyDiagnosis);

  let xmlUrls = `  <url>
    <loc>${baseUrl}/benefits</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;

  // 1. County root directories (/benefits/[county])
  counties.forEach(county => {
    xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/${county.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  // 2. Diagnosis directories (/benefits/[diagnosis])
  diagnosesSlugs.forEach(diag => {
    xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/${diag}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  // 3. County x Diagnosis leaves (/benefits/[diagnosis]/[county])
  counties.forEach(county => {
    diagnosesSlugs.forEach(diag => {
      xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/${diag}/${county.id}</loc>
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
