import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';
import { SchoolDistrict } from '@/lib/db';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://special-needs-ca.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  let districts: SchoolDistrict[] = [];
  try {
    const navigatorDbPath = path.resolve(process.cwd(), 'ca_disability_navigator.db');
    const db = new Database(navigatorDbPath, { readonly: true });
    districts = db.prepare('SELECT * FROM school_districts').all() as SchoolDistrict[];
    db.close();
  } catch {
    console.error('Failed to query school districts for sitemap:');
  }

  const diagnosesSlugs = DIAGNOSES.map(slugifyDiagnosis);
  let xmlUrls = '';

  districts.forEach(d => {
    const districtSlug = d.name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
    diagnosesSlugs.forEach(diag => {
      xmlUrls += `  <url>
    <loc>${baseUrl}/benefits/${diag}/${districtSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    });
  });

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
