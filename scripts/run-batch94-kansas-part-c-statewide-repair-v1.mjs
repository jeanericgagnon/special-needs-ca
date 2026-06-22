import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  partCSource: path.join(generatedDir, 'kansas_part_c_reviewed_source_v1.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch94_kansas_part_c_statewide_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch94-kansas-part-c-statewide-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
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
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function assertIncludes(text, pattern, label) {
  if (!text.includes(pattern)) {
    throw new Error(`Expected ${label} to include "${pattern}".`);
  }
}

function buildVerifiedRows(existingRows, partCSource) {
  return existingRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed live KSDE Early Childhood Special Education leaf now provides role-aligned Kansas birth-to-three and Part C routing with KDHE administration and local ITS referral context.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Kansas Early Childhood Special Education',
            source_url: partCSource.source_url,
            final_url: partCSource.final_url,
            verification_status: partCSource.verification_status,
            source_type: partCSource.source_type,
            source_table: partCSource.source_table,
            fetched_at: partCSource.fetched_at,
            evidence_snippet: partCSource.evidence_snippet,
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kansas California-Grade Part C Repair v1',
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
    '## Completion decision',
    '',
    '- Kansas early intervention is no longer missing because the live KSDE Early Childhood Special Education leaf explicitly preserves Kansas birth-to-three entitlement and states that KDHE administers early intervention services under Part C of IDEA, with a local Infant Toddler Services routing pointer on the same official page.',
    '- Kansas remains BLOCKED and not index-safe because the KanCare and KDADS roots are still challenge-blocked, and district-grade plus county-local routing still lack reviewed local proof.',
  ].join('\n') + '\n';
}

export function generateBatch94KansasPartCStatewideRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const partCSource = readJson(INPUTS.partCSource);

  assertIncludes(partCSource.page_title, 'Early Childhood Special Education', 'Kansas Part C reviewed source title');
  assertIncludes(partCSource.evidence_snippet, 'birth to age 3', 'Kansas Part C reviewed source snippet');
  assertIncludes(partCSource.evidence_snippet, 'under Part C of the Individuals with Disabilities Education Act', 'Kansas Part C reviewed source snippet');
  assertIncludes(partCSource.evidence_snippet, 'www.itsofks.org', 'Kansas Part C reviewed source snippet');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed live KSDE Early Childhood Special Education leaf now provides Kansas birth-to-three, Part C, KDHE administration, and local ITS referral context.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'early_intervention_part_c');
  const updatedVerifiedRows = buildVerifiedRows(verifiedRows, partCSource);
  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'early_intervention_part_c')
    .sort((a, b) => a.priority_rank - b.priority_rank);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 58,
    strong_critical_families: 7,
    weak_critical_families: 5,
    missing_critical_families: 0,
    primary_gap_reason: 'official_medicaid_kdads_stack_blocked_and_local_district_proof_unverified',
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch_94_kansas_part_c_statewide_repair_v1',
    generated_at: partCSource.fetched_at,
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'early_intervention_part_c',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      earlyInterventionPartC: {
        sourceUrl: partCSource.source_url,
        finalUrl: partCSource.final_url,
        pageTitle: partCSource.page_title,
      },
    },
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.mkdirSync(path.dirname(OUTPUTS.stateReport), { recursive: true });
  fs.writeFileSync(OUTPUTS.stateReport, updatedReport);
  fs.mkdirSync(path.dirname(OUTPUTS.report), { recursive: true });
  fs.writeFileSync(OUTPUTS.report, [
    '# Kansas Part C Statewide Repair Batch 94',
    '',
    `- classification: ${batchSummary.classification}`,
    `- index_safe: ${batchSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    `- part_c_source: ${partCSource.source_url}`,
  ].join('\n') + '\n');

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  const result = generateBatch94KansasPartCStatewideRepairV1();
  console.log(JSON.stringify({
    state: result.state,
    classification: result.classification,
    index_safe: result.index_safe,
    completeness_pct: result.completeness_pct,
  }, null, 2));
}
