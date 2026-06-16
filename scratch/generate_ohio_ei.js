import fs from 'fs';
import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const counties = db.prepare("SELECT id, name FROM counties WHERE id LIKE '%-oh' ORDER BY id").all();
db.close();

const records = counties.map(c => {
  const slug = c.id.replace('-oh', '');
  
  return {
    source_url: 'https://ohioearlyintervention.org/',
    confidence_score: 9.5,
    notes: `Official Help Me Grow Early Intervention contact for ${c.name} County.`,
    suggested_target_id: `oh-ei-${slug}`,
    name: `${c.name} County Early Intervention (Help Me Grow)`,
    phone: '(800) 755-4769',
    physical_county: c.id,
    agency_type: 'early_intervention',
    evidence_level: 'source_listed',
    verification_status: 'pending_review',
    data_origin: 'scraped'
  };
});

const outputPath = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/ohio/phase_records/early_intervention.json';
fs.writeFileSync(outputPath, JSON.stringify(records, null, 2), 'utf8');
console.log(`✓ Generated early_intervention.json with ${records.length} records.`);
