import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const defaultDbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const frontendDbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const summaryJsonPath = path.join(generatedDir, 'canonical-normalization-v1-summary.json');
const summaryMdPath = path.join(generatedDir, 'canonical-normalization-v1-summary.md');

export function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function parseArgs(argv) {
  const args = {
    dbPath: defaultDbPath,
    mode: 'apply',
    skipBackfill: false,
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'db-path' && value) args.dbPath = path.resolve(value);
    if (flag === 'mode' && value) args.mode = value;
    if (flag === 'skip-backfill') args.skipBackfill = value ? value !== 'false' : true;
  }

  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeWhitespace(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value)
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return normalized || null;
}

function normalizeName(value) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;
  return normalized
    .replace(/\s+\|\s+/g, ' | ')
    .replace(/\s*-\s*/g, ' - ');
}

export function normalizeEmail(value) {
  const normalized = normalizeWhitespace(value);
  return normalized ? normalized.toLowerCase() : null;
}

export function normalizePhone(value) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;
  const extMatch = normalized.match(/(?:ext\.?|extension|x)\s*(\d{1,6})$/i);
  const corePortion = extMatch ? normalized.slice(0, extMatch.index).trim() : normalized;
  const digits = corePortion.replace(/\D/g, '');
  let core = digits;
  if (core.length === 11 && core.startsWith('1')) core = core.slice(1);
  if (core.length < 10) return normalized;
  const main = core.slice(0, 10);
  const formatted = `(${main.slice(0, 3)}) ${main.slice(3, 6)}-${main.slice(6, 10)}`;
  return extMatch ? `${formatted} ext ${extMatch[1]}` : formatted;
}

export function normalizeUrl(rawValue) {
  const normalized = normalizeWhitespace(rawValue);
  if (!normalized) return null;
  try {
    const url = new URL(normalized);
    url.hash = '';
    const removable = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
    for (const key of removable) url.searchParams.delete(key);
    const search = url.searchParams.toString();
    url.search = search ? `?${search}` : '';
    url.hostname = url.hostname.toLowerCase();
    if ((url.protocol === 'https:' && url.port === '443') || (url.protocol === 'http:' && url.port === '80')) {
      url.port = '';
    }
    if (url.pathname.length > 1) {
      url.pathname = url.pathname.replace(/\/{2,}/g, '/').replace(/\/$/, '');
    } else if (url.pathname === '/') {
      url.pathname = '';
    }
    let rendered = url.toString();
    if (url.pathname === '' || url.pathname === '/') {
      rendered = rendered.replace(/\/(\?|$)/, '$1');
    }
    return rendered;
  } catch {
    return normalized;
  }
}

function normalizeUrlOrContact(rawValue) {
  const normalized = normalizeWhitespace(rawValue);
  if (!normalized) return null;
  if (/^https?:\/\//i.test(normalized)) return normalizeUrl(normalized);
  const phone = normalizePhone(normalized);
  if (phone !== normalized || /\d{3}/.test(normalized)) return phone;
  const email = normalizeEmail(normalized);
  if (email && email.includes('@')) return email;
  return normalizeTextBlock(normalized);
}

function domainFromUrl(rawValue) {
  const normalized = normalizeUrl(rawValue);
  if (!normalized) return null;
  try {
    return new URL(normalized).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function normalizeDate(rawValue) {
  const normalized = normalizeWhitespace(rawValue);
  if (!normalized) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return normalized;
  return date.toISOString().slice(0, 10);
}

export function normalizeConfidenceScore(value) {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  let normalized = numeric;
  if (normalized > 1 && normalized <= 5) normalized = normalized / 5;
  else if (normalized > 5) normalized = normalized / 10;
  normalized = Math.max(0, Math.min(1, normalized));
  return Math.round(normalized * 1000) / 1000;
}

function normalizeAddress(value) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;
  return normalized
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s{2,}/g, ' ');
}

function normalizeList(value, mapper) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;
  const parts = normalized
    .split(/[\n;,|]+/)
    .map((part) => mapper(part))
    .filter(Boolean);
  if (!parts.length) return null;
  return Array.from(new Set(parts)).sort().join(', ');
}

function normalizeServiceTags(value) {
  return normalizeList(value, (part) => slugify(part).replace(/^-+|-+$/g, '').replace(/-/g, '_'));
}

function normalizeTextBlock(value) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;
  return normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

function buildStateMaps(db) {
  const rows = db.prepare('SELECT id, code, name FROM states').all();
  const byAny = new Map();
  for (const row of rows) {
    byAny.set(String(row.id).toLowerCase(), row.id);
    if (row.code) byAny.set(String(row.code).toLowerCase(), row.id);
    if (row.name) byAny.set(slugify(row.name), row.id);
  }
  return byAny;
}

