import { NextResponse } from 'next/server';
import { getCounties, getCountyDetails, getProgramsForDiagnosis, getAllStates, getLocalProviders, County, ResourceProvider, Program, navigatorDb, DbProgram } from '@/lib/db';
import { evaluateSeoPolicy, shouldIncludeInSitemap, assertNoPlaceholderData, SeoPolicyResult } from '@/lib/seo-policy';
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

  const countiesPolicyMap = new Map<string, { policy: SeoPolicyResult, lastVerifiedDate: string | null }>();

  // Pre-calculate county-hub policy for each county
  for (const c of allCounties) {
    const stateId = c.state_id || 'california';
    const details = countyDetailsMap.get(c.id);
    const hasRequiredContactInfo = !!(details?.countyOffices && details.countyOffices.length > 0);
    const hasNoPlaceholderData = details ? assertNoPlaceholderData(JSON.stringify(details)) : false;

    let confidenceScore: number | null = null;
    let lastVerifiedDate: string | null = null;
    let hasOfficialSource = !!details?.website;

    if (details) {
      const rcDates = (details.regionalCenters || []).map(rc => rc.last_verified_date).filter(Boolean) as string[];
      const sdDates = (details.schoolDistricts || []).map(sd => sd.last_verified_date).filter(Boolean) as string[];
      const coDates = (details.countyOffices || []).map(co => co.last_verified_date).filter(Boolean) as string[];
      const allDates = [...rcDates, ...sdDates, ...coDates];
      lastVerifiedDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;

      const rcScores = (details.regionalCenters || []).map(rc => rc.confidence_score).filter(s => s !== null && s !== undefined);
      const sdScores = (details.schoolDistricts || []).map(sd => sd.confidence_score !== null && sd.confidence_score !== undefined ? sd.confidence_score / 5.0 : null).filter((s): s is number => s !== null);
      const coScores = (details.countyOffices || []).map(co => co.confidence_score !== null && co.confidence_score !== undefined ? co.confidence_score / 5.0 : null).filter((s): s is number => s !== null);
      const allScores = [...rcScores, ...sdScores, ...coScores];
      confidenceScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

      if ((details.regionalCenters || []).some(rc => !!rc.source_url) ||
          (details.schoolDistricts || []).some(sd => !!sd.source_url) ||
          (details.countyOffices || []).some(co => !!co.source_url)) {
        hasOfficialSource = true;
      }
    }

    const policy = evaluateSeoPolicy({
      routeType: 'county-hub',
      stateId,
      countyId: c.id,
      entityCount: details?.schoolDistricts?.length || 0,
      hasOfficialSource,
      lastVerifiedDate,
      confidenceScore,
      hasRequiredContactInfo,
      hasNoPlaceholderData
    });

    countiesPolicyMap.set(c.id, { policy, lastVerifiedDate });
  }

  // Filter counties based on SITEMAP_BATCH configuration & centralized SEO policy
  const counties = allCounties.filter(c => {
    const stateId = c.state_id || 'california';
    const policyInfo = countiesPolicyMap.get(c.id);
    if (!policyInfo || !shouldIncludeInSitemap(policyInfo.policy)) return false;

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
  
  // Omit lastmod for benefits index since it is static
  let xmlUrls = `  <url>
    <loc>${baseUrl}/benefits</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;

  // 1. County root directories (/benefits/[state]/[county])
  counties.forEach(county => {
    const stateId = county.state_id || 'california';
    const policyInfo = countiesPolicyMap.get(county.id);
    const lastmodTag = policyInfo?.lastVerifiedDate ? `\n    <lastmod>${policyInfo.lastVerifiedDate}</lastmod>` : '';
    xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/${stateId}/${county.id}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    xmlUrls += `  <url>
    <loc>${baseUrl}/counties/${stateId}/${county.id}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
  });

  // 2. Diagnosis directories (/benefits/[state]/[diagnosis])
  for (const st of states) {
    let statePrograms: DbProgram[] = [];
    try {
      statePrograms = await navigatorDb.prepare('SELECT * FROM programs WHERE state_id = ?').all(st.id) as DbProgram[];
    } catch {}
    const dates = statePrograms.map(p => p.last_verified_date).filter(Boolean) as string[];
    const minDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
    const scores = statePrograms.map(p => p.confidence_score).filter(s => s !== null && s !== undefined);
    const avgScore = scores.length > 0 ? (scores.reduce((sum, s) => sum + s, 0) / scores.length) / 5.0 : null;

    diagnosesSlugs.forEach(diag => {
      const policy = evaluateSeoPolicy({
        routeType: 'condition-hub',
        stateId: st.id,
        diagnosisId: diag,
        confidenceScore: avgScore,
        hasOfficialSource: statePrograms.length > 0 && statePrograms.some(p => !!p.official_source_url),
        lastVerifiedDate: minDate,
        hasNoPlaceholderData: statePrograms.every(p => assertNoPlaceholderData(JSON.stringify(p)))
      });

      if (shouldIncludeInSitemap(policy)) {
        const lastmodTag = minDate ? `\n    <lastmod>${minDate}</lastmod>` : '';
        xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/${st.id}/${diag}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
      }
    });
  }

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
        const hasRealLocalAssets = playgrounds.length > 0 || clinics.length > 0 || groups.length > 0;
        const hasRequiredContactInfo = !!(countyDetails?.countyOffices && countyDetails.countyOffices.length > 0);
        const hasNoPlaceholderData = countyDetails ? assertNoPlaceholderData(JSON.stringify(countyDetails)) : false;

        let confidenceScore: number | null = null;
        let lastVerifiedDate: string | null = null;
        let hasOfficialSource = !!countyDetails?.website;

        if (countyDetails) {
          const rcDates = (countyDetails.regionalCenters || []).map(rc => rc.last_verified_date).filter(Boolean) as string[];
          const sdDates = (countyDetails.schoolDistricts || []).map(sd => sd.last_verified_date).filter(Boolean) as string[];
          const coDates = (countyDetails.countyOffices || []).map(co => co.last_verified_date).filter(Boolean) as string[];
          const allDates = [...rcDates, ...sdDates, ...coDates];
          lastVerifiedDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;

          const rcScores = (countyDetails.regionalCenters || []).map(rc => rc.confidence_score).filter(s => s !== null && s !== undefined);
          const sdScores = (countyDetails.schoolDistricts || []).map(sd => sd.confidence_score !== null && sd.confidence_score !== undefined ? sd.confidence_score / 5.0 : null).filter((s): s is number => s !== null);
          const coScores = (countyDetails.countyOffices || []).map(co => co.confidence_score !== null && co.confidence_score !== undefined ? co.confidence_score / 5.0 : null).filter((s): s is number => s !== null);
          const allScores = [...rcScores, ...sdScores, ...coScores];
          confidenceScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

          if ((countyDetails.regionalCenters || []).some(rc => !!rc.source_url) ||
              (countyDetails.schoolDistricts || []).some(sd => !!sd.source_url) ||
              (countyDetails.countyOffices || []).some(co => !!co.source_url)) {
            hasOfficialSource = true;
          }
        }

        const policy = evaluateSeoPolicy({
          routeType: 'county-condition',
          stateId,
          countyId: county.id,
          diagnosisId: diag,
          hasRealLocalAssets,
          hasRequiredContactInfo,
          hasNoPlaceholderData,
          confidenceScore,
          hasOfficialSource,
          lastVerifiedDate
        });

        if (!shouldIncludeInSitemap(policy)) return;

        const lastmodTag = lastVerifiedDate ? `\n    <lastmod>${lastVerifiedDate}</lastmod>` : '';
        xmlUrls += `  <url>
      <loc>${baseUrl}/benefits/${stateId}/${diag}/${county.id}</loc>${lastmodTag}
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
