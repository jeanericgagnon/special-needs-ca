import fs from 'fs';
import path from 'path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const sourceTargetsDir = path.join(dataDir, 'source_targets');
const sourcePacksDir = path.join(dataDir, 'source_packs');
const stateDir = path.join(dataDir, 'source-acquisition-state');
const generatedDate = new Date().toISOString().slice(0, 10);
const defaultInputPath = process.env.INPUT_PATH || path.join(repoRoot, 'data', 'provider-pull-now-decisions.json');
const decisionTemplatePath = path.join(docsDir, `provider-pull-now-decision-template-${generatedDate}.json`);
const providerSourcePackPlanPath = path.join(docsDir, `provider-source-pack-plan-${generatedDate}.json`);
const resolutionLedgerPath = path.join(stateDir, 'provider-pull-now-resolution-ledger.json');
const resolutionPackPath = path.join(sourcePacksDir, 'provider_pull_now_resolutions.json');
const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');

function parseArgs(argv) {
  const args = {
    apply: false,
    input: defaultInputPath,
    state: null,
  };

  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--input=')) args.input = path.resolve(arg.slice('--input='.length).trim());
    else if (arg.startsWith('--state=')) args.state = arg.slice('--state='.length).trim().toLowerCase();
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return readJson(filePath);
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

function normalizeUrl(rawUrl) {
  if (!hasText(rawUrl)) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) parsed.port = '';
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function domainFromUrl(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function toMarkdown(report) {
  const lines = [
    '# Provider Pull-Now Decision Run',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Mode: ${report.mode}`,
    '',
    '## Summary',
    '',
    `- state filter: ${report.stateFilter || 'all'}`,
    `- input path: ${report.inputPath}`,
    `- decision rows: ${report.summary.inputRows}`,
    `- resolved rows: ${report.summary.resolvedRows}`,
    `- deferred rows: ${report.summary.deferredRows}`,
    `- files changed: ${report.summary.filesChanged}`,
    '',
    '## Skipped By Reason',
    '',
    ...Object.entries(report.summary.skippedByReason).sort((a, b) => b[1] - a[1]).map(([reason, count]) => `- ${reason}: ${count}`),
    '',
    '## Decision Modes',
    '',
    ...Object.entries(report.summary.byDecisionMode).sort((a, b) => b[1] - a[1]).map(([mode, count]) => `- ${mode}: ${count}`),
    '',
    '## Decisions',
    '',
  ];

  for (const item of report.decisions) {
    lines.push(`- ${item.stateId} | ${item.sourceUrl} | ${item.status} | resolved=${item.resolvedSourceUrl || ''}`);
  }

  return `${lines.join('\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(args.input)) {
  console.log(JSON.stringify({
    message: 'No provider pull-now decision file found; nothing to apply.',
    expectedPath: args.input,
    resolvedRows: 0,
  }, null, 2));
  process.exit(0);
}

if (!fs.existsSync(decisionTemplatePath)) {
  throw new Error(`Missing provider pull-now decision template: ${decisionTemplatePath}. Run npm run audit:provider-pull-now-decision-template first.`);
}

if (!fs.existsSync(providerSourcePackPlanPath)) {
  throw new Error(`Missing provider source pack plan: ${providerSourcePackPlanPath}. Run npm run audit:provider-source-pack first.`);
}

const decisionTemplate = readJson(decisionTemplatePath);
const templateByKey = new Map((decisionTemplate.rows || []).map((row) => [
  `${row.stateId}__${normalizeUrl(row.sourceUrl)}`,
  row,
]));
const sourcePackPlan = readJson(providerSourcePackPlanPath);
const statePlanById = new Map((sourcePackPlan.states || []).map((state) => [state.stateId, state]));
const raw = readJson(args.input);
const rows = Array.isArray(raw) ? raw : raw.rows;
if (!Array.isArray(rows)) {
  throw new Error(`Expected rows array in ${args.input}`);
}

const selectedRows = rows.filter((row) => !args.state || String(row.stateId || '').trim().toLowerCase() === args.state);
const resolutionLedger = readJsonIfExists(resolutionLedgerPath, {
  generatedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  rows: [],
});
const resolutionPack = readJsonIfExists(resolutionPackPath, {
  packId: 'provider_pull_now_resolutions',
  generatedAt: generatedDate,
  rows: [],
});
const changedFiles = new Set();
const decisions = [];
const summary = {
  inputRows: selectedRows.length,
  resolvedRows: 0,
  deferredRows: 0,
  filesChanged: 0,
  skippedByReason: {},
  byDecisionMode: {},
};

function note(reason) {
  summary.skippedByReason[reason] = (summary.skippedByReason[reason] || 0) + 1;
}

function noteMode(mode) {
  summary.byDecisionMode[mode] = (summary.byDecisionMode[mode] || 0) + 1;
}

for (const row of selectedRows) {
  const stateId = hasText(row?.stateId) ? String(row.stateId).trim().toLowerCase() : '';
  const actionClass = hasText(row?.actionClass) ? String(row.actionClass).trim() : '';
  const sourceUrl = normalizeUrl(row?.sourceUrl);
  const decisionMode = hasText(row?.decisionMode) ? String(row.decisionMode).trim() : '';
  const reviewedBy = hasText(row?.reviewedBy) ? String(row.reviewedBy).trim() : '';
  const reviewedSourceName = hasText(row?.reviewedSourceName) ? String(row.reviewedSourceName).trim() : '';
  const reviewedSourceUrl = normalizeUrl(row?.reviewedSourceUrl);
  const retryNotes = hasText(row?.retryNotes) ? String(row.retryNotes).trim() : '';
  const reviewNotes = hasText(row?.reviewNotes) ? String(row.reviewNotes).trim() : '';
  const templateRow = templateByKey.get(`${stateId}__${sourceUrl}`);

  if (!stateId || !sourceUrl || !actionClass) {
    note('missing_identity_fields');
    continue;
  }
  if (!templateRow) {
    note('row_not_in_live_pull_now_template');
    decisions.push({ stateId, sourceUrl, status: 'skipped_row_not_in_live_pull_now_template', resolvedSourceUrl: '' });
    continue;
  }
  if (!reviewedBy) {
    note('missing_reviewed_by');
    decisions.push({ stateId, sourceUrl, status: 'skipped_missing_reviewed_by', resolvedSourceUrl: '' });
    continue;
  }
  if (!['replace_with_reviewed_first_party_target', 'bounded_retry_once', 'needs_manual_research', 'skip_unresolved'].includes(decisionMode)) {
    note('invalid_decision_mode');
    decisions.push({ stateId, sourceUrl, status: 'skipped_invalid_decision_mode', resolvedSourceUrl: '' });
    continue;
  }

  noteMode(decisionMode);
  const statePlan = statePlanById.get(stateId) || {};
  const concreteTargets = Array.isArray(statePlan.concreteProviderTargets) ? statePlan.concreteProviderTargets : [];

  let resolvedSourceUrl = '';
  let resolvedSourceName = '';
  let ledgerStatus = '';
  let resolutionStatus = '';

  if (decisionMode === 'replace_with_reviewed_first_party_target') {
    const matchingTarget = concreteTargets.find((target) =>
      normalizeUrl(target.source_url) === reviewedSourceUrl &&
      String(target.source_name || '').trim() === reviewedSourceName
    );
    if (!reviewedSourceUrl || !reviewedSourceName || !matchingTarget) {
      note('missing_or_unapproved_reviewed_replacement');
      decisions.push({ stateId, sourceUrl, status: 'skipped_missing_or_unapproved_reviewed_replacement', resolvedSourceUrl: reviewedSourceUrl });
      continue;
    }
    resolvedSourceUrl = reviewedSourceUrl;
    resolvedSourceName = reviewedSourceName;
    ledgerStatus = 'resolved_replaced_with_reviewed_first_party_target';
    resolutionStatus = args.apply ? 'applied' : 'dry_run_ready';
    summary.resolvedRows += 1;
  } else if (decisionMode === 'bounded_retry_once') {
    if (actionClass !== 'bounded_retry_then_replace') {
      note('retry_mode_not_allowed_for_action_class');
      decisions.push({ stateId, sourceUrl, status: 'skipped_retry_mode_not_allowed_for_action_class', resolvedSourceUrl: '' });
      continue;
    }
    ledgerStatus = 'deferred_bounded_retry_once';
    resolutionStatus = args.apply ? 'applied_deferred' : 'dry_run_deferred';
    summary.deferredRows += 1;
  } else if (decisionMode === 'needs_manual_research') {
    ledgerStatus = 'deferred_manual_research';
    resolutionStatus = args.apply ? 'applied_deferred' : 'dry_run_deferred';
    summary.deferredRows += 1;
  } else {
    ledgerStatus = 'skipped_unresolved';
    resolutionStatus = args.apply ? 'applied_skipped' : 'dry_run_skipped';
    summary.deferredRows += 1;
  }

  const ledgerEntry = {
    stateId,
    actionClass,
    sourceUrl,
    hostname: templateRow.hostname || domainFromUrl(sourceUrl),
    followupReason: templateRow.followupReason || '',
    decisionMode,
    status: ledgerStatus,
    resolvedSourceName,
    resolvedSourceUrl,
    resolvedDomain: domainFromUrl(resolvedSourceUrl),
    retryNotes,
    reviewNotes,
    reviewedBy,
    reviewedAt: new Date().toISOString(),
  };

  const packRow = {
    stateId,
    sourceName: resolvedSourceName,
    sourceUrl: resolvedSourceUrl,
    domain: domainFromUrl(resolvedSourceUrl),
    targetTable: 'resource_providers',
    actionClass,
    replacedSourceUrl: sourceUrl,
    resolutionMode: decisionMode,
    reviewNotes,
    reviewedBy,
    reviewedAt: ledgerEntry.reviewedAt,
  };

  if (args.apply) {
    const filePath = path.join(sourceTargetsDir, `${stateId}.json`);
    if (!fs.existsSync(filePath)) {
      note('missing_source_targets_file');
      decisions.push({ stateId, sourceUrl, status: 'skipped_missing_source_targets_file', resolvedSourceUrl });
      continue;
    }

    const payload = readJson(filePath);
    const items = Array.isArray(payload) ? payload : payload.targets || [];
    const match = items.find((item) =>
      (item.target_table || '') === 'resource_providers' &&
      normalizeUrl(item.source_url || '') === sourceUrl
    );

    if (decisionMode === 'replace_with_reviewed_first_party_target') {
      if (!match) {
        note('missing_source_row');
        decisions.push({ stateId, sourceUrl, status: 'skipped_missing_source_row', resolvedSourceUrl });
        continue;
      }
      const repairNote = `Provider pull-now decision applied ${generatedDate} from ${sourceUrl} to ${resolvedSourceUrl}.`;
      match.source_url = resolvedSourceUrl;
      match.source_name = resolvedSourceName;
      match.domain = domainFromUrl(resolvedSourceUrl);
      match.notes = String(match.notes || '').includes('Provider pull-now decision applied')
        ? String(match.notes || '')
        : `${String(match.notes || '')}${match.notes ? ' ' : ''}${repairNote}`;
      fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
      changedFiles.add(filePath);
    }

    const ledgerIndex = resolutionLedger.rows.findIndex((item) =>
      item.stateId === stateId && normalizeUrl(item.sourceUrl) === sourceUrl
    );
    if (ledgerIndex >= 0) resolutionLedger.rows[ledgerIndex] = ledgerEntry;
    else resolutionLedger.rows.push(ledgerEntry);
    resolutionLedger.updatedAt = new Date().toISOString();

    const packIndex = resolutionPack.rows.findIndex((item) =>
      item.stateId === stateId && normalizeUrl(item.replacedSourceUrl) === sourceUrl
    );
    if (decisionMode === 'replace_with_reviewed_first_party_target') {
      if (packIndex >= 0) resolutionPack.rows[packIndex] = packRow;
      else resolutionPack.rows.push(packRow);
    } else if (packIndex >= 0) {
      resolutionPack.rows.splice(packIndex, 1);
    }
  }

  decisions.push({
    stateId,
    sourceUrl,
    status: resolutionStatus,
    resolvedSourceUrl,
  });
}

if (args.apply) {
  writeJson(resolutionLedgerPath, resolutionLedger);
  writeJson(resolutionPackPath, resolutionPack);
  changedFiles.add(resolutionLedgerPath);
  changedFiles.add(resolutionPackPath);
}

summary.filesChanged = changedFiles.size;

const report = {
  generatedAt: new Date().toISOString(),
  mode: args.apply ? 'apply' : 'dry-run',
  stateFilter: args.state,
  inputPath: path.relative(repoRoot, args.input),
  summary,
  decisions,
};

const reportJsonPath = path.join(docsDir, `provider-pull-now-decision-run-${runTimestamp}.json`);
const reportMdPath = path.join(docsDir, `provider-pull-now-decision-run-${runTimestamp}.md`);
writeJson(reportJsonPath, report);
fs.writeFileSync(reportMdPath, toMarkdown(report));

console.log(JSON.stringify({
  generatedAt: report.generatedAt,
  mode: report.mode,
  summary: report.summary,
  report: {
    json: reportJsonPath,
    md: reportMdPath,
  },
}, null, 2));