function buildCountyMaps(db) {
  const rows = db.prepare('SELECT id, state_id, name FROM counties').all();
  const byId = new Set(rows.map((row) => row.id));
  const byStateAndName = new Map();
  const byUniqueName = new Map();
  const nameCounts = new Map();
  for (const row of rows) {
    byStateAndName.set(`${row.state_id}:${slugify(row.name)}`, row.id);
    const bare = slugify(row.name)
      .replace(/-county$/, '')
      .replace(/-parish$/, '')
      .replace(/-borough$/, '')
      .replace(/-census-area$/, '');
    byStateAndName.set(`${row.state_id}:${bare}`, row.id);
    nameCounts.set(bare, (nameCounts.get(bare) || 0) + 1);
    byUniqueName.set(bare, row.id);
  }
  return { byId, byStateAndName, byUniqueName, nameCounts };
}

function buildProgramMaps(db) {
  const rows = db.prepare('SELECT id, state_id, name FROM programs').all();
  const byAny = new Map();
  for (const row of rows) {
    byAny.set(String(row.id).toLowerCase(), row.id);
    byAny.set(slugify(row.name), row.id);
    if (row.state_id) byAny.set(`${row.state_id}:${slugify(row.name)}`, row.id);
  }
  return byAny;
}

function normalizeStateId(value, stateMap) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;
  const direct = stateMap.get(normalized.toLowerCase()) || stateMap.get(slugify(normalized));
  return direct || normalized.toLowerCase();
}

function normalizeCountyId(value, stateId, countyMaps) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;
  const lower = normalized.toLowerCase();
  if (countyMaps.byId.has(lower)) return lower;
  const cleaned = slugify(normalized)
    .replace(/-county$/, '')
    .replace(/-parish$/, '')
    .replace(/-borough$/, '')
    .replace(/-census-area$/, '');
  if (stateId) {
    const resolved = countyMaps.byStateAndName.get(`${stateId}:${cleaned}`);
    if (resolved) return resolved;
  }
  if ((countyMaps.nameCounts.get(cleaned) || 0) === 1) {
    return countyMaps.byUniqueName.get(cleaned) || lower;
  }
  return lower;
}

function normalizeProgramId(value, stateId, programMap) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;
  const lower = normalized.toLowerCase();
  return programMap.get(lower)
    || programMap.get(slugify(normalized))
    || (stateId ? programMap.get(`${stateId}:${slugify(normalized)}`) : null)
    || lower;
}

function normalizeCountyCoverage(value, stateId, countyMaps) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return null;
  if (/^statewide$/i.test(normalized)) return 'statewide';
  return normalizeList(normalized, (part) => normalizeCountyId(part, stateId, countyMaps));
}

function updateRow(db, tableName, keyColumn, keyValue, nextValues) {
  const columns = Object.keys(nextValues);
  if (!columns.length) return;
  const assignments = columns.map((column) => `${column} = @${column}`).join(', ');
  const statement = db.prepare(`UPDATE ${tableName} SET ${assignments} WHERE ${keyColumn} = @keyValue`);
  statement.run({ ...nextValues, keyValue });
}

function diffRow(current, next) {
  const changed = {};
  for (const [key, value] of Object.entries(next)) {
    if ((current[key] ?? null) !== (value ?? null)) changed[key] = value ?? null;
  }
  return changed;
}

function normalizeSourceFields(row, sourceFieldNames = ['source_url', 'website', 'pdf_url', 'official_source_url', 'url']) {
  const next = {};
  for (const field of sourceFieldNames) {
    if (Object.prototype.hasOwnProperty.call(row, field)) next[field] = normalizeUrl(row[field]);
  }
  return next;
}

function buildDuplicateSection(db) {
  const queries = [
    {
      table: 'programs',
      sql: `SELECT state_id || '|' || lower(name) AS k, COUNT(*) AS c FROM programs GROUP BY k HAVING COUNT(*) > 1`,
    },
    {
      table: 'county_offices',
      sql: `SELECT county_id || '|' || lower(office_name) AS k, COUNT(*) AS c FROM county_offices GROUP BY k HAVING COUNT(*) > 1`,
    },
    {
      table: 'school_districts',
      sql: `SELECT county_id || '|' || lower(name) AS k, COUNT(*) AS c FROM school_districts GROUP BY k HAVING COUNT(*) > 1`,
    },
    {
      table: 'state_resource_agencies',
      sql: `SELECT state_id || '|' || agency_type || '|' || lower(name) AS k, COUNT(*) AS c FROM state_resource_agencies GROUP BY k HAVING COUNT(*) > 1`,
    },
    {
      table: 'forms_and_guides',
      sql: `SELECT state_id || '|' || lower(title) AS k, COUNT(*) AS c FROM forms_and_guides GROUP BY k HAVING COUNT(*) > 1`,
    },
    {
      table: 'nonprofit_organizations',
      sql: `SELECT county_id || '|' || lower(name) AS k, COUNT(*) AS c FROM nonprofit_organizations GROUP BY k HAVING COUNT(*) > 1`,
    },
    {
      table: 'resource_providers',
      sql: `SELECT county_id || '|' || lower(name) AS k, COUNT(*) AS c FROM resource_providers GROUP BY k HAVING COUNT(*) > 1`,
    },
  ];
  return queries.map((query) => {
    const rows = db.prepare(query.sql).all();
    return {
      table: query.table,
      duplicateClusterCount: rows.length,
      duplicateRowCount: rows.reduce((sum, row) => sum + Number(row.c || 0), 0),
    };
  });
}

function ensureNormalizationSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      organization_type TEXT NOT NULL,
      parent_organization_id TEXT,
      website TEXT,
      intake_phone TEXT,
      intake_email TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL,
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS organization_program_links (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      program_id TEXT,
      listing_type TEXT NOT NULL,
      title TEXT NOT NULL,
      intake_model TEXT,
      service_summary TEXT,
      eligibility_summary TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS office_locations (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      office_name TEXT NOT NULL,
      office_type TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state_id TEXT,
      postal_code TEXT,
      county_id TEXT,
      intake_phone TEXT,
      intake_email TEXT,
      website TEXT,
      hours_text TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS service_locations (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      location_name TEXT NOT NULL,
      location_type TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state_id TEXT,
      postal_code TEXT,
      county_id TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      appointment_url TEXT,
      hours_text TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS virtual_service_areas (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      program_link_id TEXT,
      area_type TEXT NOT NULL,
      area_name TEXT NOT NULL,
      state_id TEXT,
      coverage_notes TEXT,
      intake_model TEXT,
      source_url TEXT,
      source_type TEXT,
      data_origin TEXT,
      verification_status TEXT,
      last_verified_date TEXT,
      last_scraped_at TEXT,
      confidence_score REAL
    );
    CREATE TABLE IF NOT EXISTS virtual_service_area_counties (
      virtual_service_area_id TEXT,
      county_id TEXT,
      PRIMARY KEY (virtual_service_area_id, county_id)
    );
  `);
}

function runBackfillScript(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`Backfill failed for ${path.basename(scriptPath)}: ${result.stderr || result.stdout}`);
  }
  return {
    script: path.relative(repoRoot, scriptPath),
    stdout: (result.stdout || '').trim(),
  };
}

export function runCanonicalNormalization({ dbPath = defaultDbPath, mode = 'apply', skipBackfill = false } = {}) {
  const db = new Database(dbPath);
  ensureNormalizationSchema(db);
  const stateMap = buildStateMaps(db);
  const countyMaps = buildCountyMaps(db);
  const programMap = buildProgramMaps(db);
  const summary = {
    generatedAt: new Date().toISOString(),
    mode,
    dbPath: path.relative(repoRoot, dbPath),
    tableStats: {},
    backfills: [],
    duplicateRisk: [],
  };

  const tableStats = summary.tableStats;
  const bump = (table, field) => {
    if (!tableStats[table]) tableStats[table] = { rowsVisited: 0, rowsChanged: 0, fieldsChanged: {} };
    tableStats[table].fieldsChanged[field] = (tableStats[table].fieldsChanged[field] || 0) + 1;
  };
  const rowVisited = (table) => {
    if (!tableStats[table]) tableStats[table] = { rowsVisited: 0, rowsChanged: 0, fieldsChanged: {} };
    tableStats[table].rowsVisited += 1;
  };
  const rowChanged = (table) => {
    if (!tableStats[table]) tableStats[table] = { rowsVisited: 0, rowsChanged: 0, fieldsChanged: {} };
    tableStats[table].rowsChanged += 1;
  };

  const tx = db.transaction(() => {
    const processTable = ({ table, key = 'id', query, mapper }) => {
      const rows = db.prepare(query || `SELECT * FROM ${table}`).all();
      for (const row of rows) {
        rowVisited(table);
        const proposed = mapper(row);
        const changed = diffRow(row, proposed);
        const fields = Object.keys(changed);
        if (!fields.length) continue;
        rowChanged(table);
        for (const field of fields) bump(table, field);
        if (mode === 'apply') updateRow(db, table, key, row[key], changed);
      }
    };

    processTable({
      table: 'programs',
      mapper: (row) => {
        const stateId = normalizeStateId(row.state_id, stateMap);
        return {
          state_id: stateId,
          name: normalizeName(row.name),
          description: normalizeTextBlock(row.description),
          who_it_is_for: normalizeTextBlock(row.who_it_is_for),
          who_might_qualify: normalizeTextBlock(row.who_might_qualify),
          official_source_url: normalizeUrl(row.official_source_url),
          source_url: normalizeUrl(row.source_url),
          source_type: normalizeWhitespace(row.source_type),
          data_origin: normalizeWhitespace(row.data_origin),
          verification_status: normalizeWhitespace(row.verification_status),
          last_verified_date: normalizeDate(row.last_verified_date),
          last_scraped_at: normalizeDate(row.last_scraped_at),
          confidence_score: normalizeConfidenceScore(row.confidence_score),
          program_type: row.program_type ? slugify(row.program_type).replace(/-/g, '_') : null,
        };
      },
    });

    processTable({
      table: 'program_eligibility_rules',
      mapper: (row) => {
        const program = db.prepare('SELECT state_id FROM programs WHERE id = ?').get(row.program_id);
        return {
          program_id: normalizeProgramId(row.program_id, program?.state_id || null, programMap),
          required_condition: normalizeWhitespace(row.required_condition),
          required_need: normalizeWhitespace(row.required_need),
          insurance_status: normalizeWhitespace(row.insurance_status),
          school_status: normalizeWhitespace(row.school_status),
          trigger_reason: normalizeTextBlock(row.trigger_reason),
        };
      },
    });

    processTable({
      table: 'program_document_requirements',
      mapper: (row) => {
        const program = db.prepare('SELECT state_id FROM programs WHERE id = ?').get(row.program_id);
        return {
          program_id: normalizeProgramId(row.program_id, program?.state_id || null, programMap),
          name: normalizeName(row.name),
          description: normalizeTextBlock(row.description),
        };
      },
    });

    processTable({
      table: 'program_application_steps',
      mapper: (row) => {
        const program = db.prepare('SELECT state_id FROM programs WHERE id = ?').get(row.program_id);
        return {
          program_id: normalizeProgramId(row.program_id, program?.state_id || null, programMap),
          title: normalizeName(row.title),
          action_description: normalizeTextBlock(row.action_description),
          apply_url_or_contact: normalizeUrlOrContact(row.apply_url_or_contact),
        };
      },
    });

    processTable({
      table: 'program_appeal_info',
      key: 'program_id',
      mapper: (row) => {
        const program = db.prepare('SELECT state_id FROM programs WHERE id = ?').get(row.program_id);
        return {
          program_id: normalizeProgramId(row.program_id, program?.state_id || null, programMap),
          appeal_steps: normalizeTextBlock(row.appeal_steps),
          denial_reasons: normalizeTextBlock(row.denial_reasons),
          appeal_form_name: normalizeName(row.appeal_form_name),
          official_appeal_source_url: normalizeUrl(row.official_appeal_source_url),
        };
      },
    });

    processTable({
      table: 'program_waitlists',
      mapper: (row) => {
        const program = db.prepare('SELECT state_id FROM programs WHERE id = ?').get(row.program_id);
        return {
          program_id: normalizeProgramId(row.program_id, program?.state_id || null, programMap),
          name: normalizeName(row.name),
          description: normalizeTextBlock(row.description),
          estimate_source_url: normalizeUrl(row.estimate_source_url),
          estimate_source_type: normalizeWhitespace(row.estimate_source_type),
          last_checked_at: normalizeDate(row.last_checked_at),
        };
      },
    });

    processTable({
      table: 'state_resource_agencies',
      mapper: (row) => {
        const stateId = normalizeStateId(row.state_id, stateMap);
        return {
          state_id: stateId,
          agency_type: row.agency_type ? slugify(row.agency_type).replace(/-/g, '_') : null,
          name: normalizeName(row.name),
          counties_served: normalizeCountyCoverage(row.counties_served, stateId, countyMaps),
          catchment_boundaries: normalizeTextBlock(row.catchment_boundaries),
          website: normalizeUrl(row.website),
          intake_phone: normalizePhone(row.intake_phone),
          early_intervention_contact: normalizeEmail(row.early_intervention_contact) || normalizePhone(row.early_intervention_contact) || normalizeTextBlock(row.early_intervention_contact),
          agency_intake_contact: normalizeEmail(row.agency_intake_contact) || normalizePhone(row.agency_intake_contact) || normalizeTextBlock(row.agency_intake_contact),
          eligibility_info_page: normalizeUrl(row.eligibility_info_page),
          services_page: normalizeUrl(row.services_page),
          appeals_info: normalizeUrl(row.appeals_info),
          languages: normalizeList(row.languages, (part) => normalizeWhitespace(part)),
          last_verified_date: normalizeDate(row.last_verified_date),
          last_scraped_at: normalizeDate(row.last_scraped_at),
          source_urls: normalizeList(row.source_urls, (part) => normalizeUrl(part)),
          source_url: normalizeUrl(row.source_url),
          source_type: normalizeWhitespace(row.source_type),
          data_origin: normalizeWhitespace(row.data_origin),
          verification_status: normalizeWhitespace(row.verification_status),
          confidence_score: normalizeConfidenceScore(row.confidence_score),
          evidence_level: row.evidence_level ? slugify(row.evidence_level).replace(/-/g, '_') : null,
        };
      },
    });

    processTable({
      table: 'county_offices',
      mapper: (row) => {
        const countyId = normalizeCountyId(row.county_id, null, countyMaps);
        const county = countyId ? db.prepare('SELECT state_id FROM counties WHERE id = ?').get(countyId) : null;
        return {
          county_id: countyId,
          program_id: normalizeProgramId(row.program_id, county?.state_id || null, programMap),
          office_name: normalizeName(row.office_name),
          address: normalizeAddress(row.address),
          phone: normalizePhone(row.phone),
          email: normalizeEmail(row.email),
          website: normalizeUrl(row.website),
          source_url: normalizeUrl(row.source_url),
          source_type: normalizeWhitespace(row.source_type),
          data_origin: normalizeWhitespace(row.data_origin),
          verification_status: normalizeWhitespace(row.verification_status),
          last_verified_date: normalizeDate(row.last_verified_date),
          last_scraped_at: normalizeDate(row.last_scraped_at),
          confidence_score: normalizeConfidenceScore(row.confidence_score),
          evidence_level: row.evidence_level ? slugify(row.evidence_level).replace(/-/g, '_') : null,
        };
      },
    });

    processTable({
      table: 'regional_education_agencies',
      mapper: (row) => {
        const stateId = normalizeStateId(row.state_id, stateMap);
        return {
          state_id: stateId,
          agency_type: row.agency_type ? slugify(row.agency_type).replace(/-/g, '_') : null,
          name: normalizeName(row.name),
          counties_served: normalizeCountyCoverage(row.counties_served, stateId, countyMaps),
          website: normalizeUrl(row.website),
          source_url: normalizeUrl(row.source_url),
          source_type: normalizeWhitespace(row.source_type),
          data_origin: normalizeWhitespace(row.data_origin),
          verification_status: normalizeWhitespace(row.verification_status),
          last_verified_date: normalizeDate(row.last_verified_date),
          last_scraped_at: normalizeDate(row.last_scraped_at),
          confidence_score: normalizeConfidenceScore(row.confidence_score),
          evidence_level: row.evidence_level ? slugify(row.evidence_level).replace(/-/g, '_') : null,
        };
      },
    });

    processTable({
      table: 'school_districts',
      mapper: (row) => ({
        county_id: normalizeCountyId(row.county_id, null, countyMaps),
        name: normalizeName(row.name),
        spec_ed_contact_phone: normalizePhone(row.spec_ed_contact_phone),
        spec_ed_contact_email: normalizeEmail(row.spec_ed_contact_email),
        website: normalizeUrl(row.website),
        source_url: normalizeUrl(row.source_url),
        source_type: normalizeWhitespace(row.source_type),
        data_origin: normalizeWhitespace(row.data_origin),
        verification_status: normalizeWhitespace(row.verification_status),
        last_verified_date: normalizeDate(row.last_verified_date),
        last_scraped_at: normalizeDate(row.last_scraped_at),
        confidence_score: normalizeConfidenceScore(row.confidence_score),
        evidence_level: row.evidence_level ? slugify(row.evidence_level).replace(/-/g, '_') : null,
      }),
    });

    processTable({
      table: 'forms_and_guides',
      mapper: (row) => {
        const stateId = normalizeStateId(row.state_id, stateMap);
        return {
          state_id: stateId,
          program_id: normalizeProgramId(row.program_id, stateId, programMap),
          title: normalizeName(row.title),
          slug: row.slug ? slugify(row.slug) : slugify(row.title),
          category: row.category ? slugify(row.category).replace(/-/g, '_') : null,
          form_type: row.form_type ? slugify(row.form_type).replace(/-/g, '_') : null,
          agency: normalizeName(row.agency),
          source_url: normalizeUrl(row.source_url),
          pdf_url: normalizeUrl(row.pdf_url),
          description: normalizeTextBlock(row.description),
          related_action: normalizeTextBlock(row.related_action),
          display_context: normalizeTextBlock(row.display_context),
          who_uses_it: normalizeTextBlock(row.who_uses_it),
          who_signs_it: normalizeTextBlock(row.who_signs_it),
          where_to_send_it: normalizeTextBlock(row.where_to_send_it),
          deadline: normalizeTextBlock(row.deadline),
          attachments: normalizeTextBlock(row.attachments),
          common_mistakes: normalizeTextBlock(row.common_mistakes),
          letter_template: normalizeTextBlock(row.letter_template),
          call_script: normalizeTextBlock(row.call_script),
          evidence_level: row.evidence_level ? slugify(row.evidence_level).replace(/-/g, '_') : null,
          data_origin: normalizeWhitespace(row.data_origin),
          verification_status: normalizeWhitespace(row.verification_status),
          confidence_score: normalizeConfidenceScore(row.confidence_score),
          last_checked_at: normalizeDate(row.last_checked_at),
          last_verified_at: normalizeDate(row.last_verified_at),
        };
      },
    });

    processTable({
      table: 'nonprofit_organizations',
      mapper: (row) => ({
        name: normalizeName(row.name),
        county_id: normalizeCountyId(row.county_id, null, countyMaps),
        website: normalizeUrl(row.website),
        phone: normalizePhone(row.phone),
        focus_condition: normalizeTextBlock(row.focus_condition),
        source_url: normalizeUrl(row.source_url),
        source_type: normalizeWhitespace(row.source_type),
        data_origin: normalizeWhitespace(row.data_origin),
        verification_status: normalizeWhitespace(row.verification_status),
        last_verified_date: normalizeDate(row.last_verified_date),
        last_scraped_at: normalizeDate(row.last_scraped_at),
        confidence_score: normalizeConfidenceScore(row.confidence_score),
        evidence_level: row.evidence_level ? slugify(row.evidence_level).replace(/-/g, '_') : null,
        service_tags: normalizeServiceTags(row.service_tags),
        serving_tags: normalizeServiceTags(row.serving_tags),
        availability_status: row.availability_status ? slugify(row.availability_status).replace(/-/g, '_') : null,
        checked_at: normalizeDate(row.checked_at),
        source_name: normalizeName(row.source_name),
        source_last_updated: normalizeDate(row.source_last_updated),
        next_step_type: row.next_step_type ? slugify(row.next_step_type).replace(/-/g, '_') : null,
        next_step_label: normalizeTextBlock(row.next_step_label),
        next_step_url: normalizeUrl(row.next_step_url),
        next_step_phone: normalizePhone(row.next_step_phone),
        next_step_email: normalizeEmail(row.next_step_email),
        next_step_instructions: normalizeTextBlock(row.next_step_instructions),
        requirements: normalizeTextBlock(row.requirements),
        application_url: normalizeUrl(row.application_url),
        referral_url: normalizeUrl(row.referral_url),
        languages: normalizeList(row.languages, (part) => normalizeWhitespace(part)),
        accessibility_notes: normalizeTextBlock(row.accessibility_notes),
        data_quality_notes: normalizeTextBlock(row.data_quality_notes),
        unsupported_claim_flags: normalizeTextBlock(row.unsupported_claim_flags),
        claim_status: normalizeWhitespace(row.claim_status),
        claim_email: normalizeEmail(row.claim_email),
        last_verified_at: normalizeDate(row.last_verified_at),
        accessibility_evidence_level: row.accessibility_evidence_level ? slugify(row.accessibility_evidence_level).replace(/-/g, '_') : null,
        accessibility_source_address: normalizeAddress(row.accessibility_source_address),
      }),
    });

    processTable({
      table: 'resource_providers',
      mapper: (row) => ({
        name: normalizeName(row.name),
        categories: normalizeList(row.categories, (part) => normalizeName(part)),
        county_id: normalizeCountyId(row.county_id, null, countyMaps),
        phone: normalizePhone(row.phone),
        email: normalizeEmail(row.email),
        address: normalizeAddress(row.address),
        regional_center_vendor_ids: normalizeList(row.regional_center_vendor_ids, (part) => normalizeWhitespace(part)),
        source_url: normalizeUrl(row.source_url),
        source_type: normalizeWhitespace(row.source_type),
        data_origin: normalizeWhitespace(row.data_origin),
        verification_status: normalizeWhitespace(row.verification_status),
        last_verified_date: normalizeDate(row.last_verified_date),
        last_scraped_at: normalizeDate(row.last_scraped_at),
        confidence_score: normalizeConfidenceScore(row.confidence_score),
        evidence_level: row.evidence_level ? slugify(row.evidence_level).replace(/-/g, '_') : null,
        service_tags: normalizeServiceTags(row.service_tags),
        serving_tags: normalizeServiceTags(row.serving_tags),
        availability_status: row.availability_status ? slugify(row.availability_status).replace(/-/g, '_') : null,
        checked_at: normalizeDate(row.checked_at),
        source_name: normalizeName(row.source_name),
        source_last_updated: normalizeDate(row.source_last_updated),
        next_step_type: row.next_step_type ? slugify(row.next_step_type).replace(/-/g, '_') : null,
        next_step_label: normalizeTextBlock(row.next_step_label),
        next_step_url: normalizeUrl(row.next_step_url),
        next_step_phone: normalizePhone(row.next_step_phone),
        next_step_email: normalizeEmail(row.next_step_email),
        next_step_instructions: normalizeTextBlock(row.next_step_instructions),
        requirements: normalizeTextBlock(row.requirements),
        application_url: normalizeUrl(row.application_url),
        referral_url: normalizeUrl(row.referral_url),
        languages: normalizeList(row.languages, (part) => normalizeWhitespace(part)),
        accessibility_notes: normalizeTextBlock(row.accessibility_notes),
        data_quality_notes: normalizeTextBlock(row.data_quality_notes),
        unsupported_claim_flags: normalizeTextBlock(row.unsupported_claim_flags),
        claim_status: normalizeWhitespace(row.claim_status),
        claim_email: normalizeEmail(row.claim_email),
        last_verified_at: normalizeDate(row.last_verified_at),
      }),
    });

    processTable({
      table: 'sources',
      mapper: (row) => ({
        program_id: normalizeProgramId(row.program_id, null, programMap),
        url: normalizeUrl(row.url),
        type: row.type ? slugify(row.type).replace(/-/g, '_') : null,
        confidence_rating: row.confidence_rating ? slugify(row.confidence_rating).replace(/-/g, '_') : null,
        source_url: normalizeUrl(row.source_url),
        source_type: normalizeWhitespace(row.source_type),
        data_origin: normalizeWhitespace(row.data_origin),
        verification_status: normalizeWhitespace(row.verification_status),
        last_verified_date: normalizeDate(row.last_verified_date),
        last_scraped_at: normalizeDate(row.last_scraped_at),
        confidence_score: normalizeConfidenceScore(row.confidence_score),
      }),
    });

    processTable({
      table: 'source_verifications',
      mapper: (row) => ({
        verified_by: normalizeName(row.verified_by),
        verified_date: normalizeDate(row.verified_date),
        notes: normalizeTextBlock(row.notes),
        source_url: normalizeUrl(row.source_url),
        source_type: normalizeWhitespace(row.source_type),
        data_origin: normalizeWhitespace(row.data_origin),
        verification_status: normalizeWhitespace(row.verification_status),
        last_verified_date: normalizeDate(row.last_verified_date),
        last_scraped_at: normalizeDate(row.last_scraped_at),
        confidence_score: normalizeConfidenceScore(row.confidence_score),
      }),
    });

    processTable({
      table: 'organizations',
      mapper: (row) => ({
        name: normalizeName(row.name),
        organization_type: row.organization_type ? slugify(row.organization_type).replace(/-/g, '_') : null,
        website: normalizeUrl(row.website),
        intake_phone: normalizePhone(row.intake_phone),
        intake_email: normalizeEmail(row.intake_email),
        source_url: normalizeUrl(row.source_url),
        source_type: normalizeWhitespace(row.source_type),
        data_origin: normalizeWhitespace(row.data_origin),
        verification_status: normalizeWhitespace(row.verification_status),
        last_verified_date: normalizeDate(row.last_verified_date),
        last_scraped_at: normalizeDate(row.last_scraped_at),
        confidence_score: normalizeConfidenceScore(row.confidence_score),
        notes: normalizeTextBlock(row.notes),
      }),
    });

    processTable({
      table: 'office_locations',
      mapper: (row) => ({
        office_name: normalizeName(row.office_name),
        office_type: row.office_type ? slugify(row.office_type).replace(/-/g, '_') : null,
        address: normalizeAddress(row.address),
        city: normalizeName(row.city),
        state_id: normalizeStateId(row.state_id, stateMap),
        postal_code: normalizeWhitespace(row.postal_code),
        county_id: normalizeCountyId(row.county_id, normalizeStateId(row.state_id, stateMap), countyMaps),
        intake_phone: normalizePhone(row.intake_phone),
        intake_email: normalizeEmail(row.intake_email),
        website: normalizeUrl(row.website),
        hours_text: normalizeTextBlock(row.hours_text),
        source_url: normalizeUrl(row.source_url),
        source_type: normalizeWhitespace(row.source_type),
        data_origin: normalizeWhitespace(row.data_origin),
        verification_status: normalizeWhitespace(row.verification_status),
        last_verified_date: normalizeDate(row.last_verified_date),
        last_scraped_at: normalizeDate(row.last_scraped_at),
        confidence_score: normalizeConfidenceScore(row.confidence_score),
      }),
    });

    processTable({
      table: 'service_locations',
      mapper: (row) => ({
        location_name: normalizeName(row.location_name),
        location_type: row.location_type ? slugify(row.location_type).replace(/-/g, '_') : null,
        address: normalizeAddress(row.address),
        city: normalizeName(row.city),
        state_id: normalizeStateId(row.state_id, stateMap),
        postal_code: normalizeWhitespace(row.postal_code),
        county_id: normalizeCountyId(row.county_id, normalizeStateId(row.state_id, stateMap), countyMaps),
        phone: normalizePhone(row.phone),
        email: normalizeEmail(row.email),
        website: normalizeUrl(row.website),
        appointment_url: normalizeUrl(row.appointment_url),
        hours_text: normalizeTextBlock(row.hours_text),
        source_url: normalizeUrl(row.source_url),
        source_type: normalizeWhitespace(row.source_type),
        data_origin: normalizeWhitespace(row.data_origin),
        verification_status: normalizeWhitespace(row.verification_status),
        last_verified_date: normalizeDate(row.last_verified_date),
        last_scraped_at: normalizeDate(row.last_scraped_at),
        confidence_score: normalizeConfidenceScore(row.confidence_score),
      }),
    });

    processTable({
      table: 'organization_program_links',
      mapper: (row) => ({
        program_id: normalizeProgramId(row.program_id, null, programMap),
        listing_type: row.listing_type ? slugify(row.listing_type).replace(/-/g, '_') : null,
        title: normalizeName(row.title),
        intake_model: row.intake_model ? slugify(row.intake_model).replace(/-/g, '_') : null,
        service_summary: normalizeTextBlock(row.service_summary),
        eligibility_summary: normalizeTextBlock(row.eligibility_summary),
        source_url: normalizeUrl(row.source_url),
        source_type: normalizeWhitespace(row.source_type),
        data_origin: normalizeWhitespace(row.data_origin),
        verification_status: normalizeWhitespace(row.verification_status),
        last_verified_date: normalizeDate(row.last_verified_date),
        last_scraped_at: normalizeDate(row.last_scraped_at),
        confidence_score: normalizeConfidenceScore(row.confidence_score),
      }),
    });
  });

  tx();

  if (mode === 'apply' && !skipBackfill) {
    summary.backfills.push(runBackfillScript(path.join(repoRoot, 'src/db/backfill_normalized_public_offices.js')));
    summary.backfills.push(runBackfillScript(path.join(repoRoot, 'src/db/backfill_normalized_provider_locations.js')));
    summary.backfills.push(runBackfillScript(path.join(repoRoot, 'src/db/backfill_normalized_nonprofit_areas.js')));
  }

  summary.duplicateRisk = buildDuplicateSection(db);
  db.pragma('wal_checkpoint(TRUNCATE)');
  db.close();

  if (mode === 'apply' && fs.existsSync(dbPath) && fs.existsSync(path.dirname(frontendDbPath))) {
    fs.copyFileSync(dbPath, frontendDbPath);
  }

  ensureDir(generatedDir);
  const totals = Object.values(summary.tableStats).reduce((acc, item) => {
    acc.rowsVisited += item.rowsVisited;
    acc.rowsChanged += item.rowsChanged;
    return acc;
  }, { rowsVisited: 0, rowsChanged: 0 });
  summary.totals = totals;

  const mdLines = [
    '# Canonical Normalization v1',
    '',
    `Generated: ${summary.generatedAt}`,
    `Mode: ${summary.mode}`,
    `DB Path: ${summary.dbPath}`,
    '',
    '## Totals',
    '',
    `- rows visited: ${totals.rowsVisited}`,
    `- rows changed: ${totals.rowsChanged}`,
    '',
    '## Table Stats',
    '',
  ];

  for (const [table, stats] of Object.entries(summary.tableStats)) {
    mdLines.push(`- ${table}: visited=${stats.rowsVisited}, changed=${stats.rowsChanged}`);
  }

  mdLines.push('', '## Duplicate Risk', '');
  for (const item of summary.duplicateRisk) {
    mdLines.push(`- ${item.table}: clusters=${item.duplicateClusterCount}, rows=${item.duplicateRowCount}`);
  }

  if (summary.backfills.length) {
    mdLines.push('', '## Backfills', '');
    for (const item of summary.backfills) {
      mdLines.push(`- ${item.script}`);
    }
  }

  fs.writeFileSync(summaryJsonPath, `${JSON.stringify(summary, null, 2)}\n`);
  fs.writeFileSync(summaryMdPath, `${mdLines.join('\n')}\n`);
  return summary;
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  const args = parseArgs(process.argv.slice(2));
  const summary = runCanonicalNormalization(args);
  console.log(JSON.stringify(summary, null, 2));
}
