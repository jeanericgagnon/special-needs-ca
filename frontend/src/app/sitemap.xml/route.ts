import { NextResponse } from 'next/server';
import { navigatorDb } from '@/lib/db';
import { getSeoPolicyForRoute, shouldIncludeInSitemap } from '@/lib/seo-policy';
import { CITIES } from '@/lib/cities';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';

  // 1. Derive lastmod dates from the max verification date of the database
  let maxDate = '2026-06-24';
  try {
    const result = await navigatorDb.prepare(`
      SELECT MAX(last_verified_date) as max_date 
      FROM (
        SELECT last_verified_date FROM programs
        UNION
        SELECT last_verified_date FROM school_districts
        UNION
        SELECT last_verified_date FROM county_offices
        UNION
        SELECT last_verified_date FROM regional_centers
      )
    `).get() as { max_date: string | null } | undefined;
    if (result?.max_date) {
      maxDate = result.max_date;
    }
  } catch (err) {
    console.error('Failed to query max verification date:', err);
  }

  // 2. Check if districts.xml has any indexable URLs
  let hasDistricts = false;
  try {
    const activeDistricts = await navigatorDb.prepare(`
      SELECT DISTINCT sd.id, c.state_id, sd.last_verified_date
      FROM school_districts sd
      JOIN counties c ON sd.county_id = c.id
      JOIN legal_decisions ld ON sd.id = ld.school_district_id
    `).all() as { id: string; state_id: string; last_verified_date: string | null }[];

    for (const d of activeDistricts) {
      const policy = getSeoPolicyForRoute('school-district', {
        stateId: d.state_id,
        programId: d.id
      }, {
        lastVerifiedDate: d.last_verified_date,
        hasNoPlaceholderData: true
      });
      if (shouldIncludeInSitemap(policy)) {
        hasDistricts = true;
        break;
      }
    }
  } catch (err) {
    console.error('Failed to check districts count for sitemap index:', err);
  }

  // 3. Check if cities.xml has any indexable URLs
  let hasCities = false;
  try {
    const counties = await navigatorDb.prepare('SELECT id, state_id FROM counties').all() as { id: string; state_id: string }[];
    const countyStateMap = new Map<string, string>();
    for (const c of counties) {
      if (c.state_id) {
        countyStateMap.set(c.id, c.state_id);
      }
    }
    const coreDiagnoses = ['autism-spectrum-disorder', 'adhd', 'down-syndrome', 'speech-or-language-delay', 'cerebral-palsy', 'epilepsy'];

    for (const city of CITIES) {
      const stateId = countyStateMap.get(city.countyId);
      if (!stateId) continue;
      for (const diag of coreDiagnoses) {
        const policy = getSeoPolicyForRoute('city', {
          stateId,
          countyId: city.countyId,
          diagnosisId: diag
        });
        if (shouldIncludeInSitemap(policy)) {
          hasCities = true;
          break;
        }
      }
      if (hasCities) break;
    }
  } catch (err) {
    console.error('Failed to check cities count for sitemap index:', err);
  }

  let sitemapsXml = `  <sitemap>
    <loc>${baseUrl}/sitemaps/static.xml</loc>
    <lastmod>${maxDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemaps/counties.xml</loc>
    <lastmod>${maxDate}</lastmod>
  </sitemap>`;

  if (hasDistricts) {
    sitemapsXml += `\n  <sitemap>
    <loc>${baseUrl}/sitemaps/districts.xml</loc>
    <lastmod>${maxDate}</lastmod>
  </sitemap>`;
  }

  if (hasCities) {
    sitemapsXml += `\n  <sitemap>
    <loc>${baseUrl}/sitemaps/cities.xml</loc>
    <lastmod>${maxDate}</lastmod>
  </sitemap>`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
