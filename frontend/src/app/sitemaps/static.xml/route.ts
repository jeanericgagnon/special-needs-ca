import { NextResponse } from 'next/server';
import { SEO_CLUSTERS } from '@/lib/seo-data';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://california-navigator.org';
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
    { loc: '/counties/pennsylvania', changefreq: 'weekly', priority: '0.85', lastmod: today }
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

