import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import {
  fetchWithRetry,
  DEFAULT_REQUEST_TIMEOUT_MS,
  DEFAULT_BODY_TIMEOUT_MS,
} from './source-acquisition-fetch-lib.mjs';

const repoRoot = process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const knowledgeStatusQueuePath = path.join(docsDir, `knowledge-content-status-queue-${generatedDate}.json`);
const providerFollowupBlockerRegistryPath = latestGeneratedJsonIfPresent('provider-followup-blocker-registry-');
const advocateFollowupBlockerRegistryPath = path.join(docsDir, `advocate-followup-blocker-registry-${generatedDate}.json`);
const competitiveHelpFollowupBlockerRegistryPath = path.join(docsDir, `competitive-help-followup-blocker-registry-${generatedDate}.json`);
const outputRoot = path.join(repoRoot, 'data', 'source-acquisition-runs');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');
const competitiveHelpFamilies = new Set([
  'housing',
  'goods_supplies',
  'jobs_vocational',
  'care_independent_living',
  'legal_aid',
  'transport_utilities_food',
]);

function normalizeUrl(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return '';
  try {
    const parsed = new URL(value);
    parsed.hash = '';
    if (parsed.pathname !== '/') {
      parsed.pathname = parsed.pathname
        .replace(/\/index\.html?$/i, '')
        .replace(/\/+$/, '');
    }
    return parsed.toString();
  } catch {
    return value
      .replace(/\/index\.html?$/i, '')
      .replace(/\/+$/, '');
  }
}

