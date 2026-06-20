import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import {
  getLatestRunId,
  outputRoot,
  parseFamilyRecord,
  writeJson,
  writeNdjson,
} from './source-acquisition-lightweight-lib.mjs';
import {
  mergeProviderSupportExtraction,
  pickProviderSupportLink,
} from './source-acquisition-provider-support-lib.mjs';

const REQUEST_TIMEOUT_MS = 15000;
const DEFAULT_RETRY_COUNT = 2;
const DEFAULT_RATE_LIMIT_MS = 1200;
const MAX_RECORDS_PER_RUN = 5;

function parseArgs(argv) {
  const args = {
    runId: '',
    mode: 'dry-run',
    limit: MAX_RECORDS_PER_RUN,
    retryCount: DEFAULT_RETRY_COUNT,
    rateLimitMs: DEFAULT_RATE_LIMIT_MS,
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'run-id' && value) args.runId = value;
    if (flag === 'mode' && value) args.mode = value;
    if (flag === 'limit' && Number.isFinite(Number(value))) args.limit = Math.max(1, Math.min(MAX_RECORDS_PER_RUN, Number(value)));
    if (flag === 'retry-count' && Number.isFinite(Number(value))) args.retryCount = Math.max(0, Number(value));
    if (flag === 'rate-limit-ms' && Number.isFinite(Number(value))) args.rateLimitMs = Math.max(0, Number(value));
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readNdjson(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function classifyFetchError(error) {
  const message = String(error?.message || error || 'unknown fetch error');
  const causeCode = error?.cause?.code || '';
  const causeMessage = error?.cause?.message || '';

  if (causeCode === 'ENOTFOUND') return { error: 'dns_lookup_failed', errorCode: causeCode, errorDetail: causeMessage || message };
  if (causeCode === 'ECONNREFUSED') return { error: 'connection_refused', errorCode: causeCode, errorDetail: causeMessage || message };
  if (causeCode === 'ETIMEDOUT' || error?.name === 'TimeoutError') return { error: 'request_timed_out', errorCode: causeCode || 'TIMEOUT', errorDetail: causeMessage || message };
  if (message.toLowerCase().includes('fetch failed')) return { error: 'fetch_failed', errorCode: causeCode || 'FETCH_FAILED', errorDetail: causeMessage || message };
  return { error: message, errorCode: causeCode || 'UNKNOWN', errorDetail: causeMessage || message };
}

async function fetchWithRetry(url, args) {
  let lastError = null;
  for (let attempt = 1; attempt <= args.retryCount + 1; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': 'Ablefull provider support followup/1.0 (+https://ablefull.com)',
          'accept-language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const contentType = response.headers.get('content-type') || '';
      const body = await response.text();
      return {
        ok: response.ok,
        status: response.status,
        finalUrl: response.url || url,
        contentType,
        body,
        attempt,
      };
    } catch (error) {
      lastError = error;
      if (attempt <= args.retryCount) await sleep(args.rateLimitMs);
    }
  }
  throw lastError;
}

function saveFetchedArtifact({ pagesDir, row, fetched, index }) {
  const fileName = [
    String(index + 1).padStart(5, '0'),
    slugify(row.stateId),
    'provider-support-followup',
    slugify(row.extractedName),
  ].join('-') + '.html';
  const filePath = path.join(pagesDir, fileName);
  fs.writeFileSync(filePath, fetched.body);
  return filePath;
}

function appendExtractionNotes(existing, supportUrl) {
  const suffix = `Support-page followup extracted bounded contact evidence from ${supportUrl}.`;
  return existing ? `${existing} ${suffix}` : suffix;
}

function renderMarkdown(summary, rows) {
  const lines = [
    '# Provider Support Followup',
    '',
    `- Run ID: \`${summary.runId}\``,
    `- Mode: \`${summary.mode}\``,
    `- Selected: \`${summary.selectedCount}\``,
    `- Updated: \`${summary.updatedCount}\``,
    `- Missing Candidate: \`${summary.missingCandidateCount}\``,
    `- Fetched Without New Signal: \`${summary.noSignalCount}\``,
    `- Failed: \`${summary.failedCount}\``,
    '',
    '## Outcomes',
    '',
    ...Object.entries(summary.byOutcome).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## Sample Rows',
    '',
    ...rows.slice(0, 10).map((row) => `- ${row.extractedName || row.sourceUrl}: ${row.outcome}`),
    '',
  ];
  return `${lines.join('\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));
const runId = args.runId || getLatestRunId();
if (!runId) throw new Error('No source acquisition run found.');

const runDir = path.join(outputRoot, runId);
const followupRoot = path.join(runDir, 'provider-support-followup');
const pagesDir = path.join(followupRoot, 'pages');
fs.mkdirSync(pagesDir, { recursive: true });

const parsedPath = path.join(runDir, 'parsed', 'providers_care', 'records.ndjson');
const decisionsPath = path.join(runDir, 'promoted', 'staging_scraped_resource_providers-decisions.json');
if (!fs.existsSync(parsedPath)) throw new Error(`Missing parsed providers artifact: ${parsedPath}`);
if (!fs.existsSync(decisionsPath)) throw new Error(`Missing promoted provider decisions artifact: ${decisionsPath}`);

const parsedRecords = readNdjson(parsedPath);
const decisions = readJson(decisionsPath);
const manualRows = decisions
  .filter((row) => row.action === 'manual_review' && row.reason === 'missing_county_id_for_provider')
  .slice(0, args.limit);

const selectedRows = manualRows.map((decision) => {
  const parsedRecord = parsedRecords.find((record) =>
    record.sourceUrl === decision.sourceUrl
    || record.finalUrl === decision.sourceUrl
    || (record.familyExtraction?.organizationName || '') === decision.extractedName);
  const candidate = parsedRecord ? pickProviderSupportLink(parsedRecord) : null;
  return {
    stagingId: decision.stagingId,
    stateId: parsedRecord?.stateId || '',
    sourceUrl: decision.sourceUrl,
    extractedName: decision.extractedName,
    parsedRecord,
    candidateSupportUrl: candidate?.resolvedUrl || '',
    candidateSupportText: candidate?.text || '',
  };
});

const db = args.mode === 'live' ? new Database(path.join(process.cwd(), 'ca_disability_navigator.db')) : null;
const results = [];

for (let index = 0; index < selectedRows.length; index += 1) {
  const row = selectedRows[index];
  if (!row.parsedRecord) {
    results.push({ ...row, outcome: 'missing_parsed_record' });
    continue;
  }
  if (!row.candidateSupportUrl) {
    results.push({ ...row, outcome: 'missing_support_candidate' });
    continue;
  }
  if (args.mode === 'dry-run') {
    results.push({ ...row, outcome: 'support_candidate_ready' });
    continue;
  }

  await sleep(index === 0 ? 0 : args.rateLimitMs);
  try {
    const fetched = await fetchWithRetry(row.candidateSupportUrl, args);
    if (!fetched.ok) {
      results.push({
        ...row,
        outcome: 'support_fetch_http_failure',
        status: fetched.status,
        finalUrl: fetched.finalUrl,
      });
      continue;
    }

    const savedPath = saveFetchedArtifact({ pagesDir, row, fetched, index });
    const supportRecord = parseFamilyRecord({
      stateId: row.parsedRecord.stateId,
      gapFamily: 'providers_care',
      targetTable: 'resource_providers',
      sourceQueue: row.parsedRecord.sourceQueue,
      sourceName: row.extractedName,
      sourceUrl: row.candidateSupportUrl,
      finalUrl: fetched.finalUrl,
      savedPath,
      contentType: fetched.contentType,
    }, fetched.body);
    const merged = mergeProviderSupportExtraction(row.parsedRecord, supportRecord);
    const hasNewAddress = !row.parsedRecord.familyExtraction?.contactAddress && Boolean(merged.extractedAddress);
    const hasNewPhone = !row.parsedRecord.familyExtraction?.contactPhone && Boolean(merged.extractedPhone);
    const hasNewEmail = !row.parsedRecord.familyExtraction?.contactEmail && Boolean(merged.extractedEmail);
    const outcome = (hasNewAddress || hasNewPhone || hasNewEmail) ? 'support_signal_extracted' : 'support_page_no_new_signal';

    if (db && outcome === 'support_signal_extracted') {
      db.prepare(`
        UPDATE staging_scraped_resource_providers
        SET extracted_name = ?,
            extracted_phone = ?,
            extracted_email = ?,
            extracted_address = ?,
            extraction_notes = ?,
            raw_text_excerpt = ?,
            evidence_level = ?
        WHERE id = ?
      `).run(
        merged.extractedName || row.extractedName,
        merged.extractedPhone || '',
        merged.extractedEmail || '',
        merged.extractedAddress || '',
        appendExtractionNotes(row.parsedRecord.extractionNotes || '', merged.supportSourceUrl),
        supportRecord.textSample || row.parsedRecord.textSample || '',
        'support_page_contact_signal',
        row.stagingId,
      );
    }

    results.push({
      ...row,
      outcome,
      finalUrl: fetched.finalUrl,
      status: fetched.status,
      savedPath,
      merged,
    });
  } catch (error) {
    const classified = classifyFetchError(error);
    results.push({
      ...row,
      outcome: 'support_fetch_failed',
      error: classified.error,
      errorCode: classified.errorCode,
      errorDetail: classified.errorDetail,
    });
  }
}

if (db) db.close();

const summary = {
  runId,
  mode: args.mode,
  selectedCount: selectedRows.length,
  updatedCount: results.filter((row) => row.outcome === 'support_signal_extracted').length,
  missingCandidateCount: results.filter((row) => row.outcome === 'missing_support_candidate').length,
  noSignalCount: results.filter((row) => row.outcome === 'support_page_no_new_signal').length,
  failedCount: results.filter((row) => row.outcome === 'support_fetch_failed' || row.outcome === 'support_fetch_http_failure').length,
  byOutcome: results.reduce((acc, row) => {
    acc[row.outcome] = (acc[row.outcome] || 0) + 1;
    return acc;
  }, {}),
};

writeNdjson(path.join(followupRoot, 'results.ndjson'), results);
writeJson(path.join(followupRoot, 'summary.json'), summary);
fs.writeFileSync(path.join(followupRoot, 'report.md'), renderMarkdown(summary, results));

console.log(JSON.stringify({
  ...summary,
  artifacts: {
    summaryJson: path.join(followupRoot, 'summary.json'),
    resultsNdjson: path.join(followupRoot, 'results.ndjson'),
    reportMd: path.join(followupRoot, 'report.md'),
  },
}, null, 2));
