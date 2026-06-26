import { NextResponse } from 'next/server';
import { CITIES } from '@/lib/cities';
import { getCounties, County } from '@/lib/db';
import { getSeoPolicyForRoute, shouldIncludeInSitemap } from '@/lib/seo-policy';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';

  let counties: County[] = [];
  try {
    counties = await getCounties();
  } catch (err) {
    console.error('Failed to get counties:', err);
    return new Response('Database error', { status: 500 });
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
      const policy = getSeoPolicyForRoute('city', {
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