function parseArgs(argv) {
  const args = {
    mode: 'dry-run',
    status: 'ready_lightweight',
    limit: 0,
    wave: '',
    gap: '',
    queue: '',
    lane: '',
    state: '',
    planPath: '',
    retryCount: 2,
    rateLimitMs: 1200,
    concurrency: 8,
    sourceUrlPattern: '',
    requestTimeoutMs: DEFAULT_REQUEST_TIMEOUT_MS,
    bodyTimeoutMs: DEFAULT_BODY_TIMEOUT_MS,
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'mode' && value) args.mode = value.toLowerCase();
    if (flag === 'status' && value) args.status = value;
    if (flag === 'limit' && Number.isFinite(Number(value))) args.limit = Number(value);
    if (flag === 'wave' && value) args.wave = value;
    if (flag === 'gap' && value) args.gap = value;
    if (flag === 'queue' && value) args.queue = value;
    if (flag === 'lane' && value) args.lane = value;
    if (flag === 'state' && value) args.state = value.toLowerCase();
    if (flag === 'plan-path' && value) args.planPath = value;
    if (flag === 'retry-count' && Number.isFinite(Number(value))) args.retryCount = Number(value);
    if (flag === 'rate-limit-ms' && Number.isFinite(Number(value))) args.rateLimitMs = Number(value);
    if (flag === 'concurrency' && Number.isFinite(Number(value))) args.concurrency = Math.max(1, Number(value));
    if (flag === 'source-url-pattern' && value) args.sourceUrlPattern = value.toLowerCase();
    if (flag === 'request-timeout-ms' && Number.isFinite(Number(value))) args.requestTimeoutMs = Number(value);
    if (flag === 'body-timeout-ms' && Number.isFinite(Number(value))) args.bodyTimeoutMs = Number(value);
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJsonIfPresent(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  return matches.length ? path.join(docsDir, matches.at(-1)) : null;
}

function loadRetryableKnowledgeSourceUrls() {
  if (!fs.existsSync(knowledgeStatusQueuePath)) {
    return {
      path: knowledgeStatusQueuePath,
      sourceUrls: new Set(),
      retryableRows: 0,
    };
  }

  const payload = readJson(knowledgeStatusQueuePath);
  const rows = Array.isArray(payload?.rows) ? payload.rows : [];
  const retryable = rows.filter((row) =>
    String(row.finalStatus || '').trim() === 'deferred_unresolved'
    && String(row.lastFollowupReason || '').trim() === 'sandbox_network_disabled'
  );

  return {
    path: knowledgeStatusQueuePath,
    sourceUrls: new Set(retryable.map((row) => String(row.sourceUrl || '').trim()).filter(Boolean)),
    retryableRows: retryable.length,
  };
}

function loadProviderRepeatedBlockerSourceUrls() {
  if (!providerFollowupBlockerRegistryPath || !fs.existsSync(providerFollowupBlockerRegistryPath)) {
    return {
      path: providerFollowupBlockerRegistryPath,
      sourceUrls: new Set(),
      repeatedRows: 0,
    };
  }

  const payload = readJson(providerFollowupBlockerRegistryPath);
  const rows = Array.isArray(payload?.rows) ? payload.rows : [];
  return {
    path: providerFollowupBlockerRegistryPath,
    sourceUrls: new Set(rows.map((row) => String(row.sourceUrl || '').trim()).filter(Boolean)),
    repeatedRows: rows.length,
  };
}

function loadAdvocateBlockedSourceUrls() {
  if (!fs.existsSync(outputRoot)) {
    return {
      path: outputRoot,
      sourceUrls: new Set(),
      actionableRows: 0,
    };
  }

  const grouped = new Map();
  const runDirs = fs.readdirSync(outputRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const runId of runDirs) {
    const followupDir = path.join(outputRoot, runId, 'followups');
    if (!fs.existsSync(followupDir)) continue;
    for (const [fileName, bucket] of [
      ['blocked-failures.json', 'blocked'],
      ['source-repair.json', 'source_repair'],
      ['retryable-failures.json', 'retryable'],
    ]) {
      const filePath = path.join(followupDir, fileName);
      if (!fs.existsSync(filePath)) continue;
      const rows = readJson(filePath);
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (row.gapFamily !== 'advocates_legal') continue;
        const sourceUrl = String(row.sourceUrl || '').trim();
        const followupReason = String(row.followupReason || '').trim();
        if (!sourceUrl || !followupReason) continue;
        const key = `${bucket}|${followupReason}|${sourceUrl}`;
        const current = grouped.get(key) || {
          bucket,
          followupReason,
          sourceUrl,
          count: 0,
        };
        current.count += 1;
        grouped.set(key, current);
      }
    }
  }

  const rows = [...grouped.values()].filter((entry) =>
    entry.count >= 2 || (entry.bucket === 'source_repair' && entry.followupReason === 'dns_lookup_failed')
  );
  return {
    path: outputRoot,
    sourceUrls: new Set(rows.map((row) => String(row.sourceUrl || '').trim()).filter(Boolean)),
    actionableRows: rows.length,
  };
}

function loadCompetitiveHelpBlockedSourceUrls(gapFamily) {
  if (!fs.existsSync(competitiveHelpFollowupBlockerRegistryPath)) {
    return {
      path: competitiveHelpFollowupBlockerRegistryPath,
      sourceUrls: new Set(),
      actionableRows: 0,
    };
  }

  const payload = readJson(competitiveHelpFollowupBlockerRegistryPath);
  const rows = Array.isArray(payload?.rows) ? payload.rows.filter((row) => row.gapFamily === gapFamily) : [];
  return {
    path: competitiveHelpFollowupBlockerRegistryPath,
    sourceUrls: new Set(rows.map((row) => String(row.sourceUrl || '').trim()).filter(Boolean)),
    actionableRows: rows.length,
  };
}

