import { NextResponse } from 'next/server';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { getProgramBySlug, navigatorDb, getProgramApplicationSteps, getProgramDocumentRequirements, Program, getCounties, getCountyDetails } from '@/lib/db';
import { evaluateSeoPolicy, shouldIncludeInSitemap, assertNoPlaceholderData, SEO_STATE_ALLOWLIST, normalizeConfidenceScore } from '@/lib/seo-policy';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';

  const stateProgramsMap: Record<string, Program[]> = {};
  for (const st of SEO_STATE_ALLOWLIST) {
    try {
      stateProgramsMap[st] = await navigatorDb.prepare('SELECT * FROM programs WHERE state_id = ?').all(st) as Program[];
    } catch {
      stateProgramsMap[st] = [];
    }
  }

  const rawStaticUrls = [
    { loc: '/', changefreq: 'monthly', priority: '1.0', routeType: 'static-page', stateId: '' },
    { loc: '/benefits', changefreq: 'weekly', priority: '0.9', routeType: 'static-page', stateId: '' },
    { loc: '/advocates', changefreq: 'weekly', priority: '0.7', routeType: 'static-page', stateId: '' },
    { loc: '/forms', changefreq: 'weekly', priority: '0.8', routeType: 'static-page', stateId: '' },
    { loc: '/school-districts', changefreq: 'weekly', priority: '0.8', routeType: 'static-page', stateId: '' },
  ];

  // Dynamically push all state hubs to rawStaticUrls
  for (const st of SEO_STATE_ALLOWLIST) {
    rawStaticUrls.push({
      loc: `/benefits/${st}`,
      changefreq: 'weekly',
      priority: '0.9',
      routeType: 'state-hub',
      stateId: st
    });
    rawStaticUrls.push({
      loc: `/counties/${st}`,
      changefreq: 'weekly',
      priority: '0.85',
      routeType: 'state-counties-hub',
      stateId: st
    });
  }

  // We only include state hubs if they are verified states
  const filteredStaticUrls = [];
  for (const url of rawStaticUrls) {
    if (url.routeType === 'static-page') {
      const policy = evaluateSeoPolicy({
        routeType: 'static-page',
        hasNoPlaceholderData: true
      });
      if (shouldIncludeInSitemap(policy)) {
        filteredStaticUrls.push({ ...url, lastmod: null });
      }
    } else if (url.routeType === 'state-hub') {
      const stateProgs = stateProgramsMap[url.stateId] || [];
      const dates = stateProgs.map((p: any) => p.last_verified_date).filter(Boolean) as string[];
      const minDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
      const scores = stateProgs.map((p: any) => normalizeConfidenceScore(p.confidence_score)).filter((s: number | null): s is number => s !== null);
      const avgScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;

      const policy = evaluateSeoPolicy({
        routeType: 'state-hub',
        stateId: url.stateId,
        entityCount: stateProgs.length,
        confidenceScore: avgScore,
        hasOfficialSource: stateProgs.length > 0 && stateProgs.some((p: any) => !!p.official_source_url),
        lastVerifiedDate: minDate,
        hasNoPlaceholderData: stateProgs.every((p: any) => assertNoPlaceholderData(JSON.stringify(p)))
      });
      if (shouldIncludeInSitemap(policy)) {
        filteredStaticUrls.push({ ...url, lastmod: minDate });
      }
    } else if (url.routeType === 'state-counties-hub') {
      const counties = await getCounties(url.stateId);
      
      let hasRealLocalAssets = false;
      let totalConfidence = 0;
      let confidenceCount = 0;
      let minDate: string | null = null;
      let hasOfficialSource = false;

      for (const c of counties) {
        const details = await getCountyDetails(c.id);
        if (!details) continue;

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

        if (lastVerDate) {
          if (!minDate || lastVerDate < minDate) {
            minDate = lastVerDate;
          }
        }

        const rcScores = rcs.map((rc: any) => normalizeConfidenceScore(rc.confidence_score)).filter((s: number | null): s is number => s !== null);
        const sdScores = countyDistricts.map((sd: any) => normalizeConfidenceScore(sd.confidence_score)).filter((s: number | null): s is number => s !== null);
        const coScores = offices.map((co: any) => normalizeConfidenceScore(co.confidence_score)).filter((s: number | null): s is number => s !== null);
        const allScores = [...rcScores, ...sdScores, ...coScores];
        const confScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

        if (confScore !== null) {
          totalConfidence += confScore;
          confidenceCount++;
        }

        let countyHasOfficialSource = false;
        if (rcs.some((rc: any) => !!rc.source_url) || countyDistricts.some((sd: any) => !!sd.source_url) || offices.some((co: any) => !!co.source_url)) {
          countyHasOfficialSource = true;
          hasOfficialSource = true;
        }

        const countyPolicy = evaluateSeoPolicy({
          routeType: 'county-hub',
          stateId: url.stateId,
          countyId: c.id,
          entityCount: countyDistricts.length,
          hasOfficialSource: countyHasOfficialSource,
          lastVerifiedDate: lastVerDate,
          confidenceScore: confScore,
          hasRequiredContactInfo,
          hasNoPlaceholderData
        });

        if (countyPolicy.index) {
          hasRealLocalAssets = true;
        }
      }

      const avgConfidenceScore = confidenceCount > 0 ? totalConfidence / confidenceCount : null;

      const policy = evaluateSeoPolicy({
        routeType: 'state-counties-hub',
        stateId: url.stateId,
        entityCount: counties.length,
        hasOfficialSource,
        lastVerifiedDate: minDate,
        confidenceScore: avgConfidenceScore,
        hasRealLocalAssets,
        hasNoPlaceholderData: counties.every((c: any) => assertNoPlaceholderData(JSON.stringify(c)))
      });

      if (shouldIncludeInSitemap(policy)) {
        filteredStaticUrls.push({ ...url, lastmod: minDate });
      }
    }
  }

  const xmlUrls = filteredStaticUrls.map((url: any) => {
    const lastmodTag = url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : '';
    return `  <url>
    <loc>${baseUrl}${url.loc}</loc>${lastmodTag}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  }).join('\n');

  // Filter dynamic programs & conditions cluster pages using evaluateSeoPolicy
  const clusterXmlUrls: string[] = [];

  for (const cluster of Object.values(SEO_CLUSTERS)) {
    if (cluster.category === 'programs') {
      const prog = await getProgramBySlug(cluster.slug);
      let hasEligibilityRules = false;
      let hasApplicationSteps = false;
      let hasDocuments = false;
      const hasNoPlaceholderData = true;
      let confidenceScore: number | null = null;
      let stateId = 'california';

      if (prog) {
        stateId = prog.state_id || 'california';
        const progIdStr = String(prog.id);
        const ruleCount = await navigatorDb.prepare('SELECT COUNT(*) as count FROM program_eligibility_rules WHERE program_id = ?').get(progIdStr) as { count: number } | undefined;
        hasEligibilityRules = (ruleCount?.count || 0) > 0;
        hasApplicationSteps = (await getProgramApplicationSteps(progIdStr)).length > 0;
        hasDocuments = (await getProgramDocumentRequirements(progIdStr)).length > 0;
        confidenceScore = normalizeConfidenceScore(prog.confidence_score);
      }

      const policy = evaluateSeoPolicy({
        routeType: 'program-guide',
        stateId,
        programId: cluster.slug,
        hasOfficialSource: !!prog?.source_url,
        lastVerifiedDate: prog?.last_verified_date || null,
        confidenceScore,
        hasEligibilityRules,
        hasApplicationSteps,
        hasDocuments,
        hasNoPlaceholderData
      });

      if (shouldIncludeInSitemap(policy)) {
        const lastmodTag = prog?.last_verified_date ? `\n    <lastmod>${prog.last_verified_date}</lastmod>` : '';
        clusterXmlUrls.push(`  <url>
    <loc>${baseUrl}/${cluster.category}/${cluster.slug}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      }
    } else if (cluster.category === 'conditions') {
      const statePrograms = stateProgramsMap['california'] || [];
      const dates = statePrograms.map((p: any) => p.last_verified_date).filter(Boolean) as string[];
      const minDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
      const scores = statePrograms.map((p: any) => normalizeConfidenceScore(p.confidence_score)).filter((s: number | null): s is number => s !== null);
      const confidenceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;

      const policy = evaluateSeoPolicy({
        routeType: 'condition-hub',
        stateId: 'california',
        diagnosisId: cluster.slug,
        confidenceScore,
        hasOfficialSource: statePrograms.length > 0 && statePrograms.some((p: any) => !!p.official_source_url),
        lastVerifiedDate: minDate,
        hasNoPlaceholderData: statePrograms.every((p: any) => assertNoPlaceholderData(JSON.stringify(p)))
      });

      if (shouldIncludeInSitemap(policy)) {
        const lastmodTag = minDate ? `\n    <lastmod>${minDate}</lastmod>` : '';
        clusterXmlUrls.push(`  <url>
    <loc>${baseUrl}/${cluster.category}/${cluster.slug}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
${clusterXmlUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
