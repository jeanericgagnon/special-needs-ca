import { NextResponse } from 'next/server';
import { navigatorDb } from '@/lib/db';
import { getSeoPolicyForRoute, shouldIncludeInSitemap } from '@/lib/seo-policy';

function getYmdDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';

  let activeDistricts: { id: string; state_id: string; last_verified_date: string | null; last_scraped_at: string | null }[] = [];
  try {
    activeDistricts = await navigatorDb.prepare(`
      SELECT DISTINCT sd.id, c.state_id, sd.last_verified_date, sd.last_scraped_at
      FROM school_districts sd
      JOIN counties c ON sd.county_id = c.id
      JOIN legal_decisions ld ON sd.id = ld.school_district_id
    `).all() as { id: string; state_id: string; last_verified_date: string | null; last_scraped_at: string | null }[];
  } catch (err) {
    console.error('Failed to query active school districts for sitemap:', err);
    return new Response('Database error', { status: 500 });
  }

  let xmlUrls = '';
  for (const d of activeDistricts) {
    const policy = getSeoPolicyForRoute('school-district', {
      stateId: d.state_id,
      programId: d.id
    }, {
      lastVerifiedDate: d.last_verified_date,
      hasNoPlaceholderData: true
    });

    if (shouldIncludeInSitemap(policy)) {
      const scrapedYmd = getYmdDate(d.last_scraped_at);
      const lastmodTag = scrapedYmd ? `\n    <lastmod>${scrapedYmd}</lastmod>` : '';
      xmlUrls += `  <url>
    <loc>${baseUrl}/school-districts/${d.state_id}/${d.id}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    }
  }

  if (!xmlUrls) {
    return new NextResponse('Sitemap is empty', { status: 404 });
  }

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
