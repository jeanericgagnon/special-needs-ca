import { NextResponse } from 'next/server';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { getProgramBySlug, navigatorDb, getProgramApplicationSteps, getProgramDocumentRequirements, DbProgram } from '@/lib/db';
import { evaluateSeoPolicy, shouldIncludeInSitemap, assertNoPlaceholderData } from '@/lib/seo-policy';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';

  const verifiedStatesList = ['california', 'texas', 'florida', 'pennsylvania', 'new-york', 'ohio', 'illinois'];
  const stateProgramsMap: Record<string, DbProgram[]> = {};
  for (const st of verifiedStatesList) {
    try {
      stateProgramsMap[st] = await navigatorDb.prepare('SELECT * FROM programs WHERE state_id = ?').all(st) as DbProgram[];
    } catch {
      stateProgramsMap[st] = [];
    }
  }

  const rawStaticUrls = [
    { loc: '/', changefreq: 'monthly', priority: '1.0', routeType: 'static-page', stateId: '' },
    { loc: '/benefits', changefreq: 'weekly', priority: '0.9', routeType: 'static-page', stateId: '' },
    { loc: '/advocates', changefreq: 'weekly', priority: '0.7', routeType: 'static-page', stateId: '' },
    { loc: '/forms', changefreq: 'weekly', priority: '0.8', routeType: 'static-page', stateId: '' },
    
    // State Hubs
    { loc: '/benefits/california', changefreq: 'weekly', priority: '0.9', routeType: 'state-hub', stateId: 'california' },
    { loc: '/counties/california', changefreq: 'weekly', priority: '0.85', routeType: 'state-hub', stateId: 'california' },
    { loc: '/benefits/texas', changefreq: 'weekly', priority: '0.9', routeType: 'state-hub', stateId: 'texas' },
    { loc: '/counties/texas', changefreq: 'weekly', priority: '0.85', routeType: 'state-hub', stateId: 'texas' },
    { loc: '/benefits/florida', changefreq: 'weekly', priority: '0.9', routeType: 'state-hub', stateId: 'florida' },
    { loc: '/counties/florida', changefreq: 'weekly', priority: '0.85', routeType: 'state-hub', stateId: 'florida' },
    { loc: '/benefits/pennsylvania', changefreq: 'weekly', priority: '0.9', routeType: 'state-hub', stateId: 'pennsylvania' },
    { loc: '/counties/pennsylvania', changefreq: 'weekly', priority: '0.85', routeType: 'state-hub', stateId: 'pennsylvania' },
    { loc: '/benefits/new-york', changefreq: 'weekly', priority: '0.9', routeType: 'state-hub', stateId: 'new-york' },
    { loc: '/counties/new-york', changefreq: 'weekly', priority: '0.85', routeType: 'state-hub', stateId: 'new-york' },
    { loc: '/benefits/ohio', changefreq: 'weekly', priority: '0.9', routeType: 'state-hub', stateId: 'ohio' },
    { loc: '/counties/ohio', changefreq: 'weekly', priority: '0.85', routeType: 'state-hub', stateId: 'ohio' },
    { loc: '/benefits/illinois', changefreq: 'weekly', priority: '0.9', routeType: 'state-hub', stateId: 'illinois' },
    { loc: '/counties/illinois', changefreq: 'weekly', priority: '0.85', routeType: 'state-hub', stateId: 'illinois' }
  ];

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
    } else {
      const stateProgs = stateProgramsMap[url.stateId] || [];
      const dates = stateProgs.map(p => p.last_verified_date).filter(Boolean) as string[];
      const minDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
      const scores = stateProgs.map(p => p.confidence_score).filter(s => s !== null && s !== undefined);
      const avgScore = scores.length > 0 ? (scores.reduce((sum, s) => sum + s, 0) / scores.length) / 5.0 : null;

      const policy = evaluateSeoPolicy({
        routeType: 'state-hub',
        stateId: url.stateId,
        confidenceScore: avgScore,
        hasOfficialSource: stateProgs.length > 0 && stateProgs.some(p => !!p.official_source_url),
        lastVerifiedDate: minDate,
        hasNoPlaceholderData: stateProgs.every(p => assertNoPlaceholderData(JSON.stringify(p)))
      });
      if (shouldIncludeInSitemap(policy)) {
        filteredStaticUrls.push({ ...url, lastmod: minDate });
      }
    }
  }

  const xmlUrls = filteredStaticUrls.map(url => {
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
      let hasNoPlaceholderData = true;
      let confidenceScore: number | null = null;
      let stateId = 'california';

      if (prog) {
        stateId = prog.state_id || 'california';
        const progIdStr = String(prog.id);
        const ruleCount = await navigatorDb.prepare('SELECT COUNT(*) as count FROM program_eligibility_rules WHERE program_id = ?').get(progIdStr) as { count: number } | undefined;
        hasEligibilityRules = (ruleCount?.count || 0) > 0;
        hasApplicationSteps = (await getProgramApplicationSteps(progIdStr)).length > 0;
        hasDocuments = (await getProgramDocumentRequirements(progIdStr)).length > 0;
        hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(prog));
        confidenceScore = prog.confidence_score !== null && prog.confidence_score !== undefined
          ? Number(prog.confidence_score) / 5.0
          : null;
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
      const dates = statePrograms.map(p => p.last_verified_date).filter(Boolean) as string[];
      const minDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
      const scores = statePrograms.map(p => p.confidence_score).filter(s => s !== null && s !== undefined);
      const confidenceScore = scores.length > 0 ? (scores.reduce((sum, s) => sum + s, 0) / scores.length) / 5.0 : null;

      const policy = evaluateSeoPolicy({
        routeType: 'condition-hub',
        stateId: 'california',
        diagnosisId: cluster.slug,
        confidenceScore,
        hasOfficialSource: statePrograms.length > 0 && statePrograms.some(p => !!p.official_source_url),
        lastVerifiedDate: minDate,
        hasNoPlaceholderData: statePrograms.every(p => assertNoPlaceholderData(JSON.stringify(p)))
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
