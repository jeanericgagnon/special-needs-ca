import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourceTargetsDir = path.join(repoRoot, 'data', 'source_targets');
const stateDir = path.join(repoRoot, 'data', 'source-acquisition-state');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-followup-repair-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-followup-repair-queue-${generatedDate}.md`);
const csvOutPath = path.join(docsDir, `provider-followup-repair-queue-${generatedDate}.csv`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestGeneratedJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated artifact for prefix: ${prefix}`);
  }
  return path.join(docsDir, matches.at(-1));
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
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

function classifyAction(row) {
  const reason = String(row.followupReason || '').trim();
  const bucket = String(row.bucket || '').trim();

  if (reason === 'stale_or_invalid_404') {
    return {
      actionClass: 'replace_exact_url',
      recommendedAction: 'Replace the dead provider URL with a current first-party clinic, hospital, or program page on the same trusted organization when possible.',
    };
  }

  if (reason === 'access_blocked_403') {
    return {
      actionClass: 'author_alternate_first_party_target',
      recommendedAction: 'Do not keep retrying the blocked page in lightweight mode; author an alternate first-party provider page or a safer clinic/location page on the same org.',
    };
  }

  if (reason === 'dns_lookup_failed') {
    return {
      actionClass: 'replace_domain',
      recommendedAction: 'Treat the domain as stale or broken and replace it with a current first-party provider target before any further provider fetches.',
    };
  }

  if (reason === 'network_timeout' || reason === 'network_fetch_failed') {
    return {
      actionClass: 'bounded_retry_then_replace',
      recommendedAction: 'Allow at most one later bounded retry outside Codex; if it fails again, replace the provider target instead of requeueing it.',
    };
  }

  return {
    actionClass: bucket === 'blocked' ? 'manual_review_or_replace' : 'replace_or_repair',
    recommendedAction: 'Route this provider blocker to deterministic source repair and do not spend more lightweight fetch volume until the source target is replaced or repaired.',
  };
}

function sourceUrlKey(sourceUrl) {
  const raw = String(sourceUrl || '').trim();
  if (!raw) return '';
  try {
    const parsed = new URL(raw);
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString().toLowerCase();
  } catch {
    return raw.toLowerCase();
  }
}

function sourceUrlExactKey(sourceUrl) {
  const raw = String(sourceUrl || '').trim();
  if (!raw) return '';
  try {
    const parsed = new URL(raw);
    parsed.hash = '';
    return parsed.toString().toLowerCase();
  } catch {
    return raw.toLowerCase();
  }
}

function stateIdFromFileName(fileName) {
  return fileName.replace(/\.json$/i, '').trim().toLowerCase();
}

function asArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.targets)) return payload.targets;
  return [];
}

function loadActiveProviderTargetUrlsByState() {
  const byState = new Map();
  if (!fs.existsSync(sourceTargetsDir)) return byState;

  for (const fileName of fs.readdirSync(sourceTargetsDir).filter((name) => name.endsWith('.json')).sort()) {
    const stateId = stateIdFromFileName(fileName);
    const payload = readJson(path.join(sourceTargetsDir, fileName));
    const urls = asArray(payload)
      .filter((row) => String(row?.target_table || '').trim() === 'resource_providers')
      .map((row) => sourceUrlExactKey(row?.source_url))
      .filter(Boolean);
    byState.set(stateId, new Set(urls));
  }

  return byState;
}

function loadAuthoredProviderRepairRowKeys() {
  const keys = new Set();
  if (!fs.existsSync(docsDir)) return keys;

  const briefFiles = fs.readdirSync(docsDir)
    .filter((name) => name.startsWith('provider-repair-authoring-brief-') && name.endsWith('.json'))
    .sort();

  for (const fileName of briefFiles) {
    const payload = readJson(path.join(docsDir, fileName));
    const rows = Array.isArray(payload?.rows) ? payload.rows : [];
    for (const row of rows) {
      const stateId = String(row?.stateId || '').trim().toLowerCase();
      const sourceUrl = sourceUrlKey(row?.sourceUrl);
      if (!stateId || !sourceUrl) continue;
      keys.add(`${stateId}__${sourceUrl}`);
    }
  }

  return keys;
}

function loadResolvedProviderPullNowRowKeys() {
  const keys = new Set();
  const ledgerPath = path.join(stateDir, 'provider-pull-now-resolution-ledger.json');
  if (!fs.existsSync(ledgerPath)) return keys;

  const payload = readJson(ledgerPath);
  const rows = Array.isArray(payload?.rows) ? payload.rows : [];

  for (const row of rows) {
    const stateId = String(row?.stateId || '').trim().toLowerCase();
    const sourceUrl = sourceUrlKey(row?.sourceUrl);
    const status = String(row?.status || '').trim().toLowerCase();
    if (!stateId || !sourceUrl || !status) continue;
    keys.add(`${stateId}__${sourceUrl}`);
  }

  return keys;
}

const blockerRegistryPath = latestGeneratedJson('provider-followup-blocker-registry-');
const trackABlockerRegistryPath = latestGeneratedJson('track-a-blocker-registry-');
const sourcePackPlanPath = latestGeneratedJson('provider-source-pack-plan-');