function loadPreviouslyAcceptedProviderSourceUrls() {
  if (!fs.existsSync(outputRoot)) {
    return {
      path: outputRoot,
      sourceUrls: new Set(),
      acceptedRows: 0,
    };
  }

  const runDirs = fs.readdirSync(outputRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const sourceUrls = new Set();
  let acceptedRows = 0;

  for (const runId of runDirs) {
    const acceptedPath = path.join(outputRoot, runId, 'validated', 'providers_care', 'accepted.ndjson');
    if (!fs.existsSync(acceptedPath)) continue;
    const lines = fs.readFileSync(acceptedPath, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    for (const line of lines) {
      const row = JSON.parse(line);
      const sourceUrl = String(row.sourceUrl || '').trim();
      if (!sourceUrl) continue;
      sourceUrls.add(sourceUrl);
      acceptedRows += 1;
    }
  }

  return {
    path: outputRoot,
    sourceUrls,
    acceptedRows,
  };
}

function loadPreviouslyAcceptedFamilySourceUrls(gapFamily) {
  if (!fs.existsSync(outputRoot)) {
    return {
      path: outputRoot,
      sourceUrls: new Set(),
      acceptedRows: 0,
    };
  }

  const runDirs = fs.readdirSync(outputRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const sourceUrls = new Set();
  let acceptedRows = 0;

  for (const runId of runDirs) {
    const acceptedPath = path.join(outputRoot, runId, 'validated', gapFamily, 'accepted.ndjson');
    if (!fs.existsSync(acceptedPath)) continue;
    const lines = fs.readFileSync(acceptedPath, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    for (const line of lines) {
      const row = JSON.parse(line);
      const sourceUrl = String(row.sourceUrl || '').trim();
      if (!sourceUrl) continue;
      sourceUrls.add(sourceUrl);
      acceptedRows += 1;
    }
  }

  return {
    path: outputRoot,
    sourceUrls,
    acceptedRows,
  };
}

function loadRepeatedFamilyFollowupSourceUrls(gapFamily, minRepeats = 2) {
  if (!fs.existsSync(outputRoot)) {
    return {
      path: outputRoot,
      sourceUrls: new Set(),
      repeatedRows: 0,
    };
  }

  const grouped = new Map();
  const terminalBlockedReasonsByFamily = new Map([
    ['programs_benefits', new Set(['access_blocked_403'])],
    ['waivers', new Set(['access_blocked_403'])],
    ['program_waitlists', new Set(['access_blocked_403'])],
    ['medicaid_hhs_offices', new Set(['access_blocked_403'])],
  ]);
  const runDirs = fs.readdirSync(outputRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const runId of runDirs) {
    const followupDir = path.join(outputRoot, runId, 'followups');
    if (!fs.existsSync(followupDir)) continue;
    for (const fileName of ['blocked-failures.json', 'source-repair.json', 'retryable-failures.json']) {
      const filePath = path.join(followupDir, fileName);
      if (!fs.existsSync(filePath)) continue;
      const rows = readJson(filePath);
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (row.gapFamily !== gapFamily) continue;
        const sourceUrl = String(row.sourceUrl || '').trim();
        const reason = String(row.followupReason || '').trim();
        if (!sourceUrl || !reason) continue;
        const bucket = fileName === 'blocked-failures.json'
          ? 'blocked'
          : fileName === 'source-repair.json'
            ? 'source_repair'
            : 'retryable';
        const key = `${bucket}|${reason}|${sourceUrl}`;
        const current = grouped.get(key) || { count: 0, sourceUrl, reason, bucket };
        current.count += 1;
        grouped.set(key, current);
      }
    }
  }

  const terminalBlockedReasons = terminalBlockedReasonsByFamily.get(gapFamily) || new Set();
  const repeated = [...grouped.values()].filter((entry) =>
    entry.count >= minRepeats
    || (entry.bucket === 'blocked' && terminalBlockedReasons.has(entry.reason))
  );
  return {
    path: outputRoot,
    sourceUrls: new Set(repeated.map((entry) => entry.sourceUrl)),
    repeatedRows: repeated.length,
  };
}

function loadPreviouslyRejectedProviderSourceUrls() {
  if (!fs.existsSync(outputRoot)) {
    return {
      path: outputRoot,
      sourceUrls: new Set(),
      rejectedRows: 0,
    };
  }

  const runDirs = fs.readdirSync(outputRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const sourceUrls = new Set();
  let rejectedRows = 0;
  const excludedReasons = new Set([
    'missing_provider_contact_signal',
  ]);

  for (const runId of runDirs) {
    const rejectedPath = path.join(outputRoot, runId, 'validated', 'providers_care', 'rejected.ndjson');
    if (!fs.existsSync(rejectedPath)) continue;
    const lines = fs.readFileSync(rejectedPath, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    for (const line of lines) {
      const row = JSON.parse(line);
      const reasons = Array.isArray(row.validationReasons) ? row.validationReasons : [];
      if (!reasons.some((reason) => excludedReasons.has(String(reason)))) continue;
      const sourceUrl = String(row.sourceUrl || '').trim();
      if (!sourceUrl) continue;
      sourceUrls.add(sourceUrl);
      rejectedRows += 1;
    }
  }

  return {
    path: outputRoot,
    sourceUrls,
    rejectedRows,
  };
}

function loadAlreadyStagedProviderKeys() {
  if (!fs.existsSync(dbPath)) {
    return {
      path: dbPath,
      keys: new Set(),
      rowCount: 0,
    };
  }

  const db = new Database(dbPath, { readonly: true });
  try {
    const rows = db.prepare(`
      SELECT DISTINCT state_id, source_url
      FROM staging_scraped_resource_providers
      WHERE source_type = 'lightweight_source_acquisition'
        AND source_url IS NOT NULL
        AND TRIM(source_url) <> ''
    `).all();
    return {
      path: dbPath,
      keys: new Set(
        rows.map((row) => providerSelectionKey(row.state_id, row.source_url)),
      ),
      rowCount: rows.length,
    };
  } finally {
    db.close();
  }
}

function hostnameFromUrl(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function normalizeUrlFingerprint(rawUrl) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const pathFingerprint = url.pathname
      .toLowerCase()
      .replace(/\/+/g, '/')
      .replace(/\/$/, '')
      .split('/')
      .filter(Boolean)
      .map((segment) => segment.replace(/[^a-z0-9]/g, ''))
      .filter(Boolean)
      .join('/');
    return `${host}|${pathFingerprint}`;
  } catch {
    return String(rawUrl || '').trim().toLowerCase();
  }
}

function providerSelectionKey(stateId, rawUrl) {
  return `${String(stateId || '').trim()}|${normalizeUrlFingerprint(rawUrl)}`;
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

function pickRows(plan, args) {
  let rows = plan.combinedReadyRows || [];
  const selectionGuards = {
    providerRepeatedBlockerRegistryPath: '',
    providerRepeatedBlockerRows: 0,
    excludedProviderRepeatedBlockerRows: 0,
    providerAcceptedRunsPath: '',
    providerAcceptedRows: 0,
    excludedPreviouslyAcceptedProviderRows: 0,
    providerRejectedRunsPath: '',
    providerRejectedRows: 0,
    excludedPreviouslyRejectedProviderRows: 0,
    providerStagingDbPath: '',
    providerStagedRows: 0,
    excludedAlreadyStagedProviderRows: 0,
    familyAcceptedRunsPath: '',
    familyAcceptedRows: 0,
    excludedPreviouslyAcceptedFamilyRows: 0,
    familyRepeatedFollowupRunsPath: '',
    familyRepeatedFollowupRows: 0,
    excludedRepeatedFamilyFollowupRows: 0,
    advocateFollowupBlockerRegistryPath: '',
    advocateActionableBlockerRows: 0,
    excludedAdvocateBlockedRows: 0,
    competitiveHelpFollowupBlockerRegistryPath: '',
    competitiveHelpActionableBlockerRows: 0,
    excludedCompetitiveHelpBlockedRows: 0,
  };
  if (args.wave) {
    const wave = (plan.queueWaves || []).find((item) => item.id === args.wave);
    if (!wave) throw new Error(`Unknown wave "${args.wave}"`);
    const allowed = new Set((wave.rowKeys || (wave.topRows || []).map((row) => `${row.targetTable}|${row.sourceUrl}`)));
    rows = rows.filter((row) => allowed.has(`${row.targetTable}|${row.sourceUrl}`));
  }
  if (args.status) rows = rows.filter((row) => row.ledgerStatus === args.status);
  if (args.gap) rows = rows.filter((row) => row.gapFamily === args.gap);
  if (args.queue) rows = rows.filter((row) => row.sourceQueue === args.queue);
  if (args.lane) rows = rows.filter((row) => row.executionLane === args.lane);
  if (args.state) rows = rows.filter((row) => row.stateId === args.state);
  if (args.sourceUrlPattern) {
    rows = rows.filter((row) => normalizeUrl(row.sourceUrl || '').toLowerCase().includes(args.sourceUrlPattern));
  }
  if (args.gap === 'providers_care') {
    const providerRegistry = loadProviderRepeatedBlockerSourceUrls();
    selectionGuards.providerRepeatedBlockerRegistryPath = providerRegistry.path;
    selectionGuards.providerRepeatedBlockerRows = providerRegistry.repeatedRows;
    if (providerRegistry.sourceUrls.size > 0) {
      const beforeCount = rows.length;
      rows = rows.filter((row) => !providerRegistry.sourceUrls.has(String(row.sourceUrl || '').trim()));
      selectionGuards.excludedProviderRepeatedBlockerRows = beforeCount - rows.length;
    }

    const acceptedRegistry = loadPreviouslyAcceptedProviderSourceUrls();
    selectionGuards.providerAcceptedRunsPath = acceptedRegistry.path;
    selectionGuards.providerAcceptedRows = acceptedRegistry.acceptedRows;
    if (acceptedRegistry.sourceUrls.size > 0) {
      const beforeCount = rows.length;
      rows = rows.filter((row) => !acceptedRegistry.sourceUrls.has(String(row.sourceUrl || '').trim()));
      selectionGuards.excludedPreviouslyAcceptedProviderRows = beforeCount - rows.length;
    }

    const rejectedRegistry = loadPreviouslyRejectedProviderSourceUrls();
    selectionGuards.providerRejectedRunsPath = rejectedRegistry.path;
    selectionGuards.providerRejectedRows = rejectedRegistry.rejectedRows;
    if (rejectedRegistry.sourceUrls.size > 0) {
      const beforeCount = rows.length;
      rows = rows.filter((row) => !rejectedRegistry.sourceUrls.has(String(row.sourceUrl || '').trim()));
      selectionGuards.excludedPreviouslyRejectedProviderRows = beforeCount - rows.length;
    }

    const stagedProviders = loadAlreadyStagedProviderKeys();
    selectionGuards.providerStagingDbPath = stagedProviders.path;
    selectionGuards.providerStagedRows = stagedProviders.rowCount;
    if (stagedProviders.keys.size > 0) {
      const beforeCount = rows.length;
      rows = rows.filter((row) => !stagedProviders.keys.has(providerSelectionKey(row.stateId, row.sourceUrl)));
      selectionGuards.excludedAlreadyStagedProviderRows = beforeCount - rows.length;
    }
  } else if (args.gap === 'advocates_legal') {
    const advocateRegistry = loadAdvocateBlockedSourceUrls();
    selectionGuards.advocateFollowupBlockerRegistryPath = advocateRegistry.path;
    selectionGuards.advocateActionableBlockerRows = advocateRegistry.actionableRows;
    if (advocateRegistry.sourceUrls.size > 0) {
      const beforeCount = rows.length;
      rows = rows.filter((row) => !advocateRegistry.sourceUrls.has(String(row.sourceUrl || '').trim()));
      selectionGuards.excludedAdvocateBlockedRows = beforeCount - rows.length;
    }
  } else if (competitiveHelpFamilies.has(args.gap)) {
    const competitiveRegistry = loadCompetitiveHelpBlockedSourceUrls(args.gap);
    selectionGuards.competitiveHelpFollowupBlockerRegistryPath = competitiveRegistry.path;
    selectionGuards.competitiveHelpActionableBlockerRows = competitiveRegistry.actionableRows;
    if (competitiveRegistry.sourceUrls.size > 0) {
      const beforeCount = rows.length;
      rows = rows.filter((row) => !competitiveRegistry.sourceUrls.has(String(row.sourceUrl || '').trim()));
      selectionGuards.excludedCompetitiveHelpBlockedRows = beforeCount - rows.length;
    }
  } else if (['knowledge_content', 'forms_guides', 'dd_routing', 'education_routing', 'waivers'].includes(args.gap)) {
    const acceptedRegistry = loadPreviouslyAcceptedFamilySourceUrls(args.gap);
    selectionGuards.familyAcceptedRunsPath = acceptedRegistry.path;
    selectionGuards.familyAcceptedRows = acceptedRegistry.acceptedRows;
    if (acceptedRegistry.sourceUrls.size > 0) {
      const beforeCount = rows.length;
      rows = rows.filter((row) => !acceptedRegistry.sourceUrls.has(String(row.sourceUrl || '').trim()));
      selectionGuards.excludedPreviouslyAcceptedFamilyRows = beforeCount - rows.length;
    }

    const repeatedFollowups = loadRepeatedFamilyFollowupSourceUrls(args.gap);
    const retryableKnowledge = args.gap === 'knowledge_content'
      ? loadRetryableKnowledgeSourceUrls()
      : { path: '', sourceUrls: new Set(), retryableRows: 0 };
    selectionGuards.familyRepeatedFollowupRunsPath = repeatedFollowups.path;
    selectionGuards.familyRepeatedFollowupRows = repeatedFollowups.repeatedRows;
    if (repeatedFollowups.sourceUrls.size > 0) {
      const beforeCount = rows.length;
      rows = rows.filter((row) => {
        const sourceUrl = String(row.sourceUrl || '').trim();
        if (args.gap === 'knowledge_content' && retryableKnowledge.sourceUrls.has(sourceUrl)) {
          return true;
        }
        return !repeatedFollowups.sourceUrls.has(sourceUrl);
      });
      selectionGuards.excludedRepeatedFamilyFollowupRows = beforeCount - rows.length;
    }
  }
  rows = rows.sort((a, b) =>
    Number(b.executionPriority || 0) - Number(a.executionPriority || 0)
    || Number(b.familyPriority || 0) - Number(a.familyPriority || 0)
    || String(a.sourceUrl || '').localeCompare(String(b.sourceUrl || ''))
  );
  if (!(args.limit > 0)) return { rows, selectionGuards };

  // Prefer hostname diversity on bounded runs so we do not spend a full low-token pass
  // on repeated failures from a single domain before sampling the wider queue.
  const selected = [];
  const seenHostnames = new Set();
  const deferred = [];

  for (const row of rows) {
    const hostname = hostnameFromUrl(row.sourceUrl);
    if (hostname && !seenHostnames.has(hostname)) {
      seenHostnames.add(hostname);
      selected.push(row);
      if (selected.length >= args.limit) return { rows: selected, selectionGuards };
    } else {
      deferred.push(row);
    }
  }

  for (const row of deferred) {
    selected.push(row);
    if (selected.length >= args.limit) break;
  }

  return { rows: selected, selectionGuards };
}

function toCsvValue(value) {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function writeCsv(filePath, rows, columns) {
  const lines = [columns.join(',')];
  for (const row of rows) {
    lines.push(columns.map((column) => toCsvValue(row?.[column])).join(','));
  }
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`);
}

function classifyFetchError(error) {
  const message = String(error?.message || error || 'unknown fetch error');
  const causeCode = error?.cause?.code || '';
  const causeMessage = error?.cause?.message || '';

  if (causeCode === 'ENOTFOUND') {
    return {
      error: 'dns_lookup_failed',
      errorCode: causeCode,
      errorDetail: causeMessage || message,
    };
  }

  if (causeCode === 'ECONNREFUSED') {
    return {
      error: 'connection_refused',
      errorCode: causeCode,
      errorDetail: causeMessage || message,
    };
  }

  if (causeCode === 'ETIMEDOUT' || error?.name === 'TimeoutError') {
    return {
      error: error?.stage === 'body_read' ? 'body_read_timed_out' : 'request_timed_out',
      errorCode: causeCode || 'TIMEOUT',
      errorDetail: causeMessage || message,
    };
  }

  if (message.toLowerCase().includes('fetch failed')) {
    return {
      error: 'fetch_failed',
      errorCode: causeCode || 'FETCH_FAILED',
      errorDetail: causeMessage || message,
    };
  }

  return {
    error: message,
    errorCode: causeCode || 'UNKNOWN',
    errorDetail: causeMessage || message,
  };
}

function summarizeCounts(rows, key) {
  return rows.reduce((accumulator, row) => {
    const bucket = row?.[key] || 'unknown';
    accumulator[bucket] = (accumulator[bucket] || 0) + 1;
    return accumulator;
  }, {});
}

function renderBucketList(title, buckets) {
  const entries = Object.entries(buckets).sort((a, b) => b[1] - a[1]);
  const lines = [`## ${title}`];
  if (!entries.length) {
    lines.push('', '_None_');
    return lines.join('\n');
  }
  for (const [label, count] of entries) {
    lines.push(`- ${label}: ${count}`);
  }
  return lines.join('\n');
}

function renderMarkdownReport(summary, payload) {
  const failedRows = payload.results.filter((row) => row?.ok === false);
  const sampleRows = payload.results.slice(0, 20);
  const sections = [
    '# Source Acquisition Run',
    '',
    `- Run ID: \`${summary.runId}\``,
    `- Generated At: \`${summary.generatedAt}\``,
    `- Mode: \`${summary.mode}\``,
    `- Selected: \`${summary.selectedCount}\``,
    `- Succeeded: \`${summary.succeeded}\``,
    `- Failed: \`${summary.failed}\``,
    `- Concurrency: \`${summary.concurrency}\``,
    `- Rate Limit Ms: \`${summary.rateLimitMs}\``,
    '',
    '## Filters',
    '',
    `- Status: \`${payload.filters.status || 'all'}\``,
    `- Wave: \`${payload.filters.wave || 'all'}\``,
    `- Gap: \`${payload.filters.gap || 'all'}\``,
    `- Queue: \`${payload.filters.queue || 'all'}\``,
    `- Lane: \`${payload.filters.lane || 'all'}\``,
    `- State: \`${payload.filters.state || 'all'}\``,
    `- Limit: \`${payload.filters.limit}\``,
    '',
    renderBucketList('Selected By State', summarizeCounts(payload.rows, 'stateId')),
    '',
    renderBucketList('Selected By Gap Family', summarizeCounts(payload.rows, 'gapFamily')),
    '',
    renderBucketList('Selected By Target Table', summarizeCounts(payload.rows, 'targetTable')),
    '',
    renderBucketList('Failures By Error', summarizeCounts(failedRows, 'error')),
    '',
    '## Sample Results',
    '',
    '| state | gap | table | ok | status | type | url | error |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...sampleRows.map((row) => `| ${row?.stateId || ''} | ${row?.gapFamily || ''} | ${row?.targetTable || ''} | ${row?.ok ? 'yes' : 'no'} | ${row?.status || ''} | ${row?.contentType || ''} | ${row?.sourceUrl || ''} | ${row?.error || ''} |`),
    '',
    '## Artifact Paths',
    '',
    `- Summary JSON: \`${summary.summaryPath}\``,
    `- Manifest JSON: \`${summary.manifestPath}\``,
    `- Results CSV: \`${summary.resultsCsvPath}\``,
    `- Report MD: \`${summary.reportPath}\``,
    `- Pages Dir: \`${summary.pagesDir}\``,
    '',
    '- Full raw payload is saved to files; this report stays compact by design.',
  ];
  fs.writeFileSync(summary.reportPath, `${sections.join('\n')}\n`);
}

const args = parseArgs(process.argv.slice(2));
const completionPlanPath = args.planPath
  ? path.resolve(repoRoot, args.planPath)
  : path.join(docsDir, `source-acquisition-completion-plan-${generatedDate}.json`);

if (!fs.existsSync(completionPlanPath)) {
  throw new Error(`Missing completion plan: ${completionPlanPath}. Run npm run audit:source-acquisition-completion-plan first.`);
}

const plan = readJson(completionPlanPath);
const selection = pickRows(plan, args);
const selectedRows = selection.rows;
const runId = new Date().toISOString().replace(/[:.]/g, '-');
const runDir = path.join(outputRoot, runId);
const pagesDir = path.join(runDir, 'pages');
fs.mkdirSync(pagesDir, { recursive: true });

const payload = {
  generatedAt: generatedDate,
  runId,
  mode: args.mode,
  filters: {
    wave: args.wave || null,
    status: args.status || null,
    gap: args.gap || null,
    queue: args.queue || null,
    lane: args.lane || null,
    state: args.state || null,
    limit: args.limit,
  },
  runtime: {
    retryCount: args.retryCount,
    rateLimitMs: args.rateLimitMs,
    concurrency: args.concurrency,
  },
  selectionGuards: selection.selectionGuards,
  selectedCount: selectedRows.length,
  rows: selectedRows,
  results: [],
};

if (args.mode === 'live') {
  let cursor = 0;

  async function worker() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= selectedRows.length) return;
      const row = selectedRows[index];
      await sleep(index < args.concurrency ? 0 : args.rateLimitMs);
      try {
        const fetched = await fetchWithRetry(row.sourceUrl, args);
        const extension = fetched.contentType.includes('application/pdf') ? '.pdf' : '.html';
        const fileName = `${String(index + 1).padStart(5, '0')}-${slugify(row.stateId)}-${slugify(row.gapFamily)}-${slugify(row.sourceName)}${extension}`;
        const filePath = path.join(pagesDir, fileName);
        fs.writeFileSync(filePath, fetched.body);
        payload.results[index] = {
          stateId: row.stateId,
          targetTable: row.targetTable,
          gapFamily: row.gapFamily,
          sourceQueue: row.sourceQueue,
          sourceUrl: row.sourceUrl,
          finalUrl: fetched.finalUrl,
          status: fetched.status,
          ok: fetched.ok,
          contentType: fetched.contentType,
          savedPath: filePath,
          attempt: fetched.attempt,
        };
      } catch (error) {
        const classifiedError = classifyFetchError(error);
        payload.results[index] = {
          stateId: row.stateId,
          targetTable: row.targetTable,
          gapFamily: row.gapFamily,
          sourceQueue: row.sourceQueue,
          sourceUrl: row.sourceUrl,
          ok: false,
          error: classifiedError.error,
          errorCode: classifiedError.errorCode,
          errorDetail: classifiedError.errorDetail,
        };
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(args.concurrency, Math.max(selectedRows.length, 1)) },
      () => worker(),
    ),
  );
}

const summary = {
  generatedAt: generatedDate,
  runId,
  mode: args.mode,
  selectedCount: selectedRows.length,
  succeeded: payload.results.filter((row) => row?.ok).length,
  failed: payload.results.filter((row) => row?.ok === false).length,
  concurrency: args.concurrency,
  rateLimitMs: args.rateLimitMs,
  summaryPath: path.join(runDir, 'summary.json'),
  manifestPath: path.join(runDir, 'manifest.json'),
  resultsCsvPath: path.join(runDir, 'results.csv'),
  reportPath: path.join(runDir, 'report.md'),
  pagesDir,
};

fs.writeFileSync(summary.summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
fs.writeFileSync(summary.manifestPath, `${JSON.stringify(payload, null, 2)}\n`);
writeCsv(summary.resultsCsvPath, payload.results, [
  'stateId',
  'targetTable',
  'gapFamily',
  'sourceQueue',
  'sourceUrl',
  'finalUrl',
  'status',
  'ok',
  'contentType',
  'savedPath',
  'attempt',
  'error',
  'errorCode',
  'errorDetail',
]);
renderMarkdownReport(summary, payload);

console.log(JSON.stringify(summary, null, 2));
