import { NextResponse } from 'next/server';
import { getCounties, getCountyDetails, getProgramsForDiagnosis, getAllStates, County } from '@/lib/db';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';

// Sitemap expansion batch configuration
// 1 = Top 10 CA counties, 2 = Top 25 CA counties, 3 = All 58 CA counties, 4 = All CA + county x diagnosis leaves
const SITEMAP_BATCH = parseInt(process.env.SITEMAP_BATCH || '3', 10);

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

const NON_CA_VERIFIED_COUNTIES = [
  'travis-tx', 'harris-tx', 'miami-dade-fl', 'kings-ny', 'queens-ny'
];

// Strict quality gate helper for CA counties
function passesCountyQualityGate(details: any): boolean {
  if (!details) return false;
  
  // 1. Regional Center mapping exists
  const hasRc = details.regionalCenters && details.regionalCenters.length > 0;
  
  // 2. SELPA mapping exists
  const hasSelpa = details.selpas && details.selpas.length > 0;
  
  // 3. IHSS office exists (program_id = 'ihss-for-children')
  const hasIhss = details.countyOffices && details.countyOffices.some((o: any) => o.program_id === 'ihss-for-children');
  
  // 4. Medi-Cal office exists (program_id = 'medi-cal-for-kids-and-teens')
  const hasMediCal = details.countyOffices && details.countyOffices.some((o: any) => o.program_id === 'medi-cal-for-kids-and-teens');
  
  // 5. CCS office exists (program_id = 'california-childrens-services')
  const hasCcs = details.countyOffices && details.countyOffices.some((o: any) => o.program_id === 'california-childrens-services');
  
  // 6. At least one school district exists
  const hasDistrict = details.schoolDistricts && details.schoolDistricts.length > 0;
  
  // 7. At least one nonprofit organization exists
  const hasNonprofit = details.localOrganizations && details.localOrganizations.length > 0;

  // 8. Trust/source metadata exists (verification_status and data_origin are not null on offices)
  const hasMetadata = details.countyOffices && details.countyOffices.every((o: any) => o.verification_status && o.data_origin);

  return !!(hasRc && hasSelpa && hasIhss && hasMediCal && hasCcs && hasDistrict && hasNonprofit && hasMetadata);
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://california-navigator.org';
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

  // Pre-load all county details
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
    if (!isCa) {
      return NON_CA_VERIFIED_COUNTIES.includes(c.id);
    }

    // Apply strict quality gate for CA counties
    const details = countyDetailsMap.get(c.id);
    const passesGate = passesCountyQualityGate(details);
    if (!passesGate) return false;

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
  const diagnosesSlugs = DIAGNOSES.map(slugifyDiagnosis).filter(d => coreDiagnoses.includes(d));

  // Pre-load programs matches map for fast checking
  const diagnosisProgramsMap = new Map();
  for (const diag of DIAGNOSES) {
    const slug = slugifyDiagnosis(diag);
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
      const countyDetails = countyDetailsMap.get(county.id);
      if (!countyDetails) return;

      const stateId = county.state_id || 'california';

      diagnosesSlugs.forEach(diag => {
        // Quality Gate: Check at least one source-backed program match exists
        const matchingPrograms = diagnosisProgramsMap.get(diag) || [];
        const hasProgramMatch = matchingPrograms.length > 0;
        if (!hasProgramMatch) return;

        // Quality Gate: Check county passes quality gate (already verified in count loop above, but double check)
        if (stateId === 'california' && !passesCountyQualityGate(countyDetails)) return;

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
