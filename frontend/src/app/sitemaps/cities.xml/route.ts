import { NextResponse } from 'next/server';
import { CITIES } from '@/lib/cities';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';
import { getCountyDetails, getProgramsForDiagnosis } from '@/lib/db';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://special-needs-ca.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  const diagnosesSlugs = DIAGNOSES.map(slugifyDiagnosis);

  // Pre-load programs matches map for fast checking
  const diagnosisProgramsMap = new Map();
  DIAGNOSES.forEach(diag => {
    const slug = slugifyDiagnosis(diag);
    try {
      const progs = getProgramsForDiagnosis(slug);
      diagnosisProgramsMap.set(slug, progs);
    } catch (e) {
      console.error(`Failed to fetch programs for diagnosis ${slug}:`, e);
    }
  });

  // Pre-load county details map for fast checking
  const countyDetailsMap = new Map();
  const countiesChecked = new Set<string>();
  CITIES.forEach(city => {
    if (city.countyId && !countiesChecked.has(city.countyId)) {
      countiesChecked.add(city.countyId);
      try {
        const details = getCountyDetails(city.countyId);
        if (details) {
          countyDetailsMap.set(city.countyId, details);
        }
      } catch (e) {
        console.error(`Failed to fetch county details for city county: ${city.countyId}`, e);
      }
    }
  });

  let xmlUrls = '';

  CITIES.forEach(city => {
    const countyDetails = countyDetailsMap.get(city.countyId);
    if (!countyDetails) return;

    // Check County Regional Center data exists
    const hasRegionalCenter = countyDetails.regionalCenters && countyDetails.regionalCenters.length > 0;
    if (!hasRegionalCenter) return;

    // Check IHSS or county office data exists
    const hasCountyOffice = (countyDetails.countyOffices && countyDetails.countyOffices.length > 0) || countyDetails.ihss_wage_rate;
    if (!hasCountyOffice) return;

    diagnosesSlugs.forEach(diag => {
      // Check program matches
      const matchingPrograms = diagnosisProgramsMap.get(diag) || [];
      if (matchingPrograms.length === 0) return;

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

