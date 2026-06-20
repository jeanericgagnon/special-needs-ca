import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourceAcquisitionRunsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');
const generatedDate = new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-placeholder-replacement-queue-${generatedDate}.json`);
const csvOutPath = path.join(docsDir, `provider-placeholder-replacement-queue-${generatedDate}.csv`);
const mdOutPath = path.join(docsDir, `provider-placeholder-replacement-queue-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function findLatestGeneratedJson(prefix) {
  const entries = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir)
      .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
      .sort()
    : [];

  if (entries.length === 0) {
    throw new Error(`Missing generated artifact for prefix: ${prefix}`);
  }

  return path.join(docsDir, entries[entries.length - 1]);
}

function normalizeUrl(rawUrl) {
  if (!rawUrl || !String(rawUrl).trim()) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function toCsv(rows, headers) {
  const escape = (value) => {
    const stringValue = String(value ?? '');
    if (/[",\n]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
    return stringValue;
  };

  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ].join('\n');
}

function collectProviderSourceRepairRowsFromRuns() {
  if (!fs.existsSync(sourceAcquisitionRunsDir)) return [];

  const grouped = new Map();
  for (const runId of fs.readdirSync(sourceAcquisitionRunsDir).sort()) {
    const filePath = path.join(sourceAcquisitionRunsDir, runId, 'followups', 'source-repair.json');
    if (!fs.existsSync(filePath)) continue;
    const rows = readJson(filePath);
    if (!Array.isArray(rows)) continue;

    for (const row of rows) {
      if (row.gapFamily !== 'providers_care') continue;
      const sourceUrl = normalizeUrl(row.sourceUrl);
      const stateId = String(row.stateId || '').trim();
      if (!sourceUrl || !stateId) continue;

      const key = `${stateId}|${sourceUrl}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          stateId,
          stateName: stateId,
          readinessLane: 'replace-placeholders-first',
          sourceTargetsPath: `data/source_targets/${stateId}.json`,
          placeholderSourceName: row.hostname || row.sourceUrl,
          placeholderSourceUrl: sourceUrl,
          domain: row.hostname || '',
          crawlMethod: 'static_fetch',
          priority: 1,
          followupType: 'repair_followup_source_repair_provider_target',
          recommendedAction: 'Replace this live-run dead or stale provider domain with named first-party hospital, university clinic, or specialty center URLs before any further provider fetches.',
          expectedExtractionFields: '',
          notes: '',
          sourceOrigin: 'source_acquisition_runs',
          runIds: new Set(),
          reasons: new Set(),
        });
      }

      const entry = grouped.get(key);
      entry.runIds.add(runId);
      entry.reasons.add(String(row.followupReason || '').trim() || 'unknown');
    }
  }

  return [...grouped.values()].map((entry) => ({
    stateId: entry.stateId,
    stateName: entry.stateName,
    readinessLane: entry.readinessLane,
    sourceTargetsPath: entry.sourceTargetsPath,
    placeholderSourceName: entry.placeholderSourceName,
    placeholderSourceUrl: entry.placeholderSourceUrl,
    domain: entry.domain,
    crawlMethod: entry.crawlMethod,
    priority: entry.priority,
    followupType: entry.followupType,
    recommendedAction: entry.recommendedAction,
    expectedExtractionFields: entry.expectedExtractionFields,
    notes: `followup_reasons=${[...entry.reasons].sort().join('|')}; run_count=${entry.runIds.size}`,
    sourceOrigin: entry.sourceOrigin,
  }));
}

const providerSourcePackPath = findLatestGeneratedJson('provider-source-pack-plan-');
const masterLedgerPath = findLatestGeneratedJson('master-source-target-ledger-');
const followupBlockerRegistryPath = findLatestGeneratedJson('provider-followup-blocker-registry-');
const providerPlan = readJson(providerSourcePackPath);
const masterLedger = readJson(masterLedgerPath);
const followupBlockerRegistry = followupBlockerRegistryPath ? readJson(followupBlockerRegistryPath) : { rows: [] };
const states = providerPlan.states || [];
const activePlaceholderStates = new Set(
  states
    .filter((state) => state.readinessLane === 'replace-placeholders-first' || Number(state.placeholderProviderTargetCount || 0) > 0)
    .map((state) => state.stateId)
    .filter(Boolean)
);

const sourcePackRows = states
  .flatMap((state) =>
    (state.placeholderProviderTargets || []).map((target) => ({
      stateId: state.stateId,
      stateName: state.stateName,
      readinessLane: state.readinessLane,
      sourceTargetsPath: state.sourceTargetsPath,
      placeholderSourceName: target.source_name,
      placeholderSourceUrl: normalizeUrl(target.source_url),
      domain: target.domain,
      crawlMethod: target.crawl_method,
      priority: 1,
      followupType: 'replace_placeholder_provider_target',
      recommendedAction: 'Replace this generic or placeholder provider target with 2-5 named first-party hospital, university clinic, or specialty center targets before any provider crawl.',
      expectedExtractionFields: target.expected_extraction_fields || '',
      notes: target.notes || '',
      sourceOrigin: 'provider_source_pack',
    }))
  );

const masterLedgerRows = (masterLedger.ledger || [])
  .filter((row) => row.gapFamily === 'providers_care' && row.ledgerStatus === 'source_repair')
  .filter((row) => activePlaceholderStates.has(row.stateId))
  .map((row) => ({
    stateId: row.stateId,
    stateName: row.stateName || row.stateId,
    readinessLane: 'replace-placeholders-first',
    sourceTargetsPath: row.origin === 'state_source_targets'
      ? `data/source_targets/${row.stateId}.json`
      : '',
    placeholderSourceName: row.sourceName,
    placeholderSourceUrl: normalizeUrl(row.sourceUrl),
    domain: row.domain,
    crawlMethod: row.crawlMethod,
    priority: Number(row.priority || 1),
    followupType: 'repair_source_repair_provider_target',
    recommendedAction: 'Replace this stale or synthetic provider source target with named first-party hospital, university clinic, or specialty center URLs before any further provider fetches.',
    expectedExtractionFields: row.expectedExtractionFields || '',
    notes: row.notes || '',
    sourceOrigin: 'master_source_target_ledger',
  }));

const followupRegistryRows = (followupBlockerRegistry.allRows || followupBlockerRegistry.rows || [])
  .filter((row) => row.gapFamily === 'providers_care' && row.bucket === 'source_repair')
  .flatMap((row) => (row.stateIds || []).map((stateId) => ({
    stateId,
    stateName: stateId,
    readinessLane: 'replace-placeholders-first',
    sourceTargetsPath: `data/source_targets/${stateId}.json`,
    placeholderSourceName: row.hostname || row.sourceUrl,
    placeholderSourceUrl: normalizeUrl(row.sourceUrl),
    domain: row.hostname || '',
    crawlMethod: 'static_fetch',
    priority: 1,
    followupType: 'repair_followup_source_repair_provider_target',
    recommendedAction: 'Replace this live-run dead or stale provider domain with named first-party hospital, university clinic, or specialty center URLs before any further provider fetches.',
    expectedExtractionFields: '',
    notes: `followup_reason=${row.followupReason}; repeat_count=${row.repeatCount || 1}`,
    sourceOrigin: 'provider_followup_blocker_registry',
  })))
  .filter((row) => activePlaceholderStates.has(row.stateId));
const followupRunRows = collectProviderSourceRepairRowsFromRuns()
  .filter((row) => activePlaceholderStates.has(row.stateId));

const dedupedRows = new Map();
for (const row of [...sourcePackRows, ...masterLedgerRows, ...followupRegistryRows, ...followupRunRows]) {
  const key = `${row.stateId}|${row.placeholderSourceUrl}`;
  if (!dedupedRows.has(key)) {
    dedupedRows.set(key, row);
    continue;
  }

  const existing = dedupedRows.get(key);
  const precedence = {
    source_acquisition_runs: 4,
    provider_followup_blocker_registry: 3,
    master_source_target_ledger: 2,
    provider_source_pack: 1,
  };
  if ((precedence[row.sourceOrigin] || 0) > (precedence[existing.sourceOrigin] || 0)) {
    dedupedRows.set(key, row);
  }
}

const rows = [...dedupedRows.values()]
  .sort((a, b) =>
    Number(b.priority) - Number(a.priority) ||
    a.stateId.localeCompare(b.stateId) ||
    a.placeholderSourceName.localeCompare(b.placeholderSourceName)
  );

const summary = {
  totalRows: rows.length,
  statesNeedingPlaceholderReplacement: new Set(rows.map((row) => row.stateId)).size,
  byState: countBy(rows, 'stateId'),
  byDomain: countBy(rows, 'domain'),
  byReadinessLane: countBy(rows, 'readinessLane'),
  bySourceOrigin: countBy(rows, 'sourceOrigin'),
  byFollowupType: countBy(rows, 'followupType'),
};

const headers = [
  'stateId',
  'stateName',
  'readinessLane',
  'sourceTargetsPath',
  'placeholderSourceName',
  'placeholderSourceUrl',
  'domain',
  'crawlMethod',
  'priority',
  'followupType',
  'recommendedAction',
  'expectedExtractionFields',
  'notes',
  'sourceOrigin',
];

const payload = {
  queueId: 'provider_placeholder_replacement_queue',
  generatedAt: generatedDate,
  sourceArtifacts: {
    providerSourcePack: path.relative(repoRoot, providerSourcePackPath),
    masterSourceTargetLedger: path.relative(repoRoot, masterLedgerPath),
    providerFollowupBlockerRegistry: followupBlockerRegistryPath
      ? path.relative(repoRoot, followupBlockerRegistryPath)
      : null,
  },
  purpose: 'Deterministic queue of provider placeholder targets that must be replaced with named first-party sources before safe provider expansion.',
  summary,
  rows,
};

const mdLines = [
  '# Provider Placeholder Replacement Queue',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This queue isolates provider placeholder targets that should be replaced before any provider crawling or promotion work.',
  '',
  '## Summary',
  '',
  `- total rows: ${summary.totalRows}`,
  `- states needing placeholder replacement: ${summary.statesNeedingPlaceholderReplacement}`,
  '',
  '## By State',
  '',
];

for (const [stateId, count] of Object.entries(summary.byState).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${stateId}: ${count}`);
}

mdLines.push('', '## By Source Origin', '');
for (const [sourceOrigin, count] of Object.entries(summary.bySourceOrigin).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${sourceOrigin}: ${count}`);
}

mdLines.push('', '## Rows', '');
for (const row of rows) {
  mdLines.push(`- ${row.stateId} | ${row.placeholderSourceName} | ${row.placeholderSourceUrl} | ${row.sourceOrigin}`);
}

mdLines.push('', '## Files', '');
mdLines.push(`- JSON queue: ${path.relative(repoRoot, jsonOutPath)}`);
mdLines.push(`- CSV queue: ${path.relative(repoRoot, csvOutPath)}`);
mdLines.push(`- Provider source-pack artifact: ${path.relative(repoRoot, providerSourcePackPath)}`);
mdLines.push(`- Master ledger artifact: ${path.relative(repoRoot, masterLedgerPath)}`);

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(csvOutPath, `${toCsv(rows, headers)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  queue: {
    json: jsonOutPath,
    csv: csvOutPath,
    md: mdOutPath,
  },
  summary,
}, null, 2));