const blockerRegistry = readJson(blockerRegistryPath);
const trackABlockerRegistry = readJson(trackABlockerRegistryPath);
const sourcePackPlan = readJson(sourcePackPlanPath);
const activeProviderTargetUrlsByState = loadActiveProviderTargetUrlsByState();
const authoredProviderRepairRowKeys = loadAuthoredProviderRepairRowKeys();
const resolvedProviderPullNowRowKeys = loadResolvedProviderPullNowRowKeys();

const stateLaneById = new Map((sourcePackPlan.states || []).map((state) => [state.stateId, state.readinessLane]));
const allRows = Array.isArray(blockerRegistry.rows) ? blockerRegistry.rows : [];

const rows = allRows.flatMap((row) => {
  const action = classifyAction(row);
  const exactSourceUrl = sourceUrlExactKey(row.sourceUrl);
  const normalizedSourceUrl = sourceUrlKey(row.sourceUrl);
  const states = (Array.isArray(row.stateIds) && row.stateIds.length ? row.stateIds : ['unknown'])
    .filter((stateId) => {
      const activeUrls = activeProviderTargetUrlsByState.get(stateId);
      if (!activeUrls || !activeUrls.size) return false;
      return activeUrls.has(exactSourceUrl);
    })
    .filter((stateId) => !authoredProviderRepairRowKeys.has(`${stateId}__${normalizedSourceUrl}`))
    .filter((stateId) => !resolvedProviderPullNowRowKeys.has(`${stateId}__${normalizedSourceUrl}`));
  return states.map((stateId) => ({
    stateId,
    readinessLane: stateLaneById.get(stateId) || 'author-targets-first',
    bucket: row.bucket,
    followupReason: row.followupReason,
    actionClass: action.actionClass,
    recommendedAction: action.recommendedAction,
    sourceUrl: row.sourceUrl,
    hostname: row.hostname,
    repeatCount: Number(row.repeatCount || 1),
    sampleStatusCodes: Array.isArray(row.sampleStatusCodes) ? row.sampleStatusCodes.join('|') : '',
    runCount: Array.isArray(row.runIds) ? row.runIds.length : 0,
    topSavedPath: Array.isArray(row.savedPaths) && row.savedPaths.length ? row.savedPaths[0] : '',
  }));
})
  .sort((a, b) =>
    b.repeatCount - a.repeatCount
    || a.actionClass.localeCompare(b.actionClass)
    || a.stateId.localeCompare(b.stateId)
    || a.sourceUrl.localeCompare(b.sourceUrl)
  );

const uniqueUrls = new Set(rows.map((row) => sourceUrlKey(row.sourceUrl))).size;
const providerBlocker = (trackABlockerRegistry.blockers || []).find((blocker) => blocker.id === 'provider_directory') || null;

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    blockerRegistryPath: path.relative(repoRoot, blockerRegistryPath),
    trackABlockerRegistryPath: path.relative(repoRoot, trackABlockerRegistryPath),
    sourcePackPlanPath: path.relative(repoRoot, sourcePackPlanPath),
    providerRepairAuthoringBriefCount: authoredProviderRepairRowKeys.size,
    providerPullNowResolutionLedgerCount: resolvedProviderPullNowRowKeys.size,
  },
  purpose: 'Deterministic provider source-repair queue derived from saved repeated blocker evidence so the next operator can repair exact provider targets without broad re-scans.',
  summary: {
    totalRows: rows.length,
    distinctSourceUrls: uniqueUrls,
    distinctStates: new Set(rows.map((row) => row.stateId)).size,
    byActionClass: countBy(rows, 'actionClass'),
    byReason: countBy(rows, 'followupReason'),
    byBucket: countBy(rows, 'bucket'),
    byReadinessLane: countBy(rows, 'readinessLane'),
    providerBlockerStatus: providerBlocker?.status || 'unknown',
  },
  rows,
};

const headers = [
  'stateId',
  'readinessLane',
  'bucket',
  'followupReason',
  'actionClass',
  'recommendedAction',
  'sourceUrl',
  'hostname',
  'repeatCount',
  'runCount',
  'sampleStatusCodes',
  'topSavedPath',
];

const mdLines = [
  '# Provider Followup Repair Queue',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Summary',
  '',
  `- total rows: ${payload.summary.totalRows}`,
  `- distinct source URLs: ${payload.summary.distinctSourceUrls}`,
  `- distinct states: ${payload.summary.distinctStates}`,
  `- provider blocker status: ${payload.summary.providerBlockerStatus}`,
  '',
  '## By Action Class',
  '',
  ...Object.entries(payload.summary.byActionClass).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## Top Queue Rows',
  '',
];

for (const row of rows.slice(0, 25)) {
  mdLines.push(`- ${row.stateId} | ${row.actionClass} | repeats=${row.repeatCount} | ${row.followupReason} | ${row.sourceUrl}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);
fs.writeFileSync(csvOutPath, `${toCsv(rows, headers)}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  csv: csvOutPath,
  totalRows: payload.summary.totalRows,
  distinctSourceUrls: payload.summary.distinctSourceUrls,
}, null, 2));
