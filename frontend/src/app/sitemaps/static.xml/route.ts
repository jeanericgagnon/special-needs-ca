import { NextResponse } from 'next/server';
import { SEO_CLUSTERS } from '@/lib/seo-data';
import { getProgramBySlug, navigatorDb, getProgramApplicationSteps, getProgramDocumentRequirements } from '@/lib/db';
import { evaluateSeoPolicy, shouldIncludeInSitemap, assertNoPlaceholderData } from '@/lib/seo-policy';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';
  const today = '2026-06-19';

  const rawStaticUrls = [
    { loc: '/', changefreq: 'monthly', priority: '1.0', lastmod: today, routeType: 'state-hub', stateId: 'california' },
    { loc: '/benefits', changefreq: 'weekly', priority: '0.9', lastmod: today, routeType: 'state-hub', stateId: 'california' },
    { loc: '/advocates', changefreq: 'weekly', priority: '0.7', lastmod: today, routeType: 'state-hub', stateId: 'california' },
    { loc: '/forms', changefreq: 'weekly', priority: '0.8', lastmod: today, routeType: 'state-hub', stateId: 'california' },
    
    // State Hubs
    { loc: '/benefits/california', changefreq: 'weekly', priority: '0.9', lastmod: today, routeType: 'state-hub', stateId: 'california' },
    { loc: '/counties/california', changefreq: 'weekly', priority: '0.85', lastmod: today, routeType: 'state-hub', stateId: 'california' },
    { loc: '/benefits/texas', changefreq: 'weekly', priority: '0.9', lastmod: today, routeType: 'state-hub', stateId: 'texas' },
    { loc: '/counties/texas', changefreq: 'weekly', priority: '0.85', lastmod: today, routeType: 'state-hub', stateId: 'texas' },
    { loc: '/benefits/florida', changefreq: 'weekly', priority: '0.9', lastmod: today, routeType: 'state-hub', stateId: 'florida' },
    { loc: '/counties/florida', changefreq: 'weekly', priority: '0.85', lastmod: today, routeType: 'state-hub', stateId: 'florida' },
    { loc: '/benefits/pennsylvania', changefreq: 'weekly', priority: '0.9', lastmod: today, routeType: 'state-hub', stateId: 'pennsylvania' },
    { loc: '/counties/pennsylvania', changefreq: 'weekly', priority: '0.85', lastmod: today, routeType: 'state-hub', stateId: 'pennsylvania' },
    { loc: '/benefits/new-york', changefreq: 'weekly', priority: '0.9', lastmod: today, routeType: 'state-hub', stateId: 'new-york' },
    { loc: '/counties/new-york', changefreq: 'weekly', priority: '0.85', lastmod: today, routeType: 'state-hub', stateId: 'new-york' },
    { loc: '/benefits/ohio', changefreq: 'weekly', priority: '0.9', lastmod: today, routeType: 'state-hub', stateId: 'ohio' },
    { loc: '/counties/ohio', changefreq: 'weekly', priority: '0.85', lastmod: today, routeType: 'state-hub', stateId: 'ohio' },
    { loc: '/benefits/illinois', changefreq: 'weekly', priority: '0.9', lastmod: today, routeType: 'state-hub', stateId: 'illinois' },
    { loc: '/counties/illinois', changefreq: 'weekly', priority: '0.85', lastmod: today, routeType: 'state-hub', stateId: 'illinois' }
  ];

  // We only include state hubs if they are verified states
  const filteredStaticUrls = [];
  for (const url of rawStaticUrls) {
    const policy = evaluateSeoPolicy({
      routeType: 'state-hub',
      stateId: url.stateId,
      confidenceScore: 0.95,
      hasOfficialSource: true,
      lastVerifiedDate: today,
      hasNoPlaceholderData: true
    });
    if (shouldIncludeInSitemap(policy)) {
      filteredStaticUrls.push(url);
    }
  }

  const xmlUrls = filteredStaticUrls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  // Filter dynamic programs & conditions cluster pages using evaluateSeoPolicy
  const clusterXmlUrls: string[] = [];

  for (const cluster of Object.values(SEO_CLUSTERS)) {
    if (cluster.category === 'programs') {
      const prog = await getProgramBySlug(cluster.slug);
      let hasEligibilityRules = false;
      let hasApplicationSteps = false;
      let hasDocuments = false;
      let hasNoPlaceholderData = true;
      let confidenceScore = 0.5;
      let stateId = 'california';

      if (prog) {
        stateId = prog.state_id || 'california';
        const progIdStr = String(prog.id);
        const ruleCount = await navigatorDb.prepare('SELECT COUNT(*) as count FROM program_eligibility_rules WHERE program_id = ?').get(progIdStr) as { count: number } | undefined;
        hasEligibilityRules = (ruleCount?.count || 0) > 0;
        hasApplicationSteps = (await getProgramApplicationSteps(progIdStr)).length > 0;
        hasDocuments = (await getProgramDocumentRequirements(progIdStr)).length > 0;
        hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(prog));
        confidenceScore = (prog.confidence_score || 5.0) / 5.0;
      }

      const policy = evaluateSeoPolicy({
        routeType: 'program-guide',
        stateId,
        programId: cluster.slug,
        hasOfficialSource: !!prog?.source_url,
        lastVerifiedDate: prog?.last_verified_date || today,
        confidenceScore,
        hasEligibilityRules,
        hasApplicationSteps,
        hasDocuments,
        hasNoPlaceholderData
      });

      if (shouldIncludeInSitemap(policy)) {
        clusterXmlUrls.push(`  <url>
    <loc>${baseUrl}/${cluster.category}/${cluster.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      }
    } else if (cluster.category === 'conditions') {
      const policy = evaluateSeoPolicy({
        routeType: 'condition-hub',
        stateId: 'california',
        diagnosisId: cluster.slug,
        confidenceScore: 0.9,
        hasOfficialSource: true,
        lastVerifiedDate: today,
        hasNoPlaceholderData: true
      });

      if (shouldIncludeInSitemap(policy)) {
        clusterXmlUrls.push(`  <url>
    <loc>${baseUrl}/${cluster.category}/${cluster.slug}</loc>
    <lastmod>${today}</lastmod>
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
