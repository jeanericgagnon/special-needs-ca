import { NextResponse } from 'next/server';
import { getCounties, getCountyDetails, getProgramsForDiagnosis, County } from '@/lib/db';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://special-needs-ca.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  let counties: County[] = [];
  try {
    counties = await getCounties();
  } catch {
    console.error('Failed to load counties for sitemap:');
    counties = [
      { id: 'los-angeles', name: 'Los Angeles', website: '' },
      { id: 'orange', name: 'Orange', website: '' }
    ];
  }

  const diagnosesSlugs = DIAGNOSES.map(slugifyDiagnosis);

  // Pre-load county details maps for fast checking
  const countyDetailsMap = new Map();
  for (const c of counties) {
    try {
      const details = await getCountyDetails(c.id);
      if (details) {
        countyDetailsMap.set(c.id, details);
      }
    } catch (e) {
      console.error(`Failed to fetch details for county ${c.id}:`, e);
    }
  }

  // Pre-load programs matches map for fast checking
  const diagnosisProgramsMap = new Map();
  for (const diag of DIAGNOSES) {
    const slug = slugifyDiagnosis(diag);
    try {
      const progs = await getProgramsForDiagnosis(slug);
      diagnosisProgramsMap.set(slug, progs);
    } catch (e) {
      console.error(`Failed to fetch programs for diagnosis ${slug}:`, e);
    }
  }

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
    xmlUrls += `  <url>
    <loc>${baseUrl}/counties/${county.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
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
    const countyDetails = countyDetailsMap.get(county.id);
    if (!countyDetails) return;

    // Check County Regional Center data exists
    const hasRegionalCenter = countyDetails.regionalCenters && countyDetails.regionalCenters.length > 0;
    if (!hasRegionalCenter) return;

    // Check IHSS or county office data exists
    const hasCountyOffice = (countyDetails.countyOffices && countyDetails.countyOffices.length > 0) || countyDetails.ihss_wage_rate;
    if (!hasCountyOffice) return;

    // Check at least one school district or SELPA record exists
    const hasSchoolOrSelpa = (countyDetails.schoolDistricts && countyDetails.schoolDistricts.length > 0) || (countyDetails.selpas && countyDetails.selpas.length > 0);
    if (!hasSchoolOrSelpa) return;

    diagnosesSlugs.forEach(diag => {
      // Check at least one source-backed program match exists
      const matchingPrograms = diagnosisProgramsMap.get(diag) || [];
      const hasProgramMatch = matchingPrograms.length > 0;
      if (!hasProgramMatch) return;

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
