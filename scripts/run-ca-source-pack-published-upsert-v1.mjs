import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { repoRelativePath, writeJson } from './ca-v1-data-quality-lib.mjs';

function parseArgs(argv) {
  const args = {
    runId: 'ca-v3',
    inputDir: path.join(process.cwd(), 'data', 'generated'),
    runsDir: path.join(process.cwd(), 'data', 'source-acquisition-runs'),
    dbPath: path.join(process.cwd(), 'ca_disability_navigator.db'),
    mode: 'dry-run',
    summaryPrefix: 'ca_live_upsert_v1',
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'run-id' && value) args.runId = value;
    if (flag === 'input-dir' && value) args.inputDir = path.resolve(value);
    if (flag === 'runs-dir' && value) args.runsDir = path.resolve(value);
    if (flag === 'db-path' && value) args.dbPath = path.resolve(value);
    if (flag === 'mode' && value) args.mode = value;
    if (flag === 'summary-prefix' && value) args.summaryPrefix = value;
  }
  return args;
}

function readNdjson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function normalizeUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    url.hash = '';
    if (url.pathname.endsWith('/') && url.pathname !== '/') url.pathname = url.pathname.slice(0, -1);
    return url.toString();
  } catch {
    return String(value || '').trim();
  }
}

function urlVariants(value) {
  const normalized = normalizeUrl(value);
  if (!normalized) return [''];
  const variants = new Set([normalized]);
  if (normalized.endsWith('/')) variants.add(normalized.slice(0, -1));
  else variants.add(`${normalized}/`);
  return Array.from(variants);
}

function resolveAgainst(base, value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    return new URL(raw, base).toString();
  } catch {
    return raw;
  }
}

function fieldMap(row) {
  return new Map((row.fieldEntries || []).map((entry) => [entry.field, entry.value]));
}

function parseCountyId(recordId) {
  const raw = String(recordId || '');
  const entityId = raw.split('|')[2] || '';
  const candidate = entityId.startsWith('county-')
    ? entityId
    : (raw.match(/\bcounty-[a-z0-9-]+/i)?.[0] || '');
  if (!candidate.startsWith('county-')) return '';
  const segments = candidate.split('-');
  return segments.length >= 3 ? segments.slice(2).join('-') : '';
}

function getColumns(db, tableName) {
  return db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name);
}

function ensureDisplayStatusColumns(db) {
  for (const tableName of ['state_resource_agencies', 'county_offices', 'programs', 'forms_and_guides']) {
    const columns = getColumns(db, tableName);
    if (!columns.includes('display_status')) {
      db.prepare(`ALTER TABLE ${tableName} ADD COLUMN display_status TEXT DEFAULT 'published'`).run();
    }
  }
}

function pickExistingId(db, tableName, decision, fields, candidateRow) {
  if (tableName === 'state_resource_agencies') {
    const [sourceA = '', sourceB = ''] = urlVariants(decision.sourceUrl);
    const [websiteA = '', websiteB = ''] = urlVariants(fields.get('website') || decision.finalUrl);
    const bySource = db.prepare(`
      SELECT id FROM state_resource_agencies
      WHERE state_id = 'california'
        AND (
          source_url IN (?, ?)
          OR website IN (?, ?)
        )
      LIMIT 1
    `).get(sourceA, sourceB, websiteA, websiteB);
    if (bySource?.id) return bySource.id;
    const byName = db.prepare(`
      SELECT id FROM state_resource_agencies
      WHERE state_id = 'california'
        AND lower(name) = lower(?)
      LIMIT 1
    `).get(fields.get('name') || candidateRow.extracted_name || '');
    return byName?.id || '';
  }
  if (tableName === 'county_offices') {
    const countyId = parseCountyId(decision.recordId);
    const programId = 'ihss-for-children';
    const existing = db.prepare(`
      SELECT id FROM county_offices
      WHERE county_id = ? AND program_id = ?
      LIMIT 1
    `).get(countyId, programId);
    return existing?.id || '';
  }
  if (tableName === 'forms_and_guides') {
    const [sourceA = '', sourceB = ''] = urlVariants(decision.sourceUrl);
    const [pdfA = '', pdfB = ''] = urlVariants(fields.get('official_download_url') || candidateRow.official_download_url || decision.sourceUrl);
    const existing = db.prepare(`
      SELECT id FROM forms_and_guides
      WHERE source_url IN (?, ?) OR pdf_url IN (?, ?)
      LIMIT 1
    `).get(sourceA, sourceB, pdfA, pdfB);
    return existing?.id || '';
  }
  if (tableName === 'programs') {
    const [sourceA = '', sourceB = ''] = urlVariants(decision.sourceUrl);
    const existing = db.prepare(`
      SELECT id FROM programs
      WHERE state_id = 'california'
        AND (
          source_url IN (?, ?)
          OR official_source_url IN (?, ?)
          OR lower(name) = lower(?)
        )
      LIMIT 1
    `).get(sourceA, sourceB, sourceA, sourceB, fields.get('name') || candidateRow.extracted_name || '');
    return existing?.id || '';
  }
  return '';
}

