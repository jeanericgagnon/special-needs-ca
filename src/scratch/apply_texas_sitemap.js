import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const routePath = path.resolve(__dirname, '../../frontend/src/app/sitemaps/counties.xml/route.ts');
const updaterPath = path.resolve(__dirname, '../db/update_sitemap_counties.js');

const db = new Database(dbPath);

// Get all Texas counties
const counties = db.prepare("SELECT * FROM counties WHERE state_id = 'texas'").all();

// Exclude the 6 counties with county_seat_fallback offices (Brazos, Lavaca, McLennan, Tyler, Victoria, Wichita)
const excludedCounties = ['brazos-tx', 'lavaca-tx', 'mclennan-tx', 'tyler-tx', 'victoria-tx', 'wichita-tx'];
const verifiedTexasCounties = counties
  .map(c => c.id)
  .filter(id => !excludedCounties.includes(id));

console.log(`Verified Texas Counties Count: ${verifiedTexasCounties.length}`);

// Existing non-TX pilot counties from route.ts
const otherPilotCounties = [
  'miami-dade-fl', 'broward-fl', 'palm-beach-fl', 'hillsborough-fl', 'orange-fl',
  'pinellas-fl', 'duval-fl', 'lee-fl', 'polk-fl', 'brevard-fl', 'pasco-fl',
  'seminole-fl', 'alachua-fl', 'leon-fl',
  'kings-ny', 'queens-ny', 'new-york-ny', 'bronx-ny', 'richmond-ny',
  'nassau-ny', 'suffolk-ny', 'westchester-ny', 'erie-ny', 'monroe-ny',
  'onondaga-ny', 'albany-ny',
  'philadelphia-pa', 'allegheny-pa', 'montgomery-pa', 'bucks-pa', 'delaware-pa',
  'chester-pa', 'lancaster-pa', 'berks-pa',
  'cook-il', 'dupage-il', 'lake-il', 'will-il', 'kane-il',
  'mchenry-il', 'winnebago-il', 'sangamon-il', 'st-clair-il', 'madison-il',
  'franklin-oh', 'cuyahoga-oh', 'hamilton-oh', 'summit-oh', 'montgomery-oh',
  'lucas-oh', 'stark-oh',
  'fulton-ga', 'gwinnett-ga', 'cobb-ga', 'dekalb-ga', 'clayton-ga',
  'cherokee-ga', 'forsyth-ga', 'chatham-ga', 'richmond-ga', 'muscogee-ga', 'clarke-ga'
];

// Merge all verified counties
const allVerifiedCounties = [...verifiedTexasCounties, ...otherPilotCounties];

console.log(`Total Pilot Counties: ${allVerifiedCounties.length}`);

// 1. Update route.ts
let routeContent = fs.readFileSync(routePath, 'utf8');

const arrayStartMarker = 'const NON_CA_VERIFIED_COUNTIES = [';
const arrayStartIdx = routeContent.indexOf(arrayStartMarker);

if (arrayStartIdx === -1) {
  console.error("❌ Could not find NON_CA_VERIFIED_COUNTIES array in route.ts!");
  process.exit(1);
}

const arrayEndIdx = routeContent.indexOf('];', arrayStartIdx);
if (arrayEndIdx === -1) {
  console.error("❌ Could not find end of NON_CA_VERIFIED_COUNTIES array!");
  process.exit(1);
}

// We change const to export const to allow importing it in page.tsx
const newArrayStartMarker = 'export const NON_CA_VERIFIED_COUNTIES = [';
const formattedArray = allVerifiedCounties.map(c => `  '${c}'`).join(',\n');
const replacement = `${newArrayStartMarker}\n${formattedArray}\n`;

const newRouteContent = routeContent.substring(0, arrayStartIdx) + replacement + routeContent.substring(arrayEndIdx);
fs.writeFileSync(routePath, newRouteContent, 'utf8');
console.log('✓ Successfully updated route.ts with verified Texas counties and exported the array.');

// 2. Update update_sitemap_counties.js to keep the hardcoded list in sync
let updaterContent = fs.readFileSync(updaterPath, 'utf8');
const updaterStartMarker = 'const existingPilotCounties = [';
const updaterStartIdx = updaterContent.indexOf(updaterStartMarker);

if (updaterStartIdx !== -1) {
  const updaterEndIdx = updaterContent.indexOf('];', updaterStartIdx);
  if (updaterEndIdx !== -1) {
    const formattedUpdaterArray = allVerifiedCounties.map(c => `  '${c}'`).join(',\n');
    const updaterReplacement = `${updaterStartMarker}\n${formattedUpdaterArray}\n`;
    const newUpdaterContent = updaterContent.substring(0, updaterStartIdx) + updaterReplacement + updaterContent.substring(updaterEndIdx);
    fs.writeFileSync(updaterPath, newUpdaterContent, 'utf8');
    console.log('✓ Successfully updated update_sitemap_counties.js with verified Texas counties.');
  }
}

db.close();
