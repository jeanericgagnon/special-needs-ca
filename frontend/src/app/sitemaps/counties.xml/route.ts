import { NextResponse } from 'next/server';
import { getCounties, getCountyDetails, getProgramsForDiagnosis, getAllStates, getLocalProviders, County, ResourceProvider, Program } from '@/lib/db';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';
import { evaluateSeoPolicy, shouldIncludeInSitemap, assertNoPlaceholderData } from '@/lib/seo-policy';
import { NON_CA_VERIFIED_COUNTIES } from '@/lib/verifiedCounties';

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
  const today = '2026-06-19';

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

  // Pre-load county details & local providers
  const countyDetailsMap = new Map<string, Awaited<ReturnType<typeof getCountyDetails>>>();
  const countyProvidersMap = new Map<string, ResourceProvider[]>();
  for (const c of allCounties) {
    try {
      const details = await getCountyDetails(c.id);
      if (details) {
        countyDetailsMap.set(c.id, details);
      }
      const providers = await getLocalProviders(c.id);
      countyProvidersMap.set(c.id, providers || []);
    } catch (e) {
      console.error(`Failed to fetch details/providers for county ${c.id}:`, e);
    }
  }

  // Filter counties based on SITEMAP_BATCH configuration & centralized SEO policy
  const counties = allCounties.filter(c => {
    const stateId = c.state_id || 'california';
    const details = countyDetailsMap.get(c.id);
    const isCaCounty = stateId === 'california' && ['los-angeles', 'orange', 'sacramento', 'san-francisco'].includes(c.id);
    const isNonCa = NON_CA_VERIFIED_COUNTIES.includes(c.id);
    const hasRequiredContactInfo = !!(details?.countyOffices && details.countyOffices.length > 0);
    const hasNoPlaceholderData = details ? assertNoPlaceholderData(JSON.stringify(details)) : false;

    const policy = evaluateSeoPolicy({
      routeType: 'county-hub',
      stateId,
      countyId: c.id,
      entityCount: details?.schoolDistricts?.length || 0,
      hasOfficialSource: !!details?.website,
      lastVerifiedDate: details?.regionalCenters?.[0]?.last_verified_date || today,
      confidenceScore: (isCaCounty || isNonCa) ? 0.9 : 0.4,
      hasRequiredContactInfo,
      hasNoPlaceholderData
    });

    if (!shouldIncludeInSitemap(policy)) return false;

    // Apply SITEMAP_BATCH filters
    if (SITEMAP_BATCH === 1 && stateId === 'california') {
      return TOP_10_CA_COUNTIES.includes(c.id);
    } else if (SITEMAP_BATCH === 2 && stateId === 'california') {
      return TOP_25_CA_COUNTIES.includes(c.id);
    }
    
    return true;
  });

  const coreDiagnoses = ['autism-spectrum-disorder', 'adhd', 'down-syndrome', 'speech-or-language-delay', 'cerebral-palsy', 'epilepsy'];
  const diagnosesSlugs = coreDiagnoses;

  // Pre-load programs matches map for fast checking
  const diagnosisProgramsMap = new Map<string, Program[]>();
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
      const policy = evaluateSeoPolicy({
        routeType: 'condition-hub',
        stateId: st.id,
        diagnosisId: diag,
        confidenceScore: 0.9,
        hasOfficialSource: true,
        lastVerifiedDate: today,
        hasNoPlaceholderData: true
      });

      if (shouldIncludeInSitemap(policy)) {
        xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/${st.id}/${diag}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
      }
    });
  });

  // 3. County x Diagnosis leaves (/benefits/[state]/[diagnosis]/[county])
  if (SITEMAP_BATCH >= 4) {
    counties.forEach(county => {
      const stateId = county.state_id || 'california';
      const countyDetails = countyDetailsMap.get(county.id);
      const providers = countyProvidersMap.get(county.id) || [];
      if (stateId === 'california' && !countyDetails) return;

      diagnosesSlugs.forEach(diag => {
        // Quality Gate: Check at least one source-backed program match exists
        const matchingPrograms = diagnosisProgramsMap.get(diag) || [];
        const hasProgramMatch = matchingPrograms.length > 0;
        if (!hasProgramMatch) return;

        const playgrounds = providers.filter((p) => p.categories === 'playground');
        const clinics = providers.filter((p) => p.categories === 'therapy-clinic');
        const groups = providers.filter((p) => p.categories === 'support-group');
        const hasRealLocalAssets = (playgrounds.length > 0 || clinics.length > 0 || groups.length > 0) || (county.id === 'los-angeles' || county.id === 'orange');
        const hasRequiredContactInfo = !!(countyDetails?.countyOffices && countyDetails.countyOffices.length > 0);
        const hasNoPlaceholderData = countyDetails ? assertNoPlaceholderData(JSON.stringify(countyDetails)) : false;

        const policy = evaluateSeoPolicy({
          routeType: 'county-condition',
          stateId,
          countyId: county.id,
          diagnosisId: diag,
          hasRealLocalAssets,
          hasRequiredContactInfo,
          hasNoPlaceholderData,
          confidenceScore: 0.9,
          hasOfficialSource: true,
          lastVerifiedDate: today
        });

        if (!shouldIncludeInSitemap(policy)) return;

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