function buildUpsertRecord(db, decision, candidateRow) {
  const fields = fieldMap(decision);
  const tableName = candidateRow.suggested_target_table || candidateRow.target_table;
  const existingId = pickExistingId(db, tableName, decision, fields, candidateRow);

  if (tableName === 'state_resource_agencies') {
    const agencyName = fields.get('name') || '';
    if (!agencyName) return null;
    const id = existingId || `ca-dd-${slugify(agencyName)}`;
    const existing = existingId
      ? db.prepare('SELECT * FROM state_resource_agencies WHERE id = ?').get(existingId)
      : null;
    return {
      tableName,
      id,
      values: {
        id,
        state_id: 'california',
        agency_type: 'regional_center',
        name: agencyName,
        counties_served: existing?.counties_served || candidateRow.counties_served || '',
        catchment_boundaries: existing?.catchment_boundaries || candidateRow.catchment_boundaries || '',
        website: normalizeUrl(fields.get('website') || candidateRow.extracted_website || decision.finalUrl),
        intake_phone: fields.get('phone') || candidateRow.extracted_phone || '',
        early_intervention_contact: fields.get('early_start_contact') || '',
        agency_intake_contact: fields.get('intake_contact') || fields.get('phone') || candidateRow.extracted_phone || '',
        eligibility_info_page: resolveAgainst(decision.finalUrl, fields.get('eligibility_info_page') || candidateRow.eligibility_info_page || decision.sourceUrl),
        services_page: resolveAgainst(decision.finalUrl, fields.get('services_page') || candidateRow.services_page || decision.sourceUrl),
        appeals_info: resolveAgainst(decision.finalUrl, fields.get('appeals_info') || candidateRow.appeals_info || decision.sourceUrl),
        languages: existing?.languages || '',
        last_verified_date: String(decision.fetchedAt || '').slice(0, 10),
        source_urls: JSON.stringify(uniqueCompact([decision.sourceUrl, decision.provenanceUrl])),
        source_url: normalizeUrl(decision.sourceUrl),
        source_type: 'official_state',
        data_origin: 'ca_source_pack_published_v1',
        verification_status: 'official_verified',
        last_scraped_at: decision.fetchedAt,
        confidence_score: decision.confidenceScore || 1,
        evidence_level: 'ca_source_pack_published_v1',
        frc_relationship: existing?.frc_relationship || '',
        office_locations: fields.get('address') || existing?.office_locations || '',
        display_status: 'published',
      },
    };
  }

  if (tableName === 'county_offices') {
    const countyId = parseCountyId(decision.recordId);
    const id = existingId || `ca-office-${countyId}-ihss`;
    const officeName = fields.get('office_name') || '';
    if (!officeName || !countyId) return null;
    return {
      tableName,
      id,
      values: {
        id,
        county_id: countyId,
        program_id: 'ihss-for-children',
        office_name: officeName,
        address: fields.get('address') || candidateRow.extracted_address || '',
        phone: fields.get('phone') || candidateRow.extracted_phone || '',
        email: candidateRow.extracted_email || '',
        website: normalizeUrl(fields.get('website') || candidateRow.extracted_website || decision.finalUrl),
        source_url: normalizeUrl(decision.sourceUrl),
        source_type: 'official_county',
        data_origin: 'ca_source_pack_published_v1',
        verification_status: 'official_verified',
        last_verified_date: String(decision.fetchedAt || '').slice(0, 10),
        last_scraped_at: decision.fetchedAt,
        confidence_score: decision.confidenceScore || 1,
        evidence_level: 'ca_source_pack_published_v1',
        display_status: 'published',
      },
    };
  }

  if (tableName === 'forms_and_guides') {
    const formNumber = fields.get('form_number') || '';
    const title = fields.get('title') || '';
    if (!title) return null;
    const id = existingId || `ca-form-${slugify(formNumber || title)}`;
    return {
      tableName,
      id,
      values: {
        id,
        state_id: 'california',
        program_id: null,
        title,
        slug: candidateRow.slug || slugify(title),
        category: /\bappeal/i.test(title) ? 'appeals' : 'forms',
        form_type: formNumber || 'official_form',
        agency: fields.get('issuing_agency') || candidateRow.source_name || '',
        source_url: normalizeUrl(decision.sourceUrl),
        pdf_url: normalizeUrl(fields.get('official_download_url') || candidateRow.official_download_url || decision.sourceUrl),
        description: title,
        related_action: '',
        display_context: 'california_source_pack_v1',
        who_uses_it: fields.get('who_uses_it') || candidateRow.who_uses_it || '',
        who_signs_it: fields.get('who_signs_it') || candidateRow.who_signs_it || '',
        where_to_send_it: fields.get('where_to_send_it') || candidateRow.where_to_send_it || '',
        deadline: fields.get('revision_date') || '',
        attachments: '',
        common_mistakes: '',
        letter_template: '',
        call_script: '',
        evidence_level: 'ca_source_pack_published_v1',
        data_origin: 'ca_source_pack_published_v1',
        verification_status: 'official_verified',
        confidence_score: decision.confidenceScore || 1,
        last_checked_at: String(decision.fetchedAt || '').slice(0, 10),
        last_verified_at: decision.fetchedAt,
        display_status: 'published',
      },
    };
  }

  if (tableName === 'programs') {
    const title = fields.get('name') || '';
    if (!title) return null;
    const id = existingId || `ca-program-${slugify(title)}`;
    return {
      tableName,
      id,
      values: {
        id,
        name: title,
        description: fields.get('description') || candidateRow.description || '',
        who_it_is_for: candidateRow.who_it_is_for || '',
        who_might_qualify: candidateRow.who_might_qualify || '',
        official_source_url: normalizeUrl(decision.sourceUrl),
        category: 'state',
        confidence_score: decision.confidenceScore || 1,
        last_verified_date: String(decision.fetchedAt || '').slice(0, 10),
        state_id: 'california',
        source_url: normalizeUrl(decision.sourceUrl),
        source_type: 'official_state',
        data_origin: 'ca_source_pack_published_v1',
        verification_status: 'official_verified',
        last_scraped_at: decision.fetchedAt,
        program_type: candidateRow.program_type || decision.family,
        display_status: 'published',
      },
    };
  }

  return null;
}

