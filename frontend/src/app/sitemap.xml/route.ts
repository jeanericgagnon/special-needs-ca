import { NextResponse } from 'next/server';
import { navigatorDb } from '@/lib/db';
import { SITEMAP_CHILD_MANIFEST } from '@/lib/seoRouteManifest';
import { CANONICAL_SITE_URL } from '@/lib/site-url';

async function tableExists(tableName: string): Promise<boolean> {
  try {
    const row = await navigatorDb.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table' AND name = ?
    `).get(tableName) as { name?: string } | undefined;
    return Boolean(row?.name);
  } catch {
    return false;
  }
}

async function getGlobalSeoLastmod(): Promise<string | null> {
  try {
    const candidateTables = ['programs', 'school_districts', 'county_offices', 'regional_centers'];
    const existingTables: string[] = [];
    for (const tableName of candidateTables) {
      if (await tableExists(tableName)) {
        existingTables.push(tableName);
      }
    }

    if (existingTables.length === 0) {
      return null;
    }

    const unionSql = existingTables
      .map((tableName) => `SELECT last_verified_date FROM ${tableName}`)
      .join('\nUNION ALL\n');

    const result = await navigatorDb.prepare(`
      SELECT MAX(last_verified_date) as max_date
      FROM (
        ${unionSql}
      )
    `).get() as { max_date: string | null } | undefined;
    return result?.max_date || null;
  } catch (error) {
    console.error('Failed to derive sitemap lastmod:', error);
    return null;
  }
}

export async function GET() {
  const baseUrl = CANONICAL_SITE_URL;
  const lastmod = await getGlobalSeoLastmod();

  const body = SITEMAP_CHILD_MANIFEST
    .filter((child) => !child.hardBlocked)
    .map((child) => {
      const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
      return `  <sitemap>
    <loc>${baseUrl}${child.loc}</loc>${lastmodTag}
  </sitemap>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
