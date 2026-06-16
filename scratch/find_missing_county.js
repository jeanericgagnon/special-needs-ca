import fs from 'fs';
import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const counties = db.prepare("SELECT id FROM counties WHERE id LIKE '%-ny'").all().map(c => c.id);
db.close();

const records = JSON.parse(fs.readFileSync('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/new-york/phase_records/benefits_hhs.json', 'utf8'));
const recordCounties = new Set(records.map(r => r.physical_county));

const curatedCounties = new Set([
  'albany-ny', 'bronx-ny', 'erie-ny', 'kings-ny', 'monroe-ny', 'nassau-ny',
  'new-york-ny', 'onondaga-ny', 'queens-ny', 'richmond-ny', 'suffolk-ny', 'westchester-ny'
]);

console.log("Missing counties (neither curated nor in records):");
for (const c of counties) {
  if (!curatedCounties.has(c) && !recordCounties.has(c)) {
    console.log(` - ${c}`);
  }
}
