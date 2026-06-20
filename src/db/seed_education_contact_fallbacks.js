import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const generatedAt = new Date().toISOString();
const today = generatedAt.slice(0, 10);

const dbPaths = [
  path.join(repoRoot, 'ca_disability_navigator.db'),
  path.join(repoRoot, 'frontend', 'ca_disability_navigator.db'),
].filter((dbPath) => fs.existsSync(dbPath));

function getSourceTargets(stateId) {
  const filePath = path.join(sourceTargetsDir, `${stateId}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function countyListIncludes(countiesServed, countyId) {
  return String(countiesServed || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .includes(countyId);
}

function buildFallbackFromRegionalAgency(agency, county) {
  return {
    id: `sd-fallback-${county.id}`,
    county_id: county.id,
    name: `${agency.name} (${county.name} County fallback)`,
    spec_ed_contact_phone: '',
    spec_ed_contact_email: '',
    website: agency.website,
    source_url: agency.source_url || agency.website,
    source_type: agency.source_type || 'official_directory',
    data_origin: 'regional_education_fallback',
    verification_status: agency.verification_status || 'source_listed',
    last_verified_date: today,
    last_scraped_at: generatedAt,
    confidence_score: agency.confidence_score || 8.5,
    evidence_level: 'regional_education_fallback',
  };
}

function buildFallbackFromSourceTarget(target, county, stateName) {
  return {
    id: `sd-fallback-${county.id}`,
    county_id: county.id,
    name: `${target.source_name || `${stateName} Special Education Support`} (${county.name} County fallback)`,
    spec_ed_contact_phone: '',
    spec_ed_contact_email: '',
    website: target.source_url,
    source_url: target.source_url,
    source_type: 'official_directory',
    data_origin: 'state_special_education_fallback',
    verification_status: 'source_listed',
    last_verified_date: today,
    last_scraped_at: generatedAt,
    confidence_score: 8.5,
    evidence_level: 'state_special_education_fallback',
  };
}

if (dbPaths.length === 0) {
  console.error('No navigator database files found.');
  process.exit(1);
}

for (const dbPath of dbPaths) {
  const db = new Database(dbPath);
  const counties = db.prepare(`
    SELECT c.id, c.name, c.state_id, s.name AS state_name
    FROM counties c
    JOIN states s ON s.id = c.state_id
    ORDER BY c.state_id, c.name
  `).all();

  const regionalAgencies = db.prepare(`
    SELECT *
    FROM regional_education_agencies
    WHERE website IS NOT NULL AND TRIM(website) <> ''
      AND source_url IS NOT NULL AND TRIM(source_url) <> ''
      AND verification_status IN ('official_verified', 'verified', 'human_verified', 'source_listed')
  `).all();

  const existingCoverage = new Set(
    db.prepare(`
      SELECT DISTINCT county_id
      FROM school_districts
      WHERE source_url IS NOT NULL AND TRIM(source_url) <> ''
        AND (
          (spec_ed_contact_phone IS NOT NULL AND TRIM(spec_ed_contact_phone) <> '') OR
          (spec_ed_contact_email IS NOT NULL AND TRIM(spec_ed_contact_email) <> '') OR
          (website IS NOT NULL AND TRIM(website) <> '')
        )
    `).all().map((row) => row.county_id)
  );

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO school_districts (
      id, county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website,
      total_enrollment, special_ed_pct, inclusion_rate_pct, self_contained_rate_pct,
      source_url, source_type, data_origin, verification_status, last_verified_date,
      last_scraped_at, confidence_score, evidence_level
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let inserted = 0;

  const tx = db.transaction(() => {
    for (const county of counties) {
      if (existingCoverage.has(county.id)) continue;

      const agency = regionalAgencies.find((row) => row.state_id === county.state_id && countyListIncludes(row.counties_served, county.id));
      let row = null;

      if (agency) {
        row = buildFallbackFromRegionalAgency(agency, county);
      } else {
        const targets = getSourceTargets(county.state_id);
        const target = targets.find((entry) => String(entry.category || '').startsWith('F. Special education / IEP'));
        if (target?.source_url) {
          row = buildFallbackFromSourceTarget(target, county, county.state_name);
        }
      }

      if (!row) continue;

      insertStmt.run(
        row.id,
        row.county_id,
        row.name,
        row.spec_ed_contact_phone,
        row.spec_ed_contact_email,
        row.website,
        null,
        null,
        null,
        null,
        row.source_url,
        row.source_type,
        row.data_origin,
        row.verification_status,
        row.last_verified_date,
        row.last_scraped_at,
        row.confidence_score,
        row.evidence_level
      );
      inserted += 1;
    }
  });

  tx();
  db.close();
  console.log(`Seeded education contact fallbacks into ${dbPath}: +${inserted} county rows.`);
}
