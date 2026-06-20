import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `directory-foundation-enrichment-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `directory-foundation-enrichment-queue-${generatedDate}.md`);
const csvOutPath = path.join(docsDir, `directory-foundation-enrichment-queue-${generatedDate}.csv`);

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

const accessibilityAuditPath = latestGeneratedJson('directory-accessibility-audit-');
const accessibilityCandidatesPath = latestGeneratedJson('directory-accessibility-candidates-');
const providerPlanPath = latestGeneratedJson('provider-accessibility-enrichment-plan-');
const blockerRegistryPath = latestGeneratedJson('track-a-blocker-registry-');

const accessibilityAudit = readJson(accessibilityAuditPath);
const accessibilityCandidates = readJson(accessibilityCandidatesPath);
const providerPlan = readJson(providerPlanPath);
const blockerRegistry = readJson(blockerRegistryPath);

const tableByName = new Map((accessibilityAudit.tables || []).map((table) => [table.table, table]));
const candidateByLabel = new Map((accessibilityCandidates.tables || []).map((table) => [table.label, table]));
const foundationBlocker = (blockerRegistry.blockers || []).find((blocker) => blocker.id === 'directory_foundation_signals') || null;

const rows = [];

for (const state of providerPlan.lanes?.sourcePullStates || []) {
  rows.push({
    lane: 'provider_source_pull',
    targetTable: 'resource_providers',
    stateId: state.stateId,
    subjectId: state.stateId,
    subjectLabel: state.stateId,
    priority: state.providerRows,
    currentSignalPct: state.accessibilityPct,
    missingSignalRows: state.providerRows - state.accessibilityRows,
    sourceUrl: '',
    clueIds: '',
    nextAction: 'Run a bounded first-party provider accessibility source pull for this state cluster and only promote explicit signals.',
    evidenceArtifact: path.relative(repoRoot, providerPlanPath),
    entryCommand: 'npm run audit:provider-accessibility-enrichment-plan',
    auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
    commands: [
      'npm run audit:provider-accessibility-enrichment-plan',
      'npm run audit:provider-accessibility-source-pull-prep',
      'npm run audit:directory-foundation-enrichment-queue',
    ],
  });
}

for (const state of (providerPlan.lanes?.sustainStates || []).filter((row) => Number(row.accessibilityPct || 0) < 100)) {
  rows.push({
    lane: 'provider_gap_cluster',
    targetTable: 'resource_providers',
    stateId: state.stateId,
    subjectId: state.stateId,
    subjectLabel: state.stateId,
    priority: state.providerRows - state.accessibilityRows,
    currentSignalPct: state.accessibilityPct,
    missingSignalRows: state.providerRows - state.accessibilityRows,
    sourceUrl: '',
    clueIds: '',
    nextAction: 'Use bounded first-party provider reviews only for the remaining provider rows in this state cluster that still lack explicit accessibility signals.',
    evidenceArtifact: path.relative(repoRoot, providerPlanPath),
    entryCommand: 'npm run audit:provider-accessibility-enrichment-plan',
    auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
    commands: [
      'npm run audit:provider-accessibility-enrichment-plan',
      'npm run audit:provider-accessibility-source-pull-prep',
      'npm run audit:directory-foundation-enrichment-queue',
    ],
  });
}

for (const candidate of candidateByLabel.get('Nonprofit Organizations')?.candidates || []) {
  rows.push({
    lane: 'nonprofit_candidate_review',
    targetTable: 'nonprofit_organizations',
    stateId: '',
    subjectId: candidate.targetId,
    subjectLabel: candidate.extractedName || candidate.targetId,
    priority: candidate.clueIds.length,
    currentSignalPct: '',
    missingSignalRows: '',
    sourceUrl: candidate.sourceUrl || '',
    clueIds: (candidate.clueIds || []).join('|'),
    nextAction: 'Review explicit nonprofit accessibility clues and only promote source-backed fields that are locally safe.',
    evidenceArtifact: path.relative(repoRoot, accessibilityCandidatesPath),
    entryCommand: 'npm run run:nonprofit-accessibility-lightweight-batch -- --mode=dry-run --limit=1',
    auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
    commands: [
      'npm run audit:directory-accessibility-candidates',
      'npm run run:nonprofit-accessibility-lightweight-batch -- --mode=dry-run --limit=1',
      'npm run audit:directory-foundation-enrichment-queue',
    ],
  });
}

for (const candidate of candidateByLabel.get('Resource Providers')?.candidates || []) {
  rows.push({
    lane: 'provider_candidate_review',
    targetTable: 'resource_providers',
    stateId: '',
    subjectId: candidate.targetId,
    subjectLabel: candidate.extractedName || candidate.targetId,
    priority: candidate.clueIds.length,
    currentSignalPct: '',
    missingSignalRows: '',
    sourceUrl: candidate.sourceUrl || '',
    clueIds: (candidate.clueIds || []).join('|'),
    nextAction: 'Review explicit provider accessibility clues and only promote source-backed fields that pass the accessibility contract.',
    evidenceArtifact: path.relative(repoRoot, accessibilityCandidatesPath),
    entryCommand: 'npm run fix:provider-accessibility-review-queue',
    auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
    commands: [
      'npm run fix:provider-accessibility-review-queue',
      'npm run audit:provider-accessibility-review-decision-template',
      'npm run fix:provider-accessibility-apply-review-decisions',
      'npm run fix:provider-accessibility-promote-reviewed',
      'npm run audit:directory-foundation-enrichment-queue',
    ],
  });
}

const advocateAudit = tableByName.get('iep_advocates');
if (advocateAudit && Number(advocateAudit.trustedButMissing || 0) > 0) {
  rows.push({
    lane: 'advocate_gap_summary',
    targetTable: 'iep_advocates',
    stateId: '',
    subjectId: 'iep_advocates',
    subjectLabel: 'IEP Advocates',
    priority: Number(advocateAudit.trustedButMissing || 0),
    currentSignalPct: Number(advocateAudit.pct?.anyAccessibility || 0),
    missingSignalRows: Number(advocateAudit.trustedButMissing || 0),
    sourceUrl: '',
    clueIds: '',
    nextAction: 'No explicit advocate accessibility candidate lane exists yet; keep this blocker visible and wait for saved first-party evidence before enrichment.',
    evidenceArtifact: path.relative(repoRoot, accessibilityAuditPath),
    entryCommand: 'npm run audit:directory-accessibility',
    auditCommand: 'npm run audit:directory-foundation-enrichment-queue',
    commands: [
      'npm run audit:directory-accessibility',
      'npm run audit:directory-foundation-enrichment-queue',
    ],
  });
}

rows.sort((a, b) =>
  String(a.lane).localeCompare(String(b.lane))
  || Number(b.priority || 0) - Number(a.priority || 0)
  || String(a.subjectId).localeCompare(String(b.subjectId))
);

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    accessibilityAuditPath: path.relative(repoRoot, accessibilityAuditPath),
    accessibilityCandidatesPath: path.relative(repoRoot, accessibilityCandidatesPath),
    providerPlanPath: path.relative(repoRoot, providerPlanPath),
    blockerRegistryPath: path.relative(repoRoot, blockerRegistryPath),
  },
  purpose: 'Deterministic enrichment queue for directory foundation signals, split into bounded provider source-pull lanes and explicit candidate-review lanes.',
  summary: {
    totalRows: rows.length,
    byLane: countBy(rows, 'lane'),
    byTargetTable: countBy(rows, 'targetTable'),
    blockerStatus: foundationBlocker?.status || 'unknown',
    providerSourcePullStates: (providerPlan.lanes?.sourcePullStates || []).length,
    nonprofitCandidateRows: (candidateByLabel.get('Nonprofit Organizations')?.candidates || []).length,
    providerCandidateRows: (candidateByLabel.get('Resource Providers')?.candidates || []).length,
  },
  rows,
};

const headers = [
  'lane',
  'targetTable',
  'stateId',
  'subjectId',
  'subjectLabel',
  'priority',
  'currentSignalPct',
  'missingSignalRows',
  'sourceUrl',
  'clueIds',
  'nextAction',
  'evidenceArtifact',
  'entryCommand',
  'auditCommand',
];

const mdLines = [
  '# Directory Foundation Enrichment Queue',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Summary',
  '',
  `- total rows: ${payload.summary.totalRows}`,
  `- blocker status: ${payload.summary.blockerStatus}`,
  `- provider source-pull states: ${payload.summary.providerSourcePullStates}`,
  `- nonprofit candidate rows: ${payload.summary.nonprofitCandidateRows}`,
  `- provider candidate rows: ${payload.summary.providerCandidateRows}`,
  '',
  '## By Lane',
  '',
  ...Object.entries(payload.summary.byLane).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## Top Rows',
  '',
];

for (const row of rows.slice(0, 25)) {
  mdLines.push(`- ${row.lane} | ${row.subjectLabel} | priority=${row.priority} | ${row.sourceUrl || row.stateId || row.subjectId}`);
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
  byLane: payload.summary.byLane,
}, null, 2));
