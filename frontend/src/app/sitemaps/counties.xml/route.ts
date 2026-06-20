import { NextResponse } from 'next/server';
import { getCounties, getCountyDetails, getProgramsForDiagnosis, getAllStates, County } from '@/lib/db';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';
import { getCountyDiagnosisTruthEligibility, getCountyTruthEligibility, isIndexableState } from '@/lib/publicTruth';

// Sitemap expansion batch configuration
// 1 = Top 10 CA counties, 2 = Top 25 CA counties, 3 = All 58 CA counties, 4 = All CA + county x diagnosis leaves
const SITEMAP_BATCH = parseInt(process.env.SITEMAP_BATCH || '4', 10);

const TOP_10_CA_COUNTIES = [
  'los-angeles', 'san-diego', 'orange', 'riverside', 'san-bernardino', 
  'santa-clara', 'alameda', 'sacramento', 'contra-costa', 'fresno'
];

const TOP_25_CA_COUNTIES = [
  ...TOP_10_CA_COUNTIES,
  'ventura', 'san-francisco', 'kern', 'san-mateo', 'san-joaquin', 
  'stanislaus', 'sonoma', 'solano', 'santa-barbara', 'tulare', 
  'monterey', 'placer', 'san-luis-obispo', 'santa-cruz', 'merced'
];

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';
  const today = '2026-06-08';

  let allCounties: County[] = [];
  try {
    allCounties = await getCounties();
  } catch (e) {
    console.error('Failed to load counties from database:', e);
    allCounties = [
      { id: 'los-angeles', name: 'Los Angeles', state_id: 'california', website: '' },
      { id: 'orange', name: 'Orange', state_id: 'california', website: '' }
    ];
  }

  // Pre-load county details for truth gating
  const countyDetailsMap = new Map();
  for (const c of allCounties) {
    try {
      const details = await getCountyDetails(c.id);
      if (details) {
        countyDetailsMap.set(c.id, details);
      }
    } catch (e) {
      console.error(`Failed to fetch details for county ${c.id}:`, e);
    }
  }

  // Filter counties based on SITEMAP_BATCH configuration & Quality Gates
  const counties = allCounties.filter(c => {
    const isCa = c.state_id === 'california';
    
    // Check if it's a verified non-CA county
    const details = countyDetailsMap.get(c.id);
    const truth = getCountyTruthEligibility(c.state_id || 'california', details);
    if (!truth.indexSafe) return false;

    // Apply SITEMAP_BATCH filters
    if (SITEMAP_BATCH === 1) {
      return TOP_10_CA_COUNTIES.includes(c.id);
    } else if (SITEMAP_BATCH === 2) {
      return TOP_25_CA_COUNTIES.includes(c.id);
    }
    
    // Batch 3 and 4 include all 58 CA counties that pass quality gates
    return true;
  });

  const coreDiagnoses = ['autism-spectrum-disorder', 'adhd', 'down-syndrome', 'speech-or-language-delay', 'cerebral-palsy', 'epilepsy'];
  const diagnosesSlugs = coreDiagnoses;

  // Pre-load programs matches map for fast checking
  const diagnosisProgramsMap = new Map();
  for (const slug of coreDiagnoses) {
    try {
      const progs = await getProgramsForDiagnosis(slug);
      diagnosisProgramsMap.set(slug, progs || []);
    } catch (e) {
      console.error(`Failed to fetch programs for diagnosis ${slug}:`, e);
    }
  }

  const states = await getAllStates();

  let xmlUrls = `  <url>
    <loc>${baseUrl}/benefits</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;

  // 1. County root directories (/benefits/[state]/[county])
  counties.forEach(county => {
    const stateId = county.state_id || 'california';
    xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/${stateId}/${county.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    xmlUrls += `  <url>
    <loc>${baseUrl}/counties/${stateId}/${county.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
  });

  // 2. Diagnosis directories (/benefits/[state]/[diagnosis])
  states.forEach(st => {
    diagnosesSlugs.forEach(diag => {
      xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/${st.id}/${diag}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });
  });

  // 3. County x Diagnosis leaves (/benefits/[state]/[diagnosis]/[county])
  // Only generated if SITEMAP_BATCH is 4 (county x diagnosis expansion)
  if (SITEMAP_BATCH >= 4) {
    counties.forEach(county => {
      const stateId = county.state_id || 'california';
      const countyDetails = countyDetailsMap.get(county.id);
      if (stateId === 'california' && !countyDetails) return;

      diagnosesSlugs.forEach(diag => {
        // Do not index Texas (or other non-California) county x diagnosis pages yet
        if (!isIndexableState(stateId)) return;

        // Quality Gate: Check at least one source-backed program match exists
        const matchingPrograms = diagnosisProgramsMap.get(diag) || [];
        const hasProgramMatch = matchingPrograms.length > 0;
        if (!hasProgramMatch) return;

        const truth = getCountyDiagnosisTruthEligibility(stateId, diag, county.id, countyDetails);
        if (!truth.indexSafe) return;

        xmlUrls += `  <url>
      <loc>${baseUrl}/benefits/${stateId}/${diag}/${county.id}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>\n`;
      });
    });
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
