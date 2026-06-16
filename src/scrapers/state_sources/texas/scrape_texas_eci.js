import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../../../ca_disability_navigator.db');
const jsonPath = path.resolve(__dirname, '../../../../data/source_targets/unique_texas_eci_contractors.json');

const args = process.argv.slice(2);
let stateArg = '';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--state' && i + 1 < args.length) {
    stateArg = args[i + 1].toLowerCase();
  }
}

if (stateArg !== 'texas') {
  console.error('❌ Error: This script is only for --state texas');
  process.exit(1);
}

if (!fs.existsSync(jsonPath)) {
  console.error(`❌ Error: Input file not found at ${jsonPath}`);
  process.exit(1);
}

console.log('⏳ Reading ECI contractor JSON...');
const eciData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Found ${eciData.length} unique contractors in JSON.`);

console.log('⏳ Connecting to database...');
const db = new Database(dbPath);

console.log('⏳ Cleaning up old staged ECI records...');
db.prepare("DELETE FROM staging_scraped_state_resource_agencies WHERE state_id = 'texas' AND agency_type = 'eci'").run();

const insertStaged = db.prepare(`
  INSERT INTO staging_scraped_state_resource_agencies (
    source_url, source_name, source_type, scraped_at, state_id, county_id, confidence_score,
    extraction_notes, raw_text_excerpt, suggested_target_table, suggested_target_id, review_status,
    extracted_name, agency_type, counties_served, catchment_boundaries, extracted_website, extracted_phone,
    early_intervention_contact, agency_intake_contact, eligibility_info_page, services_page, appeals_info, evidence_level
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let stagedCount = 0;
const timestamp = new Date().toISOString();

// Define metro/large contractors for confidence boost (0.95 vs 0.90)
const metroContractors = [
  'eci-metrocare-services',
  'eci-the-warren-center',
  'eci-easterseals-greater-houston',
  'eci-bay-area-rehabilitation-center',
  'eci-the-harris-center',
  'eci-easterseals-rehabilitation-center',
  'eci-brighton-center',
  'eci-center-for-health-care-services',
  'eci-any-baby-can-of-austin'
];

try {
  db.transaction(() => {
    for (const item of eciData) {
      const countiesServed = item.counties.join(',');
      const catchmentBoundaries = `Serves counties in Texas: ${countiesServed}.`;
      const primaryCounty = item.counties[0] || '';
      
      const isMetro = metroContractors.includes(item.id);
      const confidence = isMetro ? 0.95 : 0.90;

      const rawTextExcerpt = `Name: ${item.name}
Phone: ${item.phone}
Website: ${item.website}
Address: ${item.address}
Fax: ${item.fax || 'N/A'}
Email: ${item.email || 'N/A'}
Counties Served: ${countiesServed}`;

      const extractionNotes = `Address: ${item.address}. Ingested from verified ECI contractor list.`;

      insertStaged.run(
        'https://citysearch.hhsc.state.tx.us/',
        'Texas HHS Early Childhood Intervention Program Search',
        'official_directory_extract', // source_type in staging, maps to data_origin in prod
        timestamp,
        'texas',
        primaryCounty,
        confidence,
        extractionNotes,
        rawTextExcerpt,
        'state_resource_agencies',
        item.id,
        'pending_review',
        item.name,
        'eci',
        countiesServed,
        catchmentBoundaries,
        item.website,
        item.phone,
        item.phone, // early_intervention_contact
        item.phone, // agency_intake_contact
        'https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services',
        'https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services',
        'https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services',
        'official_directory_extract' // evidence_level
      );
      stagedCount++;
    }
  })();
  console.log(`✓ Successfully staged ${stagedCount} ECI records in staging table.`);
} catch (err) {
  console.error('❌ Ingestion transaction failed:', err.message);
} finally {
  db.close();
}
