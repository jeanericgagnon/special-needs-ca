import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const runsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');
const stateDir = path.join(repoRoot, 'data', 'source-acquisition-state');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `knowledge-content-status-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `knowledge-content-status-queue-${generatedDate}.md`);
const csvOutPath = path.join(docsDir, `knowledge-content-status-queue-${generatedDate}.csv`);
const repairLedgerPath = path.join(stateDir, 'knowledge-content-repair-ledger.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return readJson(filePath);
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

function normalizeUrl(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return '';
  try {
    const url = new URL(value);
    url.hash = '';
    if (url.pathname !== '/') {
      url.pathname = url.pathname
        .replace(/\/index\.html?$/i, '')
        .replace(/\/+$/, '');
    }
    return url.toString();
  } catch {
    return value
      .replace(/\/index\.html?$/i, '')
      .replace(/\/+$/, '');
  }
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

function loadNdjson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function shellEscape(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function latestRunId(runIds) {
  const normalized = [...new Set((runIds || []).filter(Boolean))].sort();
  return normalized.length ? normalized.at(-1) : '';
}

function replacementAlreadyApplied(target, repairDecision) {
  if (!repairDecision?.reviewedSourceUrl) return false;
  return normalizeUrl(repairDecision.reviewedSourceUrl) === normalizeUrl(target?.sourceUrl);
}

const authoredTargetsPath = latestGeneratedJson('authored-missing-source-targets-');
const blockerRegistryPath = latestGeneratedJson('track-a-blocker-registry-');
const authoredTargets = readJson(authoredTargetsPath);
const blockerRegistry = readJson(blockerRegistryPath);
const repairLedger = readJsonIfExists(repairLedgerPath, { rows: [] });
const repairLedgerById = new Map((repairLedger.rows || []).map((row) => [String(row.id || '').trim(), row]));

const knowledgeTargets = (authoredTargets.targets || [])
  .filter((target) => target.gapFamily === 'knowledge_content')
  .map((target) => ({
    id: target.id,
    sourceName: target.sourceName,
    sourceUrl: normalizeUrl(target.sourceUrl),
    domain: target.domain,
    sourceFamily: target.sourceFamily,
    expectedExtractionFields: target.expectedExtractionFields,
    whyNeeded: target.whyNeeded,
    authoredAt: target.authoredAt,
  }));

const targetsByUrl = new Map(knowledgeTargets.map((target) => [target.sourceUrl, {
  ...target,
  acceptedRunIds: [],
  rejectedRunIds: [],
  repeatedFollowupRunIds: [],
  duplicatePromotionRunIds: [],
  promotedRunIds: [],
  lastValidationReasons: [],
  finalStatus: 'pending_exact_target',
  nextAction: 'Run the bounded knowledge_content wave for this exact source target.',
}]));

function findTargetForRecord(row) {
  const candidates = [
    row?.sourceUrl,
    row?.finalUrl,
    row?.canonicalUrl,
  ].map(normalizeUrl).filter(Boolean);

  for (const candidate of candidates) {
    const target = targetsByUrl.get(candidate);
    if (target) return target;
  }

  return null;
}

if (fs.existsSync(runsDir)) {
  for (const runId of fs.readdirSync(runsDir).sort()) {
    const acceptedRows = loadNdjson(path.join(runsDir, runId, 'validated', 'knowledge_content', 'accepted.ndjson'));
    for (const row of acceptedRows) {
      const target = findTargetForRecord(row);
      if (!target) continue;
      target.acceptedRunIds.push(runId);
    }

    const rejectedRows = loadNdjson(path.join(runsDir, runId, 'validated', 'knowledge_content', 'rejected.ndjson'));
    for (const row of rejectedRows) {
      const target = findTargetForRecord(row);
      if (!target) continue;
      target.rejectedRunIds.push(runId);
      target.lastValidationReasons = Array.isArray(row.validationReasons) ? row.validationReasons : [];
    }

    for (const fileName of ['blocked-failures.json', 'source-repair.json', 'retryable-failures.json']) {
      const filePath = path.join(runsDir, runId, 'followups', fileName);
      const rows = fs.existsSync(filePath) ? readJson(filePath) : [];
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (row.gapFamily !== 'knowledge_content') continue;
        const target = findTargetForRecord(row);
        if (!target) continue;
        target.repeatedFollowupRunIds.push(runId);
        target.lastFollowupReason = row.followupReason || '';
      }
    }

    const decisionPath = path.join(runsDir, runId, 'promoted', 'staging_scraped_knowledge_content-decisions.json');
    const decisions = fs.existsSync(decisionPath) ? readJson(decisionPath) : [];
    if (Array.isArray(decisions)) {
      for (const decision of decisions) {
        const target = findTargetForRecord(decision);
        if (!target) continue;
        if (decision.action === 'duplicate') {
          target.duplicatePromotionRunIds.push(runId);
        } else if (decision.action === 'promote') {
          target.promotedRunIds.push(runId);
        }
      }
    }
  }
}

const rows = [...targetsByUrl.values()].map((target) => {
  const acceptedCount = new Set(target.acceptedRunIds).size;
  const rejectedCount = new Set(target.rejectedRunIds).size;
  const duplicateCount = new Set(target.duplicatePromotionRunIds).size;
  const promotedCount = new Set(target.promotedRunIds).size;
  const followupCount = new Set(target.repeatedFollowupRunIds).size;

  let finalStatus = 'pending_exact_target';
  let nextAction = 'Run the bounded knowledge_content wave for this exact source target.';
  const repairDecision = repairLedgerById.get(String(target.id || '').trim()) || null;
  if (promotedCount > 0) {
    finalStatus = 'promoted_live';
    nextAction = 'No immediate fetch work is needed; this exact target is already promoted.';
  } else if (duplicateCount > 0) {
    finalStatus = 'duplicate_of_existing_live_article';
    nextAction = 'Do not re-fetch this target; expand the authored knowledge source pack with new exact topics instead.';
  } else if (repairDecision?.status === 'deferred_blocked_source') {
    finalStatus = 'deferred_blocked_source';
    nextAction = 'This blocked official source has been explicitly deferred; do not retry it unless a reviewed replacement is provided.';
  } else if (repairDecision?.status === 'reviewed_replacement_ready' && !replacementAlreadyApplied(target, repairDecision)) {
    finalStatus = 'reviewed_replacement_ready';
    nextAction = 'A reviewed exact replacement is saved; apply it to the source pack before spending more fetch volume.';
  } else if (repairDecision?.status === 'skipped_unresolved' && String(target.lastFollowupReason || '').trim() === 'sandbox_network_disabled') {
    finalStatus = 'deferred_unresolved';
    nextAction = 'This blocked target was explicitly skipped as unresolved; do not retry it in the bounded lane.';
  } else if (repairDecision?.status === 'skipped_unresolved' && followupCount > 0) {
    finalStatus = 'fetch_blocked';
    nextAction = 'A newer blocked-source signal supersedes the prior unresolved skip; move this exact target through the repair queue.';
  } else if (acceptedCount > 0) {
    finalStatus = 'accepted_not_promoted';
    nextAction = 'Review staging and promotion state if this accepted knowledge target still needs a live article.';
  } else if (rejectedCount > 0) {
    finalStatus = 'validation_rejected';
    nextAction = 'Refine parser or target quality only if this topic remains essential; otherwise prefer new exact knowledge targets.';
  } else if (followupCount > 0) {
    finalStatus = 'fetch_blocked';
    nextAction = 'Do not keep retrying blindly; repair or replace this exact knowledge source target from saved blocker evidence.';
  }

  return {
    ...target,
    acceptedRunCount: acceptedCount,
    rejectedRunCount: rejectedCount,
    duplicatePromotionRunCount: duplicateCount,
    promotedRunCount: promotedCount,
    followupRunCount: followupCount,
    finalStatus,
    nextAction,
    latestAcceptedRunId: latestRunId(target.acceptedRunIds),
    latestRejectedRunId: latestRunId(target.rejectedRunIds),
    latestFollowupRunId: latestRunId(target.repeatedFollowupRunIds),
    lastValidationReasons: target.lastValidationReasons.join('|'),
    lastFollowupReason: target.lastFollowupReason || '',
    repairDecisionMode: repairDecision?.decisionMode || '',
    repairDecisionStatus: repairDecision?.status || '',
    reviewedReplacementUrl: repairDecision?.reviewedSourceUrl || '',
    reviewedReplacementName: repairDecision?.reviewedSourceName || '',
  };
}).map((row) => {
  let nextCommands = [];

  if (row.finalStatus === 'accepted_not_promoted') {
    nextCommands = row.latestAcceptedRunId
      ? [
          `npm run run:source-acquisition-stage -- --run-id=${row.latestAcceptedRunId} --family=knowledge_content --mode=dry-run`,
          `npm run run:source-acquisition-promote -- --run-id=${row.latestAcceptedRunId} --family=knowledge_content --mode=dry-run`,
        ]
      : [
          'npm run run:source-acquisition-stage -- --run-id=<accepted-run-id> --family=knowledge_content --mode=dry-run',
          'npm run run:source-acquisition-promote -- --run-id=<accepted-run-id> --family=knowledge_content --mode=dry-run',
        ];
  } else if (row.finalStatus === 'pending_exact_target') {
    nextCommands = [
      `npm run run:source-acquisition-wave -- --mode=live --lane=ready_target_scrape --gap=knowledge_content --limit=1 --source-url-pattern=${shellEscape(row.sourceUrl)}`,
      'npm run run:source-acquisition-followups -- --run-id=<run-id>',
      'npm run run:source-acquisition-parse -- --run-id=<run-id> --family=knowledge_content',
      'npm run run:source-acquisition-validate -- --run-id=<run-id> --family=knowledge_content',
      'npm run run:source-acquisition-stage -- --run-id=<run-id> --family=knowledge_content --mode=dry-run',
    ];
  } else if (row.finalStatus === 'fetch_blocked') {
    nextCommands = [
      'npm run audit:knowledge-content-repair-queue',
      'npm run run:next-knowledge-content-repair-step',
    ];
  } else if (row.finalStatus === 'reviewed_replacement_ready') {
    nextCommands = [
      'npm run audit:authored-missing-source-targets',
      'npm run audit:knowledge-content-status-queue',
    ];
  } else if (row.finalStatus === 'deferred_blocked_source' || row.finalStatus === 'deferred_unresolved') {
    nextCommands = [
      'npm run audit:knowledge-content-status-queue',
    ];
  } else if (row.finalStatus === 'validation_rejected') {
    nextCommands = [
      'npm run run:source-acquisition-validate -- --run-id=<run-id> --family=knowledge_content',
      'npm run audit:knowledge-content-status-queue',
    ];
  } else if (row.finalStatus === 'duplicate_of_existing_live_article') {
    nextCommands = [
      'npm run audit:authored-missing-source-targets',
      'npm run audit:knowledge-content-status-queue',
    ];
  } else if (row.finalStatus === 'promoted_live') {
    nextCommands = [
      'npm run audit:knowledge-content-status-queue',
    ];
  }

  return {
    ...row,
    entryCommand: nextCommands[0] || '',
    auditCommand: nextCommands.at(-1) || '',
    nextCommands,
  };
}).sort((a, b) =>
  a.finalStatus.localeCompare(b.finalStatus)
  || a.sourceName.localeCompare(b.sourceName)
);

const knowledgeBlocker = (blockerRegistry.blockers || []).find((blocker) => blocker.id === 'knowledge_content_depth') || null;

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    authoredTargetsPath: path.relative(repoRoot, authoredTargetsPath),
    blockerRegistryPath: path.relative(repoRoot, blockerRegistryPath),
    repairLedgerPath: fs.existsSync(repairLedgerPath) ? path.relative(repoRoot, repairLedgerPath) : null,
  },
  purpose: 'Deterministic per-target knowledge status queue derived from authored exact knowledge URLs and saved run outcomes.',
  summary: {
    totalTargets: rows.length,
    byFinalStatus: countBy(rows, 'finalStatus'),
    blockerStatus: knowledgeBlocker?.status || 'unknown',
  },
  rows,
};

const headers = [
  'id',
  'sourceName',
  'sourceUrl',
  'domain',
  'finalStatus',
  'acceptedRunCount',
  'rejectedRunCount',
  'duplicatePromotionRunCount',
  'promotedRunCount',
  'followupRunCount',
  'lastFollowupReason',
  'lastValidationReasons',
  'nextAction',
  'latestAcceptedRunId',
  'latestRejectedRunId',
  'latestFollowupRunId',
];

const mdLines = [
  '# Knowledge Content Status Queue',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Summary',
  '',
  `- total targets: ${payload.summary.totalTargets}`,
  `- blocker status: ${payload.summary.blockerStatus}`,
  '',
  '## By Final Status',
  '',
  ...Object.entries(payload.summary.byFinalStatus).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## Targets',
  '',
];

for (const row of rows) {
  mdLines.push(`- ${row.finalStatus} | ${row.sourceName} | ${row.sourceUrl}`);
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
  totalTargets: payload.summary.totalTargets,
  byFinalStatus: payload.summary.byFinalStatus,
}, null, 2));
