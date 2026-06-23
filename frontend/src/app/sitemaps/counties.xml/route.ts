import { NextResponse } from 'next/server';
import { getCounties, getCountyDetails, getBulkCountyDetails, getProgramsForDiagnosis, getAllStates, County, Program, navigatorDb } from '@/lib/db';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';
import { getCountyDiagnosisTruthEligibility, getCountyTruthEligibility, isIndexableState } from '@/lib/publicTruth';
import { evaluateSeoPolicy, shouldIncludeInSitemap, assertNoPlaceholderData, normalizeConfidenceScore } from '@/lib/seo-policy';

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
  const countyDetailsMap = new Map();
  try {
    const states = await getAllStates();
    const indexableStates = states.filter(s => isIndexableState(s.id));
    
    const countiesPromises = indexableStates.map(s => getCounties(s.id));
    const countiesLists = await Promise.all(countiesPromises);
    allCounties = countiesLists.flat();

    for (const s of indexableStates) {
      const stateMap = await getBulkCountyDetails(s.id);
      for (const [key, val] of stateMap.entries()) {
        countyDetailsMap.set(key, val);
      }
    }
  } catch (e) {
    console.error('Failed to load counties or bulk details from database:', e);
    allCounties = [
      { id: 'los-angeles', name: 'Los Angeles', state_id: 'california', website: '' },
      { id: 'orange', name: 'Orange', state_id: 'california', website: '' }
    ];
    try {
      const la = await getCountyDetails('los-angeles');
      if (la) countyDetailsMap.set('los-angeles', la);
      const oc = await getCountyDetails('orange');
      if (oc) countyDetailsMap.set('orange', oc);
    } catch {}
  }

  // Filter counties using evaluateSeoPolicy
  const counties = allCounties.filter(c => {
    const details = countyDetailsMap.get(c.id);
    if (!details) return false;

    const offices = details.countyOffices || [];
    const countyDistricts = details.schoolDistricts || [];
    const rcs = details.regionalCenters || [];

    const hasRequiredContactInfo = offices.length > 0;
    const hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(details));

    const rcDates = rcs.map((rc: any) => rc.last_verified_date).filter(Boolean) as string[];
    const sdDates = countyDistricts.map((sd: any) => sd.last_verified_date).filter(Boolean) as string[];
    const coDates = offices.map((co: any) => co.last_verified_date).filter(Boolean) as string[];
    const allDates = [...rcDates, ...sdDates, ...coDates];
    const lastVerDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;

    const rcScores = rcs.map((rc: any) => normalizeConfidenceScore(rc.confidence_score)).filter((s: number | null): s is number => s !== null);
    const sdScores = countyDistricts.map((sd: any) => normalizeConfidenceScore(sd.confidence_score)).filter((s: number | null): s is number => s !== null);
    const coScores = offices.map((co: any) => normalizeConfidenceScore(co.confidence_score)).filter((s: number | null): s is number => s !== null);
    const allScores = [...rcScores, ...sdScores, ...coScores];
    const confScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

    let countyHasOfficialSource = false;
    if (rcs.some((rc: any) => !!rc.source_url) || countyDistricts.some((sd: any) => !!sd.source_url) || offices.some((co: any) => !!co.source_url)) {
      countyHasOfficialSource = true;
    }

    const stateId = c.state_id || 'california';

    const policy = evaluateSeoPolicy({
      routeType: 'county-hub',
      stateId,
      countyId: c.id,
      entityCount: countyDistricts.length,
      hasOfficialSource: countyHasOfficialSource,
      lastVerifiedDate: lastVerDate,
      confidenceScore: confScore,
      hasRequiredContactInfo,
      hasNoPlaceholderData,
      hasRealLocalAssets: countyDistricts.length > 0 || offices.length > 0 || rcs.length > 0
    });

    if (shouldIncludeInSitemap(policy)) {
      if (SITEMAP_BATCH === 1) {
        return TOP_10_CA_COUNTIES.includes(c.id);
      } else if (SITEMAP_BATCH === 2) {
        return TOP_25_CA_COUNTIES.includes(c.id);
      }
      return true;
    }
    return false;
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

  let xmlUrls = '';
  
  // Include /benefits index if it's evaluated safely
  const benefitsIndexPolicy = evaluateSeoPolicy({
    routeType: 'static-page',
    stateId: '',
    hasNoPlaceholderData: true
  });
  if (shouldIncludeInSitemap(benefitsIndexPolicy)) {
    xmlUrls += `  <url>
    <loc>${baseUrl}/benefits</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
  }

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
  for (const st of states) {
    const statePrograms = await navigatorDb.prepare('SELECT * FROM programs WHERE state_id = ?').all(st.id) as Program[];
    const dates = statePrograms.map((p: any) => p.last_verified_date).filter(Boolean) as string[];
    const minDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
    const scores = statePrograms.map((p: any) => normalizeConfidenceScore(p.confidence_score)).filter((s: number | null): s is number => s !== null);
    const confidenceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;

    for (const diag of diagnosesSlugs) {
      const policy = evaluateSeoPolicy({
        routeType: 'condition-hub',
        stateId: st.id,
        diagnosisId: diag,
        confidenceScore,
        hasOfficialSource: statePrograms.length > 0 && statePrograms.some((p: any) => !!p.official_source_url),
        lastVerifiedDate: minDate,
        hasNoPlaceholderData: statePrograms.every((p: any) => assertNoPlaceholderData(JSON.stringify(p)))
      });

      if (shouldIncludeInSitemap(policy)) {
        xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/${st.id}/${diag}</loc>
    <lastmod>${minDate || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
      }
    }
  }

  // 3. County x Diagnosis leaves (/benefits/[state]/[diagnosis]/[county])
  if (SITEMAP_BATCH >= 4) {
    for (const county of counties) {
      const stateId = county.state_id || 'california';
      const countyDetails = countyDetailsMap.get(county.id);
      if (stateId === 'california' && !countyDetails) continue;

      for (const diag of diagnosesSlugs) {
        // Do not index Texas (or other non-California) county x diagnosis pages yet
        if (!isIndexableState(stateId)) continue;

        // Quality Gate: Check at least one source-backed program match exists
        const matchingPrograms = diagnosisProgramsMap.get(diag) || [];
        const hasProgramMatch = matchingPrograms.length > 0;
        if (!hasProgramMatch) continue;

        const truth = getCountyDiagnosisTruthEligibility(stateId, diag, county.id, countyDetails);
        if (!truth.indexSafe) continue;

        // Evaluate using evaluateSeoPolicy for county-condition route type
        const sdList = countyDetails?.schoolDistricts || [];
        const coList = countyDetails?.countyOffices || [];
        const rcList = countyDetails?.regionalCenters || [];
        const rcScores = rcList.map((rc: any) => normalizeConfidenceScore(rc.confidence_score)).filter((s: number | null): s is number => s !== null);
        const sdScores = sdList.map((sd: any) => normalizeConfidenceScore(sd.confidence_score)).filter((s: number | null): s is number => s !== null);
        const coScores = coList.map((co: any) => normalizeConfidenceScore(co.confidence_score)).filter((s: number | null): s is number => s !== null);
        const allScores = [...rcScores, ...sdScores, ...coScores];
        const confScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

        const policy = evaluateSeoPolicy({
          routeType: 'county-condition',
          stateId,
          countyId: county.id,
          diagnosisId: diag,
          entityCount: sdList.length,
          confidenceScore: confScore,
          hasOfficialSource: rcList.some((rc: any) => !!rc.source_url) || sdList.some((sd: any) => !!sd.source_url) || coList.some((co: any) => !!co.source_url),
          lastVerifiedDate: today,
          hasRequiredContactInfo: coList.length > 0,
          hasNoPlaceholderData: assertNoPlaceholderData(JSON.stringify(countyDetails)),
          hasRealLocalAssets: sdList.length > 0 || coList.length > 0 || rcList.length > 0
        });

        if (shouldIncludeInSitemap(policy)) {
          xmlUrls += `  <url>
      <loc>${baseUrl}/benefits/${stateId}/${diag}/${county.id}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>\n`;
        }
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
