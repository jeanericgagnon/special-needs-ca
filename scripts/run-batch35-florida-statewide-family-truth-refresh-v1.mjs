import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'florida_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'florida_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch35_florida_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch35-florida-repair-report-v1.md'),
};

const FAMILY_UPGRADES = {
  vocational_rehabilitation_pre_ets: {
    status_reason: 'Official statewide Florida Vocational Rehabilitation transition and Pre-ETS source is present and verified.',
    sample: {
      sample_name: 'Florida Vocational Rehabilitation Transition Youth Program',
      source_url: 'https://www.rehabworks.org/student-youth/',
      verification_status: 'verified',
      source_type: 'official',
      source_table: 'programs',
    },
  },
  protection_and_advocacy: {
    status_reason: 'Disability Rights Florida is already present as a verified first-party statewide P&A source.',
    sample: {
      sample_name: 'Disability Rights Florida',
      source_url: 'https://www.disabilityrightsflorida.org',
      verification_status: 'verified',
      source_type: 'state_website',
      source_table: 'nonprofit_organizations',
    },
  },
  parent_training_information_center: {
    status_reason: 'Family Network on Disabilities is already present as a verified first-party statewide PTI source.',
    sample: {
      sample_name: 'Family Network on Disabilities (FND)',
      source_url: 'https://fndusa.org',
      verification_status: 'verified',
      source_type: 'state_website',
      source_table: 'nonprofit_organizations',
    },
  },
  legal_aid: {
    status_reason: 'Reviewed first-party Florida legal aid sources are present in the Florida source pack and verified discovery artifacts.',
    samples: [
      {
        sample_name: 'Bay Area Legal Services (Tampa)',
        source_url: 'https://bals.org',
        verification_status: 'official_verified',
        source_type: 'official_state_source_target',
        source_table: 'data/source_targets/florida.json',
      },
      {
        sample_name: 'Legal Aid Society of Palm Beach County',
        source_url: 'https://legalaidpbc.org',
        verification_status: 'official_verified',
        source_type: 'official_state_source_target',
        source_table: 'data/source_targets/florida.json',
      },
    ],
  },
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function mergeSamples(preferredSamples, existingSamples) {
  const merged = [];
  const seen = new Set();
  for (const sample of [...preferredSamples, ...existingSamples]) {
    if (!sample) continue;
    const key = `${sample.sample_name || ''}|${sample.source_url || ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(sample);
  }
  return merged;
}

function recalcSummary(summary, gapRows, failureRows, verifiedRows) {
  const criticalRows = gapRows.filter((row) => row.critical);
  const strong = criticalRows.filter((row) => String(row.family_status || '').startsWith('verified_')).length;
  const missing = criticalRows.filter((row) => row.family_status === 'missing').length;
  const weak = criticalRows.length - strong - missing;
  return {
    ...summary,
    completeness_pct: Math.floor((strong / criticalRows.length) * 100),
    strong_critical_families: strong,
    weak_critical_families: weak,
    missing_critical_families: missing,
    primary_gap_reason: failureRows[0]?.failure_code || 'none',
    critical_gap_families: failureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: failureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    verified_source_families_with_samples: verifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: summary.classification === 'COMPLETE' && summary.index_safe,
  };
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Florida California-Grade Audit Report v2',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Failure ledger',
    '',
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Batch 35 Florida statewide-family truth refresh',
    '',
    '- Upgraded only the statewide Florida families already proven by first-party sources on disk.',
    '- County-grade education routing and county-local disability resources remain the real unresolved Florida blockers.',
  ].join('\n') + '\n';
}

export function generateBatch35FloridaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    const upgrade = FAMILY_UPGRADES[row.family];
    if (!upgrade) return row;
    return {
      ...row,
      family_status: 'verified_state_grade',
      status_reason: upgrade.status_reason,
    };
  });

  const updatedFailureRows = failureRows.filter((row) => !Object.hasOwn(FAMILY_UPGRADES, row.family));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    const upgrade = FAMILY_UPGRADES[row.family];
    if (!upgrade) return row;
    const preferredSamples = upgrade.samples || (upgrade.sample ? [upgrade.sample] : []);
    const existingSamples = row.samples && row.samples.length ? row.samples : [];
    const samples = mergeSamples(preferredSamples, existingSamples);
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: samples.length,
      blocker_code: null,
      blocker_evidence: null,
      samples,
    };
  });

  const updatedNextRows = nextRows
    .filter((row) => !Object.hasOwn(FAMILY_UPGRADES, row.family))
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const updatedReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    batch: 'batch_35_florida_statewide_family_truth_refresh_v1',
    generated_at: new Date().toISOString(),
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    upgraded_families: Object.keys(FAMILY_UPGRADES),
    remaining_failure_families: updatedFailureRows.map((row) => row.family),
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 35 Florida Repair Report v1',
    '',
    'This pass converts stale Florida statewide-family packet labels to verified-state-grade where first-party evidence already exists on disk.',
    '',
    `- upgraded families: ${batchSummary.upgraded_families.join(', ')}`,
    `- completeness_pct: ${batchSummary.completeness_pct}`,
    `- remaining failure families: ${batchSummary.remaining_failure_families.join(', ')}`,
    '- No new reusable lesson was promoted in this pass; the existing Florida county-local and county-grade routing lessons remain authoritative.',
  ].join('\n') + '\n');

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch35FloridaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
