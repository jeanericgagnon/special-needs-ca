import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const db = new Database(dbPath);

function parseHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function isSyntheticEducationGovHost(hostname = '') {
  return /^www\.[a-z-]+-education\.gov$/i.test(hostname);
}

const targetCountyIds = new Set();
const agencies = db.prepare(`
  SELECT state_id, counties_served, website, source_url
  FROM regional_education_agencies
  WHERE verification_status IN ('verified', 'official_verified', 'human_verified')
`).all();

for (const agency of agencies) {
  const websiteHost = parseHostname(agency.website || '');
  const sourceHost = parseHostname(agency.source_url || '');
  if (!websiteHost || !sourceHost) continue;
  if (isSyntheticEducationGovHost(websiteHost) || isSyntheticEducationGovHost(sourceHost)) continue;

  for (const countyId of String(agency.counties_served || '').split(',').map((value) => value.trim()).filter(Boolean)) {
    targetCountyIds.add(countyId);
  }
}

if (targetCountyIds.size === 0) {
  console.log('Deleted 0 low-confidence school district rows.');
  console.log(JSON.stringify({ targetCountyIds: [], deletedByState: {} }, null, 2));
  db.close();
  process.exit(0);
}

const rows = db.prepare(`
  SELECT sd.id, sd.county_id, sd.name, c.state_id, sd.verification_status, sd.data_origin, sd.website, sd.source_url, sd.spec_ed_contact_phone, sd.spec_ed_contact_email
  FROM school_districts sd
  JOIN counties c ON c.id = sd.county_id
  WHERE sd.county_id IN (${Array.from(targetCountyIds).map(() => '?').join(',')})
    AND sd.verification_status IN ('source_listed', 'manual_review_required', 'unverified')
`).all(...Array.from(targetCountyIds));

function shouldDelete(row) {
  if (row.verification_status === 'unverified') {
    const websiteHost = parseHostname(row.website || '');
    return (
      row.source_url === 'https://educationdata.urban.org' &&
      (row.website || '').startsWith('https://www.google.com/search?q=') &&
      (
        (row.spec_ed_contact_email || '').startsWith('specialeducation@') ||
        !websiteHost ||
        websiteHost === 'www.google.com'
      )
    );
  }

  if (row.verification_status === 'manual_review_required') {
    const websiteHost = parseHostname(row.website || '');
    const sourceHost = parseHostname(row.source_url || '');
    const hasNoDirectContact = !row.spec_ed_contact_phone && !row.spec_ed_contact_email;
    const looksLikeCountyPlaceholder = /County School District$/i.test(row.name || '');
    const looksLikeDistrictPlaceholder = /School District$/i.test(row.name || '');
    const hasNoUsefulWebsite = !websiteHost;

    return Boolean(
      row.data_origin === 'scraped' &&
      hasNoDirectContact &&
      (
        looksLikeCountyPlaceholder ||
        looksLikeDistrictPlaceholder ||
        hasNoUsefulWebsite
      ) &&
      sourceHost &&
      (
        hasNoUsefulWebsite ||
        websiteHost === sourceHost
      ) &&
      (websiteHost ? isSyntheticEducationGovHost(websiteHost) === false : true) &&
      isSyntheticEducationGovHost(sourceHost) === false
    );
  }

  if (row.verification_status === 'source_listed') {
    if (row.data_origin === 'official_locator_derived') return true;
    if (row.data_origin === 'official_directory_extract') {
      const hasNoDirectContact = !row.spec_ed_contact_phone && !row.spec_ed_contact_email;
      const websiteHost = parseHostname(row.website || '');
      const sourceHost = parseHostname(row.source_url || '');
      return Boolean(
        hasNoDirectContact &&
        websiteHost &&
        sourceHost &&
        websiteHost === sourceHost
      );
    }
    if (row.data_origin === 'scraped') {
      const websiteHost = parseHostname(row.website || '');
      const sourceHost = parseHostname(row.source_url || '');
      if (!websiteHost || !sourceHost) return false;
      if (websiteHost === 'www.spedtex.org' && sourceHost === 'txschools.gov') return true;
      return websiteHost === sourceHost;
    }
  }

  return false;
}

const deletedByState = {};
let deleted = 0;
const deletableRows = rows.filter(shouldDelete);
const deleteStmt = db.prepare('DELETE FROM school_districts WHERE id = ?');

const tx = db.transaction(() => {
  for (const row of deletableRows) {
    deleteStmt.run(row.id);
    deleted += 1;
    deletedByState[row.state_id] = (deletedByState[row.state_id] || 0) + 1;
  }
});

tx();

console.log(`Deleted ${deleted} low-confidence school district rows.`);
console.log(JSON.stringify({ targetCountyIds: Array.from(targetCountyIds), deletedByState }, null, 2));

db.close();
