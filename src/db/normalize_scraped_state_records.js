import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const db = new Database(dbPath);

console.log('Running staging records normalization against:', dbPath);

function normalizePhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone.trim();
}

function normalizeUrl(url) {
  if (!url) return '';
  let cleaned = url.trim().toLowerCase();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  try {
    const u = new URL(cleaned);
    const searchParams = new URLSearchParams(u.search);
    const keysToStrip = [];
    for (const key of searchParams.keys()) {
      if (key.startsWith('utm_') || key === 'fbclid' || key === 'gclid') {
        keysToStrip.push(key);
      }
    }
    keysToStrip.forEach(k => searchParams.delete(k));
    u.search = searchParams.toString();
    return u.toString().replace(/\/$/, '');
  } catch (e) {
    return url.trim();
  }
}

function normalizeAddress(address) {
  if (!address) return '';
  return address.trim()
    .replace(/\s+/g, ' ')
    .replace(/\bStreet\b/gi, 'St')
    .replace(/\bAvenue\b/gi, 'Ave')
    .replace(/\bRoad\b/gi, 'Rd')
    .replace(/\bBoulevard\b/gi, 'Blvd')
    .replace(/\bLane\b/gi, 'Ln')
    .replace(/\bDrive\b/gi, 'Dr')
    .replace(/\bCourt\b/gi, 'Ct')
    .replace(/\bPlaza\b/gi, 'Plz')
    .replace(/\bParkway\b/gi, 'Pkwy')
    .replace(/\bSuite\b/gi, 'Ste')
    .replace(/\bApartment\b/gi, 'Apt');
}

function normalizeCountySlug(countyName) {
  if (!countyName) return '';
  return countyName.trim().toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

// Fetch all staging tables
const stagingTables = [
  'staging_scraped_county_offices',
  'staging_scraped_state_resource_agencies',
  'staging_scraped_regional_education_agencies',
  'staging_scraped_school_districts',
  'staging_scraped_nonprofit_organizations',
  'staging_scraped_iep_advocates',
  'staging_scraped_resource_providers',
  'staging_scraped_forms',
  'staging_scraped_help_resources',
  'staging_scraped_knowledge_content',
  'staging_scraped_waitlists',
  'staging_scraped_sources'
];

let totalNormalized = 0;

for (const table of stagingTables) {
  // Check if table exists
  const tableCheck = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(table);
  if (!tableCheck) {
    console.log(`Table ${table} does not exist. Skipping.`);
    continue;
  }

  const records = db.prepare(`SELECT * FROM ${table} WHERE review_status = 'pending_review'`).all();
  if (records.length === 0) {
    continue;
  }

  console.log(`Normalizing ${records.length} records in ${table}...`);

  for (const record of records) {
    const updates = {};
    const params = [];

    // Fields to normalize
    if ('extracted_phone' in record) {
      record.extracted_phone = normalizePhone(record.extracted_phone);
    }
    if ('spec_ed_contact_phone' in record) {
      record.spec_ed_contact_phone = normalizePhone(record.spec_ed_contact_phone);
    }
    if ('extracted_website' in record) {
      record.extracted_website = normalizeUrl(record.extracted_website);
    }
    if ('extracted_address' in record) {
      record.extracted_address = normalizeAddress(record.extracted_address);
    }
    if ('source_url' in record) {
      record.source_url = normalizeUrl(record.source_url);
    }
    if ('official_download_url' in record) {
      record.official_download_url = normalizeUrl(record.official_download_url);
    }
    if ('action_url' in record) {
      record.action_url = normalizeUrl(record.action_url);
    }
    if ('canonical_url' in record) {
      record.canonical_url = normalizeUrl(record.canonical_url);
    }
    if ('county_id' in record && record.county_id) {
      // Cross-reference county with counties table
      const normalizedCounty = normalizeCountySlug(record.county_id);
      const countyDb = db.prepare("SELECT id FROM counties WHERE id = ? OR id = ?").get(normalizedCounty, `${normalizedCounty}-${record.state_id}`);
      if (countyDb) {
        record.county_id = countyDb.id;
      } else {
        record.county_id = normalizedCounty;
      }
    }

    // Confidence Score Calculation
    let score = 0.50; // base score
    if (record.source_type === 'official_state' || record.source_type === 'official_county' || record.source_type === 'official_local_agency') {
      score += 0.30;
    } else if (record.source_type === 'nonprofit') {
      score += 0.15;
    }

    try {
      const u = new URL(record.source_url);
      if (u.hostname.endsWith('.gov') || u.hostname.endsWith('.edu') || u.hostname.endsWith('.mil')) {
        score += 0.10;
      }
    } catch(e) {}

    if (record.extracted_phone || record.spec_ed_contact_phone) score += 0.05;
    if (record.extracted_email || record.spec_ed_contact_email) score += 0.05;

    record.confidence_score = Math.min(1.0, score);

    // Build update query dynamically
    const fieldsToUpdate = Object.keys(record).filter(k => k !== 'id');
    const updateClauses = fieldsToUpdate.map(f => `${f} = ?`).join(', ');
    const updateParams = fieldsToUpdate.map(f => record[f]);
    updateParams.push(record.id);

    db.prepare(`UPDATE ${table} SET ${updateClauses} WHERE id = ?`).run(...updateParams);
    totalNormalized++;
  }
}

console.log(`✓ Normalization complete. Standardized ${totalNormalized} records.`);
db.close();
