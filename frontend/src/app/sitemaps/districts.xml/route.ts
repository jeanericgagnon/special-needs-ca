import { NextResponse } from 'next/server';
import { navigatorDb } from '@/lib/db';
import { evaluateSeoPolicy, shouldIncludeInSitemap } from '@/lib/seo-policy';
import { CANONICAL_SITE_URL } from '@/lib/site-url';

export async function GET() {
  const baseUrl = CANONICAL_SITE_URL;

  let activeDistricts: { id: string; state_id: string; last_verified_date: string | null }[] = [];
  try {
    const hasLegalDecisions = await navigatorDb.prepare(
      `SELECT 1 AS ok FROM sqlite_master WHERE type IN ('table', 'view') AND name = ?`
    ).all('legal_decisions') as Array<{ ok: number }>;

    if (hasLegalDecisions.length > 0) {
      activeDistricts = await navigatorDb.prepare(`
        SELECT DISTINCT sd.id, c.state_id, sd.last_verified_date
        FROM school_districts sd
        JOIN counties c ON sd.county_id = c.id
        JOIN legal_decisions ld ON sd.id = ld.school_district_id
      `).all() as { id: string; state_id: string; last_verified_date: string | null }[];
    }
  } catch (err) {
    console.error('Failed to query active school districts for sitemap:', err);
  }

  let xmlUrls = '';
  for (const d of activeDistricts) {
    const policy = evaluateSeoPolicy({
      routeType: 'school-district',
      stateId: d.state_id,
      programId: d.id,
      lastVerifiedDate: d.last_verified_date,
      hasNoPlaceholderData: true
    });

    if (shouldIncludeInSitemap(policy)) {
      const lastmodTag = d.last_verified_date ? `\n    <lastmod>${d.last_verified_date}</lastmod>` : '';
      xmlUrls += `  <url>
    <loc>${baseUrl}/school-districts/${d.state_id}/${d.id}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    }
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
