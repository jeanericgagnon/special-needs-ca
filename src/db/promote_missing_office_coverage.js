import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const upgradesDir = path.join(repoRoot, 'data/state-upgrades');

const db = new Database(dbPath);

function getExpectedCountyCount(stateId, actualCount) {
  if (stateId === 'california') return 58;
  if (stateId === 'texas') return 254;
  return actualCount;
}

function getCoreOfficePrograms(stateId, stateCode) {
  if (stateId === 'california') {
    return ['medi-cal-for-kids-and-teens', 'california-childrens-services', 'hearing-aid-coverage', 'hcba', 'ihss-for-children'];
  }
  if (stateId === 'texas') {
    return ['tx-mdcp', 'tx-medicaid-chip'];
  }
  if (stateId === 'florida') {
    return ['fl-medicaid-dcf'];
  }
  if (stateId === 'new-york') {
    return ['ny-medicaid'];
  }
  if (stateId === 'pennsylvania') {
    return ['pa-medicaid'];
  }
  if (stateId === 'illinois') {
    return ['il-medicaid'];
  }
  if (stateId === 'ohio') {
    return ['oh-medicaid'];
  }
  if (stateId === 'georgia') {
    return ['ga-medicaid'];
  }
  return [`${stateCode}-medicaid`, `${stateCode}-personal-care`];
}

function loadPhaseRecords(stateId) {
  const phasePath = path.join(upgradesDir, stateId, 'phase_records', 'benefits_hhs.json');
  if (!fs.existsSync(phasePath)) return [];
  return JSON.parse(fs.readFileSync(phasePath, 'utf8'));
}

const states = db.prepare('SELECT id, code FROM states ORDER BY id').all();
const findExistingById = db.prepare('SELECT 1 FROM county_offices WHERE id = ?');
const insertOffice = db.prepare(`
  INSERT INTO county_offices (
    id, county_id, program_id, office_name, address, phone, email, website,
    source_url, source_type, data_origin, verification_status, last_verified_date,
    last_scraped_at, confidence_score, evidence_level
  ) VALUES (
    @id, @county_id, @program_id, @office_name, @address, @phone, @email, @website,
    @source_url, @source_type, @data_origin, @verification_status, @last_verified_date,
    @last_scraped_at, @confidence_score, @evidence_level
  )
`);

const inserted = [];
const skipped = [];
const now = new Date().toISOString();
const today = now.slice(0, 10);

const tx = db.transaction(() => {
  for (const state of states) {
    const counties = db.prepare('SELECT id FROM counties WHERE state_id = ? ORDER BY id').all(state.id).map((row) => row.id);
    const expectedCountyCount = getExpectedCountyCount(state.id, counties.length);
    const programs = getCoreOfficePrograms(state.id, state.code.toLowerCase());
    const officeRows = counties.length > 0
      ? db.prepare(`
          SELECT DISTINCT county_id
          FROM county_offices
          WHERE county_id IN (${counties.map(() => '?').join(',')})
            AND program_id IN (${programs.map(() => '?').join(',')})
        `).all(...counties, ...programs).map((row) => row.county_id)
      : [];

    const coveredCountyIds = new Set(officeRows);
    const missingCountyIds = counties.filter((countyId) => !coveredCountyIds.has(countyId));
    if (Math.max(0, expectedCountyCount - coveredCountyIds.size) === 0) continue;

    const phaseRecords = loadPhaseRecords(state.id);
    if (phaseRecords.length === 0) continue;

    for (const countyId of missingCountyIds) {
      const record = phaseRecords.find((item) => item.physical_county === countyId);
      if (!record) {
        skipped.push({ state: state.id, countyId, reason: 'missing_phase_record' });
        continue;
      }

      const targetId = record.suggested_target_id || `off-${countyId}-${programs[0]}`;
      if (findExistingById.get(targetId)) {
        skipped.push({ state: state.id, countyId, reason: 'target_id_exists' });
        continue;
      }

      insertOffice.run({
        id: targetId,
        county_id: countyId,
        program_id: programs[0],
        office_name: record.name || `${countyId} storefront office`,
        address: record.physical_address || record.extracted_address || '',
        phone: record.phone || '',
        email: record.email || null,
        website: record.source_url || '',
        source_url: record.source_url || '',
        source_type: record.source_type || record.evidence_level || 'official_locator_derived',
        data_origin: record.data_origin || 'scraped',
        verification_status: record.verification_status || 'manual_review_required',
        last_verified_date: today,
        last_scraped_at: now,
        confidence_score: record.confidence_score || null,
        evidence_level: record.evidence_level || null,
      });

      inserted.push({ state: state.id, countyId, id: targetId });
    }
  }
});

tx();

console.log(`Inserted ${inserted.length} missing office coverage rows from phase artifacts.`);
if (inserted.length > 0) {
  console.log(JSON.stringify(inserted.slice(0, 50), null, 2));
}
if (skipped.length > 0) {
  console.log(`Skipped ${skipped.length} counties.`);
}

db.close();
