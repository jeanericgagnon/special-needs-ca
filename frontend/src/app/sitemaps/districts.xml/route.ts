import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';
import { SchoolDistrict, getProgramsForDiagnosis, getCountyDetails } from '@/lib/db';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://special-needs-ca.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  let districts: SchoolDistrict[] = [];
  try {
    const navigatorDbPath = path.resolve(process.cwd(), 'ca_disability_navigator.db');
    const db = new Database(navigatorDbPath, { readonly: true });
    // Only select school districts that have some special ed stats or contacts
    districts = db.prepare(`
      SELECT *
      FROM school_districts
      WHERE (spec_ed_contact_phone IS NOT NULL AND TRIM(spec_ed_contact_phone) != '')
         OR inclusion_rate_pct IS NOT NULL
    `).all() as SchoolDistrict[];
    db.close();
  } catch {
    console.error('Failed to query school districts for sitemap:');
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

  // Pre-load county details map for fast checking
  const countyDetailsMap = new Map();
  const countiesChecked = new Set<string>();
  for (const d of districts) {
    if (d.county_id && !countiesChecked.has(d.county_id)) {
      countiesChecked.add(d.county_id);
      try {
        const details = await getCountyDetails(d.county_id);
        if (details) {
          countyDetailsMap.set(d.county_id, details);
        }
      } catch (e) {
        console.error(`Failed to fetch county details for district: ${d.county_id}`, e);
      }
    }
  }

  const diagnosesSlugs = DIAGNOSES.map(slugifyDiagnosis);
  let xmlUrls = '';

  districts.forEach(d => {
    const countyDetails = countyDetailsMap.get(d.county_id);
    if (!countyDetails) return;

    // Must have Regional Center and county office details
    const hasRegionalCenter = countyDetails.regionalCenters && countyDetails.regionalCenters.length > 0;
    if (!hasRegionalCenter) return;

    const hasCountyOffice = (countyDetails.countyOffices && countyDetails.countyOffices.length > 0) || countyDetails.ihss_wage_rate;
    if (!hasCountyOffice) return;

    const districtSlug = d.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
    diagnosesSlugs.forEach(diag => {
      // Check program matches
      const matchingPrograms = diagnosisProgramsMap.get(diag) || [];
      if (matchingPrograms.length === 0) return;

      xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/california/${diag}/${districtSlug}</loc>
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
