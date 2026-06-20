import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import {
  ensureDir,
  getLatestRunId,
  outputRoot,
  writeJson,
} from './source-acquisition-lightweight-lib.mjs';
import { familyDirName } from './source-acquisition-stage-lib.mjs';
import {
  CENSUS_BATCH_URL,
  buildFipsCountyIndex,
  buildBatchCsv,
  parseAddressParts,
  parseCensusBatchResponse,
  mapGeocodeMatches,
} from './source-acquisition-provider-geocode-lib.mjs';

function parseArgs(argv) {
  const args = {
    runId: '',
    mode: 'dry-run',
    limit: 0,
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'run-id' && value) args.runId = value;
    if (flag === 'mode' && value) args.mode = value;
    if (flag === 'limit' && Number.isFinite(Number(value))) args.limit = Number(value);
  }
  return args;
}

function countBy(rows, keyFn) {
  const counts = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).map(([label, count]) => ({ label, count }));
}

function readNdjson(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function buildScopedRowKeys(runDir) {
  const candidatesPath = path.join(runDir, 'staged', familyDirName('providers_care'), 'promotion-candidates.ndjson');
  if (!fs.existsSync(candidatesPath)) return null;
  return new Set(
    readNdjson(candidatesPath).map((entry) => {
      const row = entry?.candidate?.row || {};
      return [
        row.state_id || '',
        row.source_url || '',
        row.extracted_name || '',
      ].join('|');
    }),
  );
}

async function fetchWithRetry(url, options, retries = 2) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
    }
  }
  throw lastError;
}

const args = parseArgs(process.argv.slice(2));
const runId = args.runId || getLatestRunId();
if (!runId) throw new Error('No source acquisition run found.');

const runDir = path.join(outputRoot, runId);
const geocodeRoot = path.join(runDir, 'provider-county-geocode');
ensureDir(geocodeRoot);
const scopedRowKeys = buildScopedRowKeys(runDir);

const db = new Database(path.join(process.cwd(), 'ca_disability_navigator.db'));
const countyRows = db.prepare('SELECT id, name, state_id FROM counties').all();
const fipsIndex = buildFipsCountyIndex(countyRows);

let providerRows = db.prepare(`
  SELECT *
  FROM staging_scraped_resource_providers
  WHERE source_type = 'lightweight_source_acquisition'
    AND county_id IS NULL
  ORDER BY id ASC
`).all().filter((row) => {
  if (!scopedRowKeys) return true;
  const rowKey = [
    row.state_id || '',
    row.source_url || '',
    row.extracted_name || '',
  ].join('|');
  return scopedRowKeys.has(rowKey);
});

if (args.limit > 0) {
  providerRows = providerRows.slice(0, args.limit);
}

const addressReady = providerRows.filter((row) => parseAddressParts(row.extracted_address));
const missingAddress = providerRows.filter((row) => !String(row.extracted_address || '').trim());
const malformedAddress = providerRows.filter((row) => String(row.extracted_address || '').trim() && !parseAddressParts(row.extracted_address));

const requestCsv = buildBatchCsv(addressReady);
fs.writeFileSync(path.join(geocodeRoot, 'provider-address-batch.csv'), `${requestCsv}${requestCsv ? '\n' : ''}`);
writeJson(path.join(geocodeRoot, 'missing-address.json'), missingAddress.map((row) => ({
  rowId: row.id,
  extractedName: row.extracted_name,
  sourceUrl: row.source_url,
})));
writeJson(path.join(geocodeRoot, 'malformed-address.json'), malformedAddress.map((row) => ({
  rowId: row.id,
  extractedName: row.extracted_name,
  sourceUrl: row.source_url,
  extractedAddress: row.extracted_address,
})));

let updates = [];
let skipped = [];
let liveRequest = null;
let liveError = null;

if (args.mode === 'live' && addressReady.length > 0) {
  const formData = new FormData();
  formData.set('benchmark', 'Public_AR_Current');
  formData.set('vintage', 'Current_Current');
  formData.set('addressFile', new Blob([requestCsv], { type: 'text/csv' }), 'provider-address-batch.csv');

  try {
    liveRequest = {
      url: CENSUS_BATCH_URL,
      submittedAt: new Date().toISOString(),
      requestCount: addressReady.length,
    };
    const response = await fetchWithRetry(CENSUS_BATCH_URL, {
      method: 'POST',
      headers: {
        'User-Agent': 'Ablefull Source Acquisition Provider County Geocode/1.0',
      },
      body: formData,
    });
    const responseText = await response.text();
    fs.writeFileSync(path.join(geocodeRoot, 'census-response.csv'), responseText);
    const geocodeRows = parseCensusBatchResponse(responseText);
    ({ updates, skipped } = mapGeocodeMatches(addressReady, geocodeRows, fipsIndex));

    const tx = db.transaction(() => {
      for (const update of updates) {
        db.prepare(`
          UPDATE staging_scraped_resource_providers
          SET county_id = ?, evidence_level = ?
          WHERE id = ?
        `).run(update.countyId, update.evidenceLevel, update.rowId);
      }
    });
    tx();
  } catch (error) {
    liveError = {
      message: error.message,
      at: new Date().toISOString(),
    };
    writeJson(path.join(geocodeRoot, 'error-log.json'), liveError);
  }
}

const summary = {
  runId,
  mode: args.mode,
  inspectedCount: providerRows.length,
  addressReadyCount: addressReady.length,
  missingAddressCount: missingAddress.length,
  malformedAddressCount: malformedAddress.length,
  updatedCount: updates.length,
  skippedCount: skipped.length,
  skippedReasons: countBy(skipped, (row) => row.reason),
  liveRequest,
  liveError,
};

writeJson(path.join(geocodeRoot, 'summary.json'), summary);
writeJson(path.join(geocodeRoot, 'updates.json'), updates);
writeJson(path.join(geocodeRoot, 'skipped.json'), skipped);
fs.writeFileSync(
  path.join(geocodeRoot, 'summary.md'),
  [
    '# Provider County Geocode Summary',
    '',
    `- Run ID: \`${runId}\``,
    `- Mode: \`${args.mode}\``,
    `- Inspected: \`${summary.inspectedCount}\``,
    `- Address-ready: \`${summary.addressReadyCount}\``,
    `- Missing address: \`${summary.missingAddressCount}\``,
    `- Malformed address: \`${summary.malformedAddressCount}\``,
    `- Updated: \`${summary.updatedCount}\``,
    `- Skipped after live geocode: \`${summary.skippedCount}\``,
    '',
    '## Skip Reasons',
    '',
    ...(summary.skippedReasons.length ? summary.skippedReasons.map((item) => `- ${item.label}: ${item.count}`) : ['_None_']),
    '',
  ].join('\n'),
);

db.close();
console.log(JSON.stringify(summary, null, 2));
