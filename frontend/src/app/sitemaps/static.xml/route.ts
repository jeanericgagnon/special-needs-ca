import { NextResponse } from 'next/server';
import { SEO_CLUSTERS } from '@/lib/seo-data';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';
  const today = '2026-05-31';

  const staticUrls = [
    { loc: '/', changefreq: 'monthly', priority: '1.0', lastmod: today },
    { loc: '/benefits', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/advocates', changefreq: 'weekly', priority: '0.7', lastmod: today },
    { loc: '/forms', changefreq: 'weekly', priority: '0.8', lastmod: today },
    // California
    { loc: '/benefits/california', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/california', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Texas
    { loc: '/benefits/texas', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/texas', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Texas Programs
    { loc: '/programs/tx-hcs', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: '/programs/tx-class', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: '/programs/tx-txhml', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: '/programs/tx-mdcp', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: '/programs/tx-eci', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: '/programs/tx-tea-sped', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: '/programs/tx-able', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: '/programs/tx-medicaid', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: '/programs/tx-yes', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: '/programs/tx-dbmd', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: '/programs/tx-starplus-hcbs', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: '/programs/tx-twc-vr', changefreq: 'weekly', priority: '0.8', lastmod: today },
    // Florida
    { loc: '/benefits/florida', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/florida', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Pennsylvania
    { loc: '/benefits/pennsylvania', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/pennsylvania', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // New York
    { loc: '/benefits/new-york', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/new-york', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Ohio
    { loc: '/benefits/ohio', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/ohio', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Illinois
    { loc: '/benefits/illinois', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/illinois', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Georgia
    { loc: '/benefits/georgia', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/georgia', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Maryland
    { loc: '/benefits/maryland', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/maryland', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Utah
    { loc: '/benefits/utah', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/utah', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // New Mexico
    { loc: '/benefits/new-mexico', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/new-mexico', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Oregon
    { loc: '/benefits/oregon', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/oregon', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Washington
    { loc: '/benefits/washington', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/washington', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Idaho
    { loc: '/benefits/idaho', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/idaho', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Wave 3 states:
    // South Carolina
    { loc: '/benefits/south-carolina', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/south-carolina', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // North Dakota
    { loc: '/benefits/north-dakota', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/north-dakota', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // West Virginia
    { loc: '/benefits/west-virginia', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/west-virginia', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Montana
    { loc: '/benefits/montana', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/montana', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Colorado
    { loc: '/benefits/colorado', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/colorado', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Louisiana
    { loc: '/benefits/louisiana', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/louisiana', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // South Dakota
    { loc: '/benefits/south-dakota', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/south-dakota', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Alabama
    { loc: '/benefits/alabama', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/alabama', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Wisconsin
    { loc: '/benefits/wisconsin', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/wisconsin', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Arkansas
    { loc: '/benefits/arkansas', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/arkansas', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Oklahoma
    { loc: '/benefits/oklahoma', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/oklahoma', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Wave 4 states:
    // North Carolina
    { loc: '/benefits/north-carolina', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/north-carolina', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Mississippi
    { loc: '/benefits/mississippi', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/mississippi', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Michigan
    { loc: '/benefits/michigan', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/michigan', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Minnesota
    { loc: '/benefits/minnesota', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/minnesota', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Wave 5 states:
    // Indiana
    { loc: '/benefits/indiana', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/indiana', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Nebraska
    { loc: '/benefits/nebraska', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/nebraska', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Tennessee
    { loc: '/benefits/tennessee', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/tennessee', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Virginia
    { loc: '/benefits/virginia', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/virginia', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Wave 6 states:
    // Arizona
    { loc: '/benefits/arizona', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/arizona', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Alaska
    { loc: '/benefits/alaska', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/alaska', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Connecticut
    { loc: '/benefits/connecticut', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/connecticut', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Delaware
    { loc: '/benefits/delaware', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/delaware', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Hawaii
    { loc: '/benefits/hawaii', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/hawaii', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Iowa
    { loc: '/benefits/iowa', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/iowa', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Kansas
    { loc: '/benefits/kansas', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/kansas', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Kentucky
    { loc: '/benefits/kentucky', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/kentucky', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Maine
    { loc: '/benefits/maine', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/maine', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Massachusetts
    { loc: '/benefits/massachusetts', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/massachusetts', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Missouri
    { loc: '/benefits/missouri', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/missouri', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Nevada
    { loc: '/benefits/nevada', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/nevada', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // New Hampshire
    { loc: '/benefits/new-hampshire', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/new-hampshire', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // New Jersey
    { loc: '/benefits/new-jersey', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/new-jersey', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Rhode Island
    { loc: '/benefits/rhode-island', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/rhode-island', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Vermont
    { loc: '/benefits/vermont', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/vermont', changefreq: 'weekly', priority: '0.85', lastmod: today },
    // Wyoming
    { loc: '/benefits/wyoming', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/counties/wyoming', changefreq: 'weekly', priority: '0.85', lastmod: today }
  ];

  const xmlUrls = staticUrls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  // Add the 12 dynamic SEO cluster pages
  const clusterUrls = Object.values(SEO_CLUSTERS).map(cluster => `  <url>
    <loc>${baseUrl}/${cluster.category}/${cluster.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
${clusterUrls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}

