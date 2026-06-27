import { NextResponse } from 'next/server';
import { CITIES } from '@/lib/cities';
import { getCounties, County } from '@/lib/db';
import { evaluateSeoPolicy, shouldIncludeInSitemap } from '@/lib/seo-policy';
import { CANONICAL_SITE_URL } from '@/lib/site-url';

export async function GET() {
  const baseUrl = CANONICAL_SITE_URL;

  let counties: County[] = [];
  try {
    counties = await getCounties();
  } catch (err) {
    console.error('Failed to get counties:', err);
  }

  const countyStateMap = new Map<string, string>();
  for (const c of counties) {
    if (c.state_id) {
      countyStateMap.set(c.id, c.state_id);
    }
  }

  const coreDiagnoses = ['autism-spectrum-disorder', 'adhd', 'down-syndrome', 'speech-or-language-delay', 'cerebral-palsy', 'epilepsy'];

  let xmlUrls = '';
  for (const city of CITIES) {
    const stateId = countyStateMap.get(city.countyId);
    if (!stateId) continue;

    for (const diag of coreDiagnoses) {
      const policy = evaluateSeoPolicy({
        routeType: 'city',
        stateId: stateId,
        countyId: city.countyId,
        diagnosisId: diag
      });

      if (shouldIncludeInSitemap(policy)) {
        xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/${stateId}/${diag}/${city.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
      }
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