function uniqueCompact(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function upsert(db, record) {
  const columns = getColumns(db, record.tableName);
  const insertColumns = Object.keys(record.values).filter((column) => columns.includes(column));
  const placeholders = insertColumns.map(() => '?').join(', ');
  db.prepare(`DELETE FROM ${record.tableName} WHERE id = ?`).run(record.id);
  db.prepare(`INSERT INTO ${record.tableName} (${insertColumns.join(', ')}) VALUES (${placeholders})`)
    .run(...insertColumns.map((column) => record.values[column] ?? null));
}

const args = parseArgs(process.argv.slice(2));
const db = new Database(args.dbPath);
ensureDisplayStatusColumns(db);

const decisions = readNdjson(path.join(args.inputDir, 'ca_publish_decisions_v1.jsonl'))
  .filter((row) => row.displayStatusDecision === 'published');
const stagedRoot = path.join(args.runsDir, args.runId, 'staged');
const stagedByRecordId = new Map();
if (fs.existsSync(stagedRoot)) {
  for (const familyDir of fs.readdirSync(stagedRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)) {
    const filePath = path.join(stagedRoot, familyDir, 'promotion-candidates.ndjson');
    for (const row of readNdjson(filePath)) stagedByRecordId.set(row.recordId, row);
  }
}

const actions = [];
const skipped = [];
for (const decision of decisions) {
  const staged = stagedByRecordId.get(decision.recordId);
  if (!staged?.candidate?.row) {
    skipped.push({
      recordId: decision.recordId,
      family: decision.family,
      reason: 'missing_staged_candidate',
    });
    continue;
  }
  const action = buildUpsertRecord(db, decision, staged.candidate.row);
  if (action) {
    actions.push({
      recordId: decision.recordId,
      family: decision.family,
      tableName: action.tableName,
      id: action.id,
      values: action.values,
    });
  } else {
    skipped.push({
      recordId: decision.recordId,
      family: decision.family,
      reason: 'missing_required_semantic_fields',
    });
  }
}

if (args.mode === 'apply') {
  const tx = db.transaction(() => {
    for (const action of actions) upsert(db, action);
  });
  tx();
}

const summary = {
  runId: args.runId,
  mode: args.mode,
  dbPath: repoRelativePath(args.dbPath),
  publishedDecisionCount: decisions.length,
  actionableCount: actions.length,
  skippedCount: skipped.length,
  upsertedByTable: actions.reduce((acc, row) => {
    acc[row.tableName] = (acc[row.tableName] || 0) + 1;
    return acc;
  }, {}),
  actions: actions.map((row) => ({
    recordId: row.recordId,
    family: row.family,
    tableName: row.tableName,
    id: row.id,
    display_status: row.values.display_status,
    source_url: row.values.source_url,
  })),
  skipped,
};

const summaryPath = path.join(args.inputDir, `${args.summaryPrefix}.json`);
writeJson(summaryPath, summary);
console.log(JSON.stringify({ ...summary, summaryPath: repoRelativePath(summaryPath) }, null, 2));
