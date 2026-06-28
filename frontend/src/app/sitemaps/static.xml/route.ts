import { NextResponse } from 'next/server';
import { SEO_CLUSTERS, getClusterSourceConfidence, isPublicSourceBackedFormGuideSlug } from '@/lib/seo-data';
import { navigatorDb, Program, getCounties, getBulkCountyDetails, RegionalCenter, SchoolDistrict, CountyOffice, County } from '@/lib/db';
import { getSeoPolicyForRoute, shouldIncludeInSitemap, assertNoPlaceholderData, SEO_STATE_ALLOWLIST, normalizeConfidenceScore, hasOfficialProgramSource } from '@/lib/seo-policy';
import { CANONICAL_SITE_URL } from '@/lib/site-url';

interface StaticUrl {
  loc: string;
  changefreq: string;
  priority: string;
  routeType: string;
  stateId: string;
  lastmod?: string | null;
}

export async function GET() {
  const baseUrl = CANONICAL_SITE_URL;

  const stateProgramsMap: Record<string, Program[]> = {};
  for (const st of SEO_STATE_ALLOWLIST) {
    try {
      stateProgramsMap[st] = await navigatorDb.prepare(`
        SELECT * FROM programs
        WHERE state_id = ?
          AND COALESCE(display_status, 'published') = 'published'
      `).all(st) as Program[];
    } catch {
      stateProgramsMap[st] = [];
    }
  }

  const rawStaticUrls: StaticUrl[] = [
    { loc: '/', changefreq: 'monthly', priority: '1.0', routeType: 'static-page', stateId: '' },
    { loc: '/benefits', changefreq: 'weekly', priority: '0.9', routeType: 'static-page', stateId: '' },
    { loc: '/forms', changefreq: 'weekly', priority: '0.8', routeType: 'static-page', stateId: '' },
    { loc: '/ihss-behavior-log', changefreq: 'weekly', priority: '0.75', routeType: 'static-page', stateId: '' },
    { loc: '/iep-goals', changefreq: 'weekly', priority: '0.75', routeType: 'static-page', stateId: '' },
    { loc: '/regional-center-funding', changefreq: 'weekly', priority: '0.75', routeType: 'static-page', stateId: '' },
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
  const filteredStaticUrls: StaticUrl[] = [];
  for (const url of rawStaticUrls) {
    if (url.routeType === 'static-page') {
      const policy = getSeoPolicyForRoute('static-page', {
        path: url.loc
      }, {
        hasNoPlaceholderData: true
      });
      if (shouldIncludeInSitemap(policy)) {
        filteredStaticUrls.push({ ...url, lastmod: null });
      }
    } else if (url.routeType === 'state-hub') {
      const stateProgs = stateProgramsMap[url.stateId] || [];
      const dates = stateProgs.map((p: Program) => p.last_verified_date).filter(Boolean) as string[];
      const minDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
      const scores = stateProgs.map((p: Program) => normalizeConfidenceScore(p.confidence_score)).filter((s: number | null): s is number => s !== null);
      const avgScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;

      const policy = getSeoPolicyForRoute('state-hub', {
        stateId: url.stateId
      }, {
        entityCount: stateProgs.length,
        confidenceScore: avgScore,
        hasOfficialSource: stateProgs.length > 0 && stateProgs.some((p: Program) => !!p.source_url),
        lastVerifiedDate: minDate,
        hasNoPlaceholderData: stateProgs.every((p: Program) => assertNoPlaceholderData(JSON.stringify(p)))
      });
      if (shouldIncludeInSitemap(policy)) {
        filteredStaticUrls.push({ ...url, lastmod: minDate });
      }
    } else if (url.routeType === 'state-counties-hub') {
      const counties = await getCounties(url.stateId);
      const countyDetailsMap = await getBulkCountyDetails(url.stateId);
      
      let hasRealLocalAssets = false;
      let totalConfidence = 0;
      let confidenceCount = 0;
      let minDate: string | null = null;
      let hasOfficialSource = false;

      for (const c of counties) {
        const details = countyDetailsMap.get(c.id);
        if (!details) continue;

        const offices = details.countyOffices || [];
        const countyDistricts = details.schoolDistricts || [];
        const rcs = details.regionalCenters || [];

        const hasRequiredContactInfo = offices.length > 0;
        const hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(details));

        const rcDates = rcs.map((rc: RegionalCenter) => rc.last_verified_date).filter(Boolean) as string[];
        const sdDates = countyDistricts.map((sd: SchoolDistrict) => sd.last_verified_date).filter(Boolean) as string[];
        const coDates = offices.map((co: CountyOffice) => co.last_verified_date).filter(Boolean) as string[];
        const allDates = [...rcDates, ...sdDates, ...coDates];
        const lastVerDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;

        if (lastVerDate) {
          if (!minDate || lastVerDate < minDate) {
            minDate = lastVerDate;
          }
        }

        const rcScores = rcs.map((rc: RegionalCenter) => normalizeConfidenceScore(rc.confidence_score)).filter((s: number | null): s is number => s !== null);
        const sdScores = countyDistricts.map((sd: SchoolDistrict) => normalizeConfidenceScore(sd.confidence_score)).filter((s: number | null): s is number => s !== null);
        const coScores = offices.map((co: CountyOffice) => normalizeConfidenceScore(co.confidence_score)).filter((s: number | null): s is number => s !== null);
        const allScores = [...rcScores, ...sdScores, ...coScores];
        const confScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

        if (confScore !== null) {
          totalConfidence += confScore;
          confidenceCount++;
        }

        let countyHasOfficialSource = false;
        if (rcs.some((rc: RegionalCenter) => !!rc.source_url) || countyDistricts.some((sd: SchoolDistrict) => !!sd.source_url) || offices.some((co: CountyOffice) => !!co.source_url)) {
          countyHasOfficialSource = true;
          hasOfficialSource = true;
        }

        const countyPolicy = getSeoPolicyForRoute('county-hub', {
          stateId: url.stateId,
          countyId: c.id
        }, {
          entityCount: countyDistricts.length,
          hasOfficialSource: countyHasOfficialSource,
          lastVerifiedDate: lastVerDate,
          confidenceScore: confScore,
          hasRequiredContactInfo,
          hasNoPlaceholderData,
          hasRealLocalAssets: countyDistricts.length > 0 || offices.length > 0 || rcs.length > 0
        });

        if (countyPolicy.index) {
          hasRealLocalAssets = true;
        }
      }

      const avgConfidenceScore = confidenceCount > 0 ? totalConfidence / confidenceCount : null;

      const policy = getSeoPolicyForRoute('state-counties-hub', {
        stateId: url.stateId
      }, {
        entityCount: counties.length,
        hasOfficialSource,
        lastVerifiedDate: minDate,
        confidenceScore: avgConfidenceScore,
        hasRealLocalAssets,
        hasNoPlaceholderData: counties.every((c: County) => assertNoPlaceholderData(JSON.stringify(c)))
      });

      if (shouldIncludeInSitemap(policy)) {
        filteredStaticUrls.push({ ...url, lastmod: minDate });
      }
    }
  }

  const xmlUrls = filteredStaticUrls.map((url: StaticUrl) => {
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
      // Authored /programs/* guides are rendered from SEO_CLUSTERS and use static-page
      // metadata on the page route itself, so sitemap policy must match that behavior.
      const policy = getSeoPolicyForRoute('static-page', {
        path: `/programs/${cluster.slug}`
      }, {
        hasNoPlaceholderData: assertNoPlaceholderData(JSON.stringify(cluster)),
        hasOfficialSource: Array.isArray(cluster.officialSources) && cluster.officialSources.some((source) => hasOfficialProgramSource(source.url)),
        lastVerifiedDate: cluster.lastReviewedDate || null,
        confidenceScore: getClusterSourceConfidence(cluster)
      });

      if (shouldIncludeInSitemap(policy)) {
        const lastmodTag = cluster.lastReviewedDate ? `\n    <lastmod>${cluster.lastReviewedDate}</lastmod>` : '';
        clusterXmlUrls.push(`  <url>
    <loc>${baseUrl}/${cluster.category}/${cluster.slug}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      }
    } else if (cluster.category === 'conditions') {
      const statePrograms = stateProgramsMap['california'] || [];
      const dates = statePrograms.map((p: Program) => p.last_verified_date).filter(Boolean) as string[];
      const minDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
      const scores = statePrograms.map((p: Program) => normalizeConfidenceScore(p.confidence_score)).filter((s: number | null): s is number => s !== null);
      const confidenceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;

      const policy = getSeoPolicyForRoute('condition-hub', {
        stateId: 'california',
        diagnosisId: cluster.slug,
        path: `/conditions/${cluster.slug}`
      }, {
        confidenceScore,
        hasOfficialSource: statePrograms.length > 0 && statePrograms.some((p: Program) => !!p.source_url),
        lastVerifiedDate: minDate,
        hasNoPlaceholderData: statePrograms.every((p: Program) => assertNoPlaceholderData(JSON.stringify(p)))
      });

      if (shouldIncludeInSitemap(policy)) {
        const lastmodTag = minDate ? `\n    <lastmod>${minDate}</lastmod>` : '';
        clusterXmlUrls.push(`  <url>
    <loc>${baseUrl}/${cluster.category}/${cluster.slug}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      }
    } else if (['forms', 'deadlines', 'situations'].includes(cluster.category)) {
      if (cluster.category === 'forms' && !isPublicSourceBackedFormGuideSlug(cluster.slug)) {
        continue;
      }
      const policy = getSeoPolicyForRoute('static-page', {
        path: `/${cluster.category}/${cluster.slug}`
      }, {
        hasNoPlaceholderData: assertNoPlaceholderData(JSON.stringify(cluster)),
        hasOfficialSource: Array.isArray(cluster.officialSources) && cluster.officialSources.some((source) => hasOfficialProgramSource(source.url)),
        lastVerifiedDate: cluster.lastReviewedDate || null,
        confidenceScore: getClusterSourceConfidence(cluster)
      });

      if (shouldIncludeInSitemap(policy)) {
        const lastmodTag = cluster.lastReviewedDate ? `\n    <lastmod>${cluster.lastReviewedDate}</lastmod>` : '';
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
