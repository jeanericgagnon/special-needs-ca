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

function loadPhaseRecords(stateId) {
  const phasePath = path.join(upgradesDir, stateId, 'phase_records', 'district_replacements.json');
  if (!fs.existsSync(phasePath)) return [];
  return JSON.parse(fs.readFileSync(phasePath, 'utf8'));
}

const states = db.prepare('SELECT id FROM states ORDER BY id').all();
const findExistingById = db.prepare('SELECT 1 FROM school_districts WHERE id = ?');
const insertDistrict = db.prepare(`
  INSERT INTO school_districts (
    id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website,
    total_enrollment, special_ed_pct, inclusion_rate_pct, self_contained_rate_pct,
    source_url, source_type, data_origin, verification_status, last_verified_date,
    last_scraped_at, confidence_score, evidence_level
  ) VALUES (
    @id, @county_id, @name, @spec_ed_contact_phone, @spec_ed_contact_email, @website,
    @total_enrollment, @special_ed_pct, @inclusion_rate_pct, @self_contained_rate_pct,
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
    const missingCountyIds = db.prepare(`
      SELECT c.id
      FROM counties c
      LEFT JOIN school_districts sd ON sd.county_id = c.id
      WHERE c.state_id = ?
      GROUP BY c.id
      HAVING COUNT(sd.id) = 0
      ORDER BY c.id
    `).all(state.id).map((row) => row.id);

    if (missingCountyIds.length === 0) continue;

    const phaseRecords = loadPhaseRecords(state.id);
    if (phaseRecords.length === 0) {
      for (const countyId of missingCountyIds) {
        skipped.push({ state: state.id, countyId, reason: 'missing_phase_records' });
      }
      continue;
    }

    for (const countyId of missingCountyIds) {
      const record = phaseRecords.find((item) => item.physical_county === countyId);
      if (!record) {
        skipped.push({ state: state.id, countyId, reason: 'missing_phase_record' });
        continue;
      }

      const targetId = record.suggested_target_id || `sd-${countyId}`;
      if (findExistingById.get(targetId)) {
        skipped.push({ state: state.id, countyId, reason: 'target_id_exists' });
        continue;
      }

      // Keep these hidden from public district surfaces until a trustworthy local
      // contact is confirmed, while still closing county-level coverage gaps.
      insertDistrict.run({
        id: targetId,
        county_id: countyId,
        name: record.name || `School district contact for ${countyId}`,
        spec_ed_contact_phone: '',
        spec_ed_contact_email: null,
        website: '',
        total_enrollment: null,
        special_ed_pct: null,
        inclusion_rate_pct: null,
        self_contained_rate_pct: null,
        source_url: record.source_url || null,
        source_type: record.source_type || record.evidence_level || 'district_replacement_artifact',
        data_origin: record.data_origin || 'scraped',
        verification_status: 'manual_review_required',
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

console.log(`Inserted ${inserted.length} missing district coverage rows from phase artifacts.`);
if (inserted.length > 0) {
  console.log(JSON.stringify(inserted.slice(0, 50), null, 2));
}
if (skipped.length > 0) {
  console.log(`Skipped ${skipped.length} counties.`);
}

db.close();
