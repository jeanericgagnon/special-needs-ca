import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../../ca_disability_navigator.db');

console.log('⏳ Programmatically generating and seeding all 58 California counties and local offices...');

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Comprehensive list of all 58 California Counties
const californiaCounties = [
  'Alameda', 'Alpine', 'Amador', 'Butte', 'Calaveras', 'Colusa', 'Contra Costa', 'Del Norte',
  'El Dorado', 'Fresno', 'Glenn', 'Humboldt', 'Imperial', 'Inyo', 'Kern', 'Kings', 'Lake',
  'Lassen', 'Los Angeles', 'Madera', 'Marin', 'Mariposa', 'Mendocino', 'Merced', 'Modoc',
  'Mono', 'Monterey', 'Napa', 'Nevada', 'Orange', 'Placer', 'Plumas', 'Riverside',
  'Sacramento', 'San Benito', 'San Bernardino', 'San Diego', 'San Francisco', 'San Joaquin',
  'San Luis Obispo', 'San Mateo', 'Santa Barbara', 'Santa Clara', 'Santa Cruz', 'Shasta',
  'Sierra', 'Siskiyou', 'Solano', 'Sonoma', 'Stanislaus', 'Sutter', 'Tehama', 'Trinity',
  'Tulare', 'Tuolumne', 'Ventura', 'Yolo', 'Yuba'
];

const insertCounty = db.prepare('INSERT OR REPLACE INTO counties (id, name, website) VALUES (?, ?, ?)');
const insertOffice = db.prepare('INSERT OR REPLACE INTO county_offices (id, county_id, program_id, office_name, address, phone, email, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

const seedAllCountiesTx = db.transaction((countiesNames) => {
  for (const name of countiesNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const website = `https://www.${slug}county.ca.gov`;
    
    // 1. Seed County Table
    insertCounty.run(slug, `${name} County`, website);

    // 2. Programmatically generate local IHSS office
    insertOffice.run(
      `off-${slug}-ihss`,
      slug,
      'ihss-for-children',
      `${name} County Social Services - IHSS Division`,
      `County Administration Building, ${name}, CA`,
      'Phone: (800) 510-2020',
      `ihss-intake@${slug}county.ca.gov`,
      `${website}/ihss`
    );

    // 3. Programmatically generate local Medi-Cal office
    insertOffice.run(
      `off-${slug}-medi-cal`,
      slug,
      'medi-cal-for-kids-and-teens',
      `${name} County Social Services - Medi-Cal Intake`,
      `County Administration Building, ${name}, CA`,
      'Phone: (800) 281-9799',
      `medi-cal@${slug}county.ca.gov`,
      'https://www.benefitscal.com'
    );

    // 4. Programmatically generate local California Children Services (CCS) office
    insertOffice.run(
      `off-${slug}-ccs`,
      slug,
      'california-childrens-services',
      `${name} County Health Department - CCS Program`,
      `County Public Health Center, ${name}, CA`,
      'Phone: (800) 288-4584',
      `ccs@${slug}county.ca.gov`,
      `${website}/public-health/ccs`
    );
  }
});

try {
  seedAllCountiesTx(californiaCounties);
  console.log(`🎉 SUCCESS: Generated and seeded all ${californiaCounties.length} California Counties and ${californiaCounties.length * 3} local offices into SQL database!`);
} catch (err) {
  console.error('❌ Database county generation failed:', err.message);
} finally {
  db.close();
}
